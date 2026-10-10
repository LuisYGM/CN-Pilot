import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..", "..");
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
const REQUIRED_PATHS = [
  ["AGENTS.md", "file"], [".cn-pilot/CORE.md", "file"], [".cn-pilot/MANIFEST.md", "file"],
  [".cn-pilot/config/responsive.json", "file"], [".cn-pilot/docs", "directory"],
  [".cn-pilot/profiles", "directory"], [".cn-pilot/templates", "directory"],
  [".cn-pilot/qa/core-check.mjs", "file"], [".cn-pilot/qa/core-check.test.mjs", "file"],
  ["kilo.jsonc", "file"], [".kilo/agents/dev-lead.md", "file"], [".kilo/agents/reviewer.md", "file"],
  [".kilo/commands/new-project.md", "file"], [".kilo/commands/checkpoint.md", "file"],
  [".kilo/commands/review.md", "file"], [".kilo/commands/doctor.md", "file"],
];
const REVIEWER_DENY = ["bash", "websearch", "webfetch", "skill", "task", "agent_manager", "background_process", "write", "edit", "apply_patch"];
const SENSITIVE_PATHS = [".env", ".env.*", "**/.env", "**/.env.*", "secrets/**", ".kilocode/mcp.json", "**/.kilocode/mcp.json"];
const DESTRUCTIVE_GIT = ["git push --force*", "git push -f*", "git reset --hard*", "git clean*"];

function safeText(value) { return String(value).replace(/[\r\n\t]/g, " "); }

function inspectPath(root, relativePath) {
  if (typeof relativePath !== "string" || path.isAbsolute(relativePath)) return { kind: "invalid", code: "INVALID_PATH" };
  const parts = relativePath.replace(/\\/g, "/").split("/").filter(Boolean);
  if (parts.some((part) => part === "." || part === "..")) return { kind: "invalid", code: "INVALID_PATH" };
  let current = root;
  let stats;
  for (let index = 0; index < parts.length; index += 1) {
    current = path.join(current, parts[index]);
    try { stats = fs.lstatSync(current); }
    catch (error) { return { kind: error?.code === "ENOENT" ? "missing" : "unreadable", code: error?.code ?? "IO_ERROR" }; }
    if (stats.isSymbolicLink()) return { kind: "symlink", code: "SYMLINK" };
    if (index < parts.length - 1 && !stats.isDirectory()) return { kind: "not-directory", code: "NOT_DIRECTORY" };
  }
  return { kind: "ok", path: current, stats };
}

function readText(root, relativePath) {
  const item = inspectPath(root, relativePath);
  if (item.kind !== "ok") return { kind: item.kind, code: item.code, text: null };
  if (!item.stats.isFile()) return { kind: "not-file", code: "NOT_FILE", text: null };
  try { return { kind: "ok", text: fs.readFileSync(item.path, "utf8") }; }
  catch (error) { return { kind: "unreadable", code: error?.code ?? "IO_ERROR", text: null }; }
}

function listDirectory(root, relativePath) {
  const item = inspectPath(root, relativePath);
  if (item.kind !== "ok") return { kind: item.kind, code: item.code, entries: [] };
  if (!item.stats.isDirectory()) return { kind: "not-directory", code: "NOT_DIRECTORY", entries: [] };
  try {
    const entries = fs.readdirSync(item.path, { withFileTypes: true });
    entries.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    return { kind: "ok", path: item.path, entries };
  } catch (error) { return { kind: "unreadable", code: error?.code ?? "IO_ERROR", entries: [] }; }
}

function listFiles(root, relativePath, { extension, recursive = false } = {}) {
  const files = [];
  const symlinks = [];
  const problems = [];
  const pending = [relativePath];
  while (pending.length) {
    const current = pending.shift();
    const listing = listDirectory(root, current);
    if (listing.kind !== "ok") { problems.push({ path: current, code: listing.code ?? listing.kind }); continue; }
    for (const entry of listing.entries) {
      const child = `${current.replace(/[\\/]+$/, "")}/${entry.name}`;
      if (entry.isSymbolicLink()) { symlinks.push(safeText(child)); continue; }
      if (entry.isDirectory()) { if (recursive) pending.push(child); continue; }
      if (entry.isFile() && (!extension || path.extname(entry.name).toLowerCase() === extension)) files.push(child);
    }
  }
  return { count: files.length, files, symlinks, problems };
}

