import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runCli, runCoreChecks } from "./core-check.mjs";
import { validateCoreSourceState, validateWorkspaceTarget } from "../agent-evals/prepare.mjs";

function readCoreFile(relativePath) {
  return fs.readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");
}

function normalizeEol(text) {
  return String(text).replace(/\r\n?/g, "\n");
}

function runKiloForPermissionTest(args) {
  if (process.platform === "win32") {
    const command = args.map((value) => `'${String(value).replace(/'/g, "''")}'`).join(" ");
    return spawnSync("powershell.exe", ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", `kilo ${command}`], {
      encoding: "utf8", windowsHide: true, timeout: 30_000, maxBuffer: 4 * 1024 * 1024,
    });
  }
  return spawnSync("kilo", args, { encoding: "utf8", timeout: 30_000, maxBuffer: 4 * 1024 * 1024 });
}

function parseKiloDebugAgent(agentName) {
  const result = runKiloForPermissionTest(["debug", "agent", agentName]);
  assert.equal(result.error, undefined, `Kilo debug agent ${agentName} must start`);
  assert.equal(result.status, 0, `Kilo debug agent ${agentName} must succeed`);
  const start = result.stdout.indexOf("{"); const end = result.stdout.lastIndexOf("}");
  assert.ok(start >= 0 && end > start, `Kilo debug agent ${agentName} returns JSON`);
  return JSON.parse(result.stdout.slice(start, end + 1));
}

function kiloPatternMatches(pattern, target) {
  const normalized = String(pattern).replace(/\\/g, "/");
  const escaped = normalized.split("*").map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp(`^${escaped}$`, process.platform === "win32" ? "i" : "").test(String(target).replace(/\\/g, "/"));
}

function resolveKiloPermission(agent, permission, target) {
  let action = null;
  for (const rule of agent.permission ?? []) {
    if (rule.permission !== "*" && !kiloPatternMatches(rule.permission ?? "", permission)) continue;
    if (kiloPatternMatches(rule.pattern ?? "*", target)) action = rule.action;
  }
  return action;
}

function createFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cn-pilot-core-qa-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (relativePath, content = "") => {
    const target = path.join(root, ...relativePath.split("/"));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, "utf8");
    return target;
  };

  const manifest = [
    "- 6 agentes en `.kilo/agents/`",
    "- 3 skills (`.kilo/skills/*/SKILL.md`)",
    "- 1 documento de referencia bajo `.kilo/skills/technical-seo/references/` (no es una skill adicional)",
    "- 14 comandos en `.kilo/commands/`",
    "- 1 perfil en `.cn-pilot/perfiles/`",
    "- 2 archivos de plantilla en la raíz de `.cn-pilot/plantillas/` y 3 archivos en total bajo `.cn-pilot/plantillas/` (incluye subdirectorios)",
  ].join("\n") + "\n";

  put("PROYECTO.md", "# Project fixture\n");
  put("REQUISITOS.md", "# Requirements fixture\n");
  put("ESTADO.md", "# State fixture\n");
  put("DECISIONES.md", "# Decisions fixture\n");
  put("ARTEFACTOS.md", "# Artifacts fixture\n");
  put("AGENTS.md", "# Minimal test kernel\n");
  put(".cn-pilot-version", "2.8.0\n");
  put(".cn-pilot/NUCLEO.md", "**Versión:** `2.8.0`\n\nLas superficies propias de CN Pilot destinadas a personas usan español por defecto, incluidos los nombres visibles de roles, documentos, comandos y estructuras.\n");
  put(".cn-pilot/MANIFIESTO.md", manifest);
  put(".cn-pilot/config/responsive.json", "{}\n");
  put(".cn-pilot/documentacion/.keep");
  put(".cn-pilot/perfiles/profile.md", "# Perfil de fixture\n");
  put(".cn-pilot/plantillas/root.md", "# Plantilla raíz\n");
  put(".cn-pilot/plantillas/sub/nested.md", "# Plantilla anidada\n");
  put(".cn-pilot/qa/core-check.mjs", "// checker fixture\n");
  put(".cn-pilot/qa/core-check.test.mjs", "// self-test fixture\n");
  put(".cn-pilot/update/updater.mjs", "// updater fixture\n");
  put(".cn-pilot/update/updater.test.mjs", "// updater test fixture\n");
  put(".cn-pilot/update/manifest.json", `${JSON.stringify({
    schemaVersion: 1,
    cnPilotVersion: "2.8.0",
    sourceRepository: "https://github.com/LuisYGM/cn-pilot.git",
    stableBranch: "main",
    sourceCommit: null,
    compatibility: { nodeMin: "20.0.0", kiloMin: "7.8.8" },
    managedFiles: [],
    addedFiles: [],
    removedFiles: [],
    migrations: [],
  })}\n`);
  put("recursos/README.md", "# Input scaffold\n");
  put("kilo.jsonc", readCoreFile("kilo.jsonc"));
  put(".gitignore", "/.cn-pilot/runtime/\n");
  put(".kilo/agents/jefe-proyecto.md", readCoreFile(".kilo/agents/jefe-proyecto.md"));
  put(".kilo/agents/revisor.md", readCoreFile(".kilo/agents/revisor.md"));
  for (const agent of ["arquitecto", "redactor", "disenador", "desarrollador"]) {
    put(`.kilo/agents/${agent}.md`, readCoreFile(`.kilo/agents/${agent}.md`));
  }
  put(".kilo/skills/environment-dependency-management/SKILL.md", readCoreFile(".kilo/skills/environment-dependency-management/SKILL.md"));
  put(".kilo/skills/sample/SKILL.md", "---\nname: sample\ndescription: Skill de fixture\n---\n# Sample\n");
  put(".kilo/skills/technical-seo/SKILL.md", "---\nname: technical-seo\ndescription: Skill SEO de fixture\n---\n# SEO\n");
  put(".kilo/skills/technical-seo/references/audit.md", "# Referencia\n");
  for (const command of ["nuevo-proyecto", "cn-estado", "cn-actualizar", "diseno", "contenido", "revision", "entrega", "diagnostico", "depurar", "desplegar-pruebas", "preparar-despliegue", "punto-control", "plan", "commit"]) {
    put(`.kilo/commands/${command}.md`, `---\ndescription: Comando ${command}\nagent: jefe-proyecto\n---\n# ${command}\n`);
  }
  put(".kilo/commands/revision.md", "---\ndescription: Comando de revisión\nagent: jefe-proyecto\n---\n# Revisión\n\nFinaliza con APPROVED, APPROVED WITH NOTES, CHANGES REQUIRED o BLOCKED y detente.\n");
  put(".cn-pilot/plantillas/informe-revision.md", "# Informe de revisión\n\n## Resultado\nAPPROVED / APPROVED WITH NOTES / CHANGES REQUIRED / BLOCKED\n");
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
  assert.equal(report.version, "2.8.0");
   assert.equal(getCheck(report, "agents.frontmatter").details.count, 6);
   assert.equal(getCheck(report, "skills.frontmatter").details.count, 3);
  assert.equal(getCheck(report, "commands.frontmatter").details.count, 14);
  assert.equal(getCheck(report, "templates.inventory").details.rootFiles, 2);
  assert.equal(getCheck(report, "templates.inventory").details.totalFiles, 3);
});

test("missing resources README remains exactly the documented optional-scaffold WARN", (t) => {
  const fixture = createFixture(t);
  fs.rmSync(path.join(fixture.root, "recursos/README.md"));
  const report = runCoreChecks({ rootDir: fixture.root });
  const optional = getCheck(report, "core.optionalScaffold");
  assert.equal(report.status, "WARN", "the overall Core QA state remains WARN");
  assert.equal(optional.status, "WARN");
  assert.deepEqual(optional.details, {
    path: "recursos/README.md",
    note: "Expected input scaffold; not required to run Core",
    code: "ENOENT",
  });
  assert.deepEqual(report.findings, [{
    id: "core.optionalScaffold",
    status: "WARN",
    path: "recursos/README.md",
    note: "Expected input scaffold; not required to run Core",
    code: "ENOENT",
  }]);
});

test("Core Project Context version is checked only for the canonical distribution, not derived projects", (t) => {
  const canonical = createFixture(t);
  canonical.put(".git/config", '[remote "origin"]\n\turl = https://github.com/LuisYGM/CN-Pilot.git\n');
  canonical.put("README.md", "# CN Pilot\n\n[Repositorio](https://github.com/LuisYGM/cn-pilot)\n");
  canonical.put("PROYECTO.md", [
    "# Proyecto",
    "- **Nombre:** Pending",
    "- **Repositorio o carpeta:** Pending",
    "- **Versión de CN Pilot Core:** 2.8.0",
  ].join("\n") + "\n");
  let report = runCoreChecks({ rootDir: canonical.root });
  let check = getCheck(report, "core.projectContextVersion");
  assert.equal(check.status, "PASS");
  assert.equal(check.details.checked, true);
  assert.equal(check.details.contextVersion, "2.8.0");

  canonical.put("PROYECTO.md", "# Proyecto\n- **Nombre:** Pending\n- **Repositorio o carpeta:** Pending\n- **Versión de CN Pilot Core:** 2.7.9\n");
  report = runCoreChecks({ rootDir: canonical.root });
  check = getCheck(report, "core.projectContextVersion");
  assert.equal(check.status, "FAIL");
  assert.equal(check.details.code, "CORE_PROJECT_VERSION_MISMATCH");

  const derived = createFixture(t);
  derived.put(".git/config", '[remote "origin"]\n\turl = https://github.com/example/TailorDoc.git\n');
  derived.put("README.md", "# CN Pilot\n\n[Repositorio](https://github.com/LuisYGM/cn-pilot)\n");
  derived.put("PROYECTO.md", "# Proyecto\n- **Nombre:** Pending\n- **Repositorio o carpeta:** Pending\n- **Versión de CN Pilot Core:** 2.7.9\n");
  report = runCoreChecks({ rootDir: derived.root });
  check = getCheck(report, "core.projectContextVersion");
  assert.equal(check.status, "PASS");
  assert.equal(check.details.checked, false);
  assert.equal(report.status, "PASS", JSON.stringify(report.findings));
});

test("revision command and report template expose the same complete outcome set", (t) => {
  const fixture = createFixture(t);
  const expected = ["APPROVED", "APPROVED WITH NOTES", "BLOCKED", "CHANGES REQUIRED"];
  let check = getCheck(runCoreChecks({ rootDir: fixture.root }), "review.outcomes");
  assert.equal(check.status, "PASS");
  assert.deepEqual(check.details.commandOutcomes, expected);
  assert.deepEqual(check.details.templateOutcomes, expected);

  fixture.put(".cn-pilot/plantillas/informe-revision.md", "# Review\n\n## Resultado\nAPPROVED / APPROVED WITH NOTES / CHANGES REQUIRED\n");
  check = getCheck(runCoreChecks({ rootDir: fixture.root }), "review.outcomes");
  assert.equal(check.status, "FAIL");
  assert.deepEqual(check.details.missingFromTemplate, ["BLOCKED"]);

  fixture.put(".kilo/commands/revision.md", "---\ndescription: Review\nagent: jefe-proyecto\n---\n# Review\nFinaliza con APPROVED, APPROVED WITH NOTES o CHANGES REQUIRED y detente.\n");
  check = getCheck(runCoreChecks({ rootDir: fixture.root }), "review.outcomes");
  assert.equal(check.status, "FAIL");
  assert.deepEqual(check.details.missingFromCommand, ["BLOCKED"]);
});

test("review handoff preflight attaches usable evidence, recovers BLOCKED narrowly, and skips DIRECT overhead", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const command = read(".kilo/commands/revision.md");
  const lead = read(".kilo/agents/jefe-proyecto.md");
  const reviewer = read(".kilo/agents/revisor.md");
  const core = read(".cn-pilot/NUCLEO.md");
  const preflight = command.slice(command.indexOf("1. Preflight"), command.indexOf("11. No implementes"));

  // A: real diff + paths + acceptance + available results must be attached in the task body.
  assert.match(preflight, /diff real relevante[\s\S]*?archivos afectados[\s\S]*?acceptance relacionado[\s\S]*?resultados PASS/i);
  assert.match(preflight, /realmente incluidos en el cuerpo[\s\S]*?pega el diff\/hunks[\s\S]*?no solo ruta/i);
  assert.match(reviewer, /ruta o nombre de un diff no constituye diff adjunto/i);
  assert.match(preflight, /Si no hay diff de código, adjunta fragmento\/evidencia del artefacto/i);

  // B: missing evidence is caught before delegation and recovered by the coordinator if possible.
  assert.match(preflight, /No invoques Revisor hasta que el preflight sea suficiente/i);
  assert.match(preflight, /recupéralo mediante Git o lectura directa[\s\S]*?no preguntes a la persona/i);
  assert.match(lead, /Antes de invocar Revisor[\s\S]*?Paths solos no cuentan como diff adjunto/i);

  // C/D: unblock only the missing piece and retain prior PASS/diff for incremental review.
  assert.match(preflight, /Reutiliza evidencia.*si objetivo y fuente\/superficies.*no cambiaron/i);
  assert.match(preflight, /Si Revisor queda BLOCKED[\s\S]*?resuelve solo el hueco indicado[\s\S]*?no reinicies investigación\/tests\/revisión/i);
  assert.match(preflight, /Tras correcciones adjunta diff incremental real/i);
  assert.match(core, /Si Revisor devuelve `BLOCKED`[\s\S]*?reenvía únicamente el scope aún no revisado/i);

  // E: DIRECT work does not acquire handoff/review artifacts without a material trigger.
  assert.match(core, /DIRECT localizado no crea paquete de revisión ni delegación sin trigger/i);
  assert.match(lead, /Revisor independiente solo cuando riesgo\/acceptance lo justifique/i);

  // These are static source-contract checks, not an end-to-end Kilo behavior evaluation.
  assert.match(command, /No invoques Revisor hasta que el preflight sea suficiente/i);
});

