import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import {
  MANIFEST_PATH,
  SOURCE_REPOSITORY,
  applyPlan,
  applyMajorMigration,
  applyValidateAndCommit,
  buildManifest,
  checkActiveTask,
  cleanupBootstrapSource,
  commitManagedUpdate,
  hashBytes,
  inspectGit,
  inspectInstallation,
  planLegacyBootstrap,
  planMajorMigration,
  planUpdate,
  validateManifest,
  verifyManifestFiles,
  verifyManifestMetadata,
  verifyTrackedManifest,
  runCli,
} from "./updater.mjs";

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cn-update-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (base, relative, content) => {
    const file = path.join(base, ...relative.split("/"));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    return file;
  };
  return { root, put };
}

function manifest(version, entries, changes = {}) {
  return validateManifest({
    schemaVersion: 1,
    cnPilotVersion: version,
    sourceRepository: "https://github.com/LuisYGM/cn-pilot.git",
    stableBranch: "main",
    sourceCommit: null,
    compatibility: { nodeMin: "20.0.0", kiloMin: "7.8.8" },
    managedFiles: entries,
    addedFiles: [],
    removedFiles: [],
    migrations: [],
    ...changes,
  });
}

function entry(relative, content) { return { path: relative, sha256: hashBytes(Buffer.from(content), relative) }; }

function activeCheckpoint(status = "ACTIVE", overrides = {}) {
  return { schemaVersion: 1, status, objective: "Recuperar tarea de prueba", nextAction: "Continuar gates pendientes", ...overrides };
}

function writeManifestFile(root, value) {
  const file = path.join(root, ...MANIFEST_PATH.split("/"));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function initRepo(root, files) {
  execFileSync("git", ["init", "-q", "-b", "main"], { cwd: root });
  execFileSync("git", ["config", "user.name", "CN Pilot Test"], { cwd: root });
  execFileSync("git", ["config", "user.email", "test@example.invalid"], { cwd: root });
  if (files.length) {
    execFileSync("git", ["add", "-A", "--", ...files], { cwd: root });
    execFileSync("git", ["commit", "-qm", "fixture"], { cwd: root });
  }
}

test("A: same version/status plan has no writes", (t) => {
  const { root, put } = fixture(t);
  const content = "same\n";
  put(root, ".cn-pilot-version", "1.3.0\n");
  put(root, ".cn-pilot/CORE.md", content);
  const item = entry(".cn-pilot/CORE.md", content);
  const current = manifest("1.3.0", [item]);
  const plan = planUpdate(root, current, current);
  assert.equal(plan.actions.length, 0);
  assert.equal(plan.conflicts.length, 0);
  assert.equal(plan.unchanged, 1);
});

test("B: unchanged baseline file safely receives upstream update", (t) => {
  const { root, put } = fixture(t);
  const old = "old\n"; const latest = "new\n";
  put(root, ".cn-pilot/CORE.md", old);
  const source = fixture(t);
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, ".cn-pilot/CORE.md", latest);
  const before = manifest("1.3.0", [entry(".cn-pilot/CORE.md", old)]);
  const after = manifest("1.4.0", [entry(".cn-pilot/CORE.md", latest)]);
  const plan = planUpdate(root, before, after);
  assert.deepEqual(plan.actions.map(({ type, path: name }) => [type, name]), [["update", ".cn-pilot/CORE.md"]]);
  applyPlan(root, source.root, plan, after);
  assert.equal(fs.readFileSync(path.join(root, ".cn-pilot/CORE.md"), "utf8"), latest);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, MANIFEST_PATH), "utf8")).cnPilotVersion, "1.4.0");
});

test("1.3.0 baseline detects the 1.3.1 PATCH distribution as available", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.3.0\n");
  put(root, "AGENTS.md", "unchanged framework instructions\n");
  const installed = manifest("1.3.0", [
    entry(".cn-pilot-version", "1.3.0\n"),
    entry("AGENTS.md", "unchanged framework instructions\n"),
  ]);
  const latest = manifest("1.3.1", [
    entry(".cn-pilot-version", "1.3.1\n"),
    entry("AGENTS.md", "unchanged framework instructions\n"),
  ]);
  const plan = planUpdate(root, installed, latest);
  assert.equal(plan.installedVersion, "1.3.0");
  assert.equal(plan.latestVersion, "1.3.1");
  assert.deepEqual(plan.actions.map((action) => action.path), [".cn-pilot-version"]);
  assert.equal(plan.conflicts.length, 0);
});

test("1.3.1 baseline detects the 1.4.0 MINOR distribution and added capability", (t) => {
  const { root, put } = fixture(t);
  const oldCore = "Core 1.3.1\n";
  const newCore = "Core 1.4.0 with BF-066\n";
  const skill = "---\nname: creative-web-experience\ndescription: Creative direction\n---\n";
  put(root, ".cn-pilot-version", "1.3.1\n");
  put(root, ".cn-pilot/CORE.md", oldCore);
  const installed = manifest("1.3.1", [
    entry(".cn-pilot-version", "1.3.1\n"),
    entry(".cn-pilot/CORE.md", oldCore),
  ]);
  const latest = manifest("1.4.0", [
    entry(".cn-pilot-version", "1.4.0\n"),
    entry(".cn-pilot/CORE.md", newCore),
    entry(".kilo/skills/creative-web-experience/SKILL.md", skill),
  ], { addedFiles: [".kilo/skills/creative-web-experience/SKILL.md"] });
  const plan = planUpdate(root, installed, latest);
  assert.equal(plan.installedVersion, "1.3.1");
  assert.equal(plan.latestVersion, "1.4.0");
  assert.deepEqual(plan.actions.map(({ type, path: name }) => [type, name]), [
    ["update", ".cn-pilot-version"],
    ["update", ".cn-pilot/CORE.md"],
    ["add", ".kilo/skills/creative-web-experience/SKILL.md"],
  ]);
  assert.equal(plan.conflicts.length, 0);
});

test("1.4.0 baseline detects the 1.5.0 MINOR discovery update as available", (t) => {
  const { root, put } = fixture(t);
  const oldSkill = "BF-066 creative direction\n";
  const newSkill = "BF-067 evidence-based discovery\n";
  put(root, ".cn-pilot-version", "1.4.0\n");
  put(root, ".kilo/skills/creative-web-experience/SKILL.md", oldSkill);
  const installed = manifest("1.4.0", [
    entry(".cn-pilot-version", "1.4.0\n"),
    entry(".kilo/skills/creative-web-experience/SKILL.md", oldSkill),
  ]);
  const latest = manifest("1.5.0", [
    entry(".cn-pilot-version", "1.5.0\n"),
    entry(".kilo/skills/creative-web-experience/SKILL.md", newSkill),
  ]);
  const plan = planUpdate(root, installed, latest);
  assert.equal(plan.installedVersion, "1.4.0");
  assert.equal(plan.latestVersion, "1.5.0");
  assert.deepEqual(plan.actions.map(({ type, path: name }) => [type, name]), [
    ["update", ".cn-pilot-version"],
    ["update", ".kilo/skills/creative-web-experience/SKILL.md"],
  ]);
  assert.equal(plan.conflicts.length, 0);
});

test("1.5.1 baseline detects the compatible 1.5.2 PATCH as available", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.5.1\n");
  put(root, ".cn-pilot/CORE.md", "Core 1.5.1\n");
  const installed = manifest("1.5.1", [entry(".cn-pilot-version", "1.5.1\n"), entry(".cn-pilot/CORE.md", "Core 1.5.1\n")]);
  const latest = manifest("1.5.2", [entry(".cn-pilot-version", "1.5.2\n"), entry(".cn-pilot/CORE.md", "Core 1.5.2\n")]);
  const plan = planUpdate(root, installed, latest);
  assert.equal(plan.installedVersion, "1.5.1");
  assert.equal(plan.latestVersion, "1.5.2");
  assert.deepEqual(plan.actions.map(({ type, path: name }) => [type, name]), [["update", ".cn-pilot-version"], ["update", ".cn-pilot/CORE.md"]]);
});

