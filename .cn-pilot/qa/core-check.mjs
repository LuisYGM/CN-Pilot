import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifyManifestMetadata } from "../update/updater.mjs";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), "..", "..");
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
const REQUIRED_PATHS = [
  ["PROYECTO.md", "file"], ["REQUISITOS.md", "file"], ["ESTADO.md", "file"], ["DECISIONES.md", "file"], ["ARTEFACTOS.md", "file"],
  ["AGENTS.md", "file"], [".cn-pilot/NUCLEO.md", "file"], [".cn-pilot/MANIFIESTO.md", "file"],
  [".cn-pilot/config/responsive.json", "file"], [".cn-pilot/documentacion", "directory"],
  [".cn-pilot/perfiles", "directory"], [".cn-pilot/plantillas", "directory"],
  [".cn-pilot/plantillas/informe-revision.md", "file"],
  [".cn-pilot/qa/core-check.mjs", "file"], [".cn-pilot/qa/core-check.test.mjs", "file"],
  [".cn-pilot/update/updater.mjs", "file"], [".cn-pilot/update/updater.test.mjs", "file"], [".cn-pilot/update/manifest.json", "file"],
  ["kilo.jsonc", "file"], [".kilo/agents/jefe-proyecto.md", "file"], [".kilo/agents/arquitecto.md", "file"],
  [".kilo/agents/contenido-seo.md", "file"], [".kilo/agents/disenador-ui-ux.md", "file"],
  [".kilo/agents/desarrollador.md", "file"], [".kilo/agents/maquetador-frontend.md", "file"], [".kilo/agents/revisor.md", "file"],
  ...["nuevo-proyecto", "cn-estado", "cn-actualizar", "diseno", "contenido", "revision", "entrega", "diagnostico", "depurar", "desplegar-pruebas", "preparar-despliegue", "punto-control", "plan", "commit"].map((name) => [`.kilo/commands/${name}.md`, "file"]),
];
const LEGACY_CANONICAL_PATHS = [
  "PROJECT.md", "REQUIREMENTS.md", "STATE.md", "DECISIONS.md", "ARTIFACTS.md",
  "project-resources", "project-artifacts", "product", ".cn-pilot/CORE.md",
  ".cn-pilot/CHANGELOG.md", ".cn-pilot/MANIFEST.md", ".cn-pilot/docs",
  ".cn-pilot/profiles", ".cn-pilot/templates", ".kilo/agents/dev-lead.md",
  ".kilo/commands/new-project.md",
];
const LEGACY_REFERENCE_ALLOWLIST = new Set([
  ".cn-pilot/CAMBIOS.md", ".cn-pilot/documentacion/ACTUALIZACIONES.md",
  ".cn-pilot/update/updater.mjs", ".cn-pilot/update/updater.test.mjs",
  ".cn-pilot/update/manifest.json", ".cn-pilot/qa/core-check.mjs", ".cn-pilot/qa/core-check.test.mjs",
]);
const LEGACY_REFERENCE_PATTERNS = [
  /\bPROJECT\.md\b/, /\bREQUIREMENTS\.md\b/, /\bSTATE\.md\b/, /\bDECISIONS\.md\b/, /\bARTIFACTS\.md\b/,
  /(?:^|[\/`])project-resources(?:\/|[`\s]|$)/, /(?:^|[\/`])project-artifacts(?:\/|[`\s]|$)/,
  /(?:^|[\/`])product\//, /\.cn-pilot\/(?:CORE|CHANGELOG|MANIFEST)\.md/,
  /\.cn-pilot\/(?:docs|profiles|templates)(?:\/|[`\s]|$)/,
  /(?:^|[\s`])\/(?:new-project|cn-status|cn-update|doctor|review|handoff|design|content|debug|deploy-staging|pre-deploy|checkpoint)(?:\b|`)/,
];
const REVIEWER_DENY = ["*", "bash", "websearch", "webfetch", "skill", "task", "agent_manager", "background_process", "write", "edit", "apply_patch", "grep", "external_directory"];
const SENSITIVE_PATHS = [
  ".env", ".env.*", "**/.env", "**/.env.*",
  "secrets/**", "**/secrets/**",
  ".npmrc", "**/.npmrc", ".pypirc", "**/.pypirc",
  ".kilocode/mcp.json", "**/.kilocode/mcp.json", ".kilo/mcp.json", "**/.kilo/mcp.json",
  "**/.netrc", "**/.aws/credentials", "**/.docker/config.json", "**/credentials.json", "**/service-account.json",
  "**/id_rsa", "**/id_ed25519", "**/id_ecdsa", "**/id_dsa", "**/*.p12", "**/*.pfx", "**/*.jks",
];
const KILO_CONFIG_PATHS = ["kilo.json", "kilo.jsonc", "**/kilo.json", "**/kilo.jsonc", ".kilo/kilo.json", ".kilo/kilo.jsonc", ".kilocode/kilo.json", ".kilocode/kilo.jsonc"];
const SENSITIVE_APPROVAL_PATHS = ["**/*.pem", "**/*.key", "**/.kube/config", "**/kubeconfig"];
const PROJECT_CONTEXT_PATHS = ["PROYECTO.md", "REQUISITOS.md", "ESTADO.md", "DECISIONES.md", "ARTEFACTOS.md", "README.md"];
const PROFILE_TOOL_KEYS = new Map([
  ["jefe-proyecto", ["*", "read", "glob", "grep", "skill", "websearch", "webfetch", "lsp", "write", "apply_patch", "question", "todoread", "todowrite", "board_read", "board_post", "goal", "goal_report", "schedule_wakeup", "cancel_wakeup", "cron_create", "cron_list", "cron_delete", "agent_manager_models", "chart", "open_plan", "kilo_local_recall", "external_directory", "agent_manager", "background_process", "task", "edit", "bash"]],
  ["arquitecto", ["*", "read", "glob", "grep", "lsp", "board_read", "board_post", "external_directory", "skill", "websearch", "webfetch", "task", "agent_manager", "background_process", "write", "apply_patch", "edit", "bash"]],
  ["contenido-seo", ["*", "read", "glob", "grep", "lsp", "board_read", "board_post", "external_directory", "skill", "websearch", "webfetch", "task", "agent_manager", "background_process", "write", "apply_patch", "edit", "bash"]],
  ["disenador-ui-ux", ["*", "read", "glob", "grep", "lsp", "board_read", "board_post", "external_directory", "skill", "websearch", "webfetch", "task", "agent_manager", "background_process", "write", "apply_patch", "edit", "bash"]],
  ["desarrollador", ["*", "read", "glob", "grep", "lsp", "board_read", "board_post", "external_directory", "skill", "websearch", "webfetch", "task", "agent_manager", "background_process", "write", "apply_patch", "edit", "bash"]],
  ["maquetador-frontend", ["*", "read", "glob", "grep", "lsp", "board_read", "board_post", "external_directory", "skill", "websearch", "webfetch", "task", "agent_manager", "background_process", "write", "apply_patch", "edit", "bash"]],
  ["revisor", ["*", "read", "glob", "grep", "skill", "websearch", "webfetch", "task", "agent_manager", "background_process", "write", "edit", "apply_patch", "bash", "external_directory"]],
]);
const ROOT_KILO_TOOL_KEYS = new Set(["*", "glob", "grep", "lsp", "question", "todoread", "todowrite", "board_read", "board_post", "agent_manager", "external_directory"]);
const DESTRUCTIVE_GIT = ["git push --force*", "git push -f*", "git reset --hard*", "git clean*"];
const CN_PILOT_AGENTS = ["arquitecto", "contenido-seo", "desarrollador", "disenador-ui-ux", "jefe-proyecto", "maquetador-frontend", "revisor"];
const REVIEW_OUTCOMES = ["APPROVED", "APPROVED WITH NOTES", "CHANGES REQUIRED", "BLOCKED"];
const CANONICAL_REPOSITORY = "https://github.com/luisygm/cn-pilot";
const LEGACY_ROLE_NAME = /\b(?:Dev Lead|Architect|Reviewer|Developer|Frontend\s*\/\s*Builder|Frontend\s+Builder|Content\s*\/\s*SEO|Content SEO(?: agent)?|UI\/UX Designer)\b/g;
const ACTIVE_LANGUAGE_ROOTS = [
  ".cn-pilot/documentacion", ".cn-pilot/perfiles", ".cn-pilot/plantillas",
  ".kilo/agents", ".kilo/commands", ".kilo/skills",
];
const PROJECT_CONTEXT_DOCS = ["AGENTS.md", "README.md", "PROYECTO.md", "REQUISITOS.md", "ESTADO.md", "DECISIONES.md", "ARTEFACTOS.md"];
const CN_PILOT_AGENT_HEADINGS = {
  "jefe-proyecto": "Jefe de proyecto",
  "arquitecto": "Arquitecto",
  "contenido-seo": "Contenido / SEO",
  "disenador-ui-ux": "Diseñador UI/UX",
  "desarrollador": "Desarrollador",
  "maquetador-frontend": "Maquetador frontend",
  "revisor": "Revisor",
};

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

function checkLegacyReferences(root) {
  const findings = []; const pending = [""];
  const textExtensions = new Set([".md", ".mjs", ".js", ".json", ".jsonc", ".yaml", ".yml", ".txt", ".csv"]);
  while (pending.length) {
    const directory = pending.pop();
    let entries;
    try { entries = fs.readdirSync(path.join(root, directory), { withFileTypes: true }); }
    catch { continue; }
    for (const entry of entries) {
      const relative = [directory, entry.name].filter(Boolean).join("/");
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (entry.name === ".git" || entry.name === "node_modules" || relative === ".kilo/worktrees" || relative === ".cn-pilot/runtime") continue;
        pending.push(relative); continue;
      }
      if (!entry.isFile() || !textExtensions.has(path.extname(entry.name).toLowerCase()) || LEGACY_REFERENCE_ALLOWLIST.has(relative)) continue;
      let text;
      try { text = fs.readFileSync(path.join(root, relative), "utf8"); } catch { continue; }
      if (LEGACY_REFERENCE_PATTERNS.some((pattern) => pattern.test(text))) findings.push(relative);
    }
  }
  return findings.sort();
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
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(stripped)) return Number(stripped);
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
  const unexpected = [...names].filter((name) => !CN_PILOT_AGENTS.includes(name));
  const missing = CN_PILOT_AGENTS.filter((name) => !names.has(name));
  if (unexpected.length || missing.length) problems.push({ code: "ACTIVE_AGENT_INVENTORY_MISMATCH", expected: CN_PILOT_AGENTS, missing, unexpected });
  for (const required of ["jefe-proyecto", "revisor"]) if (!names.has(required)) problems.push({ agent: required, code: "REQUIRED_AGENT_MISSING" });
  for (const file of listing.files) {
    const relative = file;
    const result = readMetadata(root, relative);
    if (!result.ok) { problems.push(result.error); continue; }
    if (!nonEmpty(result.fields.description)) problems.push({ path: relative, field: "description", code: "MISSING_REQUIRED_FIELD" });
    if (!new Set(["primary", "subagent", "all"]).has(result.fields.mode)) problems.push({ path: relative, field: "mode", code: "INVALID_REQUIRED_FIELD" });
  }
  return { count: listing.count + symlinks.length, names, problems, symlinks };
}

