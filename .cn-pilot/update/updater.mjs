import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const SOURCE_REPOSITORY = "https://github.com/LuisYGM/cn-pilot.git";
export const STABLE_BRANCH = "main";
export const MANIFEST_PATH = ".cn-pilot/update/manifest.json";
export const MANAGED_ROOTS = ["AGENTS.md", ".cn-pilot-version", ".cn-pilot/", ".kilo/agents/", ".kilo/skills/", ".kilo/commands/"];
export const PROJECT_OWNED_PATHS = [
  "PROJECT.md", "REQUIREMENTS.md", "STATE.md", "DECISIONS.md", "ARTIFACTS.md", "README.md",
  "product/", "project-resources/", "project-artifacts/", ".env", ".env.*", "secrets/",
  ".cn-pilot/runtime/", "kilo.jsonc", ".gitignore", ".editorconfig", ".gitattributes", ".kilocodeignore", "LICENSE", ".vscode/",
];
const HASH = /^[a-f0-9]{64}$/;
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export class UpdateError extends Error {
  constructor(code, message) { super(message); this.name = "UpdateError"; this.code = code; }
}

function fail(code, message) { throw new UpdateError(code, message); }

function run(command, args, cwd, { allowFailure = false } = {}) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    if (allowFailure) return { ok: false, stdout: result.stdout ?? "", stderr: "" };
    fail("COMMAND_FAILED", `${command} ${args[0] ?? ""} failed (${result.error?.code ?? result.status ?? "unknown"}).`);
  }
  return { ok: true, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function semverParts(value) {
  const match = String(value ?? "").trim().match(VERSION);
  if (!match) fail("INVALID_VERSION", `Invalid SemVer: ${String(value ?? "")}`);
  return match.slice(1).map(Number);
}

export function compareVersions(left, right) {
  const a = semverParts(left); const b = semverParts(right);
  for (let index = 0; index < 3; index += 1) if (a[index] !== b[index]) return a[index] < b[index] ? -1 : 1;
  return 0;
}

export function normalizeManagedPath(value) {
  if (typeof value !== "string" || !value || value.includes("\\") || value.startsWith("/") || value.includes("\0")) fail("INVALID_PATH", "Manifest contains an invalid managed path.");
  const parts = value.split("/");
  if (parts.some((part) => !part || part === "." || part === ".." || part.includes(":") || /[\x00-\x1f\x7f]/.test(part) || /[ .]$/.test(part) || /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\..*)?$/i.test(part))) fail("INVALID_PATH", "Manifest contains a non-canonical managed path.");
  const normalized = parts.join("/");
  if (normalized === ".cn-pilot/runtime" || normalized.startsWith(".cn-pilot/runtime/") || parts.some((part) => /^\.env(?:\.|$)/i.test(part) || part.toLowerCase() === "secrets")) fail("PROTECTED_PATH", `Protected path is not distributable: ${normalized}`);
  const allowed = MANAGED_ROOTS.some((root) => root.endsWith("/") ? normalized.startsWith(root) : normalized === root);
  if (!allowed || PROJECT_OWNED_PATHS.some((protectedPath) => protectedPath.endsWith("/") ? normalized.startsWith(protectedPath) : protectedPath.endsWith(".*") ? normalized.startsWith(protectedPath.slice(0, -1)) : normalized === protectedPath)) {
    fail("PROTECTED_PATH", `Path is outside CN Pilot managed roots: ${normalized}`);
  }
  return normalized;
}

function safePath(root, relative, { allowMissing = false } = {}) {
  const normalized = normalizeManagedPath(relative);
  const base = path.resolve(root);
  const target = path.resolve(base, ...normalized.split("/"));
  if (target === base || !target.startsWith(`${base}${path.sep}`)) fail("PATH_ESCAPE", "Managed path escapes the project root.");
  let current = base;
  for (const part of normalized.split("/")) {
    current = path.join(current, part);
    try {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink()) fail("SYMLINK_PATH", `Symlink in managed path: ${normalized}`);
      if (current !== target && !stat.isDirectory()) fail("INVALID_PARENT", `Non-directory parent in managed path: ${normalized}`);
      if (current === target && !stat.isFile()) fail("NON_REGULAR_FILE", `Managed path is not a regular file: ${normalized}`);
    } catch (error) {
      if (error?.code !== "ENOENT" || !allowMissing) throw error;
      break;
    }
  }
  return target;
}

function safeMetadataPath(root) {
  const base = path.resolve(root);
  const target = path.resolve(base, ...MANIFEST_PATH.split("/"));
  let current = base;
  for (const [index, part] of MANIFEST_PATH.split("/").entries()) {
    current = path.join(current, part);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code === "ENOENT") return target; throw error; }
    if (stat.isSymbolicLink() || (index < MANIFEST_PATH.split("/").length - 1 && !stat.isDirectory()) || (index === MANIFEST_PATH.split("/").length - 1 && !stat.isFile())) fail("UNSAFE_MANIFEST_PATH", "Distribution manifest destination is not a safe regular file.");
  }
  return target;
}