test("1.5.2 baseline detects the compatible 1.5.3 PATCH as available", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.5.2\n");
  put(root, ".cn-pilot/CORE.md", "Core 1.5.2\n");
  const installed = manifest("1.5.2", [entry(".cn-pilot-version", "1.5.2\n"), entry(".cn-pilot/CORE.md", "Core 1.5.2\n")]);
  const latest = manifest("1.5.3", [entry(".cn-pilot-version", "1.5.3\n"), entry(".cn-pilot/CORE.md", "Core 1.5.3\n")]);
  const plan = planUpdate(root, installed, latest);
  assert.equal(plan.installedVersion, "1.5.2");
  assert.equal(plan.latestVersion, "1.5.3");
  assert.deepEqual(plan.actions.map(({ type, path: name }) => [type, name]), [["update", ".cn-pilot-version"], ["update", ".cn-pilot/CORE.md"]]);
});

test("1.5.3 baseline detects the compatible 1.5.4 PATCH as available", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.5.3\n");
  put(root, ".cn-pilot/CORE.md", "Core 1.5.3\n");
  const installed = manifest("1.5.3", [entry(".cn-pilot-version", "1.5.3\n"), entry(".cn-pilot/CORE.md", "Core 1.5.3\n")]);
  const latest = manifest("1.5.4", [entry(".cn-pilot-version", "1.5.4\n"), entry(".cn-pilot/CORE.md", "Core 1.5.4\n")]);
  const plan = planUpdate(root, installed, latest);
  assert.equal(plan.installedVersion, "1.5.3");
  assert.equal(plan.latestVersion, "1.5.4");
  assert.deepEqual(plan.actions.map(({ type, path: name }) => [type, name]), [["update", ".cn-pilot-version"], ["update", ".cn-pilot/CORE.md"]]);
});

test("C: concurrent local and upstream edits conflict without overwrite", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot/CORE.md", "local\n");
  const before = manifest("1.3.0", [entry(".cn-pilot/CORE.md", "base\n")]);
  const after = manifest("1.4.0", [entry(".cn-pilot/CORE.md", "upstream\n")]);
  const plan = planUpdate(root, before, after);
  assert.equal(plan.conflicts[0].path, ".cn-pilot/CORE.md");
  assert.throws(() => applyPlan(root, root, plan, after), { code: "CONFLICTS" });
  assert.equal(fs.readFileSync(path.join(root, ".cn-pilot/CORE.md"), "utf8"), "local\n");
});

test("D: local-only change is preserved when upstream matches baseline", (t) => {
  const { root, put } = fixture(t); const source = fixture(t);
  put(root, ".cn-pilot-version", "1.3.0\n");
  put(root, ".cn-pilot/CORE.md", "custom\n");
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, ".cn-pilot/CORE.md", "base\n");
  const before = manifest("1.3.0", [entry(".cn-pilot-version", "1.3.0\n"), entry(".cn-pilot/CORE.md", "base\n")]);
  const after = manifest("1.4.0", [entry(".cn-pilot-version", "1.4.0\n"), entry(".cn-pilot/CORE.md", "base\n")]);
  const plan = planUpdate(root, before, after);
  assert.deepEqual(plan.actions.map((item) => item.path), [".cn-pilot-version"]);
  assert.equal(plan.preserved[0].path, ".cn-pilot/CORE.md");
  applyPlan(root, source.root, plan, after);
  assert.equal(fs.readFileSync(path.join(root, ".cn-pilot/CORE.md"), "utf8"), "custom\n");
  assert.equal(verifyManifestMetadata(root).manifest.cnPilotVersion, "1.4.0");
  assert.throws(() => verifyManifestFiles(root), { code: "HASH_MISMATCH" });
});

test("E: new upstream managed file is added if target is absent", (t) => {
  const { root, put } = fixture(t); const source = fixture(t);
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, ".cn-pilot/docs/NEW.md", "new\n");
  const before = manifest("1.3.0", []);
  const after = manifest("1.4.0", [entry(".cn-pilot/docs/NEW.md", "new\n")]);
  const plan = planUpdate(root, before, after);
  assert.equal(plan.actions[0].type, "add");
  applyPlan(root, source.root, plan, after);
  assert.equal(fs.readFileSync(path.join(root, ".cn-pilot/docs/NEW.md"), "utf8"), "new\n");
});

test("E2: new upstream file colliding with local file is a conflict", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot/docs/NEW.md", "local\n");
  const before = manifest("1.3.0", []);
  const after = manifest("1.4.0", [entry(".cn-pilot/docs/NEW.md", "new\n")]);
  assert.equal(planUpdate(root, before, after).conflicts[0].path, ".cn-pilot/docs/NEW.md");
});

test("F: upstream removal deletes only an unchanged baseline file", (t) => {
  const { root, put } = fixture(t); const source = fixture(t);
  put(root, ".cn-pilot/docs/old.md", "old\n");
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  const before = manifest("1.3.0", [entry(".cn-pilot/docs/old.md", "old\n")]);
  const after = manifest("1.4.0", []);
  const plan = planUpdate(root, before, after);
  assert.equal(plan.actions[0].type, "remove");
  applyPlan(root, source.root, plan, after);
  assert.equal(fs.existsSync(path.join(root, ".cn-pilot/docs/old.md")), false);
});

test("G: project-owned and mixed-ownership paths are rejected by manifest", () => {
  for (const protectedPath of ["PROJECT.md", "README.md", "product/index.html", "project-resources/source.zip", "project-artifacts/design/page.html", ".env", ".env.production", "secrets/key", ".cn-pilot/runtime/active-task.json", ".cn-pilot/docs/.env.private", ".kilo/skills/secrets/key", "kilo.jsonc", ".gitignore", ".editorconfig", ".gitattributes", ".kilocodeignore", "LICENSE"]) {
    assert.throws(() => manifest("1.4.0", [entry(protectedPath, "x")]), { code: "PROTECTED_PATH" }, protectedPath);
  }
});

test("H: tracked dirty tree is detected before apply", (t) => {
  const { root, put } = fixture(t);
  put(root, "managed.txt", "base\n");
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["config", "user.name", "CN Pilot Test"], { cwd: root });
  execFileSync("git", ["config", "user.email", "test@example.invalid"], { cwd: root });
  execFileSync("git", ["add", "managed.txt"], { cwd: root });
  execFileSync("git", ["commit", "-qm", "fixture"], { cwd: root });
  put(root, "managed.txt", "changed\n");
  assert.equal(inspectGit(root).trackedChanges.length, 1);
});

test("untracked project resources do not block tracked-tree preflight", (t) => {
  const { root, put } = fixture(t);
  put(root, "tracked.txt", "base\n");
  initRepo(root, ["tracked.txt"]);
  put(root, "project-resources/source.bin", "original\n");
  const state = inspectGit(root);
  assert.equal(state.trackedChanges.length, 0);
  assert.equal(state.untracked.length, 1);
});

test("H2: updater blocks dirty tracked tree before consulting source or writing", async (t) => {
  const { root, put } = fixture(t);
  put(root, "tracked.txt", "base\n");
  initRepo(root, ["tracked.txt"]);
  put(root, "tracked.txt", "dirty\n");
  const before = fs.readFileSync(path.join(root, "tracked.txt"), "utf8");
  let stderr = "";
  const code = await runCli(["update", "--target", root, "--source-dir", path.join(root, "missing-source")], { stderr: { write: (value) => { stderr += value; } }, stdout: { write() {} } });
  assert.equal(code, 1);
  assert.match(stderr, /DIRTY_TRACKED_TREE/);
  assert.equal(fs.readFileSync(path.join(root, "tracked.txt"), "utf8"), before);
});

