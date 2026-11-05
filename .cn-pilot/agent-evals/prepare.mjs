import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const CORE_FILES = ["AGENTS.md", ".gitignore", "kilo.jsonc", ".cn-pilot-version", ".cn-pilot/NUCLEO.md"];
const CORE_CONFIG_PATHS = [...CORE_FILES, ".kilo/agents", ".kilo/commands", ".kilo/skills"];

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

export function validateWorkspaceTarget(targetPath, { repoRoot = REPO_ROOT, tempRoot = os.tmpdir() } = {}) {
  if (typeof targetPath !== "string" || !targetPath.trim()) throw new Error("Provide a new absolute workspace path.");
  if (!path.isAbsolute(targetPath)) throw new Error("Workspace path must be absolute.");

  const target = path.resolve(targetPath);
  const project = fs.realpathSync(repoRoot);
  const temp = fs.realpathSync(tempRoot);
  if (isInside(project, target)) throw new Error("Refusing to create an eval workspace inside the CN Pilot checkout.");
  if (!isInside(temp, target) || target === temp) throw new Error("Eval workspaces must be new children of the OS temp directory.");
  if (fs.existsSync(target)) throw new Error("Workspace already exists; it will not be overwritten or cleaned automatically.");

  const parent = path.dirname(target);
  if (!fs.existsSync(parent)) throw new Error("Workspace parent must already exist.");
  if (!isInside(temp, fs.realpathSync(parent))) throw new Error("Workspace parent resolves outside the OS temp directory.");
  return target;
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", windowsHide: true });
  if (result.error) throw result.error;
  return { status: result.status ?? 1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function copyTree(source, destination, { exclude = new Set() } = {}) {
  if (!fs.existsSync(source)) throw new Error(`Fixture path is missing: ${path.relative(REPO_ROOT, source)}`);
  fs.cpSync(source, destination, {
    recursive: true,
    force: true,
    filter: (entry) => {
      const relative = path.relative(source, entry).split(path.sep).join("/");
      if ([...exclude].some((item) => relative === item || relative.startsWith(`${item}/`))) return false;
      if (path.basename(entry).toLowerCase().match(/^(\.env($|\.)|\.npmrc$|\.pypirc$|credentials(\.json)?$|id_(rsa|ed25519|ecdsa|dsa)$)/))
        throw new Error(`Sensitive filename is not allowed in an eval fixture: ${relative}`);
      if (fs.lstatSync(entry).isSymbolicLink()) throw new Error(`Symlinks are not allowed in eval fixtures: ${relative}`);
      return true;
    }
  });
}

function hashTree(root) {
  const entries = [];
  const walk = (directory) => {
    for (const item of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (item.name === ".git") continue;
      const absolute = path.join(directory, item.name);
      if (item.isSymbolicLink()) throw new Error(`Refusing symlink in workspace fingerprint: ${absolute}`);
      if (item.isDirectory()) walk(absolute);
      else entries.push([path.relative(root, absolute).split(path.sep).join("/"), crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex")]);
    }
  };
  walk(root);
  return crypto.createHash("sha256").update(JSON.stringify(entries)).digest("hex");
}

function hashConfiguration(workspace) {
  const relativeFiles = [...CORE_FILES];
  for (const directory of [".kilo/agents", ".kilo/commands", ".kilo/skills"]) {
    const walk = (folder) => {
      for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
        const absolute = path.join(folder, item.name);
        if (item.isSymbolicLink()) throw new Error(`Refusing symlink in Kilo config: ${absolute}`);
        if (item.isDirectory()) walk(absolute);
        else relativeFiles.push(path.relative(workspace, absolute).split(path.sep).join("/"));
      }
    };
    walk(path.join(workspace, directory));
  }
  const entries = relativeFiles.sort().map((relative) => [relative, crypto.createHash("sha256").update(fs.readFileSync(path.join(workspace, relative))).digest("hex")]);
  return crypto.createHash("sha256").update(JSON.stringify(entries)).digest("hex");
}

function fingerprintScenario(scenario) {
  const contract = {
    id: scenario.id,
    mode: scenario.mode,
    agent: scenario.agent,
    expectedOwner: scenario.expectedOwner ?? null,
    fixture: scenario.fixture,
    request: scenario.request,
    acceptance: scenario.acceptance
  };
  return crypto.createHash("sha256").update(JSON.stringify(contract)).digest("hex");
}

function scaffoldWorkspace(workspace) {
  for (const relative of CORE_FILES) {
    const from = path.join(REPO_ROOT, relative);
    if (!fs.existsSync(from)) throw new Error(`Missing Core scaffold file: ${relative}`);
    const to = path.join(workspace, relative);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
  for (const directory of [".kilo/agents", ".kilo/commands", ".kilo/skills"]) {
    copyTree(path.join(REPO_ROOT, directory), path.join(workspace, directory), { exclude: new Set([".gitignore", "agent-manager.json"]) });
  }
}

function assertCoreSourceStable() {
  const branch = run("git", ["-C", REPO_ROOT, "branch", "--show-current"], REPO_ROOT);
  if (branch.status !== 0 || branch.stdout.trim() !== "main") throw new Error("Prepare Agent Evals only from the real main checkout.");
  const diff = run("git", ["-C", REPO_ROOT, "diff", "--quiet", "HEAD", "--", ...CORE_CONFIG_PATHS], REPO_ROOT);
  if (diff.status !== 0) throw new Error("Core prompts/config are dirty; do not evaluate an unrecorded configuration snapshot.");
  const staged = run("git", ["-C", REPO_ROOT, "diff", "--cached", "--quiet", "HEAD", "--", ...CORE_CONFIG_PATHS], REPO_ROOT);
  if (staged.status !== 0) throw new Error("Core prompts/config have staged changes; prepare from a known snapshot first.");
  const status = run("git", ["-C", REPO_ROOT, "status", "--porcelain", "--", ...CORE_CONFIG_PATHS], REPO_ROOT);
  if (status.status !== 0 || status.stdout.trim()) throw new Error("Core prompt/config has untracked or staged state; refuse ambiguous evaluation provenance.");
}

function setupFixture(scenario, workspace) {
  const fixtureRoot = path.resolve(REPO_ROOT, ".cn-pilot/agent-evals", scenario.fixture);
  if (!isInside(path.resolve(REPO_ROOT, ".cn-pilot/agent-evals/fixtures"), fixtureRoot)) throw new Error("Scenario fixture escapes the eval fixture root.");

  let baselineCommit = null;
  if (scenario.workspaceMode === "git-baseline" || scenario.workspaceMode === "git-baseline-plus-working") {
    const baseline = path.resolve(REPO_ROOT, ".cn-pilot/agent-evals", scenario.baseline ?? scenario.fixture);
    copyTree(baseline, workspace);
    const init = run("git", ["init", "--initial-branch=main"], workspace);
    if (init.status !== 0) throw new Error(`Scratch repo init failed: ${init.stderr}`);
    const add = run("git", ["add", "-A"], workspace);
    if (add.status !== 0) throw new Error(`Scratch repo baseline add failed: ${add.stderr}`);
    const emptyHooks = path.join(workspace, ".eval-hooks-disabled");
    fs.mkdirSync(emptyHooks);
    const commit = run("git", ["-c", `core.hooksPath=${emptyHooks}`, "-c", "user.name=Agent Evals", "-c", "user.email=agent-evals@localhost", "commit", "-m", `baseline fixture ${scenario.id}`], workspace);
    if (commit.status !== 0) throw new Error(`Scratch repo baseline commit failed: ${commit.stderr}`);
    baselineCommit = run("git", ["rev-parse", "HEAD"], workspace).stdout.trim();
    if (run("git", ["remote"], workspace).stdout.trim()) throw new Error("Fixture repository unexpectedly has a remote.");
    if (scenario.workspaceMode === "git-baseline-plus-working") {
      const working = path.resolve(REPO_ROOT, ".cn-pilot/agent-evals", scenario.working);
      copyTree(working, workspace, { exclude: new Set(["active-task.json.fixture"]) });
      if (scenario.checkpointFixture) {
        const checkpoint = path.resolve(REPO_ROOT, ".cn-pilot/agent-evals", scenario.checkpointFixture);
        const checkpointPath = path.join(workspace, ".cn-pilot/runtime/active-task.json");
        fs.mkdirSync(path.dirname(checkpointPath), { recursive: true });
        fs.copyFileSync(checkpoint, checkpointPath);
      }
    }
  } else {
    throw new Error(`Unsupported workspaceMode: ${scenario.workspaceMode}`);
  }

  let setupTest = null;
  if (scenario.setupTest) {
    const result = run(process.execPath, scenario.setupTest.command, workspace);
    setupTest = { command: ["node", ...scenario.setupTest.command], exitCode: result.status, expectedExit: scenario.setupTest.expectExit, stdout: result.stdout, stderr: result.stderr };
    if (result.status !== scenario.setupTest.expectExit) throw new Error(`Fixture test exit ${result.status}; expected ${scenario.setupTest.expectExit}. Workspace retained at ${workspace}.\n${result.stdout}\n${result.stderr}`);
    const evidencePath = path.join(workspace, scenario.setupTest.recordPath);
    fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
    if (evidencePath.endsWith(".txt")) fs.writeFileSync(evidencePath, `${result.stdout}${result.stderr}`, "utf8");
  }
  return { baselineCommit, setupTest };
}

export function prepareEval(evalId, targetPath) {
  assertCoreSourceStable();
  const target = validateWorkspaceTarget(targetPath);
  const suitePath = path.join(SCRIPT_DIR, "scenarios.json");
  const suite = JSON.parse(fs.readFileSync(suitePath, "utf8"));
  const scenario = suite.scenarios.find(({ id }) => id === evalId);
  if (!scenario) throw new Error(`Unknown eval id: ${evalId}`);

  fs.mkdirSync(target);
  try {
    scaffoldWorkspace(target);
    const setup = setupFixture(scenario, target);
    const kilo = process.platform === "win32"
      ? run("powershell.exe", ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", "kilo --version"], target)
      : run("kilo", ["--version"], target);
    const setupRecord = {
      evalId,
      preparedAt: new Date().toISOString(),
      coreVersion: fs.readFileSync(path.join(target, ".cn-pilot-version"), "utf8").trim(),
      sourceCommit: run("git", ["-C", REPO_ROOT, "rev-parse", "HEAD"], REPO_ROOT).stdout.trim(),
      kiloVersion: kilo.status === 0 ? kilo.stdout.trim() : null,
      model: null,
      scenarioFingerprint: fingerprintScenario(scenario),
      workspaceFingerprint: hashTree(target),
      configurationFingerprint: hashConfiguration(target),
      configurationScope: "Project scaffold only; user-global provider/model configuration is not copied or fingerprinted.",
      baselineCommit: setup.baselineCommit,
      setupTest: setup.setupTest,
      sessionID: null,
      result: "INCONCLUSIVE"
    };
    const setupPath = path.join(target, ".cn-pilot/runtime/eval-setup.json");
    fs.mkdirSync(path.dirname(setupPath), { recursive: true });
    fs.writeFileSync(setupPath, `${JSON.stringify(setupRecord, null, 2)}\n`, "utf8");
    return setupRecord;
  } catch (error) {
    // Keep a failed scratch workspace for diagnosis; never auto-delete it.
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [, , evalId, targetPath] = process.argv;
    const result = prepareEval(evalId, targetPath);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`Agent Evals preparation failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