test("upstream GitHub Actions workflow is restricted, compatible, and runs the local QA commands", (t) => {
  const workflowPath = new URL("../../.github/workflows/core-qa.yml", import.meta.url);
  if (!fs.existsSync(workflowPath)) {
    t.skip("The upstream-only workflow is intentionally outside the updater's managed roots.");
    return;
  }
  const workflow = fs.readFileSync(workflowPath, "utf8");
  assert.doesNotMatch(workflow, /\t/, "YAML indentation uses spaces");
  assert.match(workflow, /^name: Core QA$/m);
  assert.match(workflow, /^on:\r?\n  push:\r?\n    branches:\r?\n      - main\r?\n  pull_request:\r?\n    branches:\r?\n      - main$/m);
  assert.match(workflow, /^permissions:\r?\n  contents: read$/m);
  assert.doesNotMatch(workflow, /:\s*write\b/i, "workflow has no write permissions");
  assert.match(workflow, /uses: actions\/checkout@v4/);
  assert.match(workflow, /uses: actions\/setup-node@v4/);
  assert.match(workflow, /node-version:\s*22\b/);
  assert.match(workflow, /run: node \.cn-pilot\/qa\/core-check\.mjs/);
  assert.match(workflow, /run: node --test \.cn-pilot\/qa\/core-check\.test\.mjs \.cn-pilot\/update\/updater\.test\.mjs \.cn-pilot\/qa\/multidisciplinary\.test\.mjs/);
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

test("numeric steps in an active CN Pilot agent fails the explicit cap guard", (t) => {
  const fixture = createFixture(t);
  const agent = ".kilo/agents/desarrollador.md";
  fixture.put(agent, "---\ndescription: Agente de fixture\nmode: subagent\nsteps: 25\n---\n# Active agent\n");
  const check = getCheck(runCoreChecks({ rootDir: fixture.root }), "agents.noStepCaps");
  assert.equal(check.status, "FAIL");
  assert.deepEqual(check.details.findings, [{ path: agent, code: "EXPLICIT_AGENT_STEP_CAP" }]);
  assert.match(check.details.reason, /outcome\/gates\/bloqueo real/);
});

test("step-cap history outside active agents does not trigger the guard", (t) => {
  const fixture = createFixture(t);
  fixture.put(".cn-pilot/CAMBIOS.md", "Historical sample: steps: 25\n");
  fixture.put(".cn-pilot/qa/fixtures/agent-example.md", "steps: 25\n");
  assert.equal(getCheck(runCoreChecks({ rootDir: fixture.root }), "agents.noStepCaps").status, "PASS");
});

test("legacy CN Pilot role names fail only in active human-facing files", (t) => {
  const fixture = createFixture(t);
  fixture.put(".kilo/commands/diagnostico.md", "---\ndescription: Fixture\nagent: jefe-proyecto\n---\nDev Lead coordina la revisión.\n");
  fixture.put(".cn-pilot/CAMBIOS.md", "Historial: Dev Lead y Reviewer eran nombres antiguos.\n");
  fixture.put(".cn-pilot/qa/fixtures/legacy.md", "Fixture histórico: Architect y Developer.\n");
  const check = getCheck(runCoreChecks({ rootDir: fixture.root }), "language.spanishFirst");
  assert.equal(check.status, "FAIL");
  assert.deepEqual(check.details.findings, [{ path: ".kilo/commands/diagnostico.md", code: "LEGACY_ROLE_NAME", value: "Dev Lead" }]);
});

test("retired agent identifiers are rejected in active routing but allowed in migration guidance", (t) => {
  const fixture = createFixture(t);
  fixture.put(".kilo/commands/diagnostico.md", "---\ndescription: Fixture\nagent: jefe-proyecto\n---\nRutea a maquetador-frontend.\n");
  fixture.put(".cn-pilot/documentacion/CONFIGURACION-KILO.md", "Migración: maquetador-frontend → desarrollador.\n");
  let check = getCheck(runCoreChecks({ rootDir: fixture.root }), "core.legacyReferences");
  assert.equal(check.status, "FAIL");
  assert.deepEqual(check.details.files, [".kilo/commands/diagnostico.md"]);

  fixture.put(".kilo/commands/diagnostico.md", "---\ndescription: Fixture\nagent: jefe-proyecto\n---\nRutea a desarrollador.\n");
  check = getCheck(runCoreChecks({ rootDir: fixture.root }), "core.legacyReferences");
  assert.equal(check.status, "PASS", "the documented migration map is not treated as an active route");
});

test("Spanish-first doctrine is required and generic technical wording is not translated", (t) => {
  const fixture = createFixture(t);
  fixture.put(".kilo/skills/sample/SKILL.md", "---\nname: sample\ndescription: Skill de fixture\n---\nEl developer experience no equivale a un rol; frontend development sigue siendo término genérico.\n");
  fixture.put(".kilo/skills/technical-seo/references/audit.md", "Cita externa de ejemplo: Developer.\n");
  assert.equal(getCheck(runCoreChecks({ rootDir: fixture.root }), "language.spanishFirst").status, "PASS");

  fixture.put(".cn-pilot/NUCLEO.md", "**Versión:** `2.8.0`\n\nLa estructura técnica permanece en inglés: archivos, carpetas, agentes.\n");
  const check = getCheck(runCoreChecks({ rootDir: fixture.root }), "language.spanishFirst");
  assert.equal(check.status, "FAIL");
  assert.ok(check.details.findings.some((finding) => finding.code === "SPANISH_FIRST_DOCTRINE_MISSING_OR_CONTRADICTORY"));
});

test("Guided Project Journey contains the required behavioral scenarios A-K", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const command = read(".kilo/commands/nuevo-proyecto.md");
  const interaction = read(".cn-pilot/documentacion/INTERACCION-HUMANA.md");
  const core = read(".cn-pilot/NUCLEO.md");
  const lead = read(".kilo/agents/jefe-proyecto.md");
  const start = read(".cn-pilot/documentacion/EMPIEZA-AQUI.md");
  const scenarios = [
    ["A Greenfield simple", command, "¿Qué te gustaría lograr con este proyecto?"],
    ["B material existente", command, "no vuelvas a preguntar lo que esos materiales resuelven"],
    ["C skip se acepta", interaction, "«SEO después»"],
    ["C skip no bloqueante", interaction, "continúa si no hay una dependencia material"],
    ["D Decide tú", command, "«Decide tú»"],
    ["E gate humano real", interaction, "decisión comercial/visual propia de la persona"],
    ["E gate de revisión visual existente", core, "Human Visual Review"],
    ["F continuación ya autorizada", command, "continúa sin preguntar «¿quieres que siga?»"],
    ["G Existing microchange", start, "Un cambio pequeño puede ir directamente a inspección, corrección y prueba"],
    ["H SaaS sin marketing web impuesto", core, "app/SaaS"],
    ["H SaaS no recibe SEO de marketing por defecto", command, "no un sitemap de marketing o SEO por defecto"],
    ["I absence is normal and a checkpoint is scope-checked", command, "Su ausencia es normal"],
    ["J Pending no material", command, "«Pending» si el dato no bloquea el próximo trabajo útil"],
    ["K checkpoint + tarea distinta", lead, "Para un encargo nuevo distinto, pregunta brevemente si se continúa o se deja en pausa"],
    ["Next best step tras milestone", command, "dónde está el proyecto y cuál es el siguiente mejor paso"],
  ];
  for (const [scenario, source, required] of scenarios) assert.ok(source.includes(required), `${scenario}: guidance is present`);
});

test("BF-062 supports controlled parallel modes, keeps single-writer isolation and limits", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const lead = fs.readFileSync(new URL("../../.kilo/agents/jefe-proyecto.md", import.meta.url), "utf8");
  const start = core.indexOf("### Orquestación paralela segura / Single Writer per Worktree (BF-062)");
  const end = core.indexOf("\n## Riesgo", start);
  assert.ok(start >= 0 && end > start, "BF-062 section remains present and bounded");
  const policy = core.slice(start, end);
  const scenarios = [
    ["A independent units", policy, "dos o más unidades útiles, independientes"],
    ["B dependencies stay serial", policy, "La duda material, el riesgo o la falta de beneficio suficiente implican SERIAL"],
    ["C no same-file writers", policy, "No asignes el mismo archivo ni superficie lógica a writers diferentes"],
    ["C lockfiles/config remain shared surfaces", policy, "`package.json`/lockfiles"],
    ["D stabilize shared contracts", policy, "Estabiliza interfaces y decisiones compartidas antes de dividir"],
    ["D shared CSS/tokens/global styles are a single-writer surface", policy, "CSS/tokens y lockfiles como una sola superficie exclusiva"],
    ["D shared system changes stay serial while derived pages can consume stable sources in parallel", core, "páginas derivadas independientes que solo la consumen"],
    ["D a derived page needing a shared-system change reports and serializes the dependency", core, "Si una página necesita cambiar el sistema compartido, reporta la dependencia y serializa/reasigna"],
    ["D unresolved shared contracts stay serial", policy, "contrato compartido abierto"],
    ["E safe read-only parallel", policy, "PARALLEL READ-ONLY"],
    ["F native worktree isolation", policy, "PARALLEL WORKTREES"],
    ["Agent Manager primary-only selection stays capability-grounded", policy, "a agentes `primary`/`all`"],
    ["F serial fallback", policy, "continúa en SERIAL sin bloquear el proyecto"],
    ["parallel content requires stable page intent", policy, "page intent/contrato está suficientemente definido"],
    ["design approval stays a prerequisite", policy, "Diseño visual material no se implementa en paralelo antes del gate/aprobación vigente"],
    ["G preserve dirty worktree", lead, "Conserva cualquier worktree dirty/no reconciliado"],
    ["H isolated blocker does not cancel peers", policy, "no cancela automáticamente unidades independientes"],
    ["I sequential integration", policy, "una unidad a la vez"],
    ["J recovery reconciles real sessions", policy, "`git worktree list`"],
    ["J does not recreate existing worktree", policy, "no recrees un worktree/sesión que ya existe"],
    ["K Project Context remains single-writer", policy, "Especialistas no escriben `PROYECTO.md`"],
    ["L Revisor remains read-only", policy, "Revisor permanece read-only"],
    ["M concurrency limits stay conservative", policy, "dos unidades por defecto"],
    ["M explicit maximum is three", policy, "tres como máximo"],
  ];
  for (const [scenario, source, required] of scenarios) assert.ok(source.includes(required), `${scenario}: contract is present`);
  assert.doesNotMatch(`${core}\n${lead}`, /máximo \*\*un subagente de proyecto activo\*\*|una sola sesión subagent activa en total|worktrees no habilitan paralelismo por default/i);
  assert.ok(lead.includes("Agent Manager en modo `worktree`"));
  assert.ok(lead.includes("Jefe de proyecto es owner de integración"));
});

test("BF-047 keeps legacy serial checkpoints valid with optional parallel recovery", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const globalRecovery = core.slice(core.indexOf("Las tareas `STRUCTURAL`/largas mantienen un único checkpoint"), core.indexOf("### No-op / Silent Closure"));
  const parallelStart = core.indexOf("BF-047 conserva **un único**");
  const parallelRecovery = core.slice(parallelStart, core.indexOf("\n## Riesgo", parallelStart));
  assert.match(globalRecovery, /schemaVersion: 1/);
  assert.match(globalRecovery, /`status`, `objective` y `nextAction`/);
  assert.match(parallelRecovery, /campo opcional `parallelUnits`/);
  assert.match(parallelRecovery, /checkpoint serial válido 2\.2 sin `parallelUnits` sigue siendo válido/);
  for (const status of ["PLANNED", "ACTIVE", "BLOCKED_HUMAN", "BLOCKED_EXTERNAL", "FAILED", "READY_TO_INTEGRATE", "INTEGRATED"])
    assert.ok(parallelRecovery.includes(status), `parallel unit status ${status} is documented`);
  assert.match(parallelRecovery, /worktreeID.*worktreePath.*branch.*baseBranch.*baseHEAD.*sessionID.*resultCommit/s);
});

test("adaptive SDD contracts preserve DIRECT speed and require structural convergence evidence", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const kernel = read("AGENTS.md");
  const lifecycle = read(".cn-pilot/documentacion/CICLO-DE-VIDA.md");
  const template = read(".cn-pilot/plantillas/especificacion-funcionalidad.md");
  const plan = read(".kilo/commands/plan.md");
  const architecture = read(".kilo/agents/arquitecto.md");
  const developer = read(".kilo/agents/desarrollador.md");
  const lead = read(".kilo/agents/jefe-proyecto.md");
  const reviewer = read(".kilo/agents/revisor.md");
  const strategy = read(".kilo/skills/testing-strategy/SKILL.md");

  assert.match(core, /\*\*DIRECT\*\*[\s\S]*?no exige spec, IDs, matriz ni plan formal/i);
  assert.match(core, /\*\*TASK\*\*[\s\S]*?No crea documentos ni IDs/i);
  assert.match(core, /### STRUCTURAL[\s\S]*?Identificadores estables `REQ-nnn`, `AC-nnn`, `TASK-nnn`, `TEST-nnn` son opcionales/i);
  assert.match(core, /requisito incluido[\s\S]*?criterio[\s\S]*?unidad de implementación[\s\S]*?evidencia adecuada/i);
  assert.match(core, /No declares `Done`[\s\S]*?Un resultado compilable por sí solo no acredita aceptación/i);
  assert.match(core, /no reabras\/replanifiques sin cambio de fuente[\s\S]*?petición explícita/i);
  assert.match(kernel, /`DIRECT` requiere comprobación focal y no documentos\/IDs; `TASK` define acceptance[\s\S]*?reconciliación de requisitos\/unidades\/evidencias/i);
  assert.match(lifecycle, /tres escalas de trabajo/i);
  assert.match(template, /Trazabilidad de implementación \(opcional; para STRUCTURAL cuando reduzca ambigüedad\)/);
  assert.match(template, /cada criterio incluido debe tener evidencia suficiente o estado BLOCKED/i);
  assert.match(plan, /DIRECT mantiene cambio\/verificación focal sin spec, IDs ni artefactos/i);
  assert.match(plan, /requisitos incluidos → acceptance → unidades esenciales → evidencia\/estado/i);
  assert.match(architecture, /unidades esenciales y qué criterios demuestran[\s\S]*?no exijas estructura formal para DIRECT\/TASK acotado/i);
  assert.match(developer, /relaciona los criterios asignados con el resultado implementado y evidencia real[\s\S]*?no como completados/i);
  assert.match(lead, /reconcilia al cierre requisitos incluidos, criterios, unidades esenciales, evidencia y estados/i);
  assert.match(reviewer, /requisitos incluidos y criterios relevantes tienen resultado verificable[\s\S]*?OUT OF SCOPE/i);
  assert.match(strategy, /mapa compacto[\s\S]*?requisitos incluidos → acceptance → unidad\/owner → evidencia adecuada → estado/i);
  assert.match(strategy, /contrato del Core son estáticas y no demuestran que un agente siga siempre bien el proceso/i);
});

test("009A adapts visual ownership, delivery and approval to project context", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const creative = read(".kilo/skills/creative-web-experience/SKILL.md");
  const designer = read(".kilo/agents/disenador.md");
  const projectLead = read(".kilo/agents/jefe-proyecto.md");
  const system = read(".kilo/skills/ui-design-system/SKILL.md");
  const kit = read(".kilo/skills/ui-kit-construction/SKILL.md");
  const media = read(".kilo/skills/visual-art-direction/SKILL.md");
  const page = read(".kilo/skills/page-composition/SKILL.md");
  const application = read(".kilo/skills/application-ui/SKILL.md");
  const frontend = read(".kilo/skills/frontend-architecture/SKILL.md");
  const pipelineStart = core.indexOf("### Visual Pipeline 2.0 / Creative Web Experience (BF-066)");
  const pipelineEnd = core.indexOf("\n### Visual Quality Floor de Public Web (BF-068)", pipelineStart);
  assert.ok(pipelineStart >= 0 && pipelineEnd > pipelineStart, "canonical pipeline is scoped in Core");
  const pipeline = core.slice(pipelineStart, pipelineEnd);
  const scenarios = [
    ["A public web direction trigger is scoped", pipeline, "Aplica solo a public web Greenfield/rediseño visual material con libertad creativa abierta"],
    ["A adaptive route is not universal", pipeline, "No es una secuencia universal"],
    ["A existing audit/content/decisions are reused", pipeline, "contenido/auditoría/identidad/diseño aprobado existentes se consumen sin repetir decisiones"],
    ["B approved copy stays authoritative", pipeline, "contenido aprobado gobierna la composición y no se reescribe"],
    ["C provisional copy is coherent and non-factual", pipeline, "contenido provisional coherente para evaluar jerarquía y recorrido"],
    ["C no invented commercial proof", pipeline, "ni inventar clientes, resultados, premios, cifras, testimonios o trabajos reales"],
    ["D user assets and authority are inspected first", pipeline, "inspecciona primero el índice/brief/recursos suministrados"],
    ["D fonts are researched through real copy and role samples", creative, "renderizando el idioma y copy del proyecto"],
    ["D media research precedes dependent composition", pipeline, "medios visuales materiales se seleccionan antes de cerrar las composiciones dependientes"],
    ["D functional SVG icon family is a professional default", media, "elige por defecto una sola familia profesional SVG"],
    ["E designer owns visual system", system, "El Diseñador responde por su criterio y entrega"],
    ["E the single Developer translates approved visual system", pipeline, "Desarrollador los traduce a tokens, variables y componentes del stack"],
    ["F relevant component states are specified", kit, "Muestra solo variantes/tamaños usados o aprobados"],
    ["G page composition starts from section purpose/content", page, "propósito/contenido; protagonista y jerarquía"],
    ["H approved implementation preserves fidelity", frontend, "Desarrollador implementa el resultado, no lo rediseña"],
    ["H no automatic aesthetic loops", creative, "no se delega a Jefe, Desarrollador, Revisor ni a un ciclo automático de evaluación estética"],
    ["I human makes the aesthetic decision", pipeline, "esta aprobación humana decide aceptar, rechazar o solicitar cambios"],
    ["I prototype self-check is functional/resource-focused", pipeline, "autocontrol focal en Browser del funcionamiento/interacciones previstas, carga de recursos y defectos evidentes"],
    ["I post-approval QA remains technical and owner-specific", core, "Tras aprobación, QA técnico de Desarrollador/Revisor verifica sus superficies y evidencia"],
    ["I post-approval QA covers required technical surfaces", core, "código, comportamiento, responsive, accesibilidad, rendimiento y fidelidad"],
    ["J Application UI does not get marketing pipeline", application, "no páginas de marketing"],
    ["J Existing/Approved keep fast paths", pipeline, "no genera exploración artificial"],
  ];
  for (const [scenario, source, required] of scenarios) assert.ok(source.includes(required), `${scenario}: contract is present`);
  assert.ok(projectLead.includes("Jefe reconcilia scope, autoridad, handoff y gates humanos; no evalúa gusto"), "project lead coordinates but does not judge creative taste");
  assert.ok(designer.includes("No hay gate intermedio de Creative Review"), "designer presents one final human approval candidate");
});

test("creative options and synthesis are not mandatory approval phases", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const creative = fs.readFileSync(new URL("../../.kilo/skills/creative-web-experience/SKILL.md", import.meta.url), "utf8");
  const coreStart = core.indexOf("### Visual Pipeline 2.0 / Creative Web Experience (BF-066)");
  const coreEnd = core.indexOf("\n### Visual Quality Floor de Public Web (BF-068)", coreStart);
  const policy = core.slice(coreStart, coreEnd);
  assert.match(policy, /Flujo orientativo[ -\s\S]*No es una secuencia universal/);
  assert.match(creative, /solo si la persona solicita comparar direcciones o existe una decisión material genuinamente abierta/);
  assert.ok(creative.includes("no añadas otra aprobación humana de “Creative Review” antes del paquete final"));
  assert.match(creative, /si el Diseñador resolvió una sola dirección, no inventes una fase de Synthesis/);
  assert.doesNotMatch(policy, /Human Creative Review/);
  assert.doesNotMatch(creative, /Creative Opportunity Question|Creative Refinement Pass|Genericity Risk/);
});