test("I: active-task schema, lifecycle statuses, and actionable diagnostics", (t) => {
  const { root, put } = fixture(t);
  assert.deepEqual(checkActiveTask(root), { exists: false, blocked: false, status: "none" });
  for (const status of ["ACTIVE", "INTERRUPTED", "BLOCKED", "BLOCKED_HUMAN", "BLOCKED_EXTERNAL", "FAILED"]) {
    put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint(status))}\n`);
    const result = checkActiveTask(root);
    assert.equal(result.status, status);
    assert.equal(result.blocked, true);
  }
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint("COMPLETED"))}\n`);
  assert.equal(checkActiveTask(root).blocked, false);
  put(root, ".cn-pilot/runtime/active-task.json", '{"status":"COMPLETED"}\n');
  assert.deepEqual(checkActiveTask(root), { exists: true, blocked: false, status: "COMPLETED" }, "historical terminal checkpoints remain readable without recovery-only fields");
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint("UNKNOWN"))}\n`);
  assert.match(checkActiveTask(root).reason, /unsupported status/);
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify({ ...activeCheckpoint(), schemaVersion: undefined })}\n`);
  assert.match(checkActiveTask(root).reason, /missing required field "schemaVersion"/);
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify({ ...activeCheckpoint(), status: undefined })}\n`);
  assert.match(checkActiveTask(root).reason, /missing required field "status"/);
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify({ objective: "Review in progress", mode: "STRUCTURAL", resume_state: "qa_done", environment: {}, working_tree: {}, sources_and_evidence: [], qa_plan: {}, gates: {}, next_step: "Wait for Human Visual Review" })}\n`);
  assert.match(checkActiveTask(root).reason, /missing required field "status"/);
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint("ACTIVE", { schemaVersion: 99 }))}\n`);
  assert.match(checkActiveTask(root).reason, /unsupported schemaVersion/);
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint("ACTIVE", { objective: " " }))}\n`);
  assert.match(checkActiveTask(root).reason, /objective/);
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint("ACTIVE", { nextAction: "" }))}\n`);
  assert.match(checkActiveTask(root).reason, /nextAction/);
  put(root, ".cn-pilot/runtime/active-task.json", "[]\n");
  assert.match(checkActiveTask(root).reason, /invalid root/);
  put(root, ".cn-pilot/runtime/active-task.json", '{"status":\n');
  assert.match(checkActiveTask(root).reason, /corrupt JSON/);
});

test("I2: pending active task blocks updater before source access", async (t) => {
  const { root, put } = fixture(t);
  put(root, "tracked.txt", "base\n");
  initRepo(root, ["tracked.txt"]);
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint("BLOCKED_HUMAN"))}\n`);
  let stderr = "";
  const code = await runCli(["update", "--target", root, "--source-dir", path.join(root, "missing-source")], { stderr: { write: (value) => { stderr += value; } }, stdout: { write() {} } });
  assert.equal(code, 1);
  assert.match(stderr, /ACTIVE_TASK/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, ".cn-pilot/runtime/active-task.json"), "utf8")).status, "BLOCKED_HUMAN");

  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify({ schemaVersion: 1, objective: "Human review", nextAction: "Wait" })}\n`);
  stderr = "";
  const invalidCode = await runCli(["update", "--target", root, "--source-dir", path.join(root, "missing-source")], { stderr: { write: (value) => { stderr += value; } }, stdout: { write() {} } });
  assert.equal(invalidCode, 1);
  assert.match(stderr, /missing required field "status"/);
  assert.match(stderr, /ACTIVE_TASK/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, ".cn-pilot/runtime/active-task.json"), "utf8")).status, undefined, "invalid checkpoint is not repaired");
});

test("J: upstream source hash mismatch blocks before target writes", (t) => {
  const { root, put } = fixture(t); const source = fixture(t);
  put(root, ".cn-pilot/docs/a.md", "target\n");
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, ".cn-pilot/docs/a.md", "tampered\n");
  const upstream = manifest("1.4.0", [entry(".cn-pilot/docs/a.md", "expected\n")]);
  const plan = { actions: [{ type: "update", path: ".cn-pilot/docs/a.md", baselineHash: hashBytes(Buffer.from("target\n")), sha256: upstream.managedFiles[0].sha256 }], conflicts: [] };
  assert.throws(() => applyPlan(root, source.root, plan, upstream), { code: "HASH_MISMATCH" });
  assert.equal(fs.readFileSync(path.join(root, ".cn-pilot/docs/a.md"), "utf8"), "target\n");
});

test("manifest traversal and symlink parent cannot redirect a managed write", (t) => {
  const { root, put } = fixture(t);
  const outside = fixture(t);
  outside.put(outside.root, "payload.md", "outside\n");
  const link = path.join(root, ".cn-pilot");
  fs.mkdirSync(root, { recursive: true });
  try { fs.symlinkSync(outside.root, link, process.platform === "win32" ? "junction" : "dir"); }
  catch (error) { t.skip(`directory symlink unavailable (${error.code})`); return; }
  const plan = planUpdate(root, manifest("1.3.0", [entry(".cn-pilot/docs/a.md", "base\n")]), manifest("1.4.0", [entry(".cn-pilot/docs/a.md", "new\n")]));
  assert.equal(plan.conflicts[0].path, ".cn-pilot/docs/a.md");
  assert.equal(fs.readFileSync(path.join(outside.root, "payload.md"), "utf8"), "outside\n");
});

test("apply rejects an intervening local edit before writing any planned path", (t) => {
  const { root, put } = fixture(t); const source = fixture(t);
  put(root, ".cn-pilot-version", "1.3.0\n");
  put(root, "AGENTS.md", "baseline\n");
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, "AGENTS.md", "upstream\n");
  const baseline = manifest("1.3.0", [entry(".cn-pilot-version", "1.3.0\n"), entry("AGENTS.md", "baseline\n")]);
  const current = manifest("1.4.0", [entry(".cn-pilot-version", "1.4.0\n"), entry("AGENTS.md", "upstream\n")]);
  const plan = planUpdate(root, baseline, current);
  put(root, "AGENTS.md", "edited after plan\n");
  assert.throws(() => applyPlan(root, source.root, plan, current), { code: "CONFLICTS" });
  assert.equal(fs.readFileSync(path.join(root, ".cn-pilot-version"), "utf8"), "1.3.0\n");
  assert.equal(fs.readFileSync(path.join(root, "AGENTS.md"), "utf8"), "edited after plan\n");
  assert.equal(fs.existsSync(path.join(root, MANIFEST_PATH)), false);
});

test("active-task probe fails closed when runtime is a symlink", (t) => {
  const { root } = fixture(t); const outside = fixture(t);
  fs.mkdirSync(path.join(root, ".cn-pilot"), { recursive: true });
  try { fs.symlinkSync(outside.root, path.join(root, ".cn-pilot/runtime"), process.platform === "win32" ? "junction" : "dir"); }
  catch (error) { t.skip(`directory symlink unavailable (${error.code})`); return; }
  assert.deepEqual(checkActiveTask(root), { exists: true, blocked: true, status: "INVALID", reason: "unsafe runtime: path is a symlink" });
});

test("literal updater/manifest detection distinguishes managed, legacy, baseline, invalid, and Git root", (t) => {
  const { root, put } = fixture(t);
  put(root, "tracked.txt", "fixture\n");
  initRepo(root, ["tracked.txt"]);
  const subdirectory = path.join(root, "nested", "cwd");
  fs.mkdirSync(subdirectory, { recursive: true });
  assert.deepEqual(inspectInstallation(subdirectory), { root, status: "LEGACY" });

  put(root, ".cn-pilot/update/updater.mjs", "fixture updater\n");
  assert.equal(fs.existsSync(path.join(root, ".cn-pilot/update/updater.mjs")), true); // Literal filesystem check; no glob result participates.
  assert.deepEqual(inspectInstallation(root), { root, status: "MANIFEST_MISSING" });

  writeManifestFile(root, manifest("1.5.1", []));
  assert.deepEqual(inspectInstallation(root), { root, status: "MANAGED" });
  put(root, MANIFEST_PATH, "{broken\n");
  const invalid = inspectInstallation(root);
  assert.equal(invalid.status, "MANIFEST_INVALID");
  assert.match(invalid.reason, /INVALID_MANIFEST/);
  assert.throws(() => inspectInstallation(os.tmpdir()), { code: "GIT_ROOT_NOT_FOUND" });
});

test("status reports missing or corrupt baseline without misclassifying updater as legacy", async (t) => {
  const { root, put } = fixture(t);
  put(root, "tracked.txt", "fixture\n");
  put(root, ".cn-pilot-version", "1.5.1\n");
  put(root, ".cn-pilot/update/updater.mjs", "fixture updater\n");
  initRepo(root, ["tracked.txt", ".cn-pilot-version", ".cn-pilot/update/updater.mjs"]);
  for (const [manifestContents, expected] of [[null, /MANIFEST_MISSING/], ["{broken\n", /MANIFEST_INVALID.*not valid JSON/s]]) {
    if (manifestContents === null) fs.rmSync(path.join(root, ...MANIFEST_PATH.split("/")), { force: true });
    else put(root, MANIFEST_PATH, manifestContents);
    let stdout = ""; let stderr = "";
    const code = await runCli(["status", "--target", root, "--source-dir", path.join(root, "missing-source")], { stdout: { write: (value) => { stdout += value; } }, stderr: { write: (value) => { stderr += value; } } });
    assert.equal(code, 0, stderr);
    assert.match(stdout, expected);
    assert.doesNotMatch(stdout, /LEGACY BOOTSTRAP REQUIRED/);
  }
});

test("status readiness requires a clean tracked tree but ignores unrelated untracked files", async (t) => {
  const target = fixture(t); const source = fixture(t);
  const targetCore = "Core 1.5.3\n"; const sourceCore = "Core 1.5.4\n";
  target.put(target.root, ".cn-pilot-version", "1.5.3\n");
  target.put(target.root, ".cn-pilot/CORE.md", targetCore);
  target.put(target.root, ".cn-pilot/update/updater.mjs", "fixture updater\n");
  target.put(target.root, "README.md", "project-owned baseline\n");
  target.put(target.root, ".gitignore", "/.cn-pilot/runtime/\n");
  const baseline = manifest("1.5.3", [entry(".cn-pilot-version", "1.5.3\n"), entry(".cn-pilot/CORE.md", targetCore)]);
  writeManifestFile(target.root, baseline);
  initRepo(target.root, [".cn-pilot-version", ".cn-pilot/CORE.md", ".cn-pilot/update/updater.mjs", "README.md", ".gitignore", MANIFEST_PATH]);
  const baselineHead = execFileSync("git", ["rev-parse", "HEAD"], { cwd: target.root, encoding: "utf8" }).trim();
  execFileSync("git", ["update-ref", "refs/remotes/origin/main", baselineHead], { cwd: target.root });
  target.put(target.root, "README.md", "local commit ahead of origin\n");
  execFileSync("git", ["add", "README.md"], { cwd: target.root });
  execFileSync("git", ["commit", "-qm", "local commit ahead"], { cwd: target.root });
  assert.equal(execFileSync("git", ["rev-list", "--count", "origin/main..HEAD"], { cwd: target.root, encoding: "utf8" }).trim(), "1");

  source.put(source.root, ".cn-pilot-version", "1.5.4\n");
  source.put(source.root, ".cn-pilot/CORE.md", sourceCore);
  const latest = manifest("1.5.4", [entry(".cn-pilot-version", "1.5.4\n"), entry(".cn-pilot/CORE.md", sourceCore)]);
  writeManifestFile(source.root, latest);
  initRepo(source.root, [".cn-pilot-version", ".cn-pilot/CORE.md", MANIFEST_PATH]);
  execFileSync("git", ["remote", "add", "origin", "https://github.com/LuisYGM/cn-pilot.git"], { cwd: source.root });

  const status = async () => {
    let stdout = ""; let stderr = "";
    const code = await runCli(["status", "--target", target.root, "--source-dir", source.root], { stdout: { write: (value) => { stdout += value; } }, stderr: { write: (value) => { stderr += value; } } });
    assert.equal(code, 0, stderr);
    return stdout;
  };

  let stdout = await status();
  assert.match(stdout, /Update available: YES/);
  assert.match(stdout, /tracked changes no/);
  assert.match(stdout, /Ready to update\./);

  target.put(target.root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint("BLOCKED_HUMAN"))}\n`);
  stdout = await status();
  assert.match(stdout, /Active task: BLOCKED_HUMAN/);
  assert.doesNotMatch(stdout, /Ready to update\./);
  fs.rmSync(path.join(target.root, ".cn-pilot/runtime/active-task.json"));

  target.put(target.root, "project-resources/untracked-note.txt", "untracked\n");
  stdout = await status();
  assert.match(stdout, /tracked changes no/);
  assert.match(stdout, /Ready to update\./);

  target.put(target.root, "README.md", "tracked local edit\n");
  stdout = await status();
  assert.match(stdout, /tracked changes YES/);
  assert.match(stdout, /Update readiness: BLOCKED/);
  assert.match(stdout, /Reason: tracked working tree changes present\./);
  assert.doesNotMatch(stdout, /Ready to update\./);

  let stderr = "";
  const updateCode = await runCli(["update", "--target", target.root, "--source-dir", source.root], { stderr: { write: (value) => { stderr += value; } }, stdout: { write() {} } });
  assert.equal(updateCode, 1);
  assert.match(stderr, /DIRTY_TRACKED_TREE/);
  assert.equal(fs.readFileSync(path.join(target.root, "README.md"), "utf8"), "tracked local edit\n");
});

