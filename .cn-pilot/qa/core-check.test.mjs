import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runCli, runCoreChecks } from "./core-check.mjs";

function createFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cn-pilot-core-qa-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (relativePath, content = "") => {
    const target = path.join(root, ...relativePath.split("/"));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, "utf8");
    return target;
  };

  const devLead = [
    "---",
    "description: Coordinador de fixture",
    "mode: primary",
    "permission:",
    "  read:",
    '    "*": allow',
    '    ".env": deny',
    '    ".env.*": deny',
    '    "**/.env": deny',
    '    "**/.env.*": deny',
    '    "secrets/**": deny',
    '    ".kilocode/mcp.json": deny',
    '    "**/.kilocode/mcp.json": deny',
    "  task:",
    '    "*": deny',
    '    "reviewer": allow',
    "  edit:",
    '    "*": ask',
    '    ".env": deny',
    '    ".env.*": deny',
    '    "**/.env": deny',
    '    "**/.env.*": deny',
    '    "secrets/**": deny',
    '    ".kilocode/mcp.json": deny',
    '    "**/.kilocode/mcp.json": deny',
    '    ".env.example": allow',
    "  bash:",
    '    "*": ask',
    '    "git push*": ask',
    '    "git push --force*": deny',
    '    "git push -f*": deny',
    '    "git reset --hard*": deny',
    '    "git clean*": deny',
    "---",
    "# Dev Lead fixture",
  ].join("\n") + "\n";

  const reviewer = [
    "---",
    "description: Revisión de fixture",
    "mode: subagent",
    "permission:",
    "  read:",
    '    "*": allow',
    '    ".env": deny',
    '    ".env.*": deny',
    '    "**/.env": deny',
    '    "**/.env.*": deny',
    '    "secrets/**": deny',
    '    ".kilocode/mcp.json": deny',
    '    "**/.kilocode/mcp.json": deny',
    "  glob: allow",
    "  grep: allow",
    "  bash: deny",
    "  websearch: deny",
    "  webfetch: deny",
    "  skill: deny",
    "  task: deny",
    "  agent_manager: deny",
    "  background_process: deny",
    "  write: deny",
    "  edit: deny",
    "  apply_patch: deny",
    "---",
    "# Reviewer fixture",
  ].join("\n") + "\n";

  const manifest = [
    "- 2 agentes en `.kilo/agents/`",
    "- 2 skills (`.kilo/skills/*/SKILL.md`)",
    "- 1 documento de referencia bajo `.kilo/skills/technical-seo/references/` (no es una skill adicional)",
    "- 4 comandos en `.kilo/commands/`",
    "- 1 perfil en `.cn-pilot/profiles/`",
    "- 1 archivo de plantilla en la raíz de `.cn-pilot/templates/` y 2 archivos en total bajo `.cn-pilot/templates/` (incluye subdirectorios)",
  ].join("\n") + "\n";

  put("AGENTS.md", "# Minimal test kernel\n");
  put(".cn-pilot-version", "1.2.0\n");
  put(".cn-pilot/CORE.md", "**Versión:** `1.2.0`\n");
  put(".cn-pilot/MANIFEST.md", manifest);
  put(".cn-pilot/config/responsive.json", "{}\n");
  put(".cn-pilot/docs/.keep");
  put(".cn-pilot/profiles/profile.md", "# Perfil de fixture\n");
  put(".cn-pilot/templates/root.md", "# Plantilla raíz\n");
  put(".cn-pilot/templates/sub/nested.md", "# Plantilla anidada\n");
  put(".cn-pilot/qa/core-check.mjs", "// checker fixture\n");
  put(".cn-pilot/qa/core-check.test.mjs", "// self-test fixture\n");
  put("project-resources/README.md", "# Input scaffold\n");
  put("kilo.jsonc", "{}\n");
  put(".gitignore", "/.cn-pilot/runtime/\n");
  put(".kilo/agents/dev-lead.md", devLead);
  put(".kilo/agents/reviewer.md", reviewer);
  put(".kilo/skills/sample/SKILL.md", "---\nname: sample\ndescription: Skill de fixture\n---\n# Sample\n");
  put(".kilo/skills/technical-seo/SKILL.md", "---\nname: technical-seo\ndescription: Skill SEO de fixture\n---\n# SEO\n");
  put(".kilo/skills/technical-seo/references/audit.md", "# Referencia\n");
  for (const command of ["new-project", "checkpoint", "review", "doctor"]) {
    put(`.kilo/commands/${command}.md`, `---\ndescription: Comando ${command}\nagent: dev-lead\n---\n# ${command}\n`);
  }
  return { root, put };
}

function getCheck(report, id) {
  const check = report.checks.find((item) => item.id === id);
  assert.ok(check, `check ${id} exists`);
  return check;
}