function listDirectories(root, relativePath) {
  const listing = listDirectory(root, relativePath);
  if (listing.kind !== "ok") return { directories: [], symlinks: [], error: { path: relativePath, code: listing.code ?? listing.kind } };
  const directories = [];
  const symlinks = [];
  for (const entry of listing.entries) {
    if (entry.isSymbolicLink()) symlinks.push(entry.name);
    else if (entry.isDirectory()) directories.push(entry.name);
  }
  return { directories, symlinks, error: null };
}

function parseScalar(value) {
  const stripped = value.replace(/\s+#.*$/, "").trim();
  if (stripped === "true") return true;
  if (stripped === "false") return false;
  if (stripped === "null" || stripped === "~") return null;
  if (stripped.startsWith('"') && stripped.endsWith('"')) {
    try { return JSON.parse(stripped); } catch { return stripped.slice(1, -1); }
  }
  if (stripped.startsWith("'") && stripped.endsWith("'")) return stripped.slice(1, -1).replace(/''/g, "'");
  return stripped;
}

/** Minimal indentation-aware YAML mapping parser for the frontmatter fields CN Pilot controls. */
export function parseFrontmatter(source) {
  const lines = String(source).replace(/^\uFEFF/, "").split(/\r\n|\n|\r/);
  if (lines[0]?.trim() !== "---") return { ok: false, fields: {}, errors: ["missing opening delimiter"] };
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (end < 0) return { ok: false, fields: {}, errors: ["missing closing delimiter"] };
  const fields = Object.create(null);
  const stack = [{ indent: -1, value: fields, rootKey: null }];
  const errors = [];
  for (let i = 1; i < end; i += 1) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const indent = line.match(/^ */)?.[0].length ?? 0;
    const content = line.slice(indent);
    if (content.startsWith("\t")) { errors.push(`tab indentation at line ${i + 1}`); continue; }
    const colon = content.indexOf(":");
    if (colon < 1) {
      if (stack.some((entry) => entry.rootKey === "permission")) errors.push(`unsupported permission mapping at line ${i + 1}`);
      continue;
    }
    let key = content.slice(0, colon).trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1);
    if (!key) { errors.push(`empty key at line ${i + 1}`); continue; }
    while (stack.length > 1 && stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1);
    const rootKey = indent === 0 ? key : parent.rootKey;
    const rawValue = content.slice(colon + 1).trim();
    if (!rawValue) {
      const nested = Object.create(null);
      parent.value[key] = nested;
      stack.push({ indent, value: nested, rootKey });
    } else parent.value[key] = parseScalar(rawValue);
  }
  return { ok: errors.length === 0, fields, errors };
}

function addCheck(checks, id, status, details = {}) { checks.push({ id, status, details }); }
function nonEmpty(value) { return typeof value === "string" && value.trim().length > 0; }

function readMetadata(root, relativePath) {
  const file = readText(root, relativePath);
  if (file.kind !== "ok") return { ok: false, error: { path: relativePath, code: file.code ?? file.kind } };
  const parsed = parseFrontmatter(file.text);
  return parsed.ok ? { ok: true, fields: parsed.fields } : { ok: false, error: { path: relativePath, code: "INVALID_FRONTMATTER", issues: parsed.errors } };
}

function checkAgents(root) {
  const listing = listFiles(root, ".kilo/agents", { extension: ".md" });
  const names = new Set(listing.files.map((file) => path.posix.basename(file, ".md")));
  const problems = listing.problems.slice();
  const symlinks = listing.symlinks.slice();
  for (const required of ["dev-lead", "reviewer"]) if (!names.has(required)) problems.push({ agent: required, code: "REQUIRED_AGENT_MISSING" });
  for (const file of listing.files) {
    const relative = file;
    const result = readMetadata(root, relative);
    if (!result.ok) { problems.push(result.error); continue; }
    if (!nonEmpty(result.fields.description)) problems.push({ path: relative, field: "description", code: "MISSING_REQUIRED_FIELD" });
    if (!new Set(["primary", "subagent", "all"]).has(result.fields.mode)) problems.push({ path: relative, field: "mode", code: "INVALID_REQUIRED_FIELD" });
  }
  return { count: listing.count + symlinks.length, names, problems, symlinks };
}