test("unsafe updater or manifest symlinks are not classified as legacy", (t) => {
  const { root, put } = fixture(t); const outside = fixture(t);
  put(root, "tracked.txt", "fixture\n"); initRepo(root, ["tracked.txt"]);
  put(outside.root, "updater.mjs", "fixture\n");
  fs.mkdirSync(path.join(root, ".cn-pilot/update"), { recursive: true });
  try { fs.symlinkSync(path.join(outside.root, "updater.mjs"), path.join(root, ".cn-pilot/update/updater.mjs")); }
  catch (error) { t.skip(`file symlink unavailable (${error.code})`); return; }
  assert.throws(() => inspectInstallation(root), { code: "UNSAFE_INSTALLATION_PATH" });

  fs.rmSync(path.join(root, ".cn-pilot/update/updater.mjs"));
  put(root, ".cn-pilot/update/updater.mjs", "fixture updater\n");
  put(outside.root, "manifest.json", `${JSON.stringify(manifest("1.5.1", []))}\n`);
  try { fs.symlinkSync(path.join(outside.root, "manifest.json"), path.join(root, MANIFEST_PATH)); }
  catch (error) { t.skip(`manifest symlink unavailable (${error.code})`); return; }
  assert.equal(inspectInstallation(root).status, "UNSAFE_MANIFEST");
});

test("unsafe active-task file symlink blocks with an explicit reason", (t) => {
  const { root, put } = fixture(t); const outside = fixture(t);
  put(root, ".cn-pilot/runtime/outside.json", "{}\n");
  fs.mkdirSync(path.join(outside.root, ".cn-pilot/runtime"), { recursive: true });
  put(outside.root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint())}\n`);
  try { fs.symlinkSync(path.join(outside.root, ".cn-pilot/runtime/active-task.json"), path.join(root, ".cn-pilot/runtime/active-task.json")); }
  catch (error) { t.skip(`file symlink unavailable (${error.code})`); return; }
  const result = checkActiveTask(root);
  assert.equal(result.status, "INVALID");
  assert.match(result.reason, /unsafe task file/);
});

test("removing a closed ignored checkpoint causes no tracked diff or new commit", (t) => {
  const { root, put } = fixture(t);
  put(root, ".gitignore", "/.cn-pilot/runtime/\n");
  put(root, "tracked.txt", "unchanged\n");
  initRepo(root, [".gitignore", "tracked.txt"]);
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint("BLOCKED_HUMAN"))}\n`);
  assert.equal(checkActiveTask(root).blocked, true);
  fs.rmSync(path.join(root, ".cn-pilot/runtime/active-task.json"));
  assert.deepEqual(checkActiveTask(root), { exists: false, blocked: false, status: "none" });
  assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }), "");
  assert.equal(execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(), head);
});