test("BF-068 Public Web Visual Quality Floor covers requirements A-S", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const kit = read(".kilo/skills/ui-kit-construction/SKILL.md");
  const motion = read(".kilo/skills/motion-interaction/SKILL.md");
  const media = read(".kilo/skills/visual-art-direction/SKILL.md");
  const creative = read(".kilo/skills/creative-web-experience/SKILL.md");
  const designer = read(".kilo/agents/disenador.md");
  const reviewer = read(".kilo/agents/revisor.md");
  const floorStart = core.indexOf("### Visual Quality Floor de Public Web (BF-068)");
  const floorEnd = core.indexOf("\n## Arquitectura frontend y fidelidad (BF-069)", floorStart);
  assert.ok(floorStart >= 0 && floorEnd > floorStart, "the Quality Floor is scoped to public web and distinct from the visual pipeline");
  const floor = core.slice(floorStart, floorEnd);
  const scenarios = [
    ["A Header and Mobile Header specimens", kit, "Header + Mobile Header"],
    ["B real representative Footer", kit, "Footer"],
    ["B Footer does not invent business facts", kit, "No inventes contacto, horarios, redes"],
    ["C Application UI and non-marketing scopes retain their fast paths", floor, "No se impone universalmente a Application UI, Existing localized, páginas derivadas de un sistema aprobado ni referencias Approved/Strict"],
    ["D default public-web Motion System", floor, "Motion obligatorio para Public Web abierta"],
    ["D the UI Kit presents Motion System specimens", kit, "**Motion System:**"],
    ["E exceptions are explicit, scoped, and resolved", floor, "La excepción a un requisito solo aplica dentro del alcance de un opt-out explícito, authority incompatible o constraint material confirmado y resuelto por Jefe"],
    ["F Hero choreography", floor, "hero/page choreography diseñada"],
    ["G material post-Hero scroll progression", floor, "progresión scroll-linked material posterior al Hero en la página principal"],
    ["G a generic opacity/translate system alone does not pass", floor, "Un sistema consistente solo de `opacity/translateY/stagger`"],
    ["G repeated fade-up and stagger alone do not pass", floor, "`fade-up + stagger` repetido no basta"],
    ["H reduced motion", motion, "`prefers-reduced-motion`"],
    ["I client media has priority", media, "Inspecciona lo existente antes de proponer sustitución"],
    ["J no empty high-fidelity slots", media, "no se deja como caja gris"],
    ["J material unresolved media is not final", media, "declara que esa parte aún no puede considerarse final"],
    ["K intentional no-photo direction is valid", media, "Un «sin fotografía» intencional es una solución, no un placeholder"],
    ["L stock is not represented as project reality", media, "No infieras que una foto externa corresponde"],
    ["M asset research returns concrete candidates when chosen", media, "produce candidatos concretos"],
    ["N one project-compatible SVG icon family is the default when needed", kit, "una sola familia profesional SVG de iconos funcionales compatible con la identidad/UI"],
    ["N no mixing packs", kit, "No mezcles packs"],
    ["O icon libraries are verified candidates, not a catalog obligation", media, "no una obligación de catálogo ni una preferencia universal"],
    ["O icon license does not grant trademark rights", media, "una licencia permisiva no elimina trademark/uso de marca"],
    ["O artwork SVG remains permitted", kit, "custom SVG se reserva para artwork/identidad"],
    ["P Quality Floor permits a deliberately sober direction", media, "Sobriedad deliberada es un resultado válido"],
    ["P anti-template swap test is present", creative, "si cambian logo/copy/fotos, ¿la propuesta se vendería casi intacta a otro sector?"],
    ["Q Flagship demonstrates approved sequences when material", motion, "El prototipo/Flagship demuestra el behavior definido por estado"],
    ["R Revisor independently checks the canonical BF-068 contract", reviewer, "aplica read-only la aceptación normativa de `.cn-pilot/NUCLEO.md` → “Visual Quality Floor de Public Web (BF-068)”"],
    ["S Designer remains the Quality Floor owner", floor, "Diseñador es owner del Quality Floor"],
    ["S Core BF-068 remains the single public-web floor", designer, "usa BF-068 como el único contrato del floor Public Web"],
  ];
  for (const [scenario, source, required] of scenarios) assert.ok(source.includes(required), `${scenario}: contract is present`);
});

test("BF-069 Frontend Architecture/Fidelity and Composition Diversity contracts A-X", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const start = core.indexOf("## Arquitectura frontend y fidelidad (BF-069)");
  const end = core.indexOf("## Flujo visual de alta fidelidad", start);
  assert.ok(start >= 0 && end > start, "Core's BF-069 source is present and bounded");
  const contract = core.slice(start, end);
  const architecture = read(".kilo/skills/frontend-architecture/SKILL.md");
  const page = read(".kilo/skills/page-composition/SKILL.md");
  const responsive = read(".kilo/skills/frontend-responsive/SKILL.md");
  const developerAgent = read(".kilo/agents/desarrollador.md");
  const scenarios = [
    ["A adaptable base grammar", contract, "Section / región semántica y visual\n→ Container / ancho útil\n  → Column o layout block"],
    ["B column and extra wrappers are optional", architecture, "una `column`/`block` relaciona"],
    ["C complex composition may extend the base", architecture, "full-bleed, sticky, overlap"],
    ["D no fixed global container width", contract, "no un max-width universal"],
    ["E Section and Container have different responsibilities", contract, "fondo/spacing exterior propio"],
    ["F columns/blocks own local grouping", architecture, "contenido, media y acciones con Grid/Flex según el layout"],
    ["G shared styles use the native stack", architecture, "no se exige llamarla `system.css`"],
    ["H page-specific CSS consumes the shared source", architecture, "los estilos específicos de página consumen esa fuente"],
    ["I editable CSS source stays readable", architecture, "CSS fuente legible, indentado"],
    ["J generated output does not replace source", architecture, "La minificación, si existe, es output del pipeline existente"],
    ["K representational media defaults to a semantic image", architecture, "prefiere `<img>`/`<picture>`"],
    ["L native semantics and heading order are retained", architecture, "Mantén la jerarquía de headings por estructura del documento"],
    ["M fidelity follows approved Flagship/system", architecture, "La Flagship/UI Kit visualmente aprobado"],
    ["N Existing and Approved/Strict fast paths remain", architecture, "Existing conserva source architecture"],
    ["N one Developer owns frontend and backend implementation", developerAgent, "No delegates implementación de UI a otro agent"],
    ["O Application UI does not inherit marketing layout", architecture, "Application UI sigue su shell/datos/roles propios"],
    ["P page composition remains content-driven", page, "qué forma lo comunica mejor"],
    ["Section numbers are optional, not decorative position markers", page, "La numeración de secciones y los eyebrows/antetítulos son recursos opcionales"],
    ["Numbering has a real sequence or editorial function", page, "comunican pasos, cronología, ranking, capítulos"],
    ["Eyebrows and headings are not a universal section formula", page, "no exijas uno por sección", "no repitas la estructura `eyebrow → heading grande → párrafo` como fórmula universal"],
    ["Approved/Strict preserves explicitly authorized section labels", page, "En Approved/Strict o Existing, conserva la numeración y etiquetas explícitas"],
    ["Q varied modules are options, not checklist", architecture, "Patrones disponibles (no checklist)"],
    ["Q two-column layouts remain valid when content warrants", architecture, "split y cards sirven cuando son claros"],
    ["Q no required carousel/tabs/accordion inventory", architecture, "No añadas sliders/tabs/accordions"],
    ["R CSS named system file is not mandatory", contract, "no la nombres `system.css` por obligación"],
    ["S material design drift is escalated", architecture, "escala a Jefe de proyecto para resolver la dependencia/approval"],
    ["T consolidation preserves approved output", architecture, "sin cambiar apariencia ni behavior aprobados"],
    ["U consolidation is scoped, not a general refactor", architecture, "No es permiso para refactor general"],
    ["U consolidated styles receive only focal retest", architecture, "Reprueba solo superficies afectadas"],
    ["V Parallel page work stabilizes shared sources", core, "Estabiliza interfaces y decisiones compartidas antes de dividir"],
    ["W responsive keeps Existing breakpoints", responsive, "Existing conserva los breakpoints implementados como source of truth"],
    ["W greenfield responsive uses its source config", responsive, "usa `.cn-pilot/config/responsive.json`"],
    ["W responsive source review does not mask transform overflow", responsive, "Revisa el efecto combinado de transforms/posicionamiento"],
    ["X exact section/container/column DOM is not mandatory", contract, "no es un árbol DOM obligatorio"],
    ["X this is conceptual architecture, not literal DOM recipe", architecture, "no una jerarquía DOM o un set de clases obligatorio"],
  ];
  assert.equal(normalizeEol("a\nb\r\nc\rd"), "a\nb\nc\nd", "LF, CRLF, and mixed EOL normalize identically");
  for (const [scenario, source, required] of scenarios) {
    assert.ok(normalizeEol(source).includes(normalizeEol(required)), `${scenario}: contract is present`);
  }
  assert.doesNotMatch(architecture, /max-width\s*:\s*1400px/i, "architecture must not fix a universal container width");
  assert.doesNotMatch(architecture, /`system\.css` es obligatorio/i, "the shared stylesheet name remains stack-native");
});

test("BF-069 Frontend Media Strategy preserves semantics, performance, fidelity and fast paths", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const coreStart = core.indexOf("## Arquitectura frontend y fidelidad (BF-069)");
  const coreEnd = core.indexOf("## Flujo visual de alta fidelidad", coreStart);
  const mediaContract = core.slice(coreStart, coreEnd);
  const architecture = read(".kilo/skills/frontend-architecture/SKILL.md");
  const responsive = read(".kilo/skills/frontend-responsive/SKILL.md");
  const developerAgent = read(".kilo/agents/desarrollador.md");
  const parity = read(".kilo/skills/visual-parity-review/SKILL.md");
  const media = `${mediaContract}\n${architecture}\n${responsive}\n${developerAgent}\n${parity}`;

  const scenarios = [
    ["representational media defaults to semantic image", /media representacional[\s\S]{0,180}prefiere `<img>`/i],
    ["CSS backgrounds remain valid for real decoration", /background-image` sigue siendo válido/i],
    ["background-like content may remain a real positioned image", /imagen representacional[\s\S]{0,160}elemento real/i],
    ["picture is conditional on art direction or source selection", /`<picture>` cuando aporte art direction/i],
    ["responsive image sources are considered when useful", /`srcset`, `sizes`/i],
    ["responsive image variants and paths are not invented", /ni inventes variantes\/rutas/i],
    ["critical/LCP media is not lazy-loaded indiscriminately", /LCP[\s\S]{0,100}no debe[\s\S]{0,100}lazy/i],
    ["below-the-fold lazy loading remains available", /below-the-fold es válido/i],
    ["known dimensions reserve layout space", /`width`\/`height`, `aspect-ratio`[\s\S]{0,120}layout shift/i],
    ["informative and decorative alt have distinct handling", /(?:informativas llevan|informativa requiere) alt contextual[\s\S]{0,140}decorativas como `<img>` (?:usan|llevan|usa) `alt=""`/i],
    ["alt text is not keyword stuffing", /No uses alt como relleno SEO/i],
    ["approved media treatment is preserved", /Preserva asset, crop, framing, ratio, overlay, placement, art direction/i],
    ["Existing does not receive mass media migration", /Existing conserva su arquitectura y convenciones[\s\S]{0,120}no migra backgrounds en masa/i],
    ["Approved/Strict authority includes material markup treatment", /APPROVED\/STRICT la autoridad de la referencia prevalece/i],
    ["Application UI does not inherit marketing art direction", /Application UI aplica semántica\/performance razonable sin imponer art direction de marketing/i],
    ["approved parity checks media asset and responsive source", /media aprobada \(asset, crop\/framing[\s\S]{0,100}source responsive/i],
  ];
  for (const [scenario, pattern] of scenarios) assert.ok(pattern.test(media), `${scenario}: policy is present`);
  const activePolicy = `${mediaContract}\n${architecture}\n${developerAgent}`;
  assert.equal(/no (?:fija|define) (?:una regla universal )?`?<img>`?[\s\S]{0,100}(?:futuro|convenciones actuales del stack)/i.test(activePolicy), false, "the incorrect deferred image policy is removed");
  assert.equal(/Frontend (?:Media|Fidelity)(?: 2\.0)? futuros?/i.test(activePolicy), false, "Frontend Media is no longer described as future work");
});

test("BF-069 spacing, CSS source quality and consolidation remain balanced", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const architecture = fs.readFileSync(new URL("../../.kilo/skills/frontend-architecture/SKILL.md", import.meta.url), "utf8");
  const contractStart = core.indexOf("## Arquitectura frontend y fidelidad (BF-069)");
  const contractEnd = core.indexOf("## Flujo visual de alta fidelidad", contractStart);
  const contract = core.slice(contractStart, contractEnd);

  assert.match(contract, /`Section`[\s\S]{0,100}spacing exterior/);
  assert.match(contract, /`Container` define el ancho útil[\s\S]{0,100}no un max-width universal/);
  assert.match(contract, /`gap` es el mecanismo normal\/preferido para spacing interno repetible/i);
  assert.match(contract, /Margins siguen siendo válidos[\s\S]{0,120}spacing contextual/);
  assert.match(architecture, /CSS fuente legible[\s\S]{0,180}no source manual/);
  assert.match(architecture, /`!important` es excepcional[\s\S]{0,180}no está prohibido universalmente/i);
  assert.match(architecture, /third-party\/builders, utility systems deliberados o helpers de accesibilidad/i);
  assert.match(architecture, /patch piles[\s\S]{0,180}revisa la causa y consolida/i);
  assert.match(architecture, /stale media\/crop\/responsive rules[\s\S]{0,300}sin cambiar apariencia ni behavior aprobados/i);
});

test("Design System stays project-specific and UI Kit represents the same source across frontend stacks", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const start = core.indexOf("## Arquitectura frontend y fidelidad (BF-069)");
  const end = core.indexOf("## Flujo visual de alta fidelidad", start);
  assert.ok(start >= 0 && end > start, "BF-069 bounds the cross-stack frontend contract");
  const contract = core.slice(start, end);
  const system = read(".kilo/skills/ui-design-system/SKILL.md");
  const kit = read(".kilo/skills/ui-kit-construction/SKILL.md");
  const architecture = read(".kilo/skills/frontend-architecture/SKILL.md");
  const wordpress = read(".kilo/skills/wordpress-theme-development/SKILL.md");
  const responsive = read(".kilo/skills/frontend-responsive/SKILL.md");
  const bricks = read(".kilo/skills/bricks/SKILL.md");
  const elementor = read(".kilo/skills/elementor/SKILL.md");
  const scenarios = [
    ["Design System is canonical and UI Kit is its representation", contract, /Design System específico de cada proyecto es la fuente de verdad; el UI Kit permanece como su representación navegable\/interactiva/i],
    ["Design System foundations are project-scoped", system, /color semántico, tipografía\/fluidez, spacing\/dimensiones, grid\/containers/i],
    ["the same tokens/components have one active canonical source", kit, /una segunda fuente de valores|fuente canónica de tokens\/componentes/i],
    ["Product never depends at runtime on design artifacts", `${system}\n${kit}\n${architecture}`, /Product (?:nunca depende|no puede depender|no depende) en runtime de `artefactos\//i],
    ["the UI Kit and components are selected only for real needs", kit, /Incluye únicamente componentes\/patrones que respondan a contenido o flujos reales/i],
    ["the Kit does not impose card/accordion/form baselines", kit, /no hay cuota de button\/card\/accordion\/form\/table/i],
    ["Tailwind is preferred for custom Greenfield, not Existing/builders", architecture, /Tailwind CSS es la opción preferida por defecto[\s\S]{0,420}Existing conserva su stack\/CSS\/Tailwind versión vigentes; Bricks, Elementor y builders usan su modelo nativo/i],
    ["Existing Bricks uses its current shared source, not a Tailwind migration", bricks, /Classes, variables, Components, global styles y breakpoints son un sistema compartido[\s\S]{0,120}no copies tokens aprobados como valores locales masivos/i],
    ["Existing Elementor preserves its builder and globals", elementor, /No migres builder, estructura, globals ni extensiones existentes para seguir una receta/i],
    ["Tailwind syntax is version-aware and uses a production build", architecture, /Confirma versión y herramienta[\s\S]{0,320}Tailwind v4 usa CSS-first[\s\S]{0,160}v3 y otras versiones tienen configuración diferente/i],
    ["production avoids CDN and global installs", architecture, /No instales Tailwind globalmente ni uses Play CDN como CSS de producción/i],
    ["Tailwind class scanning covers static PHP/Blade sources", architecture, /detector de Tailwind lee source como texto y no resuelve concatenación\/interpolación dinámica[\s\S]{0,140}paths `@source` explícitos si PHP\/Blade/i],
    ["responsive breakpoints retain the canonical config/source", `${architecture}\n${responsive}`, /Existing y Approved conservan los puntos de cambio de su source, sin sumar una escala global divergente/i],
    ["shadcn is optional, React-scoped and customizable to design tokens", architecture, /`shadcn\/ui` es opcional cuando sus componentes abiertos y editables resuelven necesidades reales[\s\S]{0,180}integra sus variables con los tokens aprobados/i],
    ["Astro remains native-first with React only for a justified island", architecture, /Astro:[\s\S]{0,240}prioriza `\.astro` y CSS\/components nativos[\s\S]{0,240}una isla React\/shadcn solo se justifica/i],
    ["Laravel shadcn requires the React frontend", architecture, /Laravel \+ React\/Inertia[\s\S]{0,200}no añadas React para acceder a `shadcn\/ui`/i],
    ["Vue/Svelte use native components instead of an automatic shadcn port", architecture, /Vue \/ Nuxt y Svelte \/ SvelteKit:[\s\S]{0,220}No presentes `shadcn\/ui` como multistack ni ports automáticamente/i],
    ["custom PHP/WP scans native templates and has one editor/token authority", `${architecture}\n${wordpress}`, /HTML \/ PHP \/ custom WordPress theme:[\s\S]{0,300}templates HTML\/PHP\/Blade están en las source paths[\s\S]{0,240}una única fuente canónica/i],
    ["Web Components are justified cross-stack and shadcn is not automatically converted", architecture, /No conviertas ni empaquetes automáticamente shadcn\/ui como Web Components/i],
  ];
  for (const [scenario, source, pattern] of scenarios) assert.ok(pattern.test(source), `${scenario}: contract is present`);
});