function checkSkills(root) {
  const listing = listDirectories(root, ".kilo/skills");
  const problems = listing.error ? [listing.error] : [];
  for (const name of listing.directories) {
    const relative = path.posix.join(".kilo/skills", name, "SKILL.md");
    const result = readMetadata(root, relative);
    if (!result.ok) { problems.push(result.error); continue; }
    if (!nonEmpty(result.fields.name)) problems.push({ path: relative, field: "name", code: "MISSING_REQUIRED_FIELD" });
    if (!nonEmpty(result.fields.description)) problems.push({ path: relative, field: "description", code: "MISSING_REQUIRED_FIELD" });
  }
  return { count: listing.directories.length + listing.symlinks.length, problems, symlinks: listing.symlinks };
}

function checkCommands(root, agentNames) {
  const listing = listFiles(root, ".kilo/commands", { extension: ".md" });
  const problems = listing.problems.slice();
  for (const file of listing.files) {
    const relative = file;
    const result = readMetadata(root, relative);
    if (!result.ok) { problems.push(result.error); continue; }
    const { description, agent } = result.fields;
    if (!nonEmpty(description)) problems.push({ path: relative, field: "description", code: "MISSING_REQUIRED_FIELD" });
    if (!nonEmpty(agent)) problems.push({ path: relative, field: "agent", code: "MISSING_REQUIRED_FIELD" });
    else if (!agentNames.has(agent)) problems.push({ path: relative, field: "agent", target: safeText(agent), code: "AGENT_TARGET_MISSING" });
  }
  return { count: listing.count + listing.symlinks.length, problems, symlinks: listing.symlinks };
}

function checkReviewerPermissions(root) {
  const result = readMetadata(root, ".kilo/agents/reviewer.md");
  if (!result.ok) return [result.error];
  const permission = result.fields.permission;
  if (!permission || typeof permission !== "object") return [{ path: ".kilo/agents/reviewer.md", field: "permission", code: "MISSING_PERMISSION_MAP" }];
  const problems = [];
  const readMap = permission.read;
  if (!(readMap === "allow" || readMap?.["*"] === "allow")) problems.push({ field: "read", code: "CRITICAL_PERMISSION_MISSING" });
  for (const capability of ["glob", "grep"]) if (permission[capability] !== "allow") problems.push({ field: capability, code: "CRITICAL_PERMISSION_MISSING" });
  for (const capability of REVIEWER_DENY) if (permission[capability] !== "deny") problems.push({ field: capability, expected: "deny", code: "PROTECTED_PERMISSION_NOT_DENIED" });
  for (const pattern of SENSITIVE_PATHS) if (readMap?.[pattern] !== "deny") problems.push({ field: `read.${pattern}`, expected: "deny", code: "SENSITIVE_READ_NOT_DENIED" });
  const readKeys = readMap && typeof readMap === "object" ? Object.keys(readMap) : [];
  const fallback = readKeys.indexOf("*");
  for (const pattern of SENSITIVE_PATHS) if (readKeys.indexOf(pattern) < fallback || readKeys.indexOf(pattern) < 0) problems.push({ field: `read.${pattern}`, code: "SECURITY_RULE_ORDER_INVALID" });
  return problems;
}