test("update preflight proceeds past an absent/closed checkpoint", async (t) => {
  const { root, put } = fixture(t);
  put(root, ".gitignore", "/.cn-pilot/runtime/\n"); put(root, "tracked.txt", "unchanged\n");
  initRepo(root, [".gitignore", "tracked.txt"]);
  let stderr = "";
  const code = await runCli(["update", "--target", root, "--source-dir", path.join(root, "missing-source")], { stderr: { write: (value) => { stderr += value; } }, stdout: { write() {} } });
  assert.equal(code, 1);
  assert.doesNotMatch(stderr, /ACTIVE_TASK/);
  assert.match(stderr, /MANIFEST_MISSING|COMMAND_FAILED/);
});

test("legacy cleanup removes only its exact temp source and preserves other runtime state", (t) => {
  const { root, put } = fixture(t);
  const source = path.join(root, ".cn-pilot/runtime/cn-pilot-update-source");
  put(root, ".cn-pilot/runtime/cn-pilot-update-source/.git/config", "fixture\n");
  put(root, ".cn-pilot/runtime/active-task.json", '{"status":"COMPLETED"}\n');
  assert.equal(cleanupBootstrapSource(root, source), true);
  assert.equal(fs.existsSync(source), false);
  assert.equal(fs.existsSync(path.join(root, ".cn-pilot/runtime/active-task.json")), true);
  assert.throws(() => cleanupBootstrapSource(root, path.join(root, "project-resources")), { code: "UNSAFE_CLEANUP_PATH" });
});

test("K: legacy install matching upstream can be bootstrapped without content overwrite", (t) => {
  const { root, put } = fixture(t); const source = fixture(t);
  put(root, ".cn-pilot-version", "1.2.0\n");
  put(root, "AGENTS.md", "same\n");
  put(root, "PROJECT.md", "project-owned\n");
  put(root, "product/index.html", "product-owned\n");
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, "AGENTS.md", "same\n");
  const upstream = manifest("1.4.0", [entry(".cn-pilot-version", "1.4.0\n"), entry("AGENTS.md", "same\n")]);
  const plan = planLegacyBootstrap(root, upstream);
  assert.equal(plan.reviewRequired.length, 0);
  assert.equal(plan.actions[0].path, ".cn-pilot-version");
  applyPlan(root, source.root, { actions: plan.actions, conflicts: [] }, upstream);
  assert.equal(fs.readFileSync(path.join(root, ".cn-pilot-version"), "utf8"), "1.4.0\n");
  assert.equal(fs.readFileSync(path.join(root, "AGENTS.md"), "utf8"), "same\n");
  assert.equal(fs.readFileSync(path.join(root, "PROJECT.md"), "utf8"), "project-owned\n");
  assert.equal(fs.readFileSync(path.join(root, "product/index.html"), "utf8"), "product-owned\n");
});

test("L: legacy local customization is unclassified and requires human review", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.2.0\n");
  put(root, "AGENTS.md", "customized\n");
  const upstream = manifest("1.4.0", [entry("AGENTS.md", "upstream\n")]);
  const plan = planLegacyBootstrap(root, upstream);
  assert.equal(plan.reviewRequired[0].path, "AGENTS.md");
  assert.equal(fs.readFileSync(path.join(root, "AGENTS.md"), "utf8"), "customized\n");
});

test("M: post-apply QA failure leaves evidence and does not call commit", async (t) => {
  const { root, put } = fixture(t); const source = fixture(t);
  put(root, ".cn-pilot/docs/a.md", "base\n");
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, ".cn-pilot/docs/a.md", "new\n");
  const upstream = manifest("1.4.0", [entry(".cn-pilot/docs/a.md", "new\n")]);
  const plan = { actions: [{ type: "update", path: ".cn-pilot/docs/a.md", baselineHash: hashBytes(Buffer.from("base\n")), sha256: upstream.managedFiles[0].sha256 }], conflicts: [] };
  let commits = 0;
  await assert.rejects(applyValidateAndCommit(root, source.root, plan, upstream, {
    validate: () => ({ status: "FAIL" }),
    commit: () => { commits += 1; },
  }), { code: "POST_APPLY_QA_FAILED" });
  assert.equal(commits, 0);
  assert.equal(fs.readFileSync(path.join(root, ".cn-pilot/docs/a.md"), "utf8"), "new\n");
});

test("successful post-apply QA commits only managed paths and preserves Project Owned", async (t) => {
  const { root, put } = fixture(t); const source = fixture(t);
  put(root, ".cn-pilot-version", "1.3.0\n");
  put(root, "AGENTS.md", "old agent\n");
  put(root, "README.md", "project README\n");
  const oldManifest = manifest("1.3.0", [entry(".cn-pilot-version", "1.3.0\n"), entry("AGENTS.md", "old agent\n")]);
  writeManifestFile(root, oldManifest);
  initRepo(root, [".cn-pilot-version", "AGENTS.md", "README.md", MANIFEST_PATH]);
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, "AGENTS.md", "new agent\n");
  const next = manifest("1.4.0", [entry(".cn-pilot-version", "1.4.0\n"), entry("AGENTS.md", "new agent\n")]);
  const plan = planUpdate(root, oldManifest, next);
  const headBefore = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  const done = await applyValidateAndCommit(root, source.root, plan, next, {
    validate: () => ({ status: "PASS" }),
    commit: ({ applied }) => commitManagedUpdate(root, applied.applied, next.cnPilotVersion),
  });
  assert.notEqual(done.commit, headBefore);
  assert.equal(fs.readFileSync(path.join(root, "README.md"), "utf8"), "project README\n");
  const committed = execFileSync("git", ["diff-tree", "--no-commit-id", "--name-only", "-r", done.commit], { cwd: root, encoding: "utf8" }).trim().split(/\r?\n/).sort();
  assert.deepEqual(committed, [".cn-pilot-version", ".cn-pilot/update/manifest.json", "AGENTS.md"].sort());
});

test("manifest paths reject traversal, absolute paths, symlinks and non-normalized separators", () => {
  for (const invalid of ["../outside", "/absolute", ".cn-pilot/../../outside", ".cn-pilot\\CORE.md", ".kilo/agents/../secrets"]) {
    assert.throws(() => validateManifest(manifest("1.4.0", [{ path: invalid, sha256: "a".repeat(64) }])), { code: "INVALID_PATH" }, invalid);
  }
  assert.throws(() => validateManifest(manifest("1.4.0", [{ path: ".cn-pilot/runtime/tmp", sha256: "a".repeat(64) }])), { code: "PROTECTED_PATH" });
  assert.equal(crypto.createHash("sha256").update("line\n").digest("hex"), hashBytes(Buffer.from("line\r\n")));
});

test("manifest verification checks version and each managed hash", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.4.0\n");
  put(root, ".cn-pilot/CORE.md", "core\n");
  const value = manifest("1.4.0", [entry(".cn-pilot/CORE.md", "core\n")]);
  writeManifestFile(root, value);
  assert.equal(verifyManifestFiles(root).verified, 1);
  put(root, ".cn-pilot/CORE.md", "tampered\n");
  assert.throws(() => verifyManifestFiles(root), { code: "HASH_MISMATCH" });
});

test("Core manifest metadata validation permits preserved local framework customization", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.4.0\n");
  put(root, "AGENTS.md", "locally customized\n");
  const baseline = manifest("1.4.0", [entry("AGENTS.md", "upstream baseline\n")]);
  writeManifestFile(root, baseline);
  assert.equal(verifyManifestMetadata(root).hashesDeclared, 1);
  assert.throws(() => verifyManifestFiles(root), { code: "HASH_MISMATCH" });
});