test("BF-071 approved visual sources permit technical normalization without implicit redesign", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const start = core.indexOf("### Conversión de frontend visualmente aprobado (BF-071)");
  const end = core.indexOf("Los wrappers auxiliares", start);
  assert.ok(start >= 0 && end > start, "BF-071 conversion invariant is bounded in Core");
  const contract = core.slice(start, end);
  assert.ok(contract.includes("esa autoridad no congela el DOM ni la arquitectura CSS/JS"));
  assert.ok(contract.includes("la opción recomendada es normalizar técnicamente"));
  assert.ok(contract.includes("rediseño material requiere scope/aprobación separados"));
  for (const phrase of ["optimizar", "refactorizar", "profesionalizar", "pasar a wordpress"]) assert.ok(contract.toLowerCase().includes(phrase), `${phrase} does not silently expand visual authority`);
});

test("approved frontend conversion infers faithful, optimized and authorized visual scope without a wizard", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const architecture = read(".kilo/skills/frontend-architecture/SKILL.md");
  const projectLead = read(".kilo/agents/jefe-proyecto.md");
  const developer = read(".kilo/agents/desarrollador.md");
  const scenarios = [
    ["approved source preserves output while allowing internals to change", architecture, "no el código literal", "no congela DOM, class names ni organización técnica"],
    ["optimized conversion is the default recommended mode", architecture, "recomienda internamente una conversión optimizada", "conserve materialmente apariencia"],
    ["faithful conversion honors explicit structure constraints", architecture, "Si la persona pide conservar estructura/clases", "usa conversión fiel"],
    ["material visual changes require explicit authorization", architecture, "Mejoras visuales", "requieren scope/autorización explícitos"],
    ["the modes remain internal rather than a user form", architecture, "no un selector/wizard para la persona"],
    ["source authority is inspected before a single material question", architecture, "inspecciónalo primero", "pregunta solo si falta esa decisión material"],
    ["Jefe routes a confirmed approved conversion without asking redundant approval", projectLead, "Si está Approved y se pide implementarlo sin cambio visual, recomienda conversión técnica optimizada", "No preguntes si ya se autorizó la conversión"],
    ["Developer avoids design change from generic optimization/refactor wording", developer, "Refactorizar, optimizar o profesionalizar el código no autoriza cambios visuales", "no re-diseñes"],
  ];
  for (const [scenario, source, ...phrases] of scenarios) assert.ok(phrases.every((phrase) => source.includes(phrase)), `${scenario}: policy is present`);
});

test("Technical Normalization preserves approved values while extracting only real shared roles", () => {
  const architecture = fs.readFileSync(new URL("../../.kilo/skills/frontend-architecture/SKILL.md", import.meta.url), "utf8");
  const parity = fs.readFileSync(new URL("../../.kilo/skills/visual-parity-review/SKILL.md", import.meta.url), "utf8");
  const scenarios = [
    ["normalization inspects the authorized source/target scope", /pasada técnica focalizada sobre el scope fuente\/target/i],
    ["semantic roles extract reusable shared tokens from original approved values", /tokens globales solo para roles\/foundations compartidos[\s\S]{0,180}valores aprobados originales/i],
    ["page/section-specific naming is avoided only for shared roles", /Nombres semánticos deben describir la función reutilizable, no una página\/sección/i],
    ["numeric coincidence alone does not merge different roles", /misma cifra CSS no implica mismo token/i],
    ["local and component-only values remain valid", /Valores locales\/component-only siguen siendo válidos/i],
    ["token extraction does not require retroactive UI Kit work", /La extracción técnica de tokens dentro de Product no obliga[\s\S]{0,120}crear un UI Kit retroactivo/i],
    ["components require a real shared pattern", /cuando exista un patrón real compartido/i],
    ["shared foundations remain distinct from page composition", /Mantén separados shared foundations\/primitives de composición propia de página/i],
    ["CSS and JS organization follow existing stack without rigid files/build", /no existe árbol de archivos, metodología CSS, archivo por página ni bundle universal obligatorio/i],
    ["page-specific assets are loaded only when useful", /añade únicamente estilos\/scripts específicos útiles/i],
    ["dead code is removed only with evidence", /Limpia dead code\/reglas con evidencia/i],
    ["technical parity does not claim visual parity", /Parity compara output\/behavior aprobado, no la calidad interna del código/i],
  ];
  for (const [scenario, pattern] of scenarios) assert.ok(pattern.test(`${architecture}\n${parity}`), `${scenario}: invariant is present`);
  assert.match(parity, /una normalización limpia tampoco demuestra por sí sola parity/i);
});

test("approved breakpoints and WordPress conversion follow their actual sources of truth", () => {
  const responsive = fs.readFileSync(new URL("../../.kilo/skills/frontend-responsive/SKILL.md", import.meta.url), "utf8");
  const theme = fs.readFileSync(new URL("../../.kilo/skills/wordpress-theme-development/SKILL.md", import.meta.url), "utf8");
  const developer = fs.readFileSync(new URL("../../.kilo/agents/desarrollador.md", import.meta.url), "utf8");
  assert.match(responsive, /fuente HTML\/frontend designada Approved también conserva sus puntos de cambio/i);
  assert.match(responsive, /Greenfield sin sistema responsive aprobado[\s\S]{0,100}`\.cn-pilot\/config\/responsive\.json`/i);
  assert.match(responsive, /Approved, los puntos de cambio efectivos del source prevalecen/i);
  assert.match(responsive, /No los sustituyas salvo cambio visual autorizado/i);
  assert.match(theme, /Cuando Product transforma un frontend Approved[\s\S]{0,240}template parts, assets y enqueue nativos/i);
  assert.match(theme, /Conserva literalmente estático lo que se aprobó como estático/i);
  assert.match(theme, /la conversión HTML no implica volver todo dinámico[\s\S]{0,180}fields\/CPT\/ACF/i);
  assert.match(developer, /consume el prototipo\/Kit\/copy aprobados como source of truth/i);
  assert.match(theme, /no implica volver todo dinámico/i);
});

test("BF-070 WordPress Product Contract preserves Greenfield and Existing boundaries", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const start = core.indexOf("## WordPress Product Contract y arquitectura de themes (BF-070)");
  const end = core.indexOf("## Convención de idioma", start);
  assert.ok(start >= 0 && end > start, "BF-070 Core source is present and bounded");
  const contract = core.slice(start, end);
  const scenarios = [
    ["Greenfield source has native wp-content roots", /WordPress Greenfield[\s\S]{0,180}producto\/wp-content\/[\s\S]{0,120}themes\//i],
    ["mu-plugins are conditional, not scaffolded", /`mu-plugins\/` cuando haya necesidad/i],
    ["WordPress Core is not part of source", /No versiona WordPress Core[\s\S]{0,100}`wp-admin\/`, `wp-includes\//i],
    ["production uploads, cache and secrets are excluded by default", /uploads de producción,[\s\S]{0,100}secretos/i],
    ["Existing paths and hosting contracts are preserved", /Existing operativo\/adopted preserva su product root[\s\S]{0,180}CI\/deploy/i],
    ["Existing theme changes require explicit scope and approval", /Mover\/reorganizar un sitio WordPress requiere una tarea explícita/i],
    ["Classic, Block and intentional Hybrid architectures are distinct", /\*\*Classic\*\*[\s\S]{0,100}PHP y Template Hierarchy[\s\S]{0,100}\*\*Block\*\*[\s\S]{0,150}sin exigir `header\.php`\/`footer\.php`[\s\S]{0,100}\*\*Hybrid\*\*/i],
    ["theme/plugin boundary and durable functionality are explicit", /El theme presenta contenido; funcionalidad durable[\s\S]{0,100}plugin o capa apropiada/i],
    ["CPT ownership is not assumed by the theme", /CPT\/taxonomías no se registran automáticamente dentro del theme/i],
    ["2.6.1 Frontend/Media contracts remain the visual authority", /preservan BF-069 y Frontend Media Strategy 2\.6\.1/i],
  ];
  for (const [scenario, pattern] of scenarios) assert.ok(pattern.test(contract), `${scenario}: invariant is present`);
});

test("wordpress-theme-development specifies proportional native theme architecture", () => {
  const theme = fs.readFileSync(new URL("../../.kilo/skills/wordpress-theme-development/SKILL.md", import.meta.url), "utf8");
  const wordpress = fs.readFileSync(new URL("../../.kilo/skills/wordpress/SKILL.md", import.meta.url), "utf8");
  const scenarios = [
    ["dedicated scope preserves WordPress API ownership", /`wordpress` sigue gobernando APIs Core[\s\S]{0,100}esta skill gobierna la organización del theme/i],
    ["Classic theme uses PHP hierarchy", /Classic:[\s\S]{0,100}PHP templates y WordPress Template Hierarchy/i],
    ["Block theme uses native files without Classic wrappers", /Block:[\s\S]{0,180}no requiere `header\.php`\/`footer\.php`/i],
    ["Hybrid theme is deliberate", /Hybrid:[\s\S]{0,160}no mezcla accidental/i],
    ["theme files are examples, not an empty scaffold", /No crees directorios vacíos[\s\S]{0,180}WooCommerce folders/i],
    ["style.css carries required WordPress metadata without mandatory all-in-one CSS", /header de metadata de WordPress; no tiene que contener todo el CSS/i],
    ["functions.php bootstraps rather than accumulating the whole product", /`functions\.php` es un bootstrap\/orquestador conciso[\s\S]{0,240}business logic/i],
    ["inc, namespaces, build and dependencies stay proportional", /Usa `inc\/` cuando[\s\S]{0,300}Composer\/Node\/build/i],
    ["theme setup uses lifecycle and real capabilities", /`after_setup_theme`[\s\S]{0,260}solo capabilities realmente implementadas/i],
    ["Classic shell retains integration hooks", /`wp_head\(\)`[\s\S]{0,180}`body_class\(\)`[\s\S]{0,100}`wp_body_open\(\)`/i],
    ["Classic footer retains wp_footer", /`footer\.php`[\s\S]{0,180}`wp_footer\(\)` antes de `<\/body>`/i],
    ["Hierarchy differentiates front-page and posts index", /`front-page\.php` \(portada\) de `home\.php` \(posts index\/blog\)/i],
    ["Hierarchy covers custom post and taxonomy templates without scaffolding all of them", /`single-\{post_type\}\.php`[\s\S]{0,220}taxonomy\/category\/tag[\s\S]{0,100}solo para comportamiento\/layout requerido/i],
    ["template parts are real units and use the native loader", /`get_template_part\(\)`[\s\S]{0,180}markup/i],
    ["main and secondary query behavior is safe", /`pre_get_posts`[\s\S]{0,100}no uses `query_posts\(\)`[\s\S]{0,180}restaura estado global/i],
    ["assets use the native enqueue lifecycle and portable paths", /`wp_enqueue_scripts`[\s\S]{0,120}`wp_enqueue_style\(\)`\/`wp_enqueue_script\(\)`[\s\S]{0,220}no hardcodees `\/wp-content\/themes/i],
    ["theme.json is optional for Classic/Hybrid but native to Block", /`theme\.json` es opcional en Classic\/Hybrid[\s\S]{0,200}Block Theme lo usa/i],
    ["WordPress native attachment output preserves responsive media", /`wp_get_attachment_image\(\)`[\s\S]{0,100}`srcset`\/sizes/i],
    ["security separates escaping, validation and capabilities", /Escape late por contexto[\s\S]{0,180}capabilities\/autorización/i],
    ["accessibility and performance preserve approved behavior", /Conserva landmarks[\s\S]{0,200}reduced motion/i],
    ["WooCommerce is conditional and template overrides are minimal", /WooCommerce solo se activa[\s\S]{0,180}copia únicamente overrides/i],
    ["missing WooCommerce does not create shop code", /Si WooCommerce falta, no crees archivos\/integraciones shop/i],
    ["shared theme surfaces serialize before derived page work", /single-writer mientras cambian[\s\S]{0,240}páginas\/templates derivados/i],
    ["Existing child themes and conventions are not automatically migrated", /Child themes, builders y conventions Existing se preservan[\s\S]{0,180}no migres Theme type/i],
    ["no build or runtime tooling is imposed on every theme", /No exijas Browser QA[\s\S]{0,180}PHPUnit\/Node a todo theme/i],
  ];
  for (const [scenario, pattern] of scenarios) assert.ok(pattern.test(theme), `${scenario}: policy is present`);
  assert.ok(/Theme nuevo\/rebuild o cambio estructural[\s\S]{0,160}`wordpress-theme-development`/.test(wordpress), "generic WordPress routing points to the theme architecture owner");
  assert.doesNotMatch(theme, /Composer, Node(?:\.js)? o Vite son obligatorios|Composer\/Node\/build[^.]{0,50}son requisito universal/i, "theme tooling remains optional");
});

test("/nuevo-proyecto es progresivo, lee antes de preguntar y no es un wizard", () => {
  const command = fs.readFileSync(new URL("../../.kilo/commands/nuevo-proyecto.md", import.meta.url), "utf8");
  const inspect = command.indexOf("## Inspecciona antes de preguntar");
  const ask = command.indexOf("## Conversa por necesidad, no por formulario");
  assert.ok(inspect >= 0 && ask > inspect, "context and resources are inspected before questions");
  assert.ok(command.includes("ni obliga a completar un wizard") || command.includes("No obliga a completar un wizard"));
  assert.ok(command.includes("No hagas una lista fija de campos"));
  assert.ok(command.includes("Acepta que la persona posponga o salte una fase"));
  assert.ok(command.includes("Alcanza esa suficiencia sin una confirmación genérica obligatoria"));
  assert.ok(!command.includes("¿Inicializo el proyecto con esta información?"));
  assert.ok(!command.includes("Pregunta 1 de"));
});

test("legacy ESTADO shape remains valid; optional journey headings are not an updater gate", (t) => {
  const fixture = createFixture(t);
  fixture.put("ESTADO.md", "# State in an older project\n\n## Working on\nAn existing task.\n");
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(report.status, "PASS", JSON.stringify(report.findings));
});

test("legacy canonical paths are rejected in a clean 2.0 installation", (t) => {
  const fixture = createFixture(t);
  fixture.put("PROJECT.md", "stale legacy context\n");
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "core.legacyPaths").status, "FAIL");
  assert.deepEqual(getCheck(report, "core.legacyPaths").details.paths, ["PROJECT.md"]);
});

test("legacy path references outside migration history and updater fixtures are rejected", (t) => {
  const fixture = createFixture(t);
  fixture.put("README.md", "Use PROJECT.md and product/ as canonical paths.\n");
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "core.legacyReferences").status, "FAIL");
  assert.deepEqual(getCheck(report, "core.legacyReferences").details.files, ["README.md"]);
});

test("command target must resolve to an existing agent", (t) => {
  const fixture = createFixture(t);
  fixture.put(".kilo/commands/revision.md", "---\ndescription: Revisión\nagent: missing-agent\n---\n");
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "routing.commands").status, "FAIL");
});

test("Dev Lead task target must resolve to an existing agent", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/jefe-proyecto.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace('"revisor": allow', '"ghost-reviewer": allow'));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "routing.devLead").status, "FAIL");
});

test("a destructive Git permission regression in Dev Lead fails", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/jefe-proyecto.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace('"git reset --hard*": deny', '"git reset --hard*": allow'));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "security.devLead").status, "FAIL");
});

test("a weakened Reviewer permission fails the protected check", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/revisor.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace("  edit: deny", "  edit: allow"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "permissions.reviewer").status, "FAIL");
});

test("Reviewer background-process capability remains denied", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/revisor.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace("background_process: deny", "background_process: allow"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "permissions.reviewer").status, "FAIL");
});

test("security profiles deny sensitive routes, protect root config, and preserve normal Product writing", (t) => {
  const fixture = createFixture(t);
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "security.agentPermissions").status, "PASS");
  assert.equal(getCheck(report, "security.agentPermissions").details.agentsChecked, 6);
  assert.equal(getCheck(report, "security.kiloPermissionDefaults").details.checked, false, "derived fixture does not enforce Core-owned Kilo config");
  const developer = normalizeEol(fs.readFileSync(path.join(fixture.root, ".kilo/agents/desarrollador.md"), "utf8"));
  assert.match(developer, /edit:\n\s+"\*": allow/);
  assert.match(developer, /"kilo.jsonc": deny/);
  assert.match(developer, /"\.env.example": allow/);

  fixture.put(".kilo/agents/desarrollador.md", developer.replace('"**/.aws/credentials": deny', '"**/.aws/credentials": ask'));
  assert.equal(getCheck(runCoreChecks({ rootDir: fixture.root }), "security.agentPermissions").status, "FAIL", "a secret-file read exception is caught");
});

test("safe .env.example exceptions cannot override a later secrets-directory denial", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/desarrollador.md";
  const source = normalizeEol(fs.readFileSync(path.join(fixture.root, file), "utf8"));
  const reordered = source.replace('"**/.env.example": allow\n    "secrets/**": deny', '"secrets/**": deny\n    "**/.env.example": allow');
  assert.notEqual(reordered, source, "fixture changed the ordered exception");
  fixture.put(file, reordered);
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "security.agentPermissions").status, "FAIL");
  assert.ok(getCheck(report, "security.agentPermissions").details.problems.some((problem) => problem.code === "SECRET_DIRECTORY_PRECEDENCE_INVALID"));
});

test("Revisor unknown tools and search bypasses remain denied", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/revisor.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace('  "*": deny', '  "*": ask').replace("  grep: deny", "  grep: allow"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "permissions.reviewer").status, "FAIL");
  assert.equal(getCheck(report, "security.agentPermissions").status, "FAIL");
});