function checkDevLeadPermissions(root, agentNames) {
  const result = readMetadata(root, ".kilo/agents/dev-lead.md");
  if (!result.ok) return { targets: [], routingProblems: [result.error], securityProblems: [result.error] };
  const permission = result.fields.permission;
  if (!permission || typeof permission !== "object") {
    const problem = { path: ".kilo/agents/dev-lead.md", field: "permission", code: "MISSING_PERMISSION_MAP" };
    return { targets: [], routingProblems: [problem], securityProblems: [problem] };
  }
  const task = permission.task;
  const routingProblems = [];
  const securityProblems = [];
  if (!task || typeof task !== "object") routingProblems.push({ field: "task", code: "MISSING_TASK_PERMISSION_MAP" });
  else {
    if (task["*"] !== "deny") routingProblems.push({ field: "task.*", code: "TASK_FALLBACK_NOT_DENIED" });
    const targets = Object.entries(task).filter(([name, action]) => name !== "*" && action === "allow").map(([name]) => name).sort();
    if (!targets.length) routingProblems.push({ field: "task", code: "NO_ALLOWED_SPECIALIST_TARGETS" });
    for (const target of targets) if (!agentNames.has(target)) routingProblems.push({ field: "task", target, code: "AGENT_TARGET_MISSING" });
  }
  for (const tool of ["read", "edit"]) {
    const rules = permission[tool];
    const keys = rules && typeof rules === "object" ? Object.keys(rules) : [];
    const fallbackIndex = keys.indexOf("*");
    for (const pattern of SENSITIVE_PATHS) {
      const index = keys.indexOf(pattern);
      if (rules?.[pattern] !== "deny") securityProblems.push({ field: `${tool}.${pattern}`, code: "SENSITIVE_PATH_NOT_DENIED" });
      if (index < 0 || index < fallbackIndex) securityProblems.push({ field: `${tool}.${pattern}`, code: "SECURITY_RULE_ORDER_INVALID" });
    }
    const denyEnvIndex = keys.indexOf(".env.*");
    const exampleIndex = keys.indexOf(".env.example");
    if (rules?.[".env.example"] === "allow" && (denyEnvIndex < 0 || exampleIndex < denyEnvIndex)) securityProblems.push({ field: `${tool}.env.example`, code: "SECURITY_RULE_ORDER_INVALID" });
  }
  const bash = permission.bash;
  const bashKeys = bash && typeof bash === "object" ? Object.keys(bash) : [];
  const fallbackIndex = bashKeys.indexOf("*");
  for (const pattern of DESTRUCTIVE_GIT) {
    const index = bashKeys.indexOf(pattern);
    if (bash?.[pattern] !== "deny") securityProblems.push({ field: `bash.${pattern}`, code: "DESTRUCTIVE_COMMAND_NOT_DENIED" });
    if (index < 0 || index < fallbackIndex) securityProblems.push({ field: `bash.${pattern}`, code: "SECURITY_RULE_ORDER_INVALID" });
  }
  return { targets: Object.entries(task ?? {}).filter(([name, action]) => name !== "*" && action === "allow").map(([name]) => name).sort(), routingProblems, securityProblems };
}