function snapshotFixture(root) {
  const snapshot = [];
  const visit = (relativeDirectory) => {
    const absoluteDirectory = path.join(root, ...relativeDirectory.split("/").filter(Boolean));
    for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
      const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      if (entry.isDirectory()) visit(relativePath);
      else if (entry.isFile()) snapshot.push([relativePath, fs.readFileSync(path.join(absoluteDirectory, entry.name), "utf8")]);
      else if (entry.isSymbolicLink()) snapshot.push([relativePath, "SYMLINK"]);
    }
  };
  visit("");
  return JSON.stringify(snapshot);
}

test("known-good minimal fixture passes deterministic invariants", (t) => {
  const fixture = createFixture(t);
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(report.status, "PASS", JSON.stringify(report.findings));
  assert.deepEqual(runCoreChecks({ rootDir: fixture.root }), report, "same read-only snapshot yields the same report");
  assert.equal(report.version, "1.2.0");
  assert.equal(getCheck(report, "agents.frontmatter").details.count, 2);
  assert.equal(getCheck(report, "skills.frontmatter").details.count, 2);
  assert.equal(getCheck(report, "commands.frontmatter").details.count, 4);
  assert.equal(getCheck(report, "templates.inventory").details.rootFiles, 1);
  assert.equal(getCheck(report, "templates.inventory").details.totalFiles, 2);
});

test("Core QA leaves the input fixture unchanged", (t) => {
  const fixture = createFixture(t);
  const before = snapshotFixture(fixture.root);
  runCoreChecks({ rootDir: fixture.root });
  assert.equal(snapshotFixture(fixture.root), before);
});

test("invalid SemVer fails the version check", (t) => {
  const fixture = createFixture(t);
  fixture.put(".cn-pilot-version", "release-current\n");
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "core.version").status, "FAIL");
  assert.equal(report.status, "FAIL");
});

test("command target must resolve to an existing agent", (t) => {
  const fixture = createFixture(t);
  fixture.put(".kilo/commands/review.md", "---\ndescription: Revisión\nagent: missing-agent\n---\n");
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "routing.commands").status, "FAIL");
});

test("Dev Lead task target must resolve to an existing agent", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/dev-lead.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace('"reviewer": allow', '"ghost-reviewer": allow'));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "routing.devLead").status, "FAIL");
});

test("a destructive Git permission regression in Dev Lead fails", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/dev-lead.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace('"git reset --hard*": deny', '"git reset --hard*": allow'));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "security.devLead").status, "FAIL");
});

test("a weakened Reviewer permission fails the protected check", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/reviewer.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace("  edit: deny", "  edit: allow"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "permissions.reviewer").status, "FAIL");
});

test("Reviewer background-process capability remains denied", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/reviewer.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace("background_process: deny", "background_process: allow"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "permissions.reviewer").status, "FAIL");
});

test("a missing SKILL.md is detected", (t) => {
  const fixture = createFixture(t);
  fs.rmSync(path.join(fixture.root, ".kilo/skills/sample/SKILL.md"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "skills.frontmatter").status, "FAIL");
});

test("MANIFEST inventory drift warns and retains non-strict success", (t) => {
  const fixture = createFixture(t);
  const file = ".cn-pilot/MANIFEST.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace("2 skills", "3 skills"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "manifest.inventory").status, "WARN");
  assert.equal(report.status, "WARN");
});

test("runtime ignore protection is checked without invoking Git", (t) => {
  const fixture = createFixture(t);
  fixture.put(".gitignore", "# runtime rule removed\n");
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "runtime.gitignore").status, "FAIL");
});

test("JSON output is parseable and exit codes distinguish results", (t) => {
  const fixture = createFixture(t);
  let stdout = "";
  let stderr = "";
  const io = {
    stdout: { write: (value) => { stdout += value; } },
    stderr: { write: (value) => { stderr += value; } },
  };
  assert.equal(runCli(["--json"], { rootDir: fixture.root, ...io }), 0);
  assert.equal(JSON.parse(stdout).status, "PASS");
  assert.equal(stderr, "");
  stdout = "";
  assert.equal(runCli(["--help"], { rootDir: fixture.root, ...io }), 0);
  assert.match(stdout, /Usage: node/);
  assert.equal(runCli(["--unknown"], { rootDir: fixture.root, ...io }), 2);
  assert.match(stderr, /Unknown argument/);
  const invalid = createFixture(t);
  invalid.put(".cn-pilot-version", "not-semver\n");
  stdout = "";
  stderr = "";
  assert.equal(runCli([], { rootDir: invalid.root, ...io }), 1);
  assert.match(stdout, /Result: FAIL/);
  assert.equal(runCli([], { rootDir: path.join(fixture.root, "missing-root"), ...io }), 2);
});

test("the current CN Pilot repository passes Core QA", () => {
  const report = runCoreChecks();
  assert.equal(report.status, "PASS", JSON.stringify(report.findings));
});