test("MCP tools require an explicit reviewed capability instead of inheriting permission for unrelated tools", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/desarrollador.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace("  grep: allow", "  mcp_server_write: allow\n  grep: allow"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "security.agentPermissions").status, "FAIL");
  assert.ok(getCheck(report, "security.agentPermissions").details.problems.some((problem) => problem.code === "UNREVIEWED_TOOL_PERMISSION"));
});

test("integrated Browser MCP is ask-scoped only for Jefe, Diseñador, and Desarrollador", (t) => {
  const fixture = createFixture(t);
  let report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "security.agentPermissions").status, "PASS");
  assert.equal(getCheck(report, "security.kiloPermissionDefaults").status, "PASS");

  const jefePath = ".kilo/agents/jefe-proyecto.md";
  const jefe = normalizeEol(fs.readFileSync(path.join(fixture.root, jefePath), "utf8"));
  const jefeWithoutApproval = jefe.replace('  "kilo-playwright_*": ask\n', "");
  assert.notEqual(jefeWithoutApproval, jefe, "fixture removes the Browser approval rule");
  fixture.put(jefePath, jefeWithoutApproval);
  report = runCoreChecks({ rootDir: fixture.root });
  const missing = getCheck(report, "security.agentPermissions");
  assert.equal(missing.status, "FAIL");
  assert.ok(missing.details.problems.some((problem) => problem.code === "BROWSER_MCP_APPROVAL_MISSING"));

  const architectPath = ".kilo/agents/arquitecto.md";
  const architect = normalizeEol(fs.readFileSync(path.join(fixture.root, architectPath), "utf8"));
  fixture.put(architectPath, architect.replace("  grep: allow", '  "kilo-playwright_*": ask\n  grep: allow'));
  report = runCoreChecks({ rootDir: fixture.root });
  const outOfScope = getCheck(report, "security.agentPermissions");
  assert.equal(outOfScope.status, "FAIL");
  assert.ok(outOfScope.details.problems.some((problem) => problem.code === "BROWSER_MCP_OUT_OF_SCOPE"));

  const canonical = createFixture(t);
  canonical.put(".git/config", '[remote "origin"]\n\turl = https://github.com/LuisYGM/CN-Pilot.git\n');
  canonical.put("README.md", "# CN Pilot\n\n[Repositorio](https://github.com/LuisYGM/cn-pilot)\n");
  canonical.put("PROYECTO.md", "# Proyecto\n- **Nombre:** Pending\n- **Repositorio o carpeta:** Pending\n- **Versión de CN Pilot Core:** 2.8.0\n");
  const configPath = "kilo.jsonc";
  const config = fs.readFileSync(path.join(canonical.root, configPath), "utf8");
  canonical.put(configPath, config.replace('"kilo-playwright_*": "ask"', '"kilo-playwright_*": "allow"'));
  const rootPermission = getCheck(runCoreChecks({ rootDir: canonical.root }), "security.kiloPermissionDefaults");
  assert.equal(rootPermission.status, "FAIL");
  assert.ok(rootPermission.details.problems.some((problem) => problem.code === "BROWSER_MCP_APPROVAL_MISSING"));
});

test("an agent cannot add an unreviewed MCP/tool permission", (t) => {
  const fixture = createFixture(t);
  const file = ".kilo/agents/desarrollador.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace("  grep: allow", "  github_create_pull_request: allow\n  grep: allow"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "security.agentPermissions").status, "FAIL");
  assert.ok(getCheck(report, "security.agentPermissions").details.problems.some((problem) => problem.code === "UNREVIEWED_TOOL_PERMISSION"));
});

test("Kilo root config fails closed on unknown tools only in the canonical Core repository", (t) => {
  const canonical = createFixture(t);
  canonical.put(".git/config", '[remote "origin"]\n\turl = https://github.com/LuisYGM/CN-Pilot.git\n');
  canonical.put("README.md", "# CN Pilot\n\n[Repositorio](https://github.com/LuisYGM/cn-pilot)\n");
  canonical.put("PROYECTO.md", "# Proyecto\n- **Nombre:** Pending\n- **Repositorio o carpeta:** Pending\n- **Versión de CN Pilot Core:** 2.8.0\n");
  let check = getCheck(runCoreChecks({ rootDir: canonical.root }), "security.kiloPermissionDefaults");
  assert.equal(check.status, "PASS");
  assert.equal(check.details.checked, true);

  const safeConfig = fs.readFileSync(path.join(canonical.root, "kilo.jsonc"), "utf8");
  const unsafe = safeConfig.replace('"*": "deny"', '"*": "allow"');
  canonical.put("kilo.jsonc", unsafe);
  check = getCheck(runCoreChecks({ rootDir: canonical.root }), "security.kiloPermissionDefaults");
  assert.equal(check.status, "FAIL");
  assert.equal(check.details.problems[0].code, "UNKNOWN_TOOL_DEFAULT_NOT_DENIED");

  canonical.put("kilo.jsonc", safeConfig.replace('"permission": {', '"mcp": { "unreviewed": { "type": "local", "command": ["unsafe-server"] } },\n  "permission": {'));
  check = getCheck(runCoreChecks({ rootDir: canonical.root }), "security.kiloPermissionDefaults");
  assert.equal(check.status, "FAIL");
  assert.ok(check.details.problems.some((problem) => problem.code === "MCP_SERVER_ADDED_OUTSIDE_REVIEW"));

  const derived = createFixture(t);
  derived.put(".git/config", '[remote "origin"]\n\turl = https://github.com/customer/site.git\n');
  derived.put("README.md", "# Sitio del cliente\n");
  derived.put("PROYECTO.md", "# Proyecto\n- **Nombre:** Sitio cliente\n- **Repositorio o carpeta:** https://github.com/customer/site\n- **Versión de CN Pilot Core:** 2.8.0\n");
  derived.put("kilo.jsonc", '{"permission":{"*":"allow"}}\n');
  check = getCheck(runCoreChecks({ rootDir: derived.root }), "security.kiloPermissionDefaults");
  assert.equal(check.status, "PASS");
  assert.equal(check.details.checked, false);
});

test("installed Kilo resolves the six static security profiles", (t) => {
  const version = runKiloForPermissionTest(["--version"]);
  if (version.error || version.status !== 0 || !/\d+\.\d+\.\d+/.test(version.stdout + version.stderr)) {
    t.skip("Kilo is not installed in this runner; static permission invariants still run in Core QA.");
    return;
  }
  const installedVersion = (version.stdout + version.stderr).match(/\d+\.\d+\.\d+/)[0];
  const parts = installedVersion.split(".").map(Number);
  assert.ok(parts[0] > 7 || (parts[0] === 7 && (parts[1] > 8 || (parts[1] === 8 && parts[2] >= 8))), `Kilo ${installedVersion} must meet the Core minimum 7.8.8`);
  const config = runKiloForPermissionTest(["config", "check"]);
  assert.equal(config.status, 0, `Kilo ${installedVersion} validates the active permission config`);

  const agentNames = ["arquitecto", "desarrollador", "disenador", "jefe-proyecto", "redactor", "revisor"];
  const profiles = Object.fromEntries(agentNames.map((name) => [name, parseKiloDebugAgent(name)]));
  for (const [name, profile] of Object.entries(profiles)) {
    const defaults = profile.permission.filter((rule) => rule.permission === "*");
    assert.equal(defaults.at(-1)?.action, "deny", `${name} blocks unreviewed tools/MCP after inherited user settings`);
    assert.equal(resolveKiloPermission(profile, "read", ".env"), "deny", `${name} blocks direct .env reads`);
    assert.equal(resolveKiloPermission(profile, "read", ".env.example"), "allow", `${name} preserves a root template`);
    assert.equal(resolveKiloPermission(profile, "read", "secrets/.env.example"), "deny", `${name} does not let example exceptions override secret directories`);
    assert.equal(resolveKiloPermission(profile, "read", "nested/.env.local"), "deny", `${name} blocks nested env variants`);
    assert.equal(resolveKiloPermission(profile, "read", "nested/.kilo/mcp.json"), "deny", `${name} blocks local MCP secret files`);
    assert.equal(resolveKiloPermission(profile, "edit", "secrets/.env.example"), "deny", `${name} blocks secret-directory edits`);
    const browserPermission = ["jefe-proyecto", "disenador", "desarrollador"].includes(name) ? "ask" : "deny";
    assert.equal(resolveKiloPermission(profile, "kilo-playwright_browser_navigate", "local/page"), browserPermission, `${name} receives only its scoped Browser MCP permission`);
  }

  const jefe = profiles["jefe-proyecto"];
  assert.equal(resolveKiloPermission(jefe, "edit", "PROYECTO.md"), "allow");
  assert.equal(resolveKiloPermission(jefe, "edit", ".cn-pilot/NUCLEO.md"), "allow");
  assert.equal(resolveKiloPermission(jefe, "edit", ".cn-pilot/runtime/active-task.json"), "allow");
  assert.equal(resolveKiloPermission(jefe, "edit", "producto/src/discount.mjs"), "deny", "Jefe must route Product writes, never self-implement them");
  assert.equal(resolveKiloPermission(jefe, "edit", "producto/index.html"), "deny");
  assert.equal(resolveKiloPermission(jefe, "bash", "Test-Path -LiteralPath '.cn-pilot/runtime/active-task.json'"), "allow");
  assert.equal(resolveKiloPermission(jefe, "bash", "Get-Item -LiteralPath '.cn-pilot/runtime/active-task.json' -Force"), "allow");
  assert.equal(resolveKiloPermission(jefe, "bash", "Select-Object -ExpandProperty Attributes"), "allow");
  assert.equal(resolveKiloPermission(jefe, "bash", "Get-ChildItem"), "ask");
  assert.equal(resolveKiloPermission(jefe, "edit", "kilo.jsonc"), "ask");
  assert.equal(resolveKiloPermission(jefe, "lsp", "workspace/file.php"), "allow");
  assert.equal(resolveKiloPermission(jefe, "mcp_unreviewed_write", "remote/resource"), "deny");
  const developer = profiles.desarrollador;
  assert.equal(resolveKiloPermission(developer, "edit", ".cn-pilot/NUCLEO.md"), "deny");
  assert.equal(resolveKiloPermission(developer, "edit", "kilo.jsonc"), "deny");
  assert.equal(resolveKiloPermission(developer, "edit", "producto/src/index.php"), "allow");
  assert.equal(resolveKiloPermission(developer, "lsp", "producto/src/index.php"), "allow");
  assert.equal(resolveKiloPermission(developer, "mcp_unreviewed_write", "remote/resource"), "deny");
  assert.equal(resolveKiloPermission(developer, "edit", "producto/src/discount.mjs"), "allow", "Developer keeps legitimate Product code ownership");
  assert.equal(resolveKiloPermission(profiles.desarrollador, "edit", "producto/index.html"), "allow", "Developer owns both UI and backend Product implementation");
  assert.equal(profiles.desarrollador.tools.write, true);
  assert.equal(profiles.desarrollador.tools.apply_patch, true);
  assert.equal(profiles["desarrollador"].tools.bash, true);

  const revisor = profiles.revisor;
  for (const tool of ["write", "apply_patch", "bash", "grep", "task", "agent_manager", "background_process", "webfetch", "websearch", "skill"]) {
    if (Object.hasOwn(revisor.tools, tool)) {
      assert.equal(revisor.tools[tool], false, `Revisor ${tool} is disabled by resolved Kilo permissions`);
    } else {
      assert.equal(resolveKiloPermission(revisor, tool, "*"), "deny", `Revisor ${tool} is unavailable and denied by resolved Kilo permissions`);
    }
  }
  assert.equal(revisor.tools.read, true);
  assert.equal(revisor.tools.glob, true);
  assert.equal(resolveKiloPermission(revisor, "edit", "PROYECTO.md"), "deny");
  assert.equal(resolveKiloPermission(revisor, "external_directory", "C:/Users/secret"), "deny");
  assert.equal(resolveKiloPermission(revisor, "mcp_unreviewed_write", "remote/resource"), "deny");
});

test("professional defaults stay explicit without adding an aesthetic gate", () => {
  const core = readCoreFile(".cn-pilot/NUCLEO.md");
  assert.match(core, /Excelencia profesional por defecto \(BF-073\)/);
  assert.match(core, /no añade fases, rondas ni gates estéticos automatizados/);
  assert.match(core, /Todo botón activo expone hover y foco `:focus-visible` claramente visibles/);

  for (const agent of ["arquitecto", "redactor", "disenador", "desarrollador"]) {
    assert.match(readCoreFile(`.kilo/agents/${agent}.md`), /BF-073/);
  }

  const visualArt = readCoreFile(".kilo/skills/visual-art-direction/SKILL.md");
  assert.match(visualArt, /familia profesional SVG/);
  assert.match(visualArt, /No uses emojis ni caracteres Unicode como sustitutos improvisados de iconos/);
  assert.match(visualArt, /solo muestra atribución si las condiciones verificadas la exigen/);
  assert.match(readCoreFile(".kilo/skills/page-composition/SKILL.md"), /colócalo por defecto inmediatamente encima del título y dentro del mismo bloque/);
});

test("a missing SKILL.md is detected", (t) => {
  const fixture = createFixture(t);
  fs.rmSync(path.join(fixture.root, ".kilo/skills/sample/SKILL.md"));
  const report = runCoreChecks({ rootDir: fixture.root });
  assert.equal(getCheck(report, "skills.frontmatter").status, "FAIL");
});