function manifestRules(text) {
  const lines = text.split(/\r\n|\n|\r/);
  const declarations = [];
  const recognized = new Set();
  const rules = [
    ["agents", /^\s*-\s*(\d+)\s+agentes?\s+en\s+`([^`]+)`/i, ".kilo/agents", (root) => listFiles(root, ".kilo/agents", { extension: ".md" })],
    ["skills", /^\s*-\s*(\d+)\s+skills\s*\([^)]*\.kilo\/skills\/\*\/SKILL\.md[^)]*\)/i, ".kilo/skills", (root) => ({ count: listDirectories(root, ".kilo/skills").directories.length })],
    ["commands", /^\s*-\s*(\d+)\s+comandos?\s+en\s+`([^`]+)`/i, ".kilo/commands", (root) => listFiles(root, ".kilo/commands", { extension: ".md" })],
    ["profiles", /^\s*-\s*(\d+)\s+perfil(?:es)?\s+en\s+`([^`]+)`/i, ".cn-pilot/profiles", (root) => listFiles(root, ".cn-pilot/profiles", { extension: ".md" })],
    ["technicalSeoReferences", /^\s*-\s*(\d+)\s+documentos? de referencia bajo\s+`([^`]+)`/i, ".kilo/skills/technical-seo/references", (root) => listFiles(root, ".kilo/skills/technical-seo/references", { extension: ".md", recursive: true })],
  ];
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    for (const [id, regex, canonicalPath, actual] of rules) {
      const match = line.match(regex);
      if (!match) continue;
      recognized.add(lineIndex);
      const declaredPath = id === "skills" ? canonicalPath : match[2].replace(/[\\/]+$/, "");
      declarations.push({ id, expected: Number(match[1]), declaredPath, canonicalPath, actual, line: lineIndex + 1 });
    }
    const templateMatch = line.match(/^\s*-\s*(\d+)\s+archivos? de plantilla en la raíz de\s+`([^`]+)`\s+y\s+(\d+)\s+archivos? en total bajo\s+`([^`]+)`/i);
    if (templateMatch) {
      recognized.add(lineIndex);
      declarations.push({ id: "templates.root", expected: Number(templateMatch[1]), declaredPath: templateMatch[2].replace(/[\\/]+$/, ""), canonicalPath: ".cn-pilot/templates", actual: (root) => listFiles(root, ".cn-pilot/templates"), line: lineIndex + 1 });
      declarations.push({ id: "templates.total", expected: Number(templateMatch[3]), declaredPath: templateMatch[4].replace(/[\\/]+$/, ""), canonicalPath: ".cn-pilot/templates", actual: (root) => listFiles(root, ".cn-pilot/templates", { recursive: true }), line: lineIndex + 1 });
    }
  }
  const unknownNumericLines = lines.map((line, index) => ({ line, index })).filter(({ line, index }) => /^\s*-\s*\d+\b/.test(line) && !recognized.has(index)).map(({ index }) => index + 1);
  return { declarations, unknownNumericLines };
}

function checkManifest(root) {
  const file = readText(root, ".cn-pilot/MANIFEST.md");
  if (file.kind !== "ok") return { status: "FAIL", details: { code: file.code ?? file.kind } };
  const parsed = manifestRules(file.text);
  const mismatches = [];
  for (const declaration of parsed.declarations) {
    if (declaration.declaredPath !== declaration.canonicalPath) {
      mismatches.push({ id: declaration.id, line: declaration.line, code: "UNSUPPORTED_DECLARED_PATH" });
      continue;
    }
    const actual = declaration.actual(root);
    if (actual.problems?.length || actual.symlinks?.length) {
      mismatches.push({ id: declaration.id, expected: declaration.expected, observed: actual.count, code: "UNSCANNED_INVENTORY_ENTRIES" });
    } else if (actual.count !== declaration.expected) {
      mismatches.push({ id: declaration.id, expected: declaration.expected, observed: actual.count, code: "COUNT_MISMATCH" });
    }
  }
  const status = mismatches.length || parsed.unknownNumericLines.length ? "WARN" : "PASS";
  return { status, details: { declarationsChecked: parsed.declarations.length, mismatches, unknownNumericLines: parsed.unknownNumericLines } };
}