function normalizedBytes(bytes, filePath) {
  let text;
  try { text = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
  catch { fail("INVALID_TEXT", `Managed file is not valid UTF-8 text: ${filePath}`); }
  return Buffer.from(text.replace(/\r\n/g, "\n"), "utf8");
}

export function hashBytes(bytes, filePath = "<buffer>") {
  return crypto.createHash("sha256").update(normalizedBytes(Buffer.from(bytes), filePath)).digest("hex");
}

export function hashFile(root, relative) {
  const filePath = safePath(root, relative);
  return hashBytes(fs.readFileSync(filePath), relative);
}

export function validateManifest(value) {
  let manifest = value;
  if (typeof value === "string") {
    try { manifest = JSON.parse(value); } catch (error) { fail("INVALID_MANIFEST", `Distribution manifest is not valid JSON (${error.message}).`); }
  }
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest) || manifest.schemaVersion !== 1) fail("INVALID_MANIFEST", "Unsupported distribution manifest schema.");
  if (!VERSION.test(manifest.cnPilotVersion ?? "")) fail("INVALID_MANIFEST", "Manifest has an invalid CN Pilot SemVer.");
  if (manifest.sourceRepository !== SOURCE_REPOSITORY || manifest.stableBranch !== STABLE_BRANCH) fail("INVALID_SOURCE", "Manifest source must be the canonical CN Pilot main branch.");
  if (manifest.sourceCommit !== null && (typeof manifest.sourceCommit !== "string" || !/^[a-f0-9]{40,64}$/i.test(manifest.sourceCommit))) fail("INVALID_MANIFEST", "Manifest source commit is invalid.");
  if (!manifest.compatibility || manifest.compatibility.nodeMin !== "20.0.0" || manifest.compatibility.kiloMin !== "7.8.8") fail("INVALID_MANIFEST", "Manifest compatibility requirements are invalid.");
  if (!Array.isArray(manifest.managedFiles) || !Array.isArray(manifest.addedFiles) || !Array.isArray(manifest.removedFiles) || !Array.isArray(manifest.migrations)) fail("INVALID_MANIFEST", "Manifest file or migration lists are invalid.");
  const seen = new Set(); const portableNames = new Set();
  for (const item of manifest.managedFiles) {
    if (!item || typeof item !== "object") fail("INVALID_MANIFEST", "Manifest file entry is invalid.");
    const relative = normalizeManagedPath(item.path);
    const portable = relative.toLocaleLowerCase("en-US");
    if (relative === MANIFEST_PATH || relative !== item.path || seen.has(relative) || portableNames.has(portable) || !HASH.test(item.sha256 ?? "")) fail("INVALID_MANIFEST", `Manifest path/hash is invalid or duplicated: ${relative}`);
    seen.add(relative);
    portableNames.add(portable);
  }
  for (const list of [manifest.addedFiles, manifest.removedFiles]) {
    const names = new Set();
    for (const item of list) {
      const relative = normalizeManagedPath(item);
      if (relative === MANIFEST_PATH || relative !== item || names.has(item)) fail("INVALID_MANIFEST", "Manifest change list is invalid or duplicated.");
      names.add(item);
    }
  }
  for (const migration of manifest.migrations) {
    if (!migration || typeof migration !== "object" || !VERSION.test(migration.from ?? "") || !VERSION.test(migration.to ?? "") || typeof migration.scope !== "string" || !migration.scope.trim() || !Array.isArray(migration.paths) || typeof migration.requiresApproval !== "boolean" || (typeof migration.idempotent !== "boolean" && typeof migration.detectAlreadyApplied !== "string")) fail("INVALID_MIGRATION", "Manifest migration must declare from/to, scope, paths, approval and idempotency/detection.");
    for (const item of migration.paths) normalizeManagedPath(item);
  }
  return manifest;
}