test("MANIFEST inventory drift warns and retains non-strict success", (t) => {
  const fixture = createFixture(t);
  const file = ".cn-pilot/MANIFIESTO.md";
  const source = fs.readFileSync(path.join(fixture.root, file), "utf8");
  fixture.put(file, source.replace("3 skills", "2 skills"));
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

test("No-op closure preserves durable decisions, visual authority, and active-task recovery", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const devLead = fs.readFileSync(new URL("../../.kilo/agents/jefe-proyecto.md", import.meta.url), "utf8");
  const closure = core.slice(core.indexOf("### No-op / Silent Closure"), core.indexOf("\n## ", core.indexOf("### No-op / Silent Closure")));

  assert.match(devLead, /No-op \/ Silent Closure/);
  assert.match(closure, /no edites archivos tracked, no stages ni crees commit/);
  assert.match(closure, /La confirmación de push no autoriza otro push/);
  assert.match(closure, /BF-063 integra la aprobación inequívoca como referencia Approved bajo BF-048/);
  assert.match(closure, /Decisiones durables comunicadas junto al cierre se persisten/);
  assert.match(closure, /active-task\.json` sigue preservando tareas activas, interrumpidas o bloqueadas/);
});

test("Dev Lead checkpoint writer matches updater's minimum recovery contract", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const devLead = fs.readFileSync(new URL("../../.kilo/agents/jefe-proyecto.md", import.meta.url), "utf8");
  const recovery = core.slice(core.indexOf("### Completion-Driven Execution & Recovery (BF-047)"), core.indexOf("### No-op / Silent Closure"));

  for (const field of ["schemaVersion: 1", "`status`", "`objective`", "`nextAction`", "BLOCKED_HUMAN", "BLOCKED_EXTERNAL", "INTERRUPTED"]) {
    assert.ok(recovery.includes(field), `BF-047 describes ${field}`);
  }
  assert.match(devLead, /schemaVersion: 1.*status.*objective.*nextAction/s);
  assert.match(recovery, /reader conserva además `BLOCKED` para compatibilidad/);
  assert.match(recovery, /`COMPLETED` se elimina al cerrar todos los gates/);
});

test("Progress Guard preserves recoverable work and bounded evidence without treating step caps as completion", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const devLead = fs.readFileSync(new URL("../../.kilo/agents/jefe-proyecto.md", import.meta.url), "utf8");
  const guard = core.slice(core.indexOf("#### Progress Guard"), core.indexOf("### No-op / Silent Closure"));

  for (const contract of ["primer fallo", "Segundo fallo comparable", "STOP VERIFYING THAT SURFACE", "INCOMPLETE + RECOVERABLE", "BLOCKED_HUMAN", "BLOCKED_EXTERNAL", "Completion Mode", "BF-062", "recovery"])
    assert.ok(guard.includes(contract), `Progress Guard keeps ${contract}`);
  assert.match(devLead, /La respuesta de un especialista que deja trabajo incompleto es un handoff/);
  assert.match(devLead, /Si acceptance sigue pendiente y el trabajo es recuperable.*continúa/s);
  assert.match(core, /No implementes un loop por strings\/texto\/exit code ambiguo/);
  assert.match(core, /una tercera iteración solo atiende un blocker material demostrable/i);
});

test("Agent Eval scenario registry is complete, safe, and distinct from behavioral results", () => {
  const suite = JSON.parse(readCoreFile(".cn-pilot/agent-evals/scenarios.json"));
  const expectedIds = ["EVAL-001", "EVAL-002", "EVAL-003", "EVAL-004", "EVAL-005", "EVAL-006"];
  assert.equal(suite.schemaVersion, 1);
  assert.deepEqual(suite.scenarios.map(({ id }) => id), expectedIds);
  assert.deepEqual(suite.resultValues, ["PASS", "FAIL", "INCONCLUSIVE"]);
  assert.match(suite.modelPolicy, /default real de Kilo/);
  for (const id of ["EVAL-001", "EVAL-002", "EVAL-003", "EVAL-005"]) {
    assert.equal(suite.scenarios.find(({ id: scenarioId }) => scenarioId === id).expectedOwner, "desarrollador", `${id} routes technical implementation to the single full-stack owner`);
  }
  assert.equal(suite.scenarios.find(({ id }) => id === "EVAL-006").expectedOwner, "revisor", "review remains assigned to the independent read-only owner");
  for (const id of ["EVAL-002", "EVAL-003"]) {
    const scenario = suite.scenarios.find(({ id: scenarioId }) => scenarioId === id);
    assert.ok(scenario.acceptance.some(({ observable }) => /un solo Desarrollador|único Desarrollador/.test(observable)), `${id} rejects artificial frontend/backend handoffs`);
  }

  for (const scenario of suite.scenarios) {
    assert.ok(scenario.title && scenario.request && scenario.agent, `${scenario.id} describes a real request/agent`);
    assert.ok(scenario.acceptance.length > 0, `${scenario.id} has observable criteria`);
    assert.ok(scenario.evidence.length > 0, `${scenario.id} names evidence`);
    assert.ok(["git-baseline", "git-baseline-plus-working"].includes(scenario.workspaceMode), `${scenario.id} has an isolated Git workspace`);
    assert.equal(scenario.agent, "jefe-proyecto", `${scenario.id} launches a real primary agent`);
    if (scenario.expectedOwner) assert.notEqual(scenario.expectedOwner, scenario.agent, `${scenario.id} records the subagent owner separately from the launch agent`);
    const evalRoot = fileURLToPath(new URL("../agent-evals/", import.meta.url));
    const fixtureRoot = path.join(evalRoot, "fixtures");
    const fixture = path.resolve(evalRoot, scenario.fixture);
    const fixtureRelative = path.relative(fixtureRoot, fixture);
    assert.ok(fixtureRelative !== ".." && !fixtureRelative.startsWith(`..${path.sep}`) && !path.isAbsolute(fixtureRelative), `${scenario.id} fixture stays in the fixture root`);
    assert.ok(fs.existsSync(fixture), `${scenario.id} fixture exists`);
    if (scenario.setupTest) {
      assert.ok([0, 1].includes(scenario.setupTest.expectExit));
      assert.ok(!path.isAbsolute(scenario.setupTest.recordPath) && !scenario.setupTest.recordPath.split(/[\\/]/).includes(".."));
    }
  }

  const recordTemplate = JSON.parse(readCoreFile(".cn-pilot/agent-evals/run-record.template.json"));
  for (const field of suite.recordFields) assert.ok(Object.hasOwn(recordTemplate, field), `record template includes ${field}`);
  assert.equal(recordTemplate.result, "INCONCLUSIVE", "a prepared/unreviewed run must not start as PASS");
  assert.equal(recordTemplate.durationMs, null, "unknown duration is not reported as zero");
  assert.equal(recordTemplate.tokenUsage.total, null, "unobserved token usage is not invented");

  const fixtureRoot = fileURLToPath(new URL("../agent-evals/fixtures/", import.meta.url));
  const sensitiveName = /(^|\/)(\.env($|\.)|\.npmrc$|\.pypirc$|credentials(\.json)?$|service-account\.json$|id_(rsa|ed25519|ecdsa|dsa)$)/i;
  const walk = (directory) => {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, item.name);
      const relative = path.relative(fixtureRoot, absolute).split(path.sep).join("/");
      assert.doesNotMatch(relative, sensitiveName);
      assert.equal(item.isSymbolicLink(), false, `fixture symlink forbidden: ${relative}`);
      if (item.isDirectory()) walk(absolute);
      else assert.doesNotMatch(fs.readFileSync(absolute, "utf8"), /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk-[A-Za-z0-9]{24,}/);
    }
  };
  walk(fixtureRoot);
  assert.ok(suite.scenarios.every(({ id }) => expectedIds.includes(id)));
  assert.match(readCoreFile(".cn-pilot/agent-evals/README.md"), /No uses `--auto`/);
});

test("Agent Eval workspace preflight only accepts new paths under OS temp and never overwrites", () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "cn-pilot-eval-preflight-"));
  const repo = path.join(parent, "checkout");
  fs.mkdirSync(repo);
  try {
    const valid = path.join(parent, "new-workspace");
    assert.equal(validateWorkspaceTarget(valid, { repoRoot: repo, tempRoot: parent }), valid);
    assert.throws(() => validateWorkspaceTarget(path.join(repo, "workspace"), { repoRoot: repo, tempRoot: parent }), /inside the CN Pilot checkout/);
    assert.throws(() => validateWorkspaceTarget(path.join(os.tmpdir(), "outside-parent", "workspace"), { repoRoot: repo, tempRoot: parent }), /children of the OS temp directory/);
    fs.mkdirSync(valid);
    assert.throws(() => validateWorkspaceTarget(valid, { repoRoot: repo, tempRoot: parent }), /already exists/);
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

test("Agent Eval candidate preparation fingerprints only tracked Core prompt modifications", () => {
  assert.equal(validateCoreSourceState("", false), "clean");
  const candidate = "M  AGENTS.md\nMM .kilo/agents/jefe-proyecto.md";
  assert.equal(validateCoreSourceState(candidate, true), candidate);
  assert.throws(() => validateCoreSourceState(candidate, false), /pass --allow-dirty-core/);
  assert.throws(() => validateCoreSourceState("D  .kilo/agents/jefe-proyecto.md", true), /unsupported source state/);
  assert.throws(() => validateCoreSourceState("?? .kilo/agents/new-agent.md", true), /unsupported source state/);
});

test("DIRECT UI/backend keeps one full-stack owner and ignored checkpoints are not reported absent", () => {
  const lead = readCoreFile(".kilo/agents/jefe-proyecto.md");
  const developer = readCoreFile(".kilo/agents/desarrollador.md");
  const core = readCoreFile(".cn-pilot/NUCLEO.md");
  const bashPermissions = lead.slice(lead.indexOf("  bash:"), lead.indexOf("\n---"));
  const editPermissions = lead.slice(lead.indexOf("  edit:"), lead.indexOf("  bash:"));
  assert.match(lead, /Determina el owner por la autoridad decisoria[\s\S]*?Desarrollador para toda implementación técnica/i);
  assert.match(lead, /tanto UI\/DOM\/presentación\/estados\/responsive como lógica\/datos\/API\/backend/i);
  assert.match(lead, /En una unidad que cruza frontend\/backend, conserva un solo Desarrollador como owner técnico/i);
  assert.match(developer, /Tu ownership incluye HTML\/DOM[\s\S]*?backend, APIs, lógica de negocio/i);
  assert.match(developer, /No delegates implementación de UI a otro agent/i);
  const routes = lead.slice(lead.indexOf("## Routing compacto"));
  assert.match(routes, /Implementación técnica full stack[\s\S]*?\| UI\/DOM[\s\S]*?`desarrollador`/i);
  assert.match(routes, /WordPress custom theme Greenfield[\s\S]*?Desarrollador es el único owner técnico/i);
  assert.match(lead, /Nunca uses el fast path DIRECT para saltarte al owner[\s\S]*?DIRECT reduce planning\/documentación, no cambia ownership/i);
  assert.match(developer, /No delegates implementación de UI a otro agent/i);
  assert.match(core, /Clasificar DIRECT no cambia el ownership de la superficie/i);
  assert.match(lead, /Test-Path -LiteralPath '\.cn-pilot\/runtime\/active-task\.json'/i);
  assert.match(lead, /Get-Item -LiteralPath '\.cn-pilot\/runtime\/active-task\.json' -Force \| Select-Object -ExpandProperty Attributes/i);
  assert.match(core, /PowerShell `Test-Path -LiteralPath '\.cn-pilot\/runtime\/active-task\.json'`/i);
  assert.match(lead, /Verifica Git con `git status` y luego `git diff`, por separado y sin flags, ambos allowlisted/i);
  assert.match(lead, /selecciona SOLO los del shell\/OS activo[\s\S]*?no ejecutes los probes POSIX/i);
  assert.match(core, /no encontrar `.cn-pilot\/runtime\/active-task.json` no confirma su ausencia/i);
  assert.match(bashPermissions, /"Test-Path -LiteralPath '\.cn-pilot\/runtime\/active-task\.json'": allow/);
  assert.match(bashPermissions, /"Get-Item -LiteralPath '\.cn-pilot\/runtime\/active-task\.json' -Force": allow/);
  assert.match(bashPermissions, /"Select-Object -ExpandProperty Attributes": allow/);
  assert.match(bashPermissions, /"test -e \.cn-pilot\/runtime\/active-task\.json": allow/);
  assert.match(bashPermissions, /"test -L \.cn-pilot\/runtime\/active-task\.json": allow/);
  assert.match(bashPermissions, /"test -f \.cn-pilot\/runtime\/active-task\.json": allow/);
  assert.match(bashPermissions, /"\*": ask/);
  assert.match(editPermissions, /"\*": ask/);
  assert.doesNotMatch(editPermissions, /"producto\/\*\*"\s*:\s*allow/i);
  assert.match(editPermissions, /"\.cn-pilot\/\*\*": allow/);
  assert.match(lead, /Cuando el checkpoint cite un PASS[\s\S]*?no repitas tests solo por precaución/i);
  assert.match(lead, /elimina solo `.cn-pilot\/runtime\/active-task\.json` con `apply_patch` \(`Delete File`\)/i);
  assert.match(core, /Un PASS checkpoint se reutiliza cuando registra comando\/scope vigente[\s\S]*?No repitas tests al cerrar únicamente por precaución/i);
  const checkpoint = JSON.parse(readCoreFile(".cn-pilot/agent-evals/fixtures/EVAL-004/working/active-task.json.fixture"));
  assert.equal(checkpoint.gates.find(({ name }) => name === "targeted test").evidencePath, ".cn-pilot/runtime/eval-setup.json");
});

test("Agent Eval run records preserve structured outcomes without inventing measurements", () => {
  const runs = fileURLToPath(new URL("../../artefactos/agent-evals/runs/", import.meta.url));
  if (!fs.existsSync(runs)) return;
  const files = fs.readdirSync(runs).filter((name) => name.endsWith(".json"));
  for (const filename of files) {
    const record = JSON.parse(fs.readFileSync(path.join(runs, filename), "utf8"));
    assert.equal(record.schemaVersion, 1, filename);
    for (const field of ["runId", "evalId", "startedAt", "finishedAt", "durationSource", "sourceCommit", "coreVersion", "kiloVersion", "configurationFingerprint", "configurationScope", "scenarioFingerprint", "sourceConfigState", "workspaceFingerprint", "request", "followUps", "criteria", "evidence", "defects", "humanInterventions", "durationMs", "tokenUsage", "limitations"])
      assert.ok(Object.hasOwn(record, field), `${filename} includes ${field}`);
    assert.ok(["PASS", "FAIL", "INCONCLUSIVE"].includes(record.result), `${filename} result is explicit`);
    assert.ok(record.criteria.every(({ result }) => ["PASS", "FAIL", "INCONCLUSIVE"].includes(result)), `${filename} criteria carry explicit outcomes`);
    if (record.durationMs === null) assert.equal(record.tokenUsage.total, null, `${filename} must not imply measurements when unmeasured`);
    if (record.tokenUsage.total === null) assert.ok(record.tokenUsage.source, `${filename} explains unavailable token aggregation`);
    assert.doesNotMatch(JSON.stringify(record), /C:\\\\Users\\\\[^\\\\]+\\\\AppData\\\\Local\\\\Temp/i, `${filename} does not disclose a personal scratch path`);
  }
});

test("update commands require deterministic filesystem discovery and preserve silent closure", () => {
  const status = fs.readFileSync(new URL("../../.kilo/commands/cn-estado.md", import.meta.url), "utf8");
  const update = fs.readFileSync(new URL("../../.kilo/commands/cn-actualizar.md", import.meta.url), "utf8");
  const updates = fs.readFileSync(new URL("../documentacion/ACTUALIZACIONES.md", import.meta.url), "utf8");

  assert.match(status, /No uses `Glob`/);
  assert.match(update, /No uses `Glob`/);
  assert.match(updates, /rev-parse/);
  assert.match(updates, /--show-toplevel/);
  assert.match(updates, /fs\.lstatSync/);
  assert.match(updates, /Solo updater realmente ausente clasifica como `LEGACY`/);
  assert.match(updates, /inválido bloquea.*sin reparar/s);
});

test("visual direction preserves designer ownership without autonomous aesthetic loops", () => {
  const system = fs.readFileSync(new URL("../../.kilo/skills/ui-design-system/SKILL.md", import.meta.url), "utf8");
  const designer = fs.readFileSync(new URL("../../.kilo/agents/disenador.md", import.meta.url), "utf8");
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const artDirection = fs.readFileSync(new URL("../../.kilo/skills/visual-art-direction/SKILL.md", import.meta.url), "utf8");
  const creative = fs.readFileSync(new URL("../../.kilo/skills/creative-web-experience/SKILL.md", import.meta.url), "utf8");
  const composition = fs.readFileSync(new URL("../../.kilo/skills/page-composition/SKILL.md", import.meta.url), "utf8");
  const application = fs.readFileSync(new URL("../../.kilo/skills/application-ui/SKILL.md", import.meta.url), "utf8");

  assert.match(system, /Calidad no equivale a moderación/);
  assert.match(system, /Display typography extrema, paletas intensas, densidad rica/);
  assert.match(designer, /La escala tipográfica puede ser contenida o extrema; no la moderes por convención/);
  assert.match(core, /La presencia visual puede ser sobria, densa, intensa o maximalista/);
  assert.match(artDirection, /también lo son intensidad, densidad y color fuertes/);
  assert.match(creative, /Default para una \*\*public web\*\* nueva/);
  assert.match(creative, /Infiere el rango de expresión y protagonismo que sirven al público/);
  assert.match(creative, /Existing conserva `continuity > novelty`/);
  assert.match(creative, /Approved\/Strict mantiene authority BF-048/);
  assert.match(creative, /responde por la calidad profesional de su propuesta/);
  assert.match(creative, /no se delega a Jefe, Desarrollador, Revisor ni a un ciclo automático de evaluación estética/);
  assert.match(creative, /corrige en un mismo pase cualquier defecto evidente que impida evaluarlo/);
  assert.doesNotMatch(creative, /Creative Refinement Pass|Genericity Risk/);
  assert.match(composition, /Dos regiones pueden compartir composición si esa continuidad tiene función/);
  assert.match(application, /no páginas de marketing/);

  for (const skill of ["creative-web-experience", "page-composition", "visual-art-direction", "motion-interaction", "ui-kit-construction", "visual-parity-review", "application-ui", "accessibility-review", "performance-review", "webapp-testing"]) {
    assert.equal(fs.existsSync(new URL(`../../.kilo/skills/${skill}/SKILL.md`, import.meta.url)), true, `${skill} remains active`);
  }
  assert.equal(fs.existsSync(new URL("../../.kilo/skills/ui-design-system/ATTRIBUTION.md", import.meta.url)), false);
});

test("accessibility-review applies relevant WCAG 2.2 criteria without universal checklist claims", () => {
  const skill = fs.readFileSync(new URL("../../.kilo/skills/accessibility-review/SKILL.md", import.meta.url), "utf8");
  const scenarios = [
    ["WCAG 2.2 AA remains a practical reference", /WCAG 2\.2 AA como referencia práctica/i],
    ["Focus Not Obscured accounts for sticky and overlay UI", /foco no totalmente ocultado por sticky headers, banners, overlays o dialogs[\s\S]{0,80}Focus Not Obscured/i],
    ["Redundant Entry is conditional on multi-step flow", /Redundant Entry[\s\S]{0,40}en procesos multi-step/i],
    ["Accessible Authentication avoids unnecessary cognitive puzzles", /Accessible Authentication[\s\S]{0,200}puzzles\/pruebas cognitivas innecesarios/i],
    ["drag alternatives, input purpose, errors and reflow are covered", /alternativas de pointer para acciones de arrastre[\s\S]{0,220}propósito\/autocomplete de inputs[\s\S]{0,180}orientación\/reflow/i],
    ["scope and risk select criteria and evidence", /scope\/risk → criterios aplicables → evidencia proporcional/i],
    ["automated scans do not establish conformance", /automated scan != accessibility conformance/],
  ];
  for (const [scenario, pattern] of scenarios) assert.ok(pattern.test(skill), `${scenario}: policy is present`);
});

test("Bricks routes to available modern capabilities without a builder-wide recipe", () => {
  const skill = fs.readFileSync(new URL("../../.kilo/skills/bricks/SKILL.md", import.meta.url), "utf8");
  const invariants = [
    ["Bricks and add-on versions/capabilities are confirmed only when relevant", "versión Bricks y add-ons si importan"],
    ["properties are deliberate component APIs", "Properties exponen decisiones configurables intencionales"],
    ["variants and slots express real variations and content", "variants nombran variaciones/estados reales", "slots permiten contenido flexible"],
    ["query context and empty states are considered", "fuente/query owner real", "pagination", "empty state", "nested-query behavior", "Query System/Global Query"],
    ["native interactions can handle simple behavior without business logic", "Las Bricks Interactions nativas", "no las uses para business logic"],
    ["global classes and variables remain a shared source", "Classes, variables, Components, global styles y breakpoints son un sistema compartido"],
    ["editable source and component propagation are verified", "fuente editable", "component propagation", "editor state"],
  ];
  for (const [scenario, ...phrases] of invariants) assert.ok(phrases.every((phrase) => skill.includes(phrase)), `${scenario}: invariant is present`);
  assert.ok(skill.includes("source/component") && skill.includes("instance") && skill.includes("local override"), "components distinguish source, instances and overrides");
  assert.match(skill, /inspecciona alcance y efecto antes de editar/i);
  assert.match(skill, /usa `source-grounded-development` con fuente oficial cuando la documentación vigente pueda cambiar la implementación/i);
  assert.match(skill, /viewports mínimos[\s\S]{0,100}no son una matriz obligatoria/i);
  assert.doesNotMatch(skill, /verifica desktop, tablet y móvil\./i, "Bricks QA does not mandate three viewports per change");
});

test("performance-review measures the causal layer and avoids universal score/budget targets", () => {
  const skill = fs.readFileSync(new URL("../../.kilo/skills/performance-review/SKILL.md", import.meta.url), "utf8");
  const scenarios = [
    ["field and lab evidence remain distinct", /datos de campo[\s\S]{0,160}laboratorio/i],
    ["browser/network, main thread and rendering are separate diagnostic layers", /Browser\/network[\s\S]{0,260}Main thread\/JS[\s\S]{0,260}Rendering/i],
    ["LCP is decomposed into response/discovery/download/render", /TTFB\/response,[\s\S]{0,160}render delay/i],
    ["INP and CLS causes remain causal rather than recipe-based", /input delay,[\s\S]{0,100}presentación[\s\S]{0,100}CLS/i],
    ["server/backend causes are included when applicable", /Server\/backend[\s\S]{0,240}external HTTP latency/i],
    ["evidence follows comparable measure-hypothesis-change cycle", /medir → localizar la categoría dominante → hipótesis falsable → cambio mínimo → repetir medición comparable/i],
    ["no universal tool or budget is required", /No exijas herramientas, score ni budget universal/i],
    ["WordPress specialization stays conditional", /Activa esta sección solo cuando el stack confirmado sea WordPress\/WooCommerce/i],
  ];
  for (const [scenario, pattern] of scenarios) assert.ok(pattern.test(skill), `${scenario}: policy is present`);
  assert.match(skill, /no persigas 100\/100/i);
});

test("responsive and motion modernize browser options without replacing existing authority", () => {
  const responsive = fs.readFileSync(new URL("../../.kilo/skills/frontend-responsive/SKILL.md", import.meta.url), "utf8");
  const motion = fs.readFileSync(new URL("../../.kilo/skills/motion-interaction/SKILL.md", import.meta.url), "utf8");
  assert.match(responsive, /Greenfield sin breakpoints\/fuente aprobados[\s\S]{0,140}`\.cn-pilot\/config\/responsive\.json`/);
  assert.match(responsive, /container queries cuando un componente reutilizable[\s\S]{0,180}no por el viewport/i);
  assert.match(responsive, /breakpoint content-driven excepcional[\s\S]{0,180}escala global divergente/i);
  assert.match(responsive, /fluidez\/layout intrínsecos sin breakpoint/i);
  assert.match(motion, /View Transitions API[\s\S]{0,220}no la añadas[\s\S]{0,120}universal/i);
  assert.match(motion, /CSS Scroll-Driven Animations[\s\S]{0,260}No reemplaza automáticamente GSAP/i);
  assert.match(motion, /source\/range deben alcanzar el estado final dentro del extent real de scroll[\s\S]{0,220}max scroll y reverse/i);
  assert.match(motion, /Usa `@supports` para comprobar todas las propiedades empleadas por la timeline/i);
  assert.match(motion, /consulta `source-grounded-development` con fuente primaria/i);
});

test("UI Kit focus and clamp rules are contextual while base readability remains intact", () => {
  const kit = fs.readFileSync(new URL("../../.kilo/skills/ui-kit-construction/SKILL.md", import.meta.url), "utf8");
  assert.match(kit, /html \{\s*font-size: 100%;/);
  assert.match(kit, /texto base usa token real[\s\S]{0,100}mínimo de 16px/i);
  assert.match(kit, /Prefiere `clamp\(\)` cuando el tamaño debe escalar/i);
  assert.match(kit, /No es obligatorio para todo token tipográfico/i);
  assert.match(kit, /Prefiere spacing fluido cuando el valor crece\/decrece/i);
  assert.match(kit, /No exijas `clamp\(\)` para cada token reusable/i);
  assert.match(kit, /Si usas `clamp\(\)`, sus endpoints siguen el contrato de px/i);
  assert.match(kit, /Borde, outline, box-shadow\/ring o su combinación son soluciones válidas/i);
  assert.match(kit, /No elimines `outline` sin un reemplazo igual o más perceptible/i);
  assert.match(kit, /forced-colors\/high-contrast/i);
  assert.doesNotMatch(kit, /Todo token nuevo de tamaño tipográfico definido en el Kit usa `clamp\(\)`/i);
  assert.doesNotMatch(kit, /no agrega outline\/halo\/box-shadow grueso/i);
});

test("security and database guidance cover conditional risk and compatible migrations", () => {
  const security = fs.readFileSync(new URL("../../.kilo/skills/security-review/SKILL.md", import.meta.url), "utf8");
  const database = fs.readFileSync(new URL("../../.kilo/skills/database-migrations/SKILL.md", import.meta.url), "utf8");
  assert.match(security, /Si el servidor consume una URL entregada o influida por usuario, evalúa SSRF/i);
  assert.match(security, /destinos privados\/internos, redirects y resolución\/validación DNS/i);
  assert.match(security, /provenance, maintenance, lockfile, scope, install scripts y riesgo de supply chain/i);
  assert.match(security, /artefactos no confiables\/no verificados[\s\S]{0,180}trust de eventos\/webhooks/i);
  assert.match(security, /fail-open\/error conditions/i);
  assert.match(security, /redemption repetido, manipulación de precio, bypass de workflow/i);
  assert.match(security, /no forman un checklist OWASP universal/i);
  assert.match(database, /Cuando lectores\/writers de varias versiones puedan coexistir[\s\S]{0,260}expand → desplegar código compatible → backfill\/verify → switch → contract/i);
  assert.match(database, /una migración offline, pequeña y versionada puede ser más simple/i);
  assert.match(database, /batches, marker\/cursor de resume, idempotency/i);
});

test("content page/blog and browser testing add evidence only for relevant use cases", () => {
  const blog = fs.readFileSync(new URL("../../.kilo/skills/content-blog-seo/SKILL.md", import.meta.url), "utf8");
  const page = fs.readFileSync(new URL("../../.kilo/skills/content-page/SKILL.md", import.meta.url), "utf8");
  const browser = fs.readFileSync(new URL("../../.kilo/skills/webapp-testing/SKILL.md", import.meta.url), "utf8");
  assert.match(blog, /fuentes primarias\/autoritativas[\s\S]{0,180}fecha\/publication\/update context/i);
  assert.match(blog, /Distingue contenido evergreen[\s\S]{0,160}consensus/i);
  assert.match(page, /Cuando conversión\/confianza lo requiera[\s\S]{0,200}objeciones\/fricción[\s\S]{0,180}proof\/trust confirmado/i);
  assert.match(page, /No inventes testimonials, cifras[\s\S]{0,200}risk reversal/i);
  assert.match(browser, /Cuando el flujo existente tenga sesión\/roles[\s\S]{0,180}URL directa no autorizada/i);
  assert.match(browser, /fixtures determinísticas seguras[\s\S]{0,120}no tomes datos productivos/i);
  assert.match(browser, /Network slow\/timeout[\s\S]{0,200}no todos por rutina/i);
  assert.match(browser, /Si comportamiento depende del tiempo[\s\S]{0,180}no inventes fake-timer infrastructure/i);
});

test("WordPress deploy/plugin skills inherit Product Contract 2.7 without migrating Existing", () => {
  const deploy = fs.readFileSync(new URL("../../.kilo/skills/deploy-wordpress/SKILL.md", import.meta.url), "utf8");
  const plugin = fs.readFileSync(new URL("../../.kilo/skills/wordpress-plugin/SKILL.md", import.meta.url), "utf8");
  assert.match(deploy, /`producto\/wp-content\/themes\/<slug>\/`[\s\S]{0,160}`producto\/wp-content\/plugins\/<slug>\/`/);
  assert.match(deploy, /No despliegues WordPress Core[\s\S]{0,180}uploads\/media de runtime/i);
  assert.match(deploy, /Existing compatibility exception[\s\S]{0,180}no muevas un theme\/plugin/i);
  assert.match(plugin, /`producto\/wp-content\/plugins\/<plugin-slug>\/`/);
  assert.match(plugin, /no crees ese directorio ni un plugin scaffold/i);
  assert.match(plugin, /Existing conserva root\/path\/CI\/deploy/i);
});

test("analytics instrumentation has a distinct owner, useful events and privacy-aware verification", () => {
  const skill = fs.readFileSync(new URL("../../.kilo/skills/analytics-instrumentation/SKILL.md", import.meta.url), "utf8");
  const description = skill.match(/^description: (.+)$/m)?.[1] ?? "";
  assert.match(skill, /^name: analytics-instrumentation$/m);
  assert.ok(description.length > 50, "analytics capability has a bounded technical description");
  const scenarios = [
    ["Developer owns technical instrumentation", /Desarrollador es owner técnico/i],
    ["measurement starts from a business question/outcome", /business question\/outcome → event → trigger → parameters → destination → verification/i],
    ["events are semantic and not click explosion", /Nombres como `lead_submitted`[\s\S]{0,240}Evita `click_1`/i],
    ["SPA tracking avoids duplicate pageviews", /SPA\/client routing verifica route\/history changes[\s\S]{0,180}pageviews duplicados/i],
    ["form conversion depends on confirmed success, not a button click", /Una conversión usa éxito confirmado por backend\/CRM[\s\S]{0,120}no un click/i],
    ["ecommerce measurement coordinates WooCommerce and deduplicates", /Si WooCommerce\/ecommerce está en scope, coordina `woocommerce`[\s\S]{0,260}deduplication/i],
    ["consent and PII are guarded", /Respeta mecanismo y configuración de consentimiento existentes/i],
    ["sensitive personal data is prohibited", /nunca envíes passwords, tokens, payment data[\s\S]{0,120}PII/i],
    ["destination receipt is distinguished from dataLayer emission", /Un evento visible en dataLayer\/console demuestra emisión[\s\S]{0,180}no recepción/i],
    ["server-side tracking is not a default", /No agregues server-side tracking[\s\S]{0,140}por moda/i],
    ["volatile vendor APIs require primary source grounding", /usa `source-grounded-development` con documentación primaria/i],
    ["Existing taxonomies/integrations are preserved", /preserva la taxonomía\/integración Existing/i],
  ];
  for (const [scenario, pattern] of scenarios) assert.ok(pattern.test(skill), `${scenario}: policy is present`);
  assert.ok(skill.includes("Actívala cuando el trabajo incluya implementación o debugging de event tracking"), "analytics has a technical implementation trigger");
  assert.ok(skill.includes("No por la mera presencia de analytics en un proyecto, por cualquier CTA o porque se hable de objetivos/KPIs"), "analytics excludes incidental website, CTA and KPI mentions");
});

test("debugging/analytics route to one full-stack Developer and editorial work to Redactor", () => {
  const lead = fs.readFileSync(new URL("../../.kilo/agents/jefe-proyecto.md", import.meta.url), "utf8");
  const developer = fs.readFileSync(new URL("../../.kilo/agents/desarrollador.md", import.meta.url), "utf8");
  const redactor = fs.readFileSync(new URL("../../.kilo/agents/redactor.md", import.meta.url), "utf8");
  assert.match(lead, /Síntoma real de bug, regresión[\s\S]{0,180}`systematic-debugging` antes del fix/i);
  assert.match(lead, /No la actives por feature request, refactor o pregunta conceptual/i);
  assert.match(lead, /Analytics\/event measurement con implementación[\s\S]{0,120}`analytics-instrumentation`/i);
  assert.match(developer, /Ante un bug\/regresión\/fallo de integración[\s\S]{0,180}`systematic-debugging`/i);
  assert.match(developer, /no crees un handoff artificial entre frontend y backend/i);
  assert.match(developer, /analytics\/event measurement[\s\S]{0,120}`analytics-instrumentation`/i);
  assert.match(redactor, /UX writing|microcopy/i);
  assert.doesNotMatch(redactor, /analytics-instrumentation/, "Redactor does not become the technical instrumentation owner");
  const agents = fs.readdirSync(new URL("../../.kilo/agents/", import.meta.url)).filter((file) => file.endsWith(".md"));
  assert.equal(agents.length, 6, "the six-agent topology remains exact");
});

test("six-agent routing covers multidisciplinary scopes and technical owners", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const lead = read(".kilo/agents/jefe-proyecto.md");
  const developer = read(".kilo/agents/desarrollador.md");
  const designer = read(".kilo/agents/disenador.md");
  const redactor = read(".kilo/agents/redactor.md");
  const routing = lead.slice(lead.indexOf("## Routing compacto"));
  const environment = read(".kilo/skills/environment-dependency-management/SKILL.md");
  const wordpressTheme = read(".kilo/skills/wordpress-theme-development/SKILL.md");

  assert.match(lead, /Diseñador para dirección\/UX\/UI visual, Redactor para estrategia\/editorial\/SEO de contenido y Desarrollador para toda implementación técnica/i);
  assert.match(lead, /BF-074\/075/);
  assert.match(lead, /Producción no web, nuevo medio o herramienta especializada/i);
  assert.match(lead, /`tool-discovery`/);
  assert.match(lead, /En una unidad que cruza frontend\/backend, conserva un solo Desarrollador como owner técnico/i);
  assert.match(routing, /Implementación técnica full stack[\s\S]*?UI\/DOM[\s\S]*?backend[\s\S]*?`desarrollador`/i);
  assert.match(routing, /WordPress custom theme Greenfield[\s\S]*?Desarrollador es el único owner técnico/i);
  assert.match(routing, /Preparación del entorno\/dependencias[\s\S]*?`environment-dependency-management`/i);
  assert.match(developer, /React, Astro, Next\.js, PHP, WordPress\/WooCommerce, Laravel, Node\.js, Python, SQL/i);
  assert.match(developer, /Implementa software, soluciones técnicas, datos, APIs, integraciones y automatización/i);
  assert.match(developer, /no convierte disciplinas ajenas en programación/i);
  assert.match(designer, /dirección visual, experiencia y producción artística en cualquier medio/i);
  assert.match(designer, /`tool-discovery`/);
  assert.match(redactor, /investigación, estrategia editorial, narrativa y comunicación publicable adaptada a diferentes entregables/i);
  assert.match(redactor, /`tool-discovery`/);
  assert.match(developer, /Diseñador conserva autoridad de UX\/dirección visual[\s\S]*?no re-diseñes/i);
  assert.match(developer, /Design-only no autoriza Product[\s\S]*?consume el prototipo\/Kit\/copy aprobados como source of truth/i);
  assert.match(designer, /el Diseñador es responsable de la dirección y de entregar su mejor propuesta profesional/i);
  assert.match(redactor, /narrativa|UX writing/i);
  assert.match(wordpressTheme, /Desarrollador es el único owner técnico/i);
  assert.match(environment, /lockfile/i);
  assert.match(environment, /No instales tools globales/i);
  assert.match(environment, /`ask` es un gate host, no autorización que se pueda eludir/i);
  assert.match(environment, /no leas\/imprimas `\.npmrc`, `\.pypirc`, secretos ni credenciales/i);
  assert.match(environment, /Los permisos de lectura de Kilo no sandboxean el subprocess/i);
  assert.match(environment, /`npm ci` puede reemplazar `node_modules`[\s\S]*?no lo ejecutes/i);
  assert.match(environment, /Inicializa directamente en el root autorizado[\s\S]*?destino no contiene archivos que puedan sobrescribirse/i);
  assert.match(environment, /No uses `--force`[\s\S]*?flags que desactiven validaciones/i);
  assert.match(environment, /scripts\/plugins\/hooks[\s\S]*?detente y solicita el gate específico/i);
});

test("testing-strategy keeps one BF-057 full-stack section with prior behavior", () => {
  const strategy = fs.readFileSync(new URL("../../.kilo/skills/testing-strategy/SKILL.md", import.meta.url), "utf8");
  const headings = strategy.match(/^#{2,3} .*BF-057.*$/gm) ?? [];
  assert.equal(headings.length, 1, "BF-057 full-stack guidance is consolidated once");
  assert.match(strategy, /alinea primero la interfaz mínima/i);
  assert.match(strategy, /vertical slice/i);
  assert.match(strategy, /check existente más barato/i);
  assert.match(strategy, /conserva evidencia vigente/i);
  assert.match(strategy, /No impongas slice overhead a un sitio estático/i);
});

test("human documentation matches Core version, entry points, commands and Kilo-native scope", () => {
  const root = new URL("../../", import.meta.url);
  const read = (relative) => fs.readFileSync(new URL(relative, root), "utf8");
  const readme = read("README.md");
  const version = read(".cn-pilot-version").trim();
  const intro = read(".cn-pilot/documentacion/EMPIEZA-AQUI.md");
  const docs = read(".cn-pilot/documentacion/README.md");
  const guide = read(".cn-pilot/documentacion/COMANDOS.md");
  const commands = new Set(fs.readdirSync(new URL(".kilo/commands/", root)).filter((name) => name.endsWith(".md")).map((name) => `/${name.slice(0, -3)}`));
  const commandLinks = [...guide.matchAll(/`(\/[a-z0-9-]+)`/g)].map((match) => match[1]);

  assert.match(readme, new RegExp(`CN Pilot ${version.replaceAll(".", "\\.")}`));
  assert.match(readme, /\[Empieza aquí\]\(\.cn-pilot\/documentacion\/EMPIEZA-AQUI\.md\)/);
  assert.match(readme, /nativo de Kilo Code/i);
  assert.match(readme, /no necesitas programar, diseñar prompts técnicos/i);
  assert.match(readme, /no hace push, publica ni modifica producción por defecto/i);
  assert.doesNotMatch(readme, /multi-agent portability|universal multi-agent/i);
  assert.match(readme, /producto\/wp-content\//);
  assert.match(readme, /No.*WordPress Core/i);
  assert.match(readme, /instrumentación de analytics se crea cuando existe un objetivo de medición/i);
  assert.match(readme, /Project Context/);
  assert.match(intro, /Decide tú/);
  assert.match(intro, /Pending/);
  assert.match(intro, /no hace falta memorizar comandos/i);
  assert.match(intro, /no se ejecutan por defecto|no.*push|no.*deploy/i);
  assert.match(docs, /COMANDOS\.md/);
  assert.match(docs, /SKILLS-Y-CAPACIDADES\.md/);
  assert.match(docs, /GLOSARIO\.md/);
  assert.equal(commandLinks.length, commands.size, "every current command has one catalog entry");
  assert.deepEqual([...new Set(commandLinks)].sort(), [...commands].sort(), "command catalog exactly matches the command filesystem");
});

test("documentation catalog inventories the actual agents and skills without requiring manual selection", () => {
  const root = new URL("../../", import.meta.url);
  const catalog = fs.readFileSync(new URL("../../.cn-pilot/documentacion/SKILLS-Y-CAPACIDADES.md", import.meta.url), "utf8");
  const agentGuide = fs.readFileSync(new URL("../../README.md", import.meta.url), "utf8");
  const actualSkills = fs.readdirSync(new URL("../../.kilo/skills/", import.meta.url)).filter((name) => fs.existsSync(new URL(`../../.kilo/skills/${name}/SKILL.md`, import.meta.url))).sort();
  const listedSkills = [...catalog.matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((match) => match[1]).sort();
  const actualAgents = fs.readdirSync(new URL("../../.kilo/agents/", import.meta.url)).filter((name) => name.endsWith(".md"));
  const listedAgents = [...agentGuide.matchAll(/^\| (Jefe de proyecto|Arquitecto|Diseñador|Redactor|Desarrollador|Revisor) \|/gm)].map((match) => match[1]).sort();
  const agentLabels = ["Jefe de proyecto", "Arquitecto", "Diseñador", "Redactor", "Desarrollador", "Revisor"].sort();
  assert.deepEqual(listedSkills, actualSkills, "skill catalog has no omissions or invented skills");
  assert.equal(actualAgents.length, 6, "agent catalog has exactly six custom agents");
  assert.deepEqual(listedAgents, agentLabels, "README describes the six real agents with human-facing names");
  assert.ok(listedSkills.includes("environment-dependency-management"), "cross-stack environment management is catalogued");
  assert.ok(catalog.includes("No tienes que elegir") && catalog.includes("bajo demanda"), "skills stay discoverable without becoming a user selection chore");
});

test("documentation navigation links resolve to existing files and headings", () => {
  const root = new URL("../../", import.meta.url);
  const sources = [
    "README.md",
    ".cn-pilot/documentacion/README.md",
    ".cn-pilot/documentacion/COMANDOS.md",
    ".cn-pilot/documentacion/SKILLS-Y-CAPACIDADES.md",
    ".cn-pilot/documentacion/GLOSARIO.md",
    ".cn-pilot/documentacion/EMPIEZA-AQUI.md",
    ".cn-pilot/documentacion/CONFIGURACION-KILO.md",
    ".cn-pilot/documentacion/CONFIGURACION.md",
    ".cn-pilot/documentacion/ESTRATEGIA-DE-MODELOS.md",
    ".cn-pilot/documentacion/CICLO-DE-VIDA.md",
    ".cn-pilot/documentacion/FLUJO-DE-EQUIPO.md",
    ".cn-pilot/documentacion/FLUJO-GIT.md",
    ".cn-pilot/documentacion/INTERACCION-HUMANA.md",
    ".cn-pilot/documentacion/SEGURIDAD.md",
    ".cn-pilot/documentacion/ACTUALIZACIONES.md",
    ".cn-pilot/documentacion/SOLUCION-DE-PROBLEMAS.md",
  ];
  for (const source of sources) {
    const content = fs.readFileSync(new URL(`../../${source}`, import.meta.url), "utf8");
    const links = [...content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]);
    for (const link of links) {
      if (/^(?:[a-z]+:|mailto:|#)/i.test(link)) continue;
      const [target, anchor] = link.split("#", 2);
      const resolved = new URL(target, new URL(`../../${source}`, import.meta.url));
      assert.equal(resolved.protocol, "file:", `${source}: only local file links are checked here`);
      assert.equal(fs.existsSync(resolved), true, `${source}: linked file exists: ${target}`);
      if (anchor) {
        const linkedContent = fs.readFileSync(resolved, "utf8");
        const headings = [...linkedContent.matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)].map((match) => match[1].toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-"));
        assert.ok(headings.includes(decodeURIComponent(anchor).toLowerCase()), `${source}: linked heading exists: ${link}`);
      }
    }
  }
  assert.ok(sources.length > 0);
});

test("human Project Context scaffolds explain ownership without updating real projects", () => {
  const readme = fs.readFileSync(new URL("../../README.md", import.meta.url), "utf8");
  const project = fs.readFileSync(new URL("../../PROYECTO.md", import.meta.url), "utf8");
  const requirements = fs.readFileSync(new URL("../../REQUISITOS.md", import.meta.url), "utf8");
  const state = fs.readFileSync(new URL("../../ESTADO.md", import.meta.url), "utf8");
  const decisions = fs.readFileSync(new URL("../../DECISIONES.md", import.meta.url), "utf8");
  const artifacts = fs.readFileSync(new URL("../../ARTEFACTOS.md", import.meta.url), "utf8");
  const contextStart = readme.indexOf("## Dónde va cada cosa");
  const contextEnd = readme.indexOf("## Agentes", contextStart);
  const summary = readme.slice(contextStart, contextEnd);
  assert.ok(contextStart >= 0 && contextEnd > contextStart);
  for (const file of ["PROYECTO.md", "REQUISITOS.md", "ESTADO.md", "DECISIONES.md", "ARTEFACTOS.md"]) assert.ok(summary.includes(file), `${file} has an onboarding explanation`);
  assert.match(project, /facts|hechos estables|Identidad/i);
  assert.match(project, /no hace falta definir el público/i);
  assert.match(requirements, /Criterios de aceptación/);
  assert.match(state, /Estado operativo resumido/);
  assert.match(state, /Ninguna tarea activa|Ninguna/);
  assert.match(decisions, /Fuente de decisiones de proyecto aprobadas\/materiales/);
  assert.match(artifacts, /No convertir este archivo en un changelog/);
});

test("BF-072 contractual UX defaults preserve scope, authority, and accessible interaction", () => {
  const read = (file) => fs.readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const architecture = read(".kilo/skills/frontend-architecture/SKILL.md");
  const kit = read(".kilo/skills/ui-kit-construction/SKILL.md");
  const responsive = read(".kilo/skills/frontend-responsive/SKILL.md");
  const motion = read(".kilo/skills/motion-interaction/SKILL.md");
  const accessibility = read(".kilo/skills/accessibility-review/SKILL.md");
  const reviewer = read(".kilo/agents/revisor.md");
  assert.match(core, /Header principal[\s\S]*?permanece visible durante el scroll[\s\S]*?position: sticky; top: 0[\s\S]*?Application UI/i);
  assert.match(core, /Existing fuera del scope conserva[\s\S]*?Approved\/Strict prevalece[\s\S]*?actualización del Core no modifica Product/i);
  assert.match(architecture, /sticky[\s\S]*?fixed[\s\S]*?scroll-padding-top[\s\S]*?CLS[\s\S]*?Application UI/i);
  assert.match(architecture, /cursor: pointer[\s\S]*?:focus-visible[\s\S]*?hover perceptible[\s\S]*?transition: all[\s\S]*?layout shift/i);
  assert.match(architecture, /disabled\/loading\/error se expresan según los estados reales, sin aparentar clicabilidad/i);
  assert.match(responsive, /permanece visible durante scroll también en mobile[\s\S]*?menú móvil[\s\S]*?anchors/i);
  assert.match(kit, /Header\/Mobile Header[\s\S]*?navegación persistente/i);
  assert.match(kit, /cursor: pointer[\s\S]*?disabled/i);
  assert.match(motion, /transición CSS breve[\s\S]*?touch[\s\S]*?prefers-reduced-motion/i);
  assert.match(accessibility, /Header persistente[\s\S]*?anchors[\s\S]*?:focus-visible[\s\S]*?reduced motion/i);
  assert.match(reviewer, /Header desaparece al scroll[\s\S]*?anchors[\s\S]*?layout shift[\s\S]*?disabled/i);
});

test("Implementation-first QA uses source gate, minimal evidence, grouped fixes, and valid PASS reuse", () => {
  const read = (file) => fs.readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const architecture = read(".kilo/skills/frontend-architecture/SKILL.md");
  const responsive = read(".kilo/skills/frontend-responsive/SKILL.md");
  const webapp = read(".kilo/skills/webapp-testing/SKILL.md");
  const parity = read(".kilo/skills/visual-parity-review/SKILL.md");
  const strategy = read(".kilo/skills/testing-strategy/SKILL.md");
  const developer = read(".kilo/agents/desarrollador.md");
  const projectLead = read(".kilo/agents/jefe-proyecto.md");
  const reviewer = read(".kilo/agents/revisor.md");
  assert.match(core, /Implementation first[\s\S]*?source-only[\s\S]*?defectos determinísticos[\s\S]*?no usa Browser[\s\S]*?check disponible más barato/i);
  assert.match(architecture, /Implementation Quality Gate[\s\S]*?archivos\/regiones recién escritos o cambiados[\s\S]*?box-sizing: border-box[\s\S]*?width: 100%[\s\S]*?minmax\(0,[\s\S]*?min-width: 0[\s\S]*?100vw[\s\S]*?heights fijas[\s\S]*?dead CSS\/JS[\s\S]*?no Browser/i);
  assert.match(architecture, /Approved\/Strict preserva fidelidad[\s\S]*?Existing aplica guardrails solo a código nuevo\/modificado/i);
  assert.match(responsive, /viewport representativo de \*\*360px de ancho\*\*[\s\S]*?no breakpoint ni única garantía/i);
  assert.match(responsive, /Browser\/resizing\/computed layout[\s\S]*?sin capturas guardadas/i);
  assert.match(webapp, /screenshots por defecto: son evidencia, no logging[\s\S]*?captura responde una pregunta[\s\S]*?360px/i);
  assert.match(webapp, /Completa la inspección Round 1 y agrupa findings antes de editar[\s\S]*?no screenshot después de cada fix/i);
  assert.match(parity, /solo viewports\/estados designados por reference\/scope[\s\S]*?no inventes resoluciones[\s\S]*?no hagas sweep/i);
  assert.match(strategy, /Implementation Quality Gate[\s\S]*?un viewport de 360px[\s\S]*?no reinicies QA omnibus/i);
  assert.match(developer, /No abras Browser\/capturas tras cada sección o fix[\s\S]*?viewports solo responden una pregunta concreta/i);
  assert.match(developer, /agrupa hallazgos compatibles en una ronda[\s\S]*?retestea solo superficies afectadas/i);
  assert.match(projectLead, /source-only antes de Browser[\s\S]*?no actives un paquete omnibus[\s\S]*?conserva PASS no invalidado/i);
  assert.match(reviewer, /defectos determinísticos visibles en source[\s\S]*?capture logging[\s\S]*?no exijas Browser/i);
});

test("Project Lead owns task-specific mandatory constraints and specialists cannot downgrade outcomes", () => {
  const read = (file) => fs.readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const lead = read(".kilo/agents/jefe-proyecto.md");
  const reviewer = read(".kilo/agents/revisor.md");
  const governance = core.slice(core.indexOf("### Gobierno del outcome y handoff por owner"), core.indexOf("## Permisos"));
  assert.match(governance, /Jefe de proyecto es accountable del outcome[\s\S]*?invariantes Core[\s\S]*?handoff compacto/i);
  assert.match(governance, /El especialista controla el método[\s\S]*?no puede degradar el outcome en silencio[\s\S]*?antes de variar/i);
  assert.match(governance, /`COMPLETED` no sustituye reconciliación[\s\S]*?vuelve al mismo owner[\s\S]*?Revisor es segunda opinión read-only/i);
  assert.match(governance, /`Decide tú`[\s\S]*?no autoriza saltar el Quality Floor[\s\S]*?opt-out explícito prevalece/i);
  assert.match(lead, /Antes de delegar, adjunta goal\/scope autorizado\/owner\/source of truth, contexto y restricciones pertinentes, acceptance\/resultado esperado, gates y evidencia disponible/i);
  assert.match(lead, /source of truth, decisiones materiales concretas[\s\S]*responsive, motion\/reduced-motion/i);
  assert.match(lead, /Jefe no instituye ciclos creativos\/capturas ni sustituye aprobación humana/i);
  assert.match(lead, /método es del especialista, mandatory defaults\/outcome no son opcionales[\s\S]*?omisión recuperable vuelve al mismo owner/i);
  assert.match(reviewer, /No juzgues gusto ni sustituyas la aprobación humana/i);
});

test("Open public-web motion floor is executable, intent-first, and preserves authority exceptions", () => {
  const read = (file) => fs.readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const creative = read(".kilo/skills/creative-web-experience/SKILL.md");
  const motion = read(".kilo/skills/motion-interaction/SKILL.md");
  const kit = read(".kilo/skills/ui-kit-construction/SKILL.md");
  const composition = read(".kilo/skills/page-composition/SKILL.md");
  const designer = read(".kilo/agents/disenador.md");
  const developer = read(".kilo/agents/desarrollador.md");
  const reviewer = read(".kilo/agents/revisor.md");
  const floorStart = core.indexOf("### Visual Quality Floor de Public Web (BF-068)");
  const floorEnd = core.indexOf("## Arquitectura frontend y fidelidad (BF-069)", floorStart);
  const floor = core.slice(floorStart, floorEnd);
  assert.match(floor, /Motion obligatorio para Public Web abierta:[\s\S]*?la Flagship ejecutable demuestra/i);
  assert.match(floor, /opt-out explícito, authority incompatible o constraint material confirmado y resuelto por Jefe/i);
  assert.match(floor, /hero\/page choreography diseñada[\s\S]*?progresión scroll-linked material posterior al Hero[\s\S]*?comportamiento elegido por composición\/rol para secciones principales[\s\S]*?microinteracciones[\s\S]*?momento memorable/i);
  assert.match(floor, /Define calidad mínima, no un estilo obligatorio[\s\S]*?composición sobria\/minimal es válida/i);
  assert.match(floor, /No hay cuota de efectos, parallax, pins o librerías[\s\S]*?Un sistema consistente solo de `opacity\/translateY\/stagger`/i);
  assert.match(floor, /No se impone universalmente a Application UI, Existing localized, páginas derivadas de un sistema aprobado ni referencias Approved\/Strict[\s\S]*?Application UI conserva su fast path/i);
  assert.match(floor, /Responsive conserva el intent con adaptación mobile[\s\S]*?prefers-reduced-motion[\s\S]*?Conserva teclado, foco y scroll nativo/i);
  assert.match(floor, /un opt-out humano limita exactamente el behavior\/scope[\s\S]*?sin scroll effects[\s\S]*?No uses GSAP[\s\S]*?limita tecnología, no experiencia/i);
  assert.match(creative, /Motion material queda diseñado y demostrado en la propuesta correspondiente/i);
  assert.match(creative, /STATIC|NONE\/static solo es válido por opt-out explícito[\s\S]*?constraint material/i);
  assert.match(creative, /opt-out se aplica exactamente al behavior\/scope pedido[\s\S]*?no GSAP.*limita tecnología, no experience/i);
  assert.match(motion, /smallest capable tool that faithfully implements the already-defined experience/i);
  assert.match(motion, /frecuencia\/repetición, urgencia y efecto[\s\S]*?estado inicial → cambio visible → estado final[\s\S]*?reversa\/interrupción/i);
  assert.match(motion, /GSAP:[\s\S]*?Ningún trigger obliga a GSAP/i);
  assert.match(motion, /dependencia reversible de implementación[\s\S]*?licencia no aceptada/i);
  assert.match(motion, /opt-out del usuario se aplica solo a los behavior\/scope expresados[\s\S]*?No GSAP[\s\S]*?no la experiencia/i);
  assert.match(motion, /Nunca añadas dependency\/CDN\/script\/node_modules a template CN Pilot/i);
  assert.match(motion, /No uses screenshots como prueba de motion/i);
  assert.match(kit, /tokens\/convenciones compartidos[\s\S]*?no repitas aquí el floor BF-068/);
  assert.match(composition, /mapa compacto por región[\s\S]*?relación de continuidad o contraste/);
  assert.match(designer, /aplica el floor de motion de BF-068: define en la dirección qué relación narrativa\/visual cambia y por qué/i);
  assert.match(developer, /preserva BF-068 y el intent aprobado[\s\S]*?No sustituyas motion por fades genéricos ni inventes efectos/i);
  assert.match(reviewer, /aplica read-only la aceptación normativa de `[\s\S]*?BF-068[\s\S]*?progresión scroll posterior al Hero[\s\S]*?momento memorable/i);
  assert.match(reviewer, /No juzgues gusto ni sustituyas la aprobación humana/i);
  assert.match(floor, /Revisor no sustituye el gate primario ni inicia Browser\/capturas\/auditorías por rutina/i);
});