function readVersion(root) {
  const local = readText(root, ".cn-pilot-version");
  const core = readText(root, ".cn-pilot/CORE.md");
  const version = local.kind === "ok" ? local.text.trim() : null;
  const declared = core.kind === "ok" ? [...core.text.matchAll(/^\s*\*\*Versi[oó]n:\*\*\s*`([^`]+)`\s*$/gim)].map((match) => match[1].trim()) : [];
  const unique = [...new Set(declared)];
  const canonical = unique.length === 1 ? unique[0] : null;
  let status = local.kind !== "ok" || !SEMVER.test(version ?? "") ? "FAIL" : "PASS";
  if (status === "PASS" && unique.length > 1) status = "WARN";
  else if (status === "PASS" && canonical && canonical !== version) status = "FAIL";
  return { status, version, details: { path: ".cn-pilot-version", version, canonical, semver: SEMVER.test(version ?? "") } };
}

export function runCoreChecks({ rootDir = DEFAULT_ROOT } = {}) {
  let root;
  try {
    root = fs.realpathSync(path.resolve(rootDir));
    if (!fs.statSync(root).isDirectory()) throw new Error("root is not a directory");
  } catch (error) {
    const fatal = new Error("Core QA could not access the selected workspace root.");
    fatal.code = error?.code ?? "ROOT_UNAVAILABLE";
    throw fatal;
  }

  const checks = [];
  const add = (id, status, details = {}) => addCheck(checks, id, status, details);
  const version = readVersion(root);
  add("core.version", version.status, version.details);

  const requiredResults = REQUIRED_PATHS.map(([relativePath, kind]) => {
    const item = inspectPath(root, relativePath);
    const match = item.kind === "ok" && (kind === "file" ? item.stats.isFile() : item.stats.isDirectory());
    return { path: relativePath, expected: kind, valid: match, code: match ? undefined : item.code ?? item.kind };
  });
  const invalidPaths = requiredResults.filter((item) => !item.valid).map(({ path: relativePath, expected, code }) => ({ path: relativePath, expected, code }));
  add("core.paths", invalidPaths.length ? "FAIL" : "PASS", { required: requiredResults.length, missingOrInvalid: invalidPaths });

  const scaffold = inspectPath(root, "project-resources/README.md");
  add("core.optionalScaffold", scaffold.kind === "ok" && scaffold.stats.isFile() ? "PASS" : "WARN", {
    path: "project-resources/README.md",
    note: "Expected input scaffold; not required to run Core",
    code: scaffold.kind === "ok" ? undefined : scaffold.code ?? scaffold.kind,
  });

  const agentInventory = checkAgents(root);
  add("agents.frontmatter", agentInventory.problems.length ? "FAIL" : agentInventory.symlinks.length ? "WARN" : "PASS", { count: agentInventory.count, problems: agentInventory.problems, uninspectedSymlinks: agentInventory.symlinks });
  const skills = checkSkills(root);
  add("skills.frontmatter", skills.problems.length ? "FAIL" : skills.symlinks.length ? "WARN" : "PASS", { count: skills.count, problems: skills.problems, uninspectedSymlinks: skills.symlinks });
  const commands = checkCommands(root, agentInventory.names);
  add("commands.frontmatter", commands.problems.length ? "FAIL" : commands.symlinks.length ? "WARN" : "PASS", { count: commands.count, problems: commands.problems, uninspectedSymlinks: commands.symlinks });
  const commandTargetsMissing = commands.problems.filter((problem) => problem.code === "AGENT_TARGET_MISSING");
  add("routing.commands", commandTargetsMissing.length ? "FAIL" : "PASS", { targetsChecked: commands.count, missing: commandTargetsMissing });

  const devLead = checkDevLeadPermissions(root, agentInventory.names);
  add("routing.devLead", devLead.routingProblems.length ? "FAIL" : "PASS", { allowedTargets: devLead.targets, problems: devLead.routingProblems });
  const reviewerProblems = checkReviewerPermissions(root);
  add("permissions.reviewer", reviewerProblems.length ? "FAIL" : "PASS", { problems: reviewerProblems });
  add("security.devLead", devLead.securityProblems.length ? "FAIL" : "PASS", { problems: devLead.securityProblems });

  const profiles = listFiles(root, ".cn-pilot/profiles", { extension: ".md" });
  add("profiles.inventory", profiles.problems.length ? "FAIL" : profiles.symlinks.length ? "WARN" : "PASS", { count: profiles.count, symbolicLinks: profiles.symlinks, problems: profiles.problems });
  const templateRoot = listFiles(root, ".cn-pilot/templates");
  const templateTotal = listFiles(root, ".cn-pilot/templates", { recursive: true });
  const templateProblems = [...templateRoot.problems, ...templateTotal.problems];
  const templateSymlinks = [...templateRoot.symlinks, ...templateTotal.symlinks];
  add("templates.inventory", templateProblems.length ? "FAIL" : templateSymlinks.length ? "WARN" : "PASS", { rootFiles: templateRoot.count, totalFiles: templateTotal.count, problems: templateProblems, symbolicLinks: templateSymlinks });
  const references = listFiles(root, ".kilo/skills/technical-seo/references", { extension: ".md", recursive: true });
  add("references.technicalSeo", references.problems.length ? "FAIL" : references.symlinks.length ? "WARN" : "PASS", { count: references.count, problems: references.problems, symbolicLinks: references.symlinks });

  const ignore = readText(root, ".gitignore");
  const runtimeRule = ignore.kind === "ok" && ignore.text.split(/\r\n|\n|\r/).some((line) => line.trim() === "/.cn-pilot/runtime/");
  add("runtime.gitignore", runtimeRule ? "PASS" : "FAIL", { path: ".gitignore", expectedRule: "/.cn-pilot/runtime/", code: ignore.kind === "ok" ? undefined : ignore.code ?? ignore.kind });

  const manifest = checkManifest(root);
  add("manifest.inventory", manifest.status, manifest.details);

  const status = checks.some((item) => item.status === "FAIL") ? "FAIL" : checks.some((item) => item.status === "WARN") ? "WARN" : "PASS";
  return {
    schemaVersion: 1,
    status,
    version: version.version,
    checks,
    findings: checks.filter((item) => item.status !== "PASS").map(({ id, status: checkStatus, details }) => ({ id, status: checkStatus, ...details })),
  };
}

const LABELS = new Map([
  ["core.version", "Version"], ["core.paths", "Core paths"], ["core.optionalScaffold", "Input scaffold"],
  ["agents.frontmatter", "Agents"], ["skills.frontmatter", "Skills"], ["commands.frontmatter", "Commands"],
  ["routing.commands", "Command routing"], ["routing.devLead", "Dev Lead routes"], ["permissions.reviewer", "Reviewer permissions"],
  ["security.devLead", "Dev Lead safety"], ["profiles.inventory", "Profiles"], ["templates.inventory", "Templates"],
  ["references.technicalSeo", "Technical SEO refs"], ["runtime.gitignore", "Runtime isolation"], ["manifest.inventory", "MANIFEST"],
]);

function humanOutput(report) {
  const lines = ["CN Pilot Core QA", `Version: ${report.version ?? "unavailable"}`];
  for (const check of report.checks) {
    const details = check.details ?? {};
    let suffix = "";
    if (["agents.frontmatter", "skills.frontmatter", "commands.frontmatter", "profiles.inventory", "references.technicalSeo"].includes(check.id)) suffix = String(details.count ?? "");
    if (check.id === "templates.inventory") suffix = `root ${details.rootFiles ?? 0}; total ${details.totalFiles ?? 0}`;
    if (check.id === "core.paths") suffix = `${details.required ?? 0} required`;
    if (check.id === "routing.devLead") suffix = `${details.allowedTargets?.length ?? 0} task targets`;
    if (check.id === "manifest.inventory") suffix = `${details.declarationsChecked ?? 0} declarations`;
    if (check.id === "core.version") suffix = details.version ?? "";
    if (check.id === "runtime.gitignore") suffix = details.expectedRule ?? "";
    lines.push(`${(LABELS.get(check.id) ?? check.id).padEnd(27, ".")} ${check.status}${suffix ? ` (${suffix})` : ""}`);
  }
  lines.push(`Result: ${report.status}`);
  return `${lines.join("\n")}\n`;
}

function usage() {
  return "Usage: node .cn-pilot/qa/core-check.mjs [--json] [--help]\nRead-only Core checks; no package installation or network access.\nExit codes: 0 = PASS/WARN, 1 = FAIL, 2 = usage or runtime error.\n";
}

export function runCli(args = process.argv.slice(2), { rootDir = DEFAULT_ROOT, stdout = process.stdout, stderr = process.stderr } = {}) {
  const unknown = args.filter((arg) => !["--json", "--help", "-h"].includes(arg));
  if (unknown.length) { stderr.write(`Unknown argument: ${String(unknown[0]).replace(/[\r\n\t]/g, " ")}\n${usage()}`); return 2; }
  if (args.includes("--help") || args.includes("-h")) { stdout.write(usage()); return 0; }
  try {
    const report = runCoreChecks({ rootDir });
    stdout.write(args.includes("--json") ? `${JSON.stringify(report, null, 2)}\n` : humanOutput(report));
    return report.status === "FAIL" ? 1 : 0;
  } catch (error) {
    stderr.write(`Core QA execution error (${String(error?.code ?? "RUNTIME_ERROR").replace(/[\r\n\t]/g, " ")}).\n`);
    return 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) process.exitCode = runCli();