function readManifest(root) {
  let manifestFile; let source;
  try {
    manifestFile = safePath(root, MANIFEST_PATH);
    source = fs.readFileSync(manifestFile, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") fail("MANIFEST_MISSING", "CN Pilot distribution manifest is missing.");
    throw error;
  }
  return validateManifest(source);
}

export function verifyManifestFiles(root, manifestInput = readManifest(root)) {
  const manifest = validateManifest(manifestInput);
  const versionPath = safePath(root, ".cn-pilot-version");
  let version;
  try { version = fs.readFileSync(versionPath, "utf8").trim(); }
  catch { fail("VERSION_MISSING", "Installed CN Pilot version file is missing."); }
  if (version !== manifest.cnPilotVersion) fail("VERSION_MISMATCH", "Manifest version does not match .cn-pilot-version.");
  for (const item of manifest.managedFiles) {
    let actual;
    try { actual = hashFile(root, item.path); }
    catch { fail("MANAGED_FILE_MISSING", `Manifest file is missing or unsafe: ${item.path}`); }
    if (actual !== item.sha256) fail("HASH_MISMATCH", `Distribution hash mismatch: ${item.path}`);
  }
  return { manifest, verified: manifest.managedFiles.length };
}

export function verifyManifestMetadata(root, manifestInput = readManifest(root)) {
  const manifest = validateManifest(manifestInput);
  const versionPath = safePath(root, ".cn-pilot-version");
  let version;
  try { version = fs.readFileSync(versionPath, "utf8").trim(); }
  catch { fail("VERSION_MISSING", "Installed CN Pilot version file is missing."); }
  if (version !== manifest.cnPilotVersion) fail("VERSION_MISMATCH", "Manifest version does not match .cn-pilot-version.");
  return { manifest, hashesDeclared: manifest.managedFiles.length };
}

function isManaged(relative) {
  try { return normalizeManagedPath(relative) === relative; } catch { return false; }
}

export function listTrackedManagedFiles(root) {
  const result = run("git", ["ls-files", "-z"], root);
  return result.stdout.split("\0").filter(Boolean).map((item) => item.replace(/\\/g, "/")).filter((item) => isManaged(item) && item !== MANIFEST_PATH).sort();
}

export function verifyTrackedManifest(root, manifestInput = readManifest(root)) {
  const manifest = validateManifest(manifestInput);
  const tracked = listTrackedManagedFiles(root);
  const listedSet = new Set(manifest.managedFiles.map((item) => item.path));
  const trackedSet = new Set(tracked);
  const missing = tracked.filter((item) => !listedSet.has(item));
  const stale = [...listedSet].filter((item) => !trackedSet.has(item));
  if (missing.length || stale.length) fail("STALE_MANIFEST", `Distribution manifest inventory differs from Git (missing: ${missing.join(", ") || "none"}; stale: ${stale.join(", ") || "none"}).`);
  return { manifest, trackedFiles: tracked.length };
}

export function buildManifest(root, { files = listTrackedManagedFiles(root), sourceCommit = null, previousManifest = null } = {}) {
  const version = fs.readFileSync(safePath(root, ".cn-pilot-version"), "utf8").trim();
  semverParts(version);
  const names = [...new Set(files.map(normalizeManagedPath).filter((item) => item !== MANIFEST_PATH))].sort();
  const managedFiles = names.map((relative) => ({ path: relative, sha256: hashFile(root, relative) }));
  const prior = previousManifest ? validateManifest(previousManifest).managedFiles.map(({ path: item }) => item) : [];
  const currentSet = new Set(names); const priorSet = new Set(prior);
  if (previousManifest) {
    const oldMap = manifestMap(validateManifest(previousManifest));
    const newMap = new Map(managedFiles.map((item) => [item.path, item.sha256]));
    const changed = [...new Set([...oldMap.keys(), ...newMap.keys()])].some((item) => oldMap.get(item) !== newMap.get(item));
    if (changed && compareVersions(version, previousManifest.cnPilotVersion) <= 0) fail("VERSION_BUMP_REQUIRED", "Managed distribution changed; bump .cn-pilot-version before regenerating its manifest.");
    if (!changed && compareVersions(version, previousManifest.cnPilotVersion) < 0) fail("VERSION_DOWNGRADE", "Distribution SemVer cannot decrease.");
  }
  return {
    schemaVersion: 1,
    cnPilotVersion: version,
    sourceRepository: SOURCE_REPOSITORY,
    stableBranch: STABLE_BRANCH,
    sourceCommit: sourceCommit ?? null,
    compatibility: { nodeMin: "20.0.0", kiloMin: "7.8.8" },
    managedFiles,
    addedFiles: previousManifest ? names.filter((item) => !priorSet.has(item)) : [],
    removedFiles: previousManifest ? prior.filter((item) => !currentSet.has(item)) : [],
    migrations: [],
  };
}

export function writeManifest(root, manifest) {
  const valid = validateManifest(manifest);
  const file = safeMetadataPath(root);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  safeMetadataPath(root);
  fs.writeFileSync(file, `${JSON.stringify(valid, null, 2)}\n`, "utf8");
  return valid;
}

function manifestMap(manifest) { return new Map(manifest.managedFiles.map((item) => [item.path, item.sha256])); }

export function planUpdate(root, installedInput, upstreamInput) {
  const installed = validateManifest(installedInput); const upstream = validateManifest(upstreamInput);
  if (compareVersions(installed.cnPilotVersion, upstream.cnPilotVersion) > 0) fail("DOWNGRADE_BLOCKED", "Upstream version is older than the installed baseline.");
  const before = manifestMap(installed); const after = manifestMap(upstream);
  const actions = []; const preserved = []; const conflicts = [];
  for (const relative of [...new Set([...before.keys(), ...after.keys()])].sort()) {
    const oldHash = before.get(relative); const nextHash = after.get(relative);
    let localHash = null; let exists = false; let unsafeLocal = false;
    try { localHash = hashFile(root, relative); exists = true; }
    catch (error) {
      if (error?.code === "ENOENT") exists = false;
      else if (error instanceof UpdateError && error.code === "NON_REGULAR_FILE") { conflicts.push({ path: relative, reason: "unsafe local path" }); unsafeLocal = true; }
      else if (error instanceof UpdateError && error.code === "SYMLINK_PATH") { conflicts.push({ path: relative, reason: "local symlink" }); unsafeLocal = true; }
      else if (!String(error?.message).includes("ENOENT")) { conflicts.push({ path: relative, reason: "cannot inspect local file" }); unsafeLocal = true; }
    }
    if (unsafeLocal) continue;
    if (!oldHash) {
      if (exists) conflicts.push({ path: relative, reason: "new upstream file collides with an untracked/local file" });
      else actions.push({ type: "add", path: relative, sha256: nextHash });
      continue;
    }
    if (!nextHash) {
      if (!exists) { preserved.push({ path: relative, reason: "local deletion preserved" }); continue; }
      if (localHash !== oldHash) conflicts.push({ path: relative, reason: "upstream removes a locally modified file" });
      else actions.push({ type: "remove", path: relative, baselineHash: oldHash, sha256: oldHash });
      continue;
    }
    if (localHash === oldHash) {
      if (nextHash !== oldHash) actions.push({ type: "update", path: relative, baselineHash: oldHash, sha256: nextHash });
      continue;
    }
    if (nextHash === oldHash) { preserved.push({ path: relative, reason: exists ? "local modification preserved; upstream unchanged" : "local deletion preserved; upstream unchanged" }); continue; }
    if (exists && localHash === nextHash) { preserved.push({ path: relative, reason: "local file already matches upstream" }); continue; }
    conflicts.push({ path: relative, reason: "local and upstream both differ from installed baseline" });
  }
  if (upstream.migrations.some((migration) => migration.requiresApproval)) conflicts.push({ path: "<migration>", reason: "migration requires human approval" });
  if (upstream.migrations.length) conflicts.push({ path: "<migration>", reason: "no migration is registered for automatic execution in v1" });
  return { installedVersion: installed.cnPilotVersion, latestVersion: upstream.cnPilotVersion, actions, preserved, conflicts, unchanged: [...before.keys()].filter((item) => before.get(item) === after.get(item)).length };
}

function atomicWrite(root, relative, bytes) {
  const destination = safePath(root, relative, { allowMissing: true });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  // Recheck parent components after directory creation to reject symlink races/parents.
  safePath(root, relative, { allowMissing: true });
  const temporary = path.join(path.dirname(destination), `.cn-update-${crypto.randomBytes(8).toString("hex")}.tmp`);
  try {
    fs.writeFileSync(temporary, bytes, { flag: "wx", mode: 0o600 });
    fs.renameSync(temporary, destination);
  } catch (error) {
    try { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); } catch { /* report the original apply failure */ }
    throw error;
  }
}