function checkAgentStepCaps(root) {
  const findings = [];
  for (const name of CN_PILOT_AGENTS) {
    const relative = `.kilo/agents/${name}.md`;
    const result = readMetadata(root, relative);
    if (!result.ok) continue; // agents.frontmatter reports the malformed/missing source separately.
    if (typeof result.fields.steps === "number") findings.push({ path: relative, code: "EXPLICIT_AGENT_STEP_CAP" });
  }
  return findings;
}

function checkSpanishFirst(root) {
  const findings = [];
  const paths = [".cn-pilot/NUCLEO.md"];
  const listingProblems = [];
  for (const directory of ACTIVE_LANGUAGE_ROOTS) {
    const listing = listFiles(root, directory, { extension: ".md", recursive: true });
    paths.push(...listing.files.filter((file) => !(directory === ".kilo/skills" && file.includes("/references/"))));
    listingProblems.push(...listing.problems);
  }
  for (const relative of PROJECT_CONTEXT_DOCS) {
    if (inspectPath(root, relative).kind === "ok") paths.push(relative);
  }
  if (listingProblems.length) findings.push(...listingProblems.map((problem) => ({ ...problem, code: "ACTIVE_LANGUAGE_PATH_UNAVAILABLE" })));

  for (const relative of [...new Set(paths)].sort()) {
    if (relative === ".cn-pilot/CAMBIOS.md") continue; // Changelog histórico no refleja la terminología activa.
    const source = readText(root, relative);
    if (source.kind !== "ok") { findings.push({ path: relative, code: "ACTIVE_LANGUAGE_FILE_UNREADABLE" }); continue; }
    for (const match of source.text.matchAll(LEGACY_ROLE_NAME)) findings.push({ path: relative, code: "LEGACY_ROLE_NAME", value: match[0] });
  }

  for (const [name, heading] of Object.entries(CN_PILOT_AGENT_HEADINGS)) {
    const relative = `.kilo/agents/${name}.md`;
    const source = readText(root, relative);
    if (source.kind !== "ok" || !source.text.split(/\r\n|\n|\r/).includes(`# ${heading}`)) {
      findings.push({ path: relative, code: "NON_CANONICAL_AGENT_HEADING", expected: `# ${heading}` });
    }
  }

  const core = readText(root, ".cn-pilot/NUCLEO.md");
  const canonical = core.kind === "ok" && core.text.includes("Las superficies propias de CN Pilot destinadas a personas usan español por defecto")
    && core.text.includes("nombres visibles de roles, documentos, comandos y estructuras")
    && !/estructura técnica permanece en inglés.{0,100}(?:archivos|carpetas|agentes)/i.test(core.text);
  if (!canonical) findings.push({ path: ".cn-pilot/NUCLEO.md", code: "SPANISH_FIRST_DOCTRINE_MISSING_OR_CONTRADICTORY" });
  return { findings, scanned: [...new Set(paths)].length };
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
  const result = readMetadata(root, ".kilo/agents/revisor.md");
  if (!result.ok) return [result.error];
  const permission = result.fields.permission;
  if (!permission || typeof permission !== "object") return [{ path: ".kilo/agents/revisor.md", field: "permission", code: "MISSING_PERMISSION_MAP" }];
  const problems = [];
  const readMap = permission.read;
  if (!(readMap === "allow" || readMap?.["*"] === "allow")) problems.push({ field: "read", code: "CRITICAL_PERMISSION_MISSING" });
  if (permission.glob !== "allow") problems.push({ field: "glob", code: "CRITICAL_PERMISSION_MISSING" });
  for (const capability of REVIEWER_DENY) if (permission[capability] !== "deny") problems.push({ field: capability, expected: "deny", code: "PROTECTED_PERMISSION_NOT_DENIED" });
  for (const pattern of SENSITIVE_PATHS) if (readMap?.[pattern] !== "deny") problems.push({ field: `read.${pattern}`, expected: "deny", code: "SENSITIVE_READ_NOT_DENIED" });
  const readKeys = readMap && typeof readMap === "object" ? Object.keys(readMap) : [];
  const fallback = readKeys.indexOf("*");
  for (const pattern of SENSITIVE_PATHS) if (readKeys.indexOf(pattern) < fallback || readKeys.indexOf(pattern) < 0) problems.push({ field: `read.${pattern}`, code: "SECURITY_RULE_ORDER_INVALID" });
  for (const pattern of KILO_CONFIG_PATHS) if (readMap?.[pattern] !== "deny") problems.push({ field: `read.${pattern}`, expected: "deny", code: "REVIEWER_CONFIG_READ_NOT_DENIED" });
  for (const pattern of SENSITIVE_APPROVAL_PATHS) if (readMap?.[pattern] !== "deny") problems.push({ field: `read.${pattern}`, expected: "deny", code: "REVIEWER_CREDENTIAL_READ_NOT_DENIED" });
  if (readMap?.[".env.example"] !== "allow" || readMap?.["**/.env.example"] !== "allow") problems.push({ field: "read.env.example", code: "SAFE_EXAMPLE_NOT_ALLOWED" });
  const exampleIndex = Math.max(readKeys.indexOf(".env.example"), readKeys.indexOf("**/.env.example"));
  if (readKeys.indexOf("**/secrets/**") < exampleIndex) problems.push({ field: "read.secrets/**", code: "SECRET_DIRECTORY_PRECEDENCE_INVALID" });
  return problems;
}