test("status with same version is read-only and does not create a remote", async (t) => {
  const target = fixture(t); const source = fixture(t);
  const content = "same\n";
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, ".cn-pilot/CORE.md", content);
  const upstream = manifest("1.4.0", [entry(".cn-pilot-version", "1.4.0\n"), entry(".cn-pilot/CORE.md", content)]);
  writeManifestFile(source.root, upstream);
  initRepo(source.root, [".cn-pilot-version", ".cn-pilot/CORE.md", MANIFEST_PATH]);
  execFileSync("git", ["remote", "add", "origin", "https://github.com/LuisYGM/cn-pilot.git"], { cwd: source.root });
  target.put(target.root, ".cn-pilot-version", "1.4.0\n");
  target.put(target.root, ".cn-pilot/CORE.md", content);
  target.put(target.root, ".cn-pilot/update/updater.mjs", "fixture updater\n");
  // Case: runtime exists but the optional checkpoint file does not.
  fs.mkdirSync(path.join(target.root, ".cn-pilot/runtime"), { recursive: true });
  writeManifestFile(target.root, upstream);
  target.put(target.root, ".gitignore", "/.cn-pilot/runtime/\n");
  initRepo(target.root, [".cn-pilot-version", ".cn-pilot/CORE.md", ".cn-pilot/update/updater.mjs", MANIFEST_PATH, ".gitignore"]);
  const before = execFileSync("git", ["status", "--porcelain"], { cwd: target.root, encoding: "utf8" });
  let stdout = ""; let stderr = "";
  const code = await runCli(["status", "--target", target.root, "--source-dir", source.root], { stdout: { write: (value) => { stdout += value; } }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(code, 0, stderr);
  assert.match(stdout, /Update available: NO/);
  assert.match(stdout, /Installed: 1\.4\.0/);
  assert.match(stdout, /Active task: none/);
  assert.match(stdout, /Kilo PASS/);
  assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: target.root, encoding: "utf8" }), before);
  assert.equal(execFileSync("git", ["remote"], { cwd: target.root, encoding: "utf8" }), "");

  const nested = path.join(target.root, "nested", "cwd");
  fs.mkdirSync(nested, { recursive: true });
  const previousCwd = process.cwd();
  try {
    process.chdir(nested);
    stdout = ""; stderr = "";
    const nestedCode = await runCli(["status", "--source-dir", source.root], { stdout: { write: (value) => { stdout += value; } }, stderr: { write: (value) => { stderr += value; } } });
    assert.equal(nestedCode, 0, stderr);
    assert.match(stdout, /Installed: 1\.4\.0/);
  } finally { process.chdir(previousCwd); }

  target.put(target.root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint("BLOCKED_HUMAN"))}\n`);
  stdout = ""; stderr = "";
  const blockedStatusCode = await runCli(["status", "--target", target.root, "--source-dir", source.root], { stdout: { write: (value) => { stdout += value; } }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(blockedStatusCode, 0, stderr);
  assert.match(stdout, /Active task: BLOCKED_HUMAN/);
  assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: target.root, encoding: "utf8" }), before);

  target.put(target.root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify({ objective: "Human review", nextAction: "Wait" })}\n`);
  stdout = ""; stderr = "";
  const invalidStatusCode = await runCli(["status", "--target", target.root, "--source-dir", source.root], { stdout: { write: (value) => { stdout += value; } }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(invalidStatusCode, 0, stderr);
  assert.match(stdout, /Active task: INVALID/);
  assert.match(stdout, /Active task reason: missing required field "status"/);
  assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: target.root, encoding: "utf8" }), before);
});

test("end-to-end local source → plan → apply → Core QA → versioned commit", async (t) => {
  const target = fixture(t); const source = fixture(t);
  const checker = 'process.stdout.write(JSON.stringify({ status: "PASS" }));\n';
  const oldAgent = "old framework instructions\n"; const newAgent = "updated framework instructions\n";
  target.put(target.root, ".cn-pilot-version", "1.3.0\n");
  target.put(target.root, "AGENTS.md", oldAgent);
  target.put(target.root, ".cn-pilot/qa/core-check.mjs", checker);
  target.put(target.root, "README.md", "project owned\n");
  const oldBaseline = manifest("1.3.0", [
    entry(".cn-pilot-version", "1.3.0\n"), entry("AGENTS.md", oldAgent), entry(".cn-pilot/qa/core-check.mjs", checker),
  ]);
  writeManifestFile(target.root, oldBaseline);
  initRepo(target.root, [".cn-pilot-version", "AGENTS.md", ".cn-pilot/qa/core-check.mjs", "README.md", MANIFEST_PATH]);

  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, "AGENTS.md", newAgent);
  source.put(source.root, ".cn-pilot/qa/core-check.mjs", checker);
  const current = manifest("1.4.0", [
    entry(".cn-pilot-version", "1.4.0\n"), entry("AGENTS.md", newAgent), entry(".cn-pilot/qa/core-check.mjs", checker),
  ]);
  writeManifestFile(source.root, current);
  initRepo(source.root, [".cn-pilot-version", "AGENTS.md", ".cn-pilot/qa/core-check.mjs", MANIFEST_PATH]);
  execFileSync("git", ["remote", "add", "origin", "https://github.com/LuisYGM/cn-pilot.git"], { cwd: source.root });

  let stderr = "";
  const code = await runCli(["update", "--target", target.root, "--source-dir", source.root], { stdout: { write() {} }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(code, 0, stderr);
  assert.equal(fs.readFileSync(path.join(target.root, ".cn-pilot-version"), "utf8"), "1.4.0\n");
  assert.equal(fs.readFileSync(path.join(target.root, "AGENTS.md"), "utf8"), newAgent);
  assert.equal(fs.readFileSync(path.join(target.root, "README.md"), "utf8"), "project owned\n");
  const commit = execFileSync("git", ["log", "-1", "--format=%s"], { cwd: target.root, encoding: "utf8" }).trim();
  assert.equal(commit, "chore: actualizar CN Pilot a 1.4.0");
  assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: target.root, encoding: "utf8" }), "");
  assert.equal(execFileSync("git", ["remote"], { cwd: target.root, encoding: "utf8" }), "");
});