export function applyPlan(targetRoot, sourceRoot, plan, upstreamInput) {
  const upstream = validateManifest(upstreamInput);
  if (plan.conflicts.length) fail("CONFLICTS", `Update blocked by ${plan.conflicts.length} conflict(s).`);
  verifyManifestFiles(sourceRoot, upstream);
  const metadataFile = safeMetadataPath(targetRoot);
  const metadataParent = path.dirname(metadataFile);
  const files = manifestMap(upstream);
  const prepared = []; const seen = new Set();
  for (const action of plan.actions) {
    const relative = normalizeManagedPath(action.path);
    if (seen.has(relative)) fail("INVALID_PLAN", `Duplicate managed operation: ${relative}`);
    seen.add(relative);
    if (action.type === "remove") {
      const file = safePath(targetRoot, relative);
      if (!action.baselineHash || hashFile(targetRoot, relative) !== action.baselineHash) fail("CONFLICTS", `Removal target changed after planning: ${relative}`);
      prepared.push({ action, file });
      continue;
    }
    if (action.type !== "add" && action.type !== "update") fail("INVALID_PLAN", "Update plan contains an unsupported operation.");
    if (files.get(relative) !== action.sha256) fail("HASH_MISMATCH", `Planned hash no longer matches manifest: ${relative}`);
    const sourceFile = safePath(sourceRoot, relative);
    const bytes = fs.readFileSync(sourceFile);
    if (hashBytes(bytes, relative) !== action.sha256) fail("HASH_MISMATCH", `Upstream content changed after planning: ${relative}`);
    const destination = safePath(targetRoot, relative, { allowMissing: true });
    if (action.type === "add" && fs.existsSync(destination)) fail("CONFLICTS", `New managed path appeared after planning: ${relative}`);
    if (action.type === "update" && (!action.baselineHash || hashFile(targetRoot, relative) !== action.baselineHash)) fail("CONFLICTS", `Update target changed after planning: ${relative}`);
    prepared.push({ action, destination, bytes });
  }
  // The complete plan and every source/target path have been revalidated before writes.
  fs.mkdirSync(metadataParent, { recursive: true });
  safeMetadataPath(targetRoot);
  const applied = [];
  for (const item of prepared) {
    if (item.action.type === "remove") fs.unlinkSync(item.file);
    else atomicWrite(targetRoot, item.action.path, item.bytes);
    applied.push(item.action);
  }
  // Baseline metadata is committed last, after every file-level operation succeeds.
  const temp = path.join(metadataParent, `.cn-update-${crypto.randomBytes(8).toString("hex")}.tmp`);
  try {
    fs.writeFileSync(temp, `${JSON.stringify(upstream, null, 2)}\n`, { flag: "wx", mode: 0o600 });
    fs.renameSync(temp, metadataFile);
  } catch (error) {
    try { if (fs.existsSync(temp)) fs.unlinkSync(temp); } catch { /* retain original failure */ }
    throw error;
  }
  return { applied, baselineUpdated: true };
}

export async function applyValidateAndCommit(targetRoot, sourceRoot, plan, upstreamInput, { validate, commit }) {
  const upstream = validateManifest(upstreamInput);
  const applied = applyPlan(targetRoot, sourceRoot, plan, upstream);
  let qa;
  try { qa = await validate(targetRoot); }
  catch (error) { fail("POST_APPLY_QA_FAILED", `Update applied but validation failed; changes remain without commit (${error.code ?? error.message}).`); }
  if (!qa || qa.status !== "PASS") fail("POST_APPLY_QA_FAILED", `Update applied but validation status is ${qa?.status ?? "unavailable"}; changes remain without commit.`);
  const commitId = await commit({ applied, plan, manifest: upstream });
  return { applied, qa, commit: commitId };
}

export function commitManagedUpdate(root, actions, version) {
  semverParts(version);
  const paths = [...new Set([...actions.map((action) => normalizeManagedPath(action.path)), MANIFEST_PATH])].sort();
  run("git", ["add", "-A", "--", ...paths], root);
  run("git", ["commit", "-m", `chore: actualizar CN Pilot a ${version}`], root);
  const head = run("git", ["rev-parse", "HEAD"], root).stdout.trim();
  const status = run("git", ["status", "--porcelain=v1", "--untracked-files=all"], root).stdout.split(/\r?\n/).filter(Boolean);
  if (status.some((line) => !line.startsWith("??"))) fail("POST_COMMIT_DIRTY", "Commit created but tracked working tree is not clean; inspect Git status.");
  return head;
}

export function cleanupBootstrapSource(targetRoot, sourceRoot) {
  const root = path.resolve(targetRoot);
  const runtime = path.join(root, ".cn-pilot", "runtime");
  const expected = path.join(runtime, "cn-pilot-update-source");
  if (path.resolve(sourceRoot) !== expected) fail("UNSAFE_CLEANUP_PATH", "Bootstrap cleanup is limited to .cn-pilot/runtime/cn-pilot-update-source.");
  if (!fs.existsSync(expected)) return false;
  for (const directory of [path.join(root, ".cn-pilot"), runtime, expected]) {
    const stat = fs.lstatSync(directory);
    if (stat.isSymbolicLink() || !stat.isDirectory()) fail("UNSAFE_CLEANUP_PATH", "Bootstrap cleanup target contains a symlink or non-directory.");
  }
  const runtimeReal = fs.realpathSync(runtime);
  const sourceReal = fs.realpathSync(expected);
  if (path.dirname(sourceReal) !== runtimeReal) fail("UNSAFE_CLEANUP_PATH", "Bootstrap source is not contained in the project's runtime directory.");
  fs.rmSync(expected, { recursive: true, force: false });
  return true;
}

export function checkActiveTask(root) {
  const runtime = path.join(root, ".cn-pilot/runtime");
  const file = path.join(runtime, "active-task.json");
  const invalid = (reason) => ({ exists: true, blocked: true, status: "INVALID", reason });
  try { if (fs.lstatSync(runtime).isSymbolicLink()) return invalid("unsafe runtime: path is a symlink"); }
  catch (error) { if (error.code === "ENOENT") return { exists: false, blocked: false, status: "none" }; return invalid(`cannot inspect runtime (${error.code ?? error.message})`); }
  let stat;
  try { stat = fs.lstatSync(file); } catch (error) { if (error.code === "ENOENT") return { exists: false, blocked: false, status: "none" }; return invalid(`cannot inspect task file (${error.code ?? error.message})`); }
  if (stat.isSymbolicLink() || !stat.isFile()) return invalid("unsafe task file: not a regular non-symlink file");
  let state;
  let contents;
  try { contents = fs.readFileSync(file, "utf8"); }
  catch (error) { return invalid(`unreadable task file (${error.code ?? error.message})`); }
  try { state = JSON.parse(contents); }
  catch (error) { return invalid(`corrupt JSON (${error.message})`); }
  if (!state || typeof state !== "object" || Array.isArray(state)) return invalid('invalid root: expected a JSON object');
  if (!Object.hasOwn(state, "status")) return invalid('missing required field "status"');
  if (typeof state.status !== "string") return invalid('invalid field "status": expected a string');
  const status = state.status.toUpperCase();
  const allowedStatuses = new Set(["ACTIVE", "INTERRUPTED", "BLOCKED", "BLOCKED_HUMAN", "BLOCKED_EXTERNAL", "FAILED", "COMPLETED"]);
  if (!allowedStatuses.has(status)) return invalid(`unsupported status "${state.status}"`);
  if (status === "COMPLETED") {
    if (Object.hasOwn(state, "schemaVersion") && state.schemaVersion !== 1) return invalid(`unsupported schemaVersion ${JSON.stringify(state.schemaVersion)} (expected 1)`);
    return { exists: true, blocked: false, status };
  }
  if (!Object.hasOwn(state, "schemaVersion")) return invalid('missing required field "schemaVersion"');
  if (state.schemaVersion !== 1) return invalid(`unsupported schemaVersion ${JSON.stringify(state.schemaVersion)} (expected 1)`);
  if (typeof state.objective !== "string" || !state.objective.trim()) return invalid('missing or empty required field "objective"');
  if (typeof state.nextAction !== "string" || !state.nextAction.trim()) return invalid('missing or empty required field "nextAction"');
  const pending = new Set(["ACTIVE", "INTERRUPTED", "BLOCKED", "BLOCKED_HUMAN", "BLOCKED_EXTERNAL", "FAILED"]);
  return { exists: true, blocked: pending.has(status), status };
}