function checkDevLeadPermissions(root, agentNames) {
  const result = readMetadata(root, ".kilo/agents/jefe-proyecto.md");
  if (!result.ok) return { targets: [], routingProblems: [result.error], securityProblems: [result.error] };
  const permission = result.fields.permission;
  if (!permission || typeof permission !== "object") {
    const problem = { path: ".kilo/agents/jefe-proyecto.md", field: "permission", code: "MISSING_PERMISSION_MAP" };
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
    for (const pattern of KILO_CONFIG_PATHS) if (rules?.[pattern] !== "ask") securityProblems.push({ field: `${tool}.${pattern}`, code: "KILO_CONFIG_GATE_MISSING" });
    for (const pattern of SENSITIVE_APPROVAL_PATHS) if (rules?.[pattern] !== "ask") securityProblems.push({ field: `${tool}.${pattern}`, code: "CREDENTIAL_GATE_MISSING" });
    const denyEnvIndex = keys.indexOf(".env.*");
    const exampleIndex = Math.max(keys.indexOf(".env.example"), keys.indexOf("**/.env.example"));
    if (rules?.[".env.example"] === "allow" && (denyEnvIndex < 0 || exampleIndex < denyEnvIndex)) securityProblems.push({ field: `${tool}.env.example`, code: "SECURITY_RULE_ORDER_INVALID" });
    if (keys.indexOf("**/secrets/**") < exampleIndex) securityProblems.push({ field: `${tool}.secrets/**`, code: "SECRET_DIRECTORY_PRECEDENCE_INVALID" });
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

function checkAgentPermissionProfiles(root) {
  const problems = [];
  const owners = new Map([
    ["arquitecto", { editFallback: "ask", writable: true }],
    ["contenido-seo", { editFallback: "ask", writable: true }],
    ["disenador-ui-ux", { editFallback: "ask", writable: true }],
    ["desarrollador", { editFallback: "allow", writable: true }],
    ["maquetador-frontend", { editFallback: "allow", writable: true }],
    ["jefe-proyecto", { editFallback: "ask", writable: true }],
    ["revisor", { editFallback: "deny", writable: false }],
  ]);
  const action = (map, pattern) => typeof map === "string" ? map : map?.[pattern];
  const keys = (map) => map && typeof map === "object" ? Object.keys(map) : [];
  const isAfterFallback = (map, pattern) => keys(map).indexOf(pattern) > keys(map).indexOf("*");

  for (const [agent, profile] of owners) {
    const relative = `.kilo/agents/${agent}.md`;
    const metadata = readMetadata(root, relative);
    if (!metadata.ok) { problems.push(metadata.error); continue; }
    const permission = metadata.fields.permission;
    if (!permission || typeof permission !== "object") { problems.push({ path: relative, code: "MISSING_PERMISSION_MAP" }); continue; }
    if (permission["*"] !== "deny") problems.push({ path: relative, field: "permission.*", expected: "deny", code: "UNKNOWN_TOOL_DEFAULT_NOT_DENIED" });
    if (Object.keys(permission).indexOf("*") !== 0) problems.push({ path: relative, field: "permission.*", code: "TOOL_FALLBACK_ORDER_INVALID" });
    const knownTools = new Set(PROFILE_TOOL_KEYS.get(agent) ?? []);
    for (const tool of Object.keys(permission)) if (!knownTools.has(tool)) problems.push({ path: relative, field: tool, code: "UNREVIEWED_TOOL_PERMISSION" });

    const readRules = permission.read;
    if (action(readRules, "*") !== "allow") problems.push({ path: relative, field: "read.*", expected: "allow", code: "READ_FALLBACK_NOT_ALLOWED" });
    for (const sensitivePath of SENSITIVE_PATHS) {
      if (action(readRules, sensitivePath) !== "deny") problems.push({ path: relative, field: `read.${sensitivePath}`, expected: "deny", code: "SENSITIVE_READ_NOT_DENIED" });
      if (!isAfterFallback(readRules, sensitivePath)) problems.push({ path: relative, field: `read.${sensitivePath}`, code: "SECURITY_RULE_ORDER_INVALID" });
    }
    for (const configPath of KILO_CONFIG_PATHS) {
      const expected = agent === "jefe-proyecto" ? "ask" : "deny";
      if (action(readRules, configPath) !== expected) problems.push({ path: relative, field: `read.${configPath}`, expected, code: "KILO_CONFIG_READ_POLICY_INVALID" });
      if (!isAfterFallback(readRules, configPath)) problems.push({ path: relative, field: `read.${configPath}`, code: "SECURITY_RULE_ORDER_INVALID" });
    }
    for (const credentialPath of SENSITIVE_APPROVAL_PATHS) {
      const expected = agent === "revisor" ? "deny" : "ask";
      if (action(readRules, credentialPath) !== expected) problems.push({ path: relative, field: `read.${credentialPath}`, expected, code: "AMBIGUOUS_CREDENTIAL_READ_POLICY_INVALID" });
      if (!isAfterFallback(readRules, credentialPath)) problems.push({ path: relative, field: `read.${credentialPath}`, code: "SECURITY_RULE_ORDER_INVALID" });
    }
    const externalDirectoryExpected = agent === "jefe-proyecto" ? "ask" : "deny";
    if (permission.external_directory !== externalDirectoryExpected) problems.push({ path: relative, field: "external_directory", expected: externalDirectoryExpected, code: "EXTERNAL_DIRECTORY_POLICY_INVALID" });
    if (action(readRules, ".env.example") !== "allow" || action(readRules, "**/.env.example") !== "allow") {
      problems.push({ path: relative, field: "read.env.example", expected: "allow", code: "SAFE_EXAMPLE_NOT_ALLOWED" });
    }
    const readKeys = keys(readRules);
    const exampleIndex = Math.max(readKeys.indexOf(".env.example"), readKeys.indexOf("**/.env.example"));
    const envDenyIndex = Math.max(readKeys.indexOf(".env.*"), readKeys.indexOf("**/.env.*"));
    if (exampleIndex < envDenyIndex) problems.push({ path: relative, field: "read.env.example", code: "ENV_EXAMPLE_PRECEDENCE_INVALID" });
    if (Math.min(readKeys.indexOf("secrets/**"), readKeys.indexOf("**/secrets/**")) < exampleIndex) problems.push({ path: relative, field: "read.secrets/**", code: "SECRET_DIRECTORY_PRECEDENCE_INVALID" });

    const editRules = permission.edit;
    if (!profile.writable) {
      if (editRules !== "deny") problems.push({ path: relative, field: "edit", expected: "deny", code: "REVIEWER_MUTATION_NOT_DENIED" });
      for (const capability of ["write", "apply_patch", "bash", "agent_manager", "background_process"]) if (permission[capability] !== "deny") problems.push({ path: relative, field: capability, expected: "deny", code: "REVIEWER_MUTATION_NOT_DENIED" });
      for (const capability of REVIEWER_DENY) if (capability !== "*" && permission[capability] !== "deny") problems.push({ path: relative, field: capability, expected: "deny", code: "REVIEWER_CAPABILITY_NOT_DENIED" });
      if (permission.grep !== "deny" || permission.external_directory !== "deny") problems.push({ path: relative, field: "grep/external_directory", expected: "deny", code: "REVIEWER_READ_BOUNDARY_NOT_DENIED" });
    } else {
      if (action(editRules, "*") !== profile.editFallback) problems.push({ path: relative, field: "edit.*", expected: profile.editFallback, code: "EDIT_FALLBACK_CHANGED" });
      for (const capability of ["write", "apply_patch"]) if (permission[capability] !== "allow") problems.push({ path: relative, field: capability, expected: "allow", code: "EDIT_TOOL_CAPABILITY_DISABLED" });
      for (const sensitivePath of SENSITIVE_PATHS) {
        if (action(editRules, sensitivePath) !== "deny") problems.push({ path: relative, field: `edit.${sensitivePath}`, expected: "deny", code: "SENSITIVE_EDIT_NOT_DENIED" });
        if (!isAfterFallback(editRules, sensitivePath)) problems.push({ path: relative, field: `edit.${sensitivePath}`, code: "SECURITY_RULE_ORDER_INVALID" });
      }
      for (const configPath of KILO_CONFIG_PATHS) {
        const expected = agent === "jefe-proyecto" ? "ask" : "deny";
        if (action(editRules, configPath) !== expected) problems.push({ path: relative, field: `edit.${configPath}`, expected, code: "KILO_CONFIG_EDIT_POLICY_INVALID" });
        if (!isAfterFallback(editRules, configPath)) problems.push({ path: relative, field: `edit.${configPath}`, code: "SECURITY_RULE_ORDER_INVALID" });
      }
      for (const credentialPath of SENSITIVE_APPROVAL_PATHS) {
        const expected = agent === "revisor" ? "deny" : "ask";
        if (action(editRules, credentialPath) !== expected) problems.push({ path: relative, field: `edit.${credentialPath}`, expected, code: "AMBIGUOUS_CREDENTIAL_EDIT_POLICY_INVALID" });
        if (!isAfterFallback(editRules, credentialPath)) problems.push({ path: relative, field: `edit.${credentialPath}`, code: "SECURITY_RULE_ORDER_INVALID" });
      }
      if (action(editRules, ".env.example") !== "allow" || action(editRules, "**/.env.example") !== "allow") {
        problems.push({ path: relative, field: "edit.env.example", expected: "allow", code: "SAFE_EXAMPLE_NOT_ALLOWED" });
      }
      const editKeys = keys(editRules);
      const editExampleIndex = Math.max(editKeys.indexOf(".env.example"), editKeys.indexOf("**/.env.example"));
      const editEnvDenyIndex = Math.max(editKeys.indexOf(".env.*"), editKeys.indexOf("**/.env.*"));
      if (editExampleIndex < editEnvDenyIndex) problems.push({ path: relative, field: "edit.env.example", code: "ENV_EXAMPLE_PRECEDENCE_INVALID" });
      if (Math.min(editKeys.indexOf("secrets/**"), editKeys.indexOf("**/secrets/**")) < editExampleIndex) problems.push({ path: relative, field: "edit.secrets/**", code: "SECRET_DIRECTORY_PRECEDENCE_INVALID" });
    }

    if (agent !== "jefe-proyecto" && profile.writable) {
      const protectedPaths = [".cn-pilot/**", ".kilo/**", ".cn-pilot-version", "AGENTS.md", ...PROJECT_CONTEXT_PATHS, "kilo.json", "kilo.jsonc"];
      for (const protectedPath of protectedPaths) if (action(editRules, protectedPath) !== "deny") problems.push({ path: relative, field: `edit.${protectedPath}`, expected: "deny", code: "CORE_OWNERSHIP_NOT_DENIED" });
    }

    if (agent !== "revisor") {
      for (const capability of ["glob", "grep", "skill", "lsp", "board_read", "board_post"]) {
        if (permission[capability] !== "allow") problems.push({ path: relative, field: capability, expected: "allow", code: "COMMON_WORKFLOW_CAPABILITY_CHANGED" });
      }
    }
    if (["desarrollador", "maquetador-frontend"].includes(agent) && permission.edit?.["*"] !== "allow") {
      problems.push({ path: relative, field: "edit.*", expected: "allow", code: "PRODUCT_EDIT_AUTONOMY_REDUCED" });
    }
  }
  return problems;
}

function findJsoncObject(source, key, fromIndex = 0) {
  const lineKey = new RegExp(`^\\s*"${key}"\\s*:\\s*\\{`, "gm");
  lineKey.lastIndex = fromIndex;
  const match = lineKey.exec(source);
  if (!match) return null;
  const open = source.indexOf("{", match.index);
  let depth = 0;
  let string = false;
  let escape = false;
  let lineComment = false;
  let blockComment = false;
  for (let i = open; i < source.length; i += 1) {
    const current = source[i];
    const next = source[i + 1];
    if (lineComment) { if (current === "\n") lineComment = false; continue; }
    if (blockComment) { if (current === "*" && next === "/") { blockComment = false; i += 1; } continue; }
    if (string) {
      if (escape) escape = false;
      else if (current === "\\") escape = true;
      else if (current === '"') string = false;
      continue;
    }
    if (current === '"') { string = true; continue; }
    if (current === "/" && next === "/") { lineComment = true; i += 1; continue; }
    if (current === "/" && next === "*") { blockComment = true; i += 1; continue; }
    if (current === "{") depth += 1;
    else if (current === "}" && --depth === 0) return source.slice(open + 1, i);
  }
  return null;
}

function parseJsoncStringRules(source) {
  const lines = String(source ?? "").split(/\r\n|\n|\r/);
  const entries = lines.map((line) => {
    const match = line.match(/^(\s*)"((?:\\.|[^"\\])*)"\s*:\s*"((?:\\.|[^"\\])*)"\s*,?\s*(?:\/\/.*)?$/);
    return match ? { indent: match[1].length, key: match[2], action: match[3] } : null;
  }).filter(Boolean);
  const indent = entries.length ? Math.min(...entries.map((entry) => entry.indent)) : null;
  return entries.filter((entry) => entry.indent === indent);
}

function checkKiloPermissionDefaults(root) {
  const project = readText(root, "PROYECTO.md");
  if (project.kind !== "ok" || !canonicalProjectContext(root, project.text)) {
    return { status: "PASS", details: { checked: false, reason: "Project Kilo configuration is user-owned outside the canonical distribution." } };
  }
  const file = readText(root, "kilo.jsonc");
  if (file.kind !== "ok") return { status: "FAIL", details: { checked: true, code: file.code ?? file.kind } };
  const permissionBlock = findJsoncObject(file.text, "permission");
  const readBlock = permissionBlock && findJsoncObject(permissionBlock, "read");
  const editBlock = permissionBlock && findJsoncObject(permissionBlock, "edit");
  const read = parseJsoncStringRules(readBlock);
  const edit = parseJsoncStringRules(editBlock);
  const topLevel = parseJsoncStringRules(permissionBlock);
  const action = (rules, pattern) => rules.filter((entry) => entry.key === pattern).at(-1)?.action;
  const index = (rules, pattern) => rules.findIndex((entry) => entry.key === pattern);
  const problems = [];
  if (action(topLevel, "*") !== "deny") problems.push({ field: "permission.*", expected: "deny", code: "UNKNOWN_TOOL_DEFAULT_NOT_DENIED" });
  if (topLevel.findIndex((entry) => entry.key === "*") !== 0) problems.push({ field: "permission.*", code: "ROOT_TOOL_FALLBACK_ORDER_INVALID" });
  for (const entry of topLevel) if (!ROOT_KILO_TOOL_KEYS.has(entry.key)) problems.push({ field: entry.key, code: "UNREVIEWED_ROOT_TOOL_PERMISSION" });
  if (findJsoncObject(file.text, "mcp")) problems.push({ field: "mcp", code: "MCP_SERVER_ADDED_OUTSIDE_REVIEW" });
  for (const [tool, rules] of [["read", read], ["edit", edit]]) {
    if (action(rules, "*") !== "allow") problems.push({ field: `${tool}.*`, expected: "allow", code: "CORE_FILE_TOOL_FALLBACK_CHANGED" });
    for (const pattern of SENSITIVE_PATHS) {
      if (action(rules, pattern) !== "deny" || index(rules, pattern) < index(rules, "*")) problems.push({ field: `${tool}.${pattern}`, code: "CORE_SENSITIVE_PATH_RULE_INVALID" });
    }
    if (action(rules, ".env.example") !== "allow" || action(rules, "**/.env.example") !== "allow") problems.push({ field: `${tool}.env.example`, code: "SAFE_EXAMPLE_NOT_ALLOWED" });
    const exampleIndex = Math.max(index(rules, ".env.example"), index(rules, "**/.env.example"));
    const envDenyIndex = Math.max(index(rules, ".env.*"), index(rules, "**/.env.*"));
    if (exampleIndex < envDenyIndex) problems.push({ field: `${tool}.env.example`, code: "ENV_EXAMPLE_PRECEDENCE_INVALID" });
    if (Math.min(index(rules, "secrets/**"), index(rules, "**/secrets/**")) < exampleIndex) problems.push({ field: `${tool}.secrets/**`, code: "SECRET_DIRECTORY_PRECEDENCE_INVALID" });
    for (const pattern of KILO_CONFIG_PATHS) {
      if (action(rules, pattern) !== "ask") problems.push({ field: `${tool}.${pattern}`, expected: "ask", code: "KILO_CONFIG_GATE_MISSING" });
      if (index(rules, pattern) <= index(rules, "*")) problems.push({ field: `${tool}.${pattern}`, code: "KILO_CONFIG_RULE_ORDER_INVALID" });
    }
    for (const pattern of SENSITIVE_APPROVAL_PATHS) {
      if (action(rules, pattern) !== "ask") problems.push({ field: `${tool}.${pattern}`, expected: "ask", code: "CREDENTIAL_GATE_MISSING" });
      if (index(rules, pattern) <= index(rules, "*")) problems.push({ field: `${tool}.${pattern}`, code: "CREDENTIAL_RULE_ORDER_INVALID" });
    }
  }
  for (const [tool, expected] of [["glob", "allow"], ["grep", "allow"], ["lsp", "allow"], ["question", "allow"], ["todoread", "allow"], ["todowrite", "allow"], ["board_read", "allow"], ["board_post", "allow"], ["agent_manager", "ask"], ["external_directory", "ask"]]) {
    if (action(topLevel, tool) !== expected) problems.push({ field: tool, expected, code: "KILO_CAPABILITY_DEFAULT_CHANGED" });
  }
  const bashBlock = permissionBlock && findJsoncObject(permissionBlock, "bash");
  const bash = parseJsoncStringRules(bashBlock);
  if (action(bash, "*") !== "ask") problems.push({ field: "bash.*", expected: "ask", code: "SHELL_FALLBACK_NOT_APPROVAL_GATED" });
  for (const pattern of DESTRUCTIVE_GIT) if (action(bash, pattern) !== "deny") problems.push({ field: `bash.${pattern}`, expected: "deny", code: "DESTRUCTIVE_COMMAND_NOT_DENIED" });
  return { status: problems.length ? "FAIL" : "PASS", details: { checked: true, problems, unknownTools: "deny", pathPatternPrecedence: "Kilo 7.8.8 last match wins" } };
}

function manifestRules(text) {
  const lines = text.split(/\r\n|\n|\r/);
  const declarations = [];
  const recognized = new Set();
  const rules = [
    ["agents", /^\s*-\s*(\d+)\s+agentes?\s+en\s+`([^`]+)`/i, ".kilo/agents", (root) => listFiles(root, ".kilo/agents", { extension: ".md" })],
    ["skills", /^\s*-\s*(\d+)\s+skills\s*\([^)]*\.kilo\/skills\/\*\/SKILL\.md[^)]*\)/i, ".kilo/skills", (root) => ({ count: listDirectories(root, ".kilo/skills").directories.length })],
    ["commands", /^\s*-\s*(\d+)\s+comandos?\s+en\s+`([^`]+)`/i, ".kilo/commands", (root) => listFiles(root, ".kilo/commands", { extension: ".md" })],
    ["profiles", /^\s*-\s*(\d+)\s+perfil(?:es)?\s+en\s+`([^`]+)`/i, ".cn-pilot/perfiles", (root) => listFiles(root, ".cn-pilot/perfiles", { extension: ".md" })],
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
      declarations.push({ id: "templates.root", expected: Number(templateMatch[1]), declaredPath: templateMatch[2].replace(/[\\/]+$/, ""), canonicalPath: ".cn-pilot/plantillas", actual: (root) => listFiles(root, ".cn-pilot/plantillas"), line: lineIndex + 1 });
      declarations.push({ id: "templates.total", expected: Number(templateMatch[3]), declaredPath: templateMatch[4].replace(/[\\/]+$/, ""), canonicalPath: ".cn-pilot/plantillas", actual: (root) => listFiles(root, ".cn-pilot/plantillas", { recursive: true }), line: lineIndex + 1 });
    }
  }
  const unknownNumericLines = lines.map((line, index) => ({ line, index })).filter(({ line, index }) => /^\s*-\s*\d+\b/.test(line) && !recognized.has(index)).map(({ index }) => index + 1);
  return { declarations, unknownNumericLines };
}

function checkManifest(root) {
  const file = readText(root, ".cn-pilot/MANIFIESTO.md");
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

function checkDistributionManifest(root) {
  try {
    const result = verifyManifestMetadata(root);
    return { status: "PASS", details: { version: result.manifest.cnPilotVersion, hashesDeclared: result.hashesDeclared, mode: "baseline metadata; local customization is permitted" } };
  } catch (error) {
    return { status: "FAIL", details: { code: String(error?.code ?? "INVALID_MANIFEST").replace(/[\r\n\t]/g, " ") } };
  }
}

function readVersion(root) {
  const local = readText(root, ".cn-pilot-version");
  const core = readText(root, ".cn-pilot/NUCLEO.md");
  const version = local.kind === "ok" ? local.text.trim() : null;
  const declared = core.kind === "ok" ? [...core.text.matchAll(/^\s*\*\*Versi[oó]n:\*\*\s*`([^`]+)`\s*$/gim)].map((match) => match[1].trim()) : [];
  const unique = [...new Set(declared)];
  const canonical = unique.length === 1 ? unique[0] : null;
  let status = local.kind !== "ok" || !SEMVER.test(version ?? "") ? "FAIL" : "PASS";
  if (status === "PASS" && unique.length > 1) status = "WARN";
  else if (status === "PASS" && canonical && canonical !== version) status = "FAIL";
  return { status, version, details: { path: ".cn-pilot-version", version, canonical, semver: SEMVER.test(version ?? "") } };
}

function hasCanonicalOrigin(root) {
  const config = readText(root, ".git/config");
  if (config.kind !== "ok") return false;
  let inOrigin = false;
  let originUrl = null;
  for (const line of config.text.split(/\r\n|\n|\r/)) {
    const section = line.match(/^\s*\[remote\s+"([^"]+)"\]\s*$/i);
    if (section) { inOrigin = section[1].toLowerCase() === "origin"; continue; }
    if (inOrigin) {
      const url = line.match(/^\s*url\s*=\s*(\S+)\s*$/i);
      if (url) { originUrl = url[1]; break; }
    }
  }
  const normalized = String(originUrl ?? "")
    .replace(/^git@github\.com:/i, "https://github.com/")
    .replace(/^ssh:\/\/git@github\.com\//i, "https://github.com/")
    .replace(/\.git$/i, "")
    .replace(/\/$/, "")
    .toLowerCase();
  return normalized === CANONICAL_REPOSITORY;
}

function canonicalProjectContext(root, projectText) {
  const manifest = readText(root, ".cn-pilot/update/manifest.json");
  const readme = readText(root, "README.md");
  if (manifest.kind !== "ok" || readme.kind !== "ok" || !hasCanonicalOrigin(root)) return false;
  let metadata;
  try { metadata = JSON.parse(manifest.text); } catch { return false; }
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return false;
  const sourceRepository = typeof metadata.sourceRepository === "string" ? metadata.sourceRepository.replace(/\.git$/i, "").toLowerCase() : "";
  const firstHeading = readme.text.split(/\r\n|\n|\r/).find((line) => /^#\s/.test(line.trim()))?.trim();
  const projectNames = [...projectText.matchAll(/^\s*-\s*\*\*Nombre:\*\*\s*(.*?)\s*$/gim)].map((match) => match[1].trim());
  const projectRepositories = [...projectText.matchAll(/^\s*-\s*\*\*Repositorio o carpeta:\*\*\s*(.*?)\s*$/gim)].map((match) => match[1].trim());
  const coreIdentity = projectNames.length === 1 && ["pending", "cn pilot", "cn pilot core"].includes(projectNames[0].toLowerCase());
  const repositoryIdentity = projectRepositories.length === 1 && ["pending", CANONICAL_REPOSITORY, `${CANONICAL_REPOSITORY}.git`].includes(projectRepositories[0].toLowerCase());
  return sourceRepository === CANONICAL_REPOSITORY
    && firstHeading === "# CN Pilot"
    && /https:\/\/github\.com\/LuisYGM\/cn-pilot\b/i.test(readme.text)
    && coreIdentity
    && repositoryIdentity;
}

function checkProjectContextVersion(root, coreVersion) {
  const project = readText(root, "PROYECTO.md");
  if (project.kind !== "ok") return { status: "FAIL", details: { path: "PROYECTO.md", checked: true, code: project.code ?? project.kind } };
  if (!canonicalProjectContext(root, project.text)) {
    return { status: "PASS", details: { path: "PROYECTO.md", checked: false, reason: "Project Context is project-owned; version cross-check requires the canonical Core origin and identity." } };
  }
  const declared = [...project.text.matchAll(/^\s*-\s*\*\*Versión de CN Pilot Core:\*\*\s*(\S+)\s*$/gim)].map((match) => match[1].trim());
  const unique = [...new Set(declared)];
  const contextVersion = unique.length === 1 ? unique[0] : null;
  const matches = coreVersion.status === "PASS" && contextVersion === coreVersion.version;
  const semver = SEMVER.test(contextVersion ?? "");
  return {
    status: matches && semver ? "PASS" : "FAIL",
    details: {
      path: "PROYECTO.md",
      checked: true,
      coreVersion: coreVersion.version,
      contextVersion,
      declarations: declared.length,
      semver,
      code: matches && semver ? undefined : "CORE_PROJECT_VERSION_MISMATCH",
    },
  };
}

function parseOutcomeDeclaration(text) {
  if (!text) return [];
  return text.split(/\s*(?:\/|\||,|\bo\b)\s*/i)
    .map((item) => item.trim().replace(/^[`*\s]+|[`*.,;\s]+$/g, "").toUpperCase())
    .filter(Boolean);
}

function checkReviewOutcomes(root) {
  const command = readText(root, ".kilo/commands/revision.md");
  const template = readText(root, ".cn-pilot/plantillas/informe-revision.md");
  if (command.kind !== "ok" || template.kind !== "ok") {
    return { status: "FAIL", details: { code: "REVIEW_OUTCOME_SOURCE_UNAVAILABLE", command: command.code ?? command.kind, template: template.code ?? template.kind } };
  }
  const finalLine = command.text.split(/\r\n|\n|\r/).find((line) => /\bFinaliza con\b/i.test(line));
  const commandDeclaration = finalLine?.match(/\bFinaliza con\s+(.+?)\s+y detente\b/i)?.[1];
  const commandOutcomes = parseOutcomeDeclaration(commandDeclaration);
  const lines = template.text.split(/\r\n|\n|\r/);
  const heading = lines.findIndex((line) => /^##\s+Resultado\s*$/i.test(line.trim()));
  const nextHeading = heading < 0 ? -1 : lines.findIndex((line, index) => index > heading && /^##\s/.test(line.trim()));
  const section = heading < 0 ? [] : lines.slice(heading + 1, nextHeading < 0 ? undefined : nextHeading);
  const templateDeclaration = section.find((line) => line.trim())?.trim().replace(/^[-*]\s*/, "");
  const templateOutcomes = parseOutcomeDeclaration(templateDeclaration);
  const expected = [...REVIEW_OUTCOMES].sort();
  const commandSet = [...new Set(commandOutcomes)].sort();
  const templateSet = [...new Set(templateOutcomes)].sort();
  const matchesExpected = (actual) => actual.length === expected.length && actual.every((item, index) => item === expected[index]);
  return {
    status: heading >= 0 && matchesExpected(commandSet) && matchesExpected(templateSet) ? "PASS" : "FAIL",
    details: {
      command: ".kilo/commands/revision.md",
      template: ".cn-pilot/plantillas/informe-revision.md",
      expected,
      commandOutcomes: commandSet,
      templateOutcomes: templateSet,
      missingFromCommand: expected.filter((item) => !commandSet.includes(item)),
      missingFromTemplate: expected.filter((item) => !templateSet.includes(item)),
      unexpectedInCommand: commandSet.filter((item) => !expected.includes(item)),
      unexpectedInTemplate: templateSet.filter((item) => !expected.includes(item)),
    },
  };
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
  const projectVersion = checkProjectContextVersion(root, version);
  add("core.projectContextVersion", projectVersion.status, projectVersion.details);
  const reviewOutcomes = checkReviewOutcomes(root);
  add("review.outcomes", reviewOutcomes.status, reviewOutcomes.details);

  const requiredResults = REQUIRED_PATHS.map(([relativePath, kind]) => {
    const item = inspectPath(root, relativePath);
    const match = item.kind === "ok" && (kind === "file" ? item.stats.isFile() : item.stats.isDirectory());
    return { path: relativePath, expected: kind, valid: match, code: match ? undefined : item.code ?? item.kind };
  });
  const invalidPaths = requiredResults.filter((item) => !item.valid).map(({ path: relativePath, expected, code }) => ({ path: relativePath, expected, code }));
  add("core.paths", invalidPaths.length ? "FAIL" : "PASS", { required: requiredResults.length, missingOrInvalid: invalidPaths });

  const legacyPaths = LEGACY_CANONICAL_PATHS.filter((relativePath) => inspectPath(root, relativePath).kind === "ok");
  add("core.legacyPaths", legacyPaths.length ? "FAIL" : "PASS", { paths: legacyPaths });
  const legacyReferences = checkLegacyReferences(root);
  add("core.legacyReferences", legacyReferences.length ? "FAIL" : "PASS", { files: legacyReferences });

  const scaffold = inspectPath(root, "recursos/README.md");
  add("core.optionalScaffold", scaffold.kind === "ok" && scaffold.stats.isFile() ? "PASS" : "WARN", {
    path: "recursos/README.md",
    note: "Expected input scaffold; not required to run Core",
    code: scaffold.kind === "ok" ? undefined : scaffold.code ?? scaffold.kind,
  });

  const agentInventory = checkAgents(root);
  add("agents.frontmatter", agentInventory.problems.length ? "FAIL" : agentInventory.symlinks.length ? "WARN" : "PASS", { count: agentInventory.count, problems: agentInventory.problems, uninspectedSymlinks: agentInventory.symlinks });
  const stepCaps = checkAgentStepCaps(root);
  add("agents.noStepCaps", stepCaps.length ? "FAIL" : "PASS", { inspected: CN_PILOT_AGENTS.length, findings: stepCaps, reason: "Los agentes activos deben terminar por outcome/gates/bloqueo real, no por un límite numérico artificial de steps." });
  const spanishFirst = checkSpanishFirst(root);
  add("language.spanishFirst", spanishFirst.findings.length ? "FAIL" : "PASS", { scanned: spanishFirst.scanned, findings: spanishFirst.findings, reason: "La documentación y los prompts activos de CN Pilot usan roles Spanish-first y declaran la excepción técnica canónica; el changelog histórico queda fuera del control." });
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
  const agentPermissions = checkAgentPermissionProfiles(root);
  add("security.agentPermissions", agentPermissions.length ? "FAIL" : "PASS", { agentsChecked: CN_PILOT_AGENTS.length, problems: agentPermissions, guarantee: "static declarations only; resolved Kilo runtime is checked separately" });
  const kiloPermissionDefaults = checkKiloPermissionDefaults(root);
  add("security.kiloPermissionDefaults", kiloPermissionDefaults.status, kiloPermissionDefaults.details);
  const profiles = listFiles(root, ".cn-pilot/perfiles", { extension: ".md" });
  add("profiles.inventory", profiles.problems.length ? "FAIL" : profiles.symlinks.length ? "WARN" : "PASS", { count: profiles.count, symbolicLinks: profiles.symlinks, problems: profiles.problems });
  const templateRoot = listFiles(root, ".cn-pilot/plantillas");
  const templateTotal = listFiles(root, ".cn-pilot/plantillas", { recursive: true });
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
  const distribution = checkDistributionManifest(root);
  add("distribution.manifest", distribution.status, distribution.details);

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
  ["core.version", "Version"], ["core.projectContextVersion", "Project context version"], ["review.outcomes", "Review outcomes"],
  ["core.paths", "Core paths"], ["core.optionalScaffold", "Input scaffold"],
  ["agents.frontmatter", "Agents"], ["skills.frontmatter", "Skills"], ["commands.frontmatter", "Commands"],
  ["agents.noStepCaps", "Agent step caps"],
  ["language.spanishFirst", "Spanish-first role terminology"],
  ["routing.commands", "Command routing"], ["routing.devLead", "Rutas de Jefe de proyecto"], ["permissions.reviewer", "Permisos de Revisor"],
  ["security.devLead", "Seguridad de Jefe de proyecto"], ["security.agentPermissions", "Permisos por owner"], ["security.kiloPermissionDefaults", "Defaults Kilo"],
  ["profiles.inventory", "Profiles"], ["templates.inventory", "Templates"],
  ["references.technicalSeo", "Technical SEO refs"], ["runtime.gitignore", "Runtime isolation"], ["manifest.inventory", "MANIFEST"],
  ["distribution.manifest", "Distribution manifest"],
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
    if (check.id === "core.projectContextVersion" && details.checked === false) suffix = "project-owned; cross-check skipped";
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