test("legacy bootstrap is plan-only until approval and preserves selected local customizations", async (t) => {
  const target = fixture(t); const source = fixture(t);
  const checker = 'process.stdout.write(JSON.stringify({ status: "PASS" }));\n';
  source.put(source.root, ".cn-pilot-version", "1.4.0\n");
  source.put(source.root, "AGENTS.md", "official rules\n");
  source.put(source.root, ".cn-pilot/qa/core-check.mjs", checker);
  const distribution = manifest("1.4.0", [
    entry(".cn-pilot-version", "1.4.0\n"), entry("AGENTS.md", "official rules\n"), entry(".cn-pilot/qa/core-check.mjs", checker),
  ]);
  writeManifestFile(source.root, distribution);
  initRepo(source.root, [".cn-pilot-version", "AGENTS.md", ".cn-pilot/qa/core-check.mjs", MANIFEST_PATH]);
  execFileSync("git", ["remote", "add", "origin", "https://github.com/LuisYGM/cn-pilot.git"], { cwd: source.root });

  target.put(target.root, ".cn-pilot-version", "1.2.0\n");
  target.put(target.root, "AGENTS.md", "legacy customization\n");
  target.put(target.root, ".cn-pilot/qa/core-check.mjs", checker);
  target.put(target.root, "PROJECT.md", "client context\n");
  target.put(target.root, "README.md", "client README\n");
  target.put(target.root, "product/index.html", "client product\n");
  initRepo(target.root, [".cn-pilot-version", "AGENTS.md", ".cn-pilot/qa/core-check.mjs", "PROJECT.md", "README.md", "product/index.html"]);
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: target.root, encoding: "utf8" }).trim();
  let output = ""; let stderr = "";
  const planCode = await runCli(["bootstrap", "--target", target.root, "--source-dir", source.root], { stdout: { write: (value) => { output += value; } }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(planCode, 3, stderr);
  assert.match(output, /LEGACY BOOTSTRAP MODE/);
  assert.match(output, /AGENTS\.md/);
  assert.equal(execFileSync("git", ["rev-parse", "HEAD"], { cwd: target.root, encoding: "utf8" }).trim(), head);
  assert.equal(fs.existsSync(path.join(target.root, MANIFEST_PATH)), false);

  const applyCode = await runCli(["bootstrap", "--approve-legacy", "--preserve", "AGENTS.md", "--target", target.root, "--source-dir", source.root], { stdout: { write() {} }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(applyCode, 0, stderr);
  assert.equal(fs.readFileSync(path.join(target.root, ".cn-pilot-version"), "utf8"), "1.4.0\n");
  assert.equal(fs.readFileSync(path.join(target.root, "AGENTS.md"), "utf8"), "legacy customization\n");
  assert.equal(fs.readFileSync(path.join(target.root, "PROJECT.md"), "utf8"), "client context\n");
  assert.equal(fs.readFileSync(path.join(target.root, "README.md"), "utf8"), "client README\n");
  assert.equal(fs.readFileSync(path.join(target.root, "product/index.html"), "utf8"), "client product\n");
  assert.equal(JSON.parse(fs.readFileSync(path.join(target.root, MANIFEST_PATH), "utf8")).cnPilotVersion, "1.4.0");
  assert.equal(execFileSync("git", ["status", "--porcelain"], { cwd: target.root, encoding: "utf8" }), "");
});

test("major migration preview preserves 1.x project data and blocks divergent destinations", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.5.4\n");
  put(root, ".cn-pilot/CORE.md", "CN Pilot Core 1.5.4\n");
  put(root, "PROJECT.md", "real project context\n");
  put(root, "project-resources/reference.txt", "original reference\n");
  put(root, "project-artifacts/report.md", "review output\n");
  put(root, "product/index.html", "implementation\n");
  writeManifestFile(root, manifest("1.5.4", [
    entry(".cn-pilot-version", "1.5.4\n"), entry(".cn-pilot/CORE.md", "CN Pilot Core 1.5.4\n"),
  ]));
  initRepo(root, [".cn-pilot-version", ".cn-pilot/CORE.md", MANIFEST_PATH, "PROJECT.md", "project-resources/reference.txt", "project-artifacts/report.md", "product/index.html"]);
  let plan = planMajorMigration(root);
  assert.equal(plan.conflicts.length, 0);
  assert.deepEqual(plan.moves.map(({ from, to }) => [from, to]), [
    ["PROJECT.md", "PROYECTO.md"], ["project-resources", "recursos"],
    ["project-artifacts", "artefactos"], ["product", "producto"],
  ]);
  put(root, "PROYECTO.md", "different context\n");
  plan = planMajorMigration(root);
  assert.equal(plan.conflicts[0].from, "PROJECT.md");
  assert.equal(fs.readFileSync(path.join(root, "PROJECT.md"), "utf8"), "real project context\n");
});

test("1.x status shows the migration plan and collision before any project writes", async (t) => {
  const target = fixture(t); const source = fixture(t);
  const updaterSource = "export const fixtureUpdater = true;\n";
  target.put(target.root, ".cn-pilot-version", "1.5.4\n");
  target.put(target.root, ".cn-pilot/CORE.md", "legacy core\n");
  target.put(target.root, ".cn-pilot/update/updater.mjs", updaterSource);
  target.put(target.root, "PROJECT.md", "project context\n");
  target.put(target.root, "project-resources/input.txt", "input\n");
  const before = manifest("1.5.4", [
    entry(".cn-pilot-version", "1.5.4\n"), entry(".cn-pilot/CORE.md", "legacy core\n"),
    entry(".cn-pilot/update/updater.mjs", updaterSource),
  ]);
  writeManifestFile(target.root, before);
  initRepo(target.root, [".cn-pilot-version", ".cn-pilot/CORE.md", ".cn-pilot/update/updater.mjs", MANIFEST_PATH, "PROJECT.md", "project-resources/input.txt"]);
  execFileSync("git", ["remote", "add", "origin", SOURCE_REPOSITORY], { cwd: target.root });

  source.put(source.root, ".cn-pilot-version", "2.0.0\n");
  source.put(source.root, ".cn-pilot/NUCLEO.md", "current core\n");
  source.put(source.root, ".cn-pilot/update/updater.mjs", updaterSource);
  const after = buildManifest(source.root, { files: [".cn-pilot-version", ".cn-pilot/NUCLEO.md", ".cn-pilot/update/updater.mjs"], previousManifest: before });
  writeManifestFile(source.root, after);
  initRepo(source.root, [".cn-pilot-version", ".cn-pilot/NUCLEO.md", ".cn-pilot/update/updater.mjs", MANIFEST_PATH]);
  execFileSync("git", ["remote", "add", "origin", SOURCE_REPOSITORY], { cwd: source.root });

  let output = ""; let stderr = "";
  const code = await runCli(["status", "--target", target.root, "--source-dir", source.root], { stdout: { write: (value) => { output += value; } }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(code, 0, stderr);
  assert.match(output, /Migration: MAJOR 1\.x → 2\.0 REQUIRED/);
  assert.match(output, /PROJECT\.md → PROYECTO\.md/);
  assert.match(output, /project-resources → recursos/);
  assert.match(output, /Ready to update\./);
  assert.equal(fs.existsSync(path.join(target.root, "PROJECT.md")), true);
  assert.equal(fs.existsSync(path.join(target.root, "PROYECTO.md")), false);
  assert.equal(fs.readFileSync(path.join(target.root, "project-resources/input.txt"), "utf8"), "input\n");
});

test("2.0 manifest declares the major migration without blocking the managed Core update", (t) => {
  const target = fixture(t); const source = fixture(t);
  target.put(target.root, ".cn-pilot-version", "1.5.4\n");
  target.put(target.root, ".cn-pilot/CORE.md", "legacy core\n");
  const before = manifest("1.5.4", [entry(".cn-pilot-version", "1.5.4\n"), entry(".cn-pilot/CORE.md", "legacy core\n")]);
  source.put(source.root, ".cn-pilot-version", "2.0.0\n");
  source.put(source.root, ".cn-pilot/NUCLEO.md", "current core\n");
  const after = buildManifest(source.root, { files: [".cn-pilot-version", ".cn-pilot/NUCLEO.md"], previousManifest: before });
  assert.equal(after.migrations.length, 1);
  assert.equal(after.migrations[0].id, "cn-pilot-1x-to-2x-foundation");
  assert.equal(after.migrations[0].requiresApproval, true);
  const plan = planUpdate(target.root, before, after);
  assert.equal(plan.conflicts.length, 0);
  assert.deepEqual(plan.actions.map(({ type, path: item }) => [type, item]), [
    ["update", ".cn-pilot-version"], ["remove", ".cn-pilot/CORE.md"], ["add", ".cn-pilot/NUCLEO.md"],
  ]);
});

test("2.0 managed rename destination collision is blocked without overwrite", (t) => {
  const target = fixture(t); const source = fixture(t);
  target.put(target.root, ".cn-pilot-version", "1.5.4\n");
  target.put(target.root, ".cn-pilot/CORE.md", "legacy core\n");
  target.put(target.root, ".cn-pilot/NUCLEO.md", "local managed-name collision\n");
  const before = manifest("1.5.4", [entry(".cn-pilot-version", "1.5.4\n"), entry(".cn-pilot/CORE.md", "legacy core\n")]);
  source.put(source.root, ".cn-pilot-version", "2.0.0\n");
  source.put(source.root, ".cn-pilot/NUCLEO.md", "upstream core\n");
  const after = buildManifest(source.root, { files: [".cn-pilot-version", ".cn-pilot/NUCLEO.md"], previousManifest: before });
  const plan = planUpdate(target.root, before, after);
  assert.equal(plan.conflicts.some(({ path: item }) => item === ".cn-pilot/NUCLEO.md"), true);
  assert.equal(fs.readFileSync(path.join(target.root, ".cn-pilot/NUCLEO.md"), "utf8"), "local managed-name collision\n");
});

test("major migration blocks every divergent legacy/new project path pair", (t) => {
  const { root, put } = fixture(t);
  for (const [from, to] of [["product", "producto"], ["project-resources", "recursos"], ["project-artifacts", "artefactos"]]) {
    put(root, `${from}/same.txt`, `legacy:${from}\n`);
    put(root, `${to}/same.txt`, `new:${to}\n`);
  }
  const plan = planMajorMigration(root);
  assert.deepEqual(plan.conflicts.map(({ from, to }) => [from, to]).sort(([a], [b]) => a.localeCompare(b)), [
    ["project-resources", "recursos"], ["project-artifacts", "artefactos"], ["product", "producto"],
  ].sort(([a], [b]) => a.localeCompare(b)));
  assert.equal(plan.moves.length, 0);
});

test("major migration preview preserves an Existing compatibility product root", (t) => {
  const { root, put } = fixture(t);
  put(root, "PROJECT.md", "Existing compatibility exception: product root is .\n");
  put(root, "product/index.html", "operational implementation\n");
  const plan = planMajorMigration(root);
  assert.equal(plan.moves.some(({ from }) => from === "product"), false);
  assert.equal(plan.preserved.some(({ path: item }) => item === "product"), true);
});

test("major migration apply moves intact paths and leaves unrelated untracked inputs intact", (t) => {
  const { root, put } = fixture(t);
  put(root, "PROJECT.md", "real context\n");
  put(root, "project-resources/README.md", "input index\n");
  put(root, "project-resources/original.bin", "original bytes\n");
  put(root, "project-artifacts/audit/report.md", "project output\n");
  put(root, "product/src/index.js", "implementation bytes\n");
  put(root, ".cn-pilot-version", "2.0.0\n");
  initRepo(root, [".cn-pilot-version", "PROJECT.md", "project-resources/README.md"]);
  const plan = planMajorMigration(root);
  const applied = applyMajorMigration(root, plan);
  assert.deepEqual(applied.moved, [
    { from: "PROJECT.md", to: "PROYECTO.md" },
    { from: "project-resources", to: "recursos" },
    { from: "project-artifacts", to: "artefactos" },
    { from: "product", to: "producto" },
  ]);
  assert.equal(fs.existsSync(path.join(root, "PROJECT.md")), false);
  assert.equal(fs.readFileSync(path.join(root, "PROYECTO.md"), "utf8"), "real context\n");
  assert.equal(fs.readFileSync(path.join(root, "recursos/original.bin"), "utf8"), "original bytes\n");
  assert.equal(fs.readFileSync(path.join(root, "artefactos/audit/report.md"), "utf8"), "project output\n");
  assert.equal(fs.readFileSync(path.join(root, "producto/src/index.js"), "utf8"), "implementation bytes\n");
  assert.equal(applied.stagePaths.includes("recursos/README.md"), true);
  assert.equal(applied.stagePaths.includes("recursos/original.bin"), false);
  const followup = planMajorMigration(root);
  assert.equal(followup.moves.length, 0);
  assert.equal(followup.conflicts.length, 0);
});

test("major migration CLI previews without writes and honors dirty-tree and active-task gates", async (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "2.0.0\n");
  put(root, "PROJECT.md", "context\n");
  initRepo(root, [".cn-pilot-version", "PROJECT.md"]);
  let output = ""; let stderr = "";
  const preview = await runCli(["migrate", "--target", root], { stdout: { write: (value) => { output += value; } }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(preview, 3, stderr);
  assert.match(output, /Preview only; no files changed/);
  assert.equal(fs.existsSync(path.join(root, "PROJECT.md")), true);
  assert.equal(fs.existsSync(path.join(root, "PROYECTO.md")), false);

  put(root, "PROJECT.md", "edited context\n");
  stderr = "";
  const dirty = await runCli(["migrate", "--approve-migration", "--target", root], { stdout: { write() {} }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(dirty, 1);
  assert.match(stderr, /DIRTY_TRACKED_TREE/);

  execFileSync("git", ["checkout", "--", "PROJECT.md"], { cwd: root });
  put(root, ".cn-pilot/runtime/active-task.json", `${JSON.stringify(activeCheckpoint())}\n`);
  stderr = "";
  const active = await runCli(["migrate", "--approve-migration", "--target", root], { stdout: { write() {} }, stderr: { write: (value) => { stderr += value; } } });
  assert.equal(active, 1);
  assert.match(stderr, /ACTIVE_TASK/);
  assert.equal(fs.existsSync(path.join(root, "PROJECT.md")), true);
});

test("unknown migrations block updates instead of executing unregistered code", (t) => {
  const { root } = fixture(t);
  const before = manifest("1.3.0", []);
  const after = manifest("1.4.0", [], { migrations: [{ id: "unsafe", from: "1.3.0", to: "1.4.0", scope: "Core only", paths: [".cn-pilot/CORE.md"], requiresApproval: false, idempotent: true }] });
  assert.equal(planUpdate(root, before, after).conflicts[0].path, "<migration>");
});

test("manifest generator is deterministic, excludes mixed/project/runtime paths, and verifies exact Git inventory", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.3.0\n");
  put(root, "AGENTS.md", "rules\n");
  put(root, ".cn-pilot/CORE.md", "core\n");
  put(root, ".cn-pilot/runtime/active-task.json", "{}\n");
  put(root, ".kilo/agents/custom.md", "agent\n");
  put(root, "README.md", "project readme\n");
  const projectContextPaths = ["PROYECTO.md", "REQUISITOS.md", "ESTADO.md", "DECISIONES.md", "ARTEFACTOS.md"];
  for (const relative of projectContextPaths) put(root, relative, `manual project context: ${relative}\n`);
  put(root, "kilo.jsonc", "{}\n");
  initRepo(root, ["AGENTS.md", ".cn-pilot-version", ".cn-pilot/CORE.md", ".kilo/agents/custom.md", "README.md", ...projectContextPaths, "kilo.jsonc"]);
  const first = buildManifest(root); const second = buildManifest(root);
  assert.deepEqual(first.managedFiles, second.managedFiles);
  assert.equal(first.managedFiles.some((item) => item.path.includes("runtime")), false);
  assert.equal(first.managedFiles.some((item) => item.path === "README.md" || item.path === "kilo.jsonc"), false);
  assert.equal(first.managedFiles.some((item) => projectContextPaths.includes(item.path)), false, "normal Core updates must never replace Project Context files");
  assert.equal(verifyTrackedManifest(root, first).trackedFiles, 4);
  put(root, ".cn-pilot/docs/new.md", "not listed\n");
  execFileSync("git", ["add", ".cn-pilot/docs/new.md"], { cwd: root });
  assert.throws(() => verifyTrackedManifest(root, first), { code: "STALE_MANIFEST" });
});

test("manifest generator requires SemVer bump when managed distribution changes", (t) => {
  const { root, put } = fixture(t);
  put(root, ".cn-pilot-version", "1.3.0\n");
  put(root, "AGENTS.md", "old\n");
  const old = manifest("1.3.0", [entry("AGENTS.md", "old\n")]);
  put(root, "AGENTS.md", "new\n");
  assert.throws(() => buildManifest(root, { files: ["AGENTS.md"], previousManifest: old }), { code: "VERSION_BUMP_REQUIRED" });
  put(root, ".cn-pilot-version", "1.4.0\n");
  assert.equal(buildManifest(root, { files: ["AGENTS.md"], previousManifest: old }).cnPilotVersion, "1.4.0");
});