export function inspectGit(root) {
  const top = run("git", ["rev-parse", "--show-toplevel"], root).stdout.trim();
  if (path.resolve(top) !== path.resolve(root)) fail("NOT_REPOSITORY_ROOT", "Run CN Pilot updates from the project Git root.");
  const branch = run("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], root, { allowFailure: true });
  const head = run("git", ["rev-parse", "HEAD"], root).stdout.trim();
  if (!/^[a-f0-9]{40,64}$/i.test(head)) fail("INVALID_HEAD", "Git HEAD is unavailable.");
  const status = run("git", ["status", "--porcelain=v1", "--untracked-files=all"], root).stdout.split(/\r?\n/).filter(Boolean);
  const trackedChanges = status.filter((line) => !line.startsWith("??"));
  return { branch: branch.ok ? branch.stdout.trim() : null, head, trackedChanges, untracked: status.filter((line) => line.startsWith("??")) };
}

function projectGitRoot(cwd) {
  const result = run("git", ["rev-parse", "--show-toplevel"], cwd, { allowFailure: true });
  if (!result.ok || !result.stdout.trim()) fail("GIT_ROOT_NOT_FOUND", "Cannot determine the project Git root from the current directory.");
  const root = path.resolve(result.stdout.trim());
  inspectGit(root);
  return root;
}

export function inspectInstallation(cwd) {
  const root = projectGitRoot(cwd);
  const updaterPath = path.join(root, ".cn-pilot/update/updater.mjs");
  const manifestPath = path.join(root, ...MANIFEST_PATH.split("/"));
  const inspectFile = (file, label) => {
    try {
      const stat = fs.lstatSync(file);
      if (stat.isSymbolicLink() || !stat.isFile()) fail("UNSAFE_INSTALLATION_PATH", `${label} is not a regular non-symlink file.`);
      return true;
    } catch (error) {
      if (error.code === "ENOENT") return false;
      throw error;
    }
  };
  if (!inspectFile(updaterPath, "Updater")) return { root, status: "LEGACY" };
  let manifestExists;
  try { manifestExists = inspectFile(manifestPath, "Distribution manifest"); }
  catch (error) {
    if (error.code === "UNSAFE_INSTALLATION_PATH") return { root, status: "UNSAFE_MANIFEST", reason: `${error.code}: ${error.message}` };
    throw error;
  }
  if (!manifestExists) return { root, status: "MANIFEST_MISSING" };
  try { readManifest(root); }
  catch (error) {
    const unsafe = String(error.code ?? "").startsWith("UNSAFE_");
    return { root, status: unsafe ? "UNSAFE_MANIFEST" : "MANIFEST_INVALID", reason: `${error.code ?? "INVALID_MANIFEST"}: ${error.message}` };
  }
  return { root, status: "MANAGED" };
}

function checkCompatibility(manifest) {
  const nodeOk = compareVersions(process.versions.node.split("-")[0].split(".").slice(0, 3).join("."), manifest.compatibility.nodeMin) >= 0;
  let kilo = run("kilo", ["--version"], process.cwd(), { allowFailure: true });
  if (!kilo.ok && process.platform === "win32") {
    // Kilo's Windows launcher may be a .ps1/.cmd shim, which spawnSync cannot execute directly.
    const powershell = spawnSync("powershell.exe", ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", "$c=Get-Command kilo -ErrorAction Stop; & $c.Source --version"], { cwd: os.homedir(), encoding: "utf8", windowsHide: true, maxBuffer: 1024 * 1024 });
    kilo = { ok: !powershell.error && powershell.status === 0, stdout: powershell.stdout ?? "" };
  }
  const kiloVersion = kilo.ok ? kilo.stdout.trim().match(/\d+\.\d+\.\d+/)?.[0] : null;
  const kiloOk = kiloVersion ? compareVersions(kiloVersion, manifest.compatibility.kiloMin) >= 0 : false;
  return { nodeVersion: process.versions.node, nodeOk, kiloVersion, kiloOk, ok: nodeOk && kiloOk };
}

function sourceRootFor(scriptPath) { return path.resolve(path.dirname(scriptPath), "../.."); }

function verifySource(root) {
  const manifest = readManifest(root);
  verifyManifestFiles(root, manifest);
  verifyTrackedManifest(root, manifest);
  const gitRoot = run("git", ["rev-parse", "--show-toplevel"], root).stdout.trim();
  if (path.resolve(gitRoot) !== path.resolve(root)) fail("INVALID_SOURCE", "Upstream source is not a Git repository root.");
  const branch = run("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], root, { allowFailure: true });
  if (!branch.ok || branch.stdout.trim() !== STABLE_BRANCH) fail("INVALID_SOURCE", "Upstream checkout is not the stable main branch.");
  const remote = run("git", ["remote", "get-url", "origin"], root).stdout.trim().replace(/\.git$/i, "").toLowerCase();
  if (remote !== SOURCE_REPOSITORY.replace(/\.git$/i, "").toLowerCase()) fail("INVALID_SOURCE", "Upstream origin is not the canonical CN Pilot repository.");
  const commit = run("git", ["rev-parse", "HEAD"], root).stdout.trim();
  return { manifest, commit };
}

async function withSource(targetRoot, suppliedSource, operation) {
  if (suppliedSource) return await operation(path.resolve(suppliedSource));
  const coreDirectory = path.join(targetRoot, ".cn-pilot");
  let coreStat;
  try { coreStat = fs.lstatSync(coreDirectory); } catch { fail("CORE_DIRECTORY_MISSING", "Cannot create update temporary source without a local .cn-pilot directory."); }
  if (coreStat.isSymbolicLink() || !coreStat.isDirectory()) fail("UNSAFE_CORE_DIRECTORY", "The local .cn-pilot path must be a real directory.");
  const runtime = path.join(targetRoot, ".cn-pilot", "runtime");
  const runtimeExisted = fs.existsSync(runtime);
  if (runtimeExisted) {
    const runtimeStat = fs.lstatSync(runtime);
    if (runtimeStat.isSymbolicLink() || !runtimeStat.isDirectory()) fail("UNSAFE_RUNTIME", "CN Pilot runtime path must be a real directory.");
  }
  fs.mkdirSync(runtime, { recursive: true });
  const temporary = fs.mkdtempSync(path.join(runtime, "update-source-"));
  const clonePath = path.join(temporary, "source");
  try {
    run("git", ["clone", "--depth=1", "--branch", STABLE_BRANCH, "--single-branch", "--no-tags", SOURCE_REPOSITORY, clonePath], targetRoot);
    return await operation(clonePath);
  } finally {
    try {
      if (path.dirname(path.resolve(temporary)) === path.resolve(runtime)) fs.rmSync(temporary, { recursive: true, force: true });
      if (!runtimeExisted && fs.existsSync(runtime) && fs.readdirSync(runtime).length === 0) fs.rmdirSync(runtime);
    } catch (error) { process.stderr.write(`Cleanup warning: temporary upstream source remains under .cn-pilot/runtime (${error.code ?? "error"}).\n`); }
  }
}

function versionFromFile(root) {
  try { return fs.readFileSync(safePath(root, ".cn-pilot-version"), "utf8").trim(); }
  catch { return "unknown"; }
}

function checkUntrackedCollision(root, git, actions) {
  const untrackedPaths = new Set(git.untracked.map((line) => line.slice(3).replace(/\\/g, "/")));
  for (const action of actions) {
    if (untrackedPaths.has(action.path)) fail("UNTRACKED_COLLISION", `Untracked project file collides with managed update path: ${action.path}`);
  }
}

function writeStatus(root, upstream, commit, writer = process.stdout) {
  const git = inspectGit(root);
  const installedVersion = versionFromFile(root);
  const active = checkActiveTask(root);
  let plan = null; let localError = null;
  try {
    const baseline = readManifest(root);
    plan = planUpdate(root, baseline, upstream);
  } catch (error) { localError = `${error.code ?? "BASELINE_ERROR"}: ${error.message}`; }
  const compatibility = checkCompatibility(upstream);
  const conflicts = plan?.conflicts.length ?? 0;
  const available = installedVersion !== "unknown" && (installedVersion !== upstream.cnPilotVersion || Boolean(plan?.actions.length));
  const localMods = plan ? new Set([
    ...plan.preserved.filter((item) => item.reason.includes("local modification")).map((item) => item.path),
    ...plan.conflicts.filter((item) => !item.path.startsWith("<")).map((item) => item.path),
  ]).size : "?";
  const lines = [
    "CN Pilot status",
    `Installed: ${installedVersion}`,
    `Latest stable: ${upstream.cnPilotVersion}`,
    `Update available: ${available ? "YES" : "NO"}`,
    `Source: LuisYGM/CN-Pilot ${STABLE_BRANCH} (${commit.slice(0, 12)})`,
    `Project Git: ${git.branch ?? "detached"} @ ${git.head.slice(0, 12)}; tracked changes ${git.trackedChanges.length ? "YES" : "no"}`,
    `Compatibility: ${compatibility.nodeOk ? "Node PASS" : "Node BLOCK"}; ${compatibility.kiloOk ? "Kilo PASS" : "Kilo BLOCK/UNKNOWN"}`,
    `Managed files: unchanged ${plan?.unchanged ?? "?"}; planned ${plan?.actions.length ?? "?"}; local modifications ${localMods}; conflicts ${conflicts}`,
    `Migration: ${upstream.migrations.length ? "required" : "none"}`,
    `Active task: ${active.exists ? active.status : "none"}`,
  ];
  if (active.reason) lines.push(`Active task reason: ${active.reason}`);
  if (localError) lines.push(`Baseline: ${localError.startsWith("MANIFEST_MISSING:") ? "BASELINE MANIFEST MISSING (bootstrap required)" : `BLOCKED (${localError})`}`);
  if (conflicts) lines.push(`Conflicts: ${plan.conflicts.map((item) => item.path).join(", ")}`);
  if (git.trackedChanges.length) lines.push("Update readiness: BLOCKED", "Reason: tracked working tree changes present.");
  if (plan && !conflicts && available && compatibility.ok && !active.blocked && !git.trackedChanges.length) lines.push("Ready to update.");
  writer.write(`${lines.join("\n")}\n`);
  return { installedVersion, upstreamVersion: upstream.cnPilotVersion, available, plan, compatibility, active, localError, commit };
}

async function updateExisting(root, sourceRoot, { autoCommit = true } = {}) {
  const git = inspectGit(root);
  if (!git.branch) fail("DETACHED_HEAD", "Update blocked: project is not on a named Git branch.");
  if (git.trackedChanges.length) fail("DIRTY_TRACKED_TREE", "Update blocked: tracked working tree changes present.");
  const active = checkActiveTask(root);
  if (active.blocked) fail("ACTIVE_TASK", `Update blocked: active CN Pilot task (${active.status}).`);
  const source = verifySource(sourceRoot);
  const compatibility = checkCompatibility(source.manifest);
  if (!compatibility.ok) fail("INCOMPATIBLE_RUNTIME", `Update blocked: Node ${compatibility.nodeVersion} and Kilo ${compatibility.kiloVersion ?? "unknown"}; requires Node >=${source.manifest.compatibility.nodeMin}, Kilo >=${source.manifest.compatibility.kiloMin}.`);
  const baseline = readManifest(root);
  const plan = planUpdate(root, baseline, source.manifest);
  checkUntrackedCollision(root, git, plan.actions);
  if (plan.conflicts.length) fail("CONFLICTS", `Update blocked: ${plan.conflicts.map((item) => `${item.path} (${item.reason})`).join("; ")}`);
  if (compareVersions(plan.installedVersion, plan.latestVersion) === 0 && !plan.actions.length) {
    process.stdout.write(`CN Pilot is up to date (${plan.latestVersion}).\n`);
    return { updated: false, plan, commit: null };
  }
  const finalized = await applyValidateAndCommit(root, sourceRoot, plan, source.manifest, {
    validate: (workspace) => JSON.parse(run("node", [".cn-pilot/qa/core-check.mjs", "--json"], workspace).stdout),
    commit: ({ applied: result }) => {
      if (!autoCommit) return null;
      return commitManagedUpdate(root, result.applied, source.manifest.cnPilotVersion);
    },
  });
  if (!autoCommit) return { updated: true, plan, result: finalized.applied, qa: finalized.qa, commit: null };
  const head = finalized.commit;
  const status = run("git", ["status", "--porcelain=v1", "--untracked-files=all"], root).stdout.split(/\r?\n/).filter(Boolean);
  if (status.some((line) => !line.startsWith("??"))) fail("POST_COMMIT_DIRTY", "Commit created but tracked working tree is not clean; inspect Git status.");
  process.stdout.write([
    "CN Pilot updated",
    `${plan.installedVersion} → ${plan.latestVersion}`,
    `Managed: + ${plan.actions.filter((item) => item.type === "add").length}; ~ ${plan.actions.filter((item) => item.type === "update").length}; - ${plan.actions.filter((item) => item.type === "remove").length}`,
    "Project-owned files changed: 0",
    "Core QA: PASS",
    `Commit: ${head}`,
    "Push: not performed",
  ].join("\n") + "\n");
  return { updated: true, plan, result: finalized.applied, qa: finalized.qa, commit: head };
}

export function planLegacyBootstrap(root, upstreamInput, preservePaths = []) {
  const upstream = validateManifest(upstreamInput);
  const preserve = new Set(preservePaths.map(normalizeManagedPath));
  if (preserve.has(".cn-pilot-version") || preserve.has(MANIFEST_PATH)) fail("INVALID_PRESERVE", "Version and baseline manifest cannot be preserved during legacy bootstrap.");
  const localVersion = versionFromFile(root);
  semverParts(localVersion);
  const actions = []; const reviewRequired = []; const preserved = [];
  for (const item of upstream.managedFiles) {
    let localHash = null;
    if (preserve.has(item.path)) { preserved.push(item.path); continue; }
    let unsafeLocal = false;
    try { localHash = hashFile(root, item.path); }
    catch (error) {
      if (error?.code !== "ENOENT") {
        reviewRequired.push({ path: item.path, reason: "local file unsafe/unreadable; manual repair required" });
        unsafeLocal = true;
      }
    }
    if (unsafeLocal) continue;
    if (localHash === null) actions.push({ type: "add", path: item.path, sha256: item.sha256 });
    else if (item.path === ".cn-pilot-version" && localHash !== item.sha256) actions.push({ type: "update", path: item.path, baselineHash: localHash, sha256: item.sha256 });
    else if (localHash !== item.sha256) reviewRequired.push({ path: item.path, reason: "legacy baseline unavailable; local content cannot be classified" });
  }
  return { mode: "LEGACY BOOTSTRAP MODE", installedVersion: localVersion, latestVersion: upstream.cnPilotVersion, actions, reviewRequired, preserved, upstreamFiles: new Set(upstream.managedFiles.map((item) => item.path)) };
}

async function runLegacyBootstrap(targetRoot, sourceRoot, { approveLegacy = false, preserve = [], output = process.stdout } = {}) {
  const root = path.resolve(targetRoot);
  const git = inspectGit(root);
  if (!git.branch) fail("DETACHED_HEAD", "Legacy bootstrap blocked: project is not on a named Git branch.");
  if (git.trackedChanges.length) fail("DIRTY_TRACKED_TREE", "Legacy bootstrap blocked: tracked working tree changes present.");
  const active = checkActiveTask(root);
  if (active.blocked) fail("ACTIVE_TASK", `Legacy bootstrap blocked: active CN Pilot task (${active.status}).`);
  const source = verifySource(sourceRoot);
  const compatibility = checkCompatibility(source.manifest);
  if (!compatibility.ok) fail("INCOMPATIBLE_RUNTIME", "Legacy bootstrap blocked: runtime does not meet manifest requirements.");
  if (fs.existsSync(path.join(root, ...MANIFEST_PATH.split("/")))) fail("ALREADY_MANAGED", "Baseline manifest already exists; use normal update mode.");
  const plan = planLegacyBootstrap(root, source.manifest, preserve);
  const trackedLocal = listTrackedManagedFiles(root).filter((item) => item !== MANIFEST_PATH);
  const upstreamPaths = new Set(source.manifest.managedFiles.map((item) => item.path));
  plan.legacyPathsNotInLatest = trackedLocal.filter((item) => !upstreamPaths.has(item));
  const collisions = new Set(git.untracked.map((line) => line.slice(3).replace(/\\/g, "/")));
  const collision = source.manifest.managedFiles.find((item) => collisions.has(item.path));
  if (collision) fail("UNTRACKED_COLLISION", `Legacy bootstrap collides with untracked file: ${collision.path}`);
  if (!approveLegacy) {
    output.write(`${plan.mode}\n${plan.installedVersion} → ${plan.latestVersion}\nReview required before apply:\n${plan.reviewRequired.map((item) => `- ${item.path}: ${item.reason}`).join("\n") || "- No content mismatches detected"}\nPlanned safe adds: ${plan.actions.filter((item) => item.type === "add").map((item) => item.path).join(", ") || "none"}\nLegacy managed paths absent upstream (preserved, not deleted): ${plan.legacyPathsNotInLatest.join(", ") || "none"}\nNo files changed. Review this plan; rerun with --approve-legacy and optional --preserve <managed-path> for each customization to keep.\n`);
    return { applied: false, plan };
  }
  if (plan.reviewRequired.length && approveLegacy) {
    const unsafe = plan.reviewRequired.find((item) => item.reason.includes("manual repair required"));
    if (unsafe) fail("LEGACY_PATH_UNSAFE", `Legacy path cannot be overwritten safely: ${unsafe.path}`);
    output.write(`LEGACY REVIEW APPROVED for ${plan.reviewRequired.length} listed managed path(s).\n`);
    for (const item of plan.reviewRequired) plan.actions.push({ type: "update", path: item.path, baselineHash: hashFile(root, item.path), sha256: manifestMap(source.manifest).get(item.path) });
  }
  const bootstrapPlan = { actions: plan.actions, conflicts: [] };
  // Exact local/upstream equivalence is already safe; the manifest captures the upstream baseline.
  const finalized = await applyValidateAndCommit(root, sourceRoot, bootstrapPlan, source.manifest, {
    validate: (workspace) => JSON.parse(run("node", [".cn-pilot/qa/core-check.mjs", "--json"], workspace).stdout),
    commit: ({ applied }) => {
      return commitManagedUpdate(root, applied.applied, source.manifest.cnPilotVersion);
    },
  });
  const commit = finalized.commit;
  const status = run("git", ["status", "--porcelain=v1", "--untracked-files=all"], root).stdout.split(/\r?\n/).filter(Boolean);
  if (status.some((line) => !line.startsWith("??"))) fail("POST_COMMIT_DIRTY", "Legacy bootstrap commit created but tracked working tree is not clean; inspect Git status.");
  output.write(`CN Pilot legacy bootstrap complete\n${plan.installedVersion} → ${plan.latestVersion}\nManaged paths changed: ${plan.actions.length}\nCore QA: PASS\nCommit: ${commit}\nPush: not performed\n`);
  return { applied: true, plan, result: finalized.applied, qa: finalized.qa, commit };
}

function parseArgs(argv) {
  const [command, ...args] = argv;
  const options = { command, preserve: [] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (["--target", "--source-dir", "--preserve"].includes(arg)) {
      const value = args[++index];
      if (!value) fail("USAGE", `Missing value for ${arg}.`);
      if (arg === "--preserve") options.preserve.push(value); else options[arg === "--target" ? "target" : "sourceDir"] = value;
    } else if (arg === "--approve-legacy") options.approveLegacy = true;
    else if (arg === "--cleanup-source") options.cleanupSource = true;
    else fail("USAGE", `Unknown argument: ${arg}`);
  }
  return options;
}

export async function runCli(argv = process.argv.slice(2), { stdout = process.stdout, stderr = process.stderr } = {}) {
  try {
    const options = parseArgs(argv);
    if (!options.command || !["manifest", "verify-manifest", "status", "update", "bootstrap"].includes(options.command)) fail("USAGE", "Usage: updater.mjs manifest|verify-manifest|status|update|bootstrap [--target PATH] [--source-dir PATH] [--approve-legacy] [--preserve MANAGED_PATH] [--cleanup-source].");
    if (options.command === "manifest" || options.command === "verify-manifest") {
      const root = path.resolve(options.target ?? ROOT);
      if (options.command === "manifest") {
        const branch = run("git", ["symbolic-ref", "--quiet", "--short", "HEAD"], root, { allowFailure: true });
        if (!branch.ok || branch.stdout.trim() !== STABLE_BRANCH) fail("WRONG_RELEASE_BRANCH", "Only generate stable distribution manifests from main.");
        let previous = null;
        try { previous = JSON.parse(fs.readFileSync(safeMetadataPath(root), "utf8")); }
        catch (error) { if (error?.code !== "ENOENT") throw error; }
        const manifest = writeManifest(root, buildManifest(root, { previousManifest: previous }));
        stdout.write(`Distribution manifest generated: ${manifest.cnPilotVersion} (${manifest.managedFiles.length} managed files).\n`);
      } else {
        const result = verifyManifestFiles(root);
        const inventory = verifyTrackedManifest(root, result.manifest);
        stdout.write(`Distribution manifest PASS: ${result.manifest.cnPilotVersion} (${result.verified} files; inventory ${inventory.trackedFiles}).\n`);
      }
      return 0;
    }
    const target = options.target ? path.resolve(options.target) : projectGitRoot(process.cwd());
    inspectGit(target);
    if (options.command === "status") {
      const installation = inspectInstallation(target);
      if (installation.status !== "MANAGED") {
        const active = checkActiveTask(target);
        const baseline = installation.status === "LEGACY" ? "LEGACY BOOTSTRAP REQUIRED" : installation.status;
        stdout.write([
          "CN Pilot status",
          `Installed: ${versionFromFile(target)}`,
          "Latest stable: not checked",
          `Baseline: ${baseline}${installation.reason ? ` (${installation.reason})` : ""}`,
          `Active task: ${active.exists ? active.status : "none"}`,
          ...(active.reason ? [`Active task reason: ${active.reason}`] : []),
        ].join("\n") + "\n");
        return 0;
      }
    }
    if (options.command === "bootstrap") {
      const sourceRoot = options.sourceDir ? path.resolve(options.sourceDir) : sourceRootFor(fileURLToPath(import.meta.url));
      if (options.cleanupSource && sourceRoot !== path.join(target, ".cn-pilot", "runtime", "cn-pilot-update-source")) fail("UNSAFE_CLEANUP_PATH", "--cleanup-source only accepts the documented runtime bootstrap clone.");
      const result = await runLegacyBootstrap(target, sourceRoot, { approveLegacy: options.approveLegacy, preserve: options.preserve, output: stdout });
      if (result.applied && options.cleanupSource) {
        try { cleanupBootstrapSource(target, sourceRoot); }
        catch (error) { stderr.write(`Cleanup warning: update succeeded; temporary source remains (${error.code ?? "error"}).\n`); }
      }
      return result.applied ? 0 : 3;
    }
    if (options.command === "update") {
      const initialGit = inspectGit(target);
      if (!initialGit.branch) fail("DETACHED_HEAD", "Update blocked: project is not on a named Git branch.");
      if (initialGit.trackedChanges.length) fail("DIRTY_TRACKED_TREE", "Update blocked: tracked working tree changes present.");
      const active = checkActiveTask(target);
      if (active.blocked) fail("ACTIVE_TASK", `Update blocked: active CN Pilot task (${active.status})${active.reason ? ` — ${active.reason}` : ""}.`);
    }
    let result;
    await withSource(target, options.sourceDir, (sourceRoot) => {
      const source = verifySource(sourceRoot);
      if (options.command === "status") result = writeStatus(target, source.manifest, source.commit, stdout);
      else return updateExisting(target, sourceRoot).then((value) => { result = value; });
    });
    return 0;
  } catch (error) {
    stderr.write(`${error.code ?? "UPDATE_ERROR"}: ${error.message}\n`);
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await runCli();
