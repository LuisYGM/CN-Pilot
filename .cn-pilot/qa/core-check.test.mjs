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
    '    "revisor": allow',
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
    "# Jefe de proyecto",
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
    "# Revisor",
  ].join("\n") + "\n";

  const manifest = [
    "- 7 agentes en `.kilo/agents/`",
    "- 2 skills (`.kilo/skills/*/SKILL.md`)",
    "- 1 documento de referencia bajo `.kilo/skills/technical-seo/references/` (no es una skill adicional)",
    "- 14 comandos en `.kilo/commands/`",
    "- 1 perfil en `.cn-pilot/perfiles/`",
    "- 1 archivo de plantilla en la raíz de `.cn-pilot/plantillas/` y 2 archivos en total bajo `.cn-pilot/plantillas/` (incluye subdirectorios)",
  ].join("\n") + "\n";

  put("PROYECTO.md", "# Project fixture\n");
  put("REQUISITOS.md", "# Requirements fixture\n");
  put("ESTADO.md", "# State fixture\n");
  put("DECISIONES.md", "# Decisions fixture\n");
  put("ARTEFACTOS.md", "# Artifacts fixture\n");
  put("AGENTS.md", "# Minimal test kernel\n");
  put(".cn-pilot-version", "2.4.0\n");
  put(".cn-pilot/NUCLEO.md", "**Versión:** `2.4.0`\n\nLas superficies propias de CN Pilot destinadas a personas usan español por defecto, incluidos los nombres visibles de roles, documentos, comandos y estructuras.\n");
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
    cnPilotVersion: "2.4.0",
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
  put("kilo.jsonc", "{}\n");
  put(".gitignore", "/.cn-pilot/runtime/\n");
  put(".kilo/agents/jefe-proyecto.md", devLead);
  put(".kilo/agents/revisor.md", reviewer);
  const fixtureHeadings = {
    arquitecto: "Arquitecto",
    "contenido-seo": "Contenido / SEO",
    "disenador-ui-ux": "Diseñador UI/UX",
    desarrollador: "Desarrollador",
    "maquetador-frontend": "Maquetador frontend",
  };
  for (const [agent, heading] of Object.entries(fixtureHeadings)) {
    put(`.kilo/agents/${agent}.md`, `---\ndescription: Agente de fixture\nmode: subagent\n---\n# ${heading}\n`);
  }
  put(".kilo/skills/sample/SKILL.md", "---\nname: sample\ndescription: Skill de fixture\n---\n# Sample\n");
  put(".kilo/skills/technical-seo/SKILL.md", "---\nname: technical-seo\ndescription: Skill SEO de fixture\n---\n# SEO\n");
  put(".kilo/skills/technical-seo/references/audit.md", "# Referencia\n");
  for (const command of ["nuevo-proyecto", "cn-estado", "cn-actualizar", "diseno", "contenido", "revision", "entrega", "diagnostico", "depurar", "desplegar-pruebas", "preparar-despliegue", "punto-control", "plan", "commit"]) {
    put(`.kilo/commands/${command}.md`, `---\ndescription: Comando ${command}\nagent: jefe-proyecto\n---\n# ${command}\n`);
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
  assert.equal(report.version, "2.4.0");
  assert.equal(getCheck(report, "agents.frontmatter").details.count, 7);
  assert.equal(getCheck(report, "skills.frontmatter").details.count, 2);
  assert.equal(getCheck(report, "commands.frontmatter").details.count, 14);
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

test("Spanish-first doctrine is required and generic technical wording is not translated", (t) => {
  const fixture = createFixture(t);
  fixture.put(".kilo/skills/sample/SKILL.md", "---\nname: sample\ndescription: Skill de fixture\n---\nEl developer experience no equivale a un rol; frontend development sigue siendo término genérico.\n");
  fixture.put(".kilo/skills/technical-seo/references/audit.md", "Cita externa de ejemplo: Developer.\n");
  assert.equal(getCheck(runCoreChecks({ rootDir: fixture.root }), "language.spanishFirst").status, "PASS");

  fixture.put(".cn-pilot/NUCLEO.md", "**Versión:** `2.4.0`\n\nLa estructura técnica permanece en inglés: archivos, carpetas, agentes.\n");
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
    ["I recovery desde checkpoint", command, "Si hay un checkpoint activo, aplica recovery primero"],
    ["J Pending no material", command, "«Pending» si el dato no bloquea el próximo trabajo útil"],
    ["K checkpoint + tarea distinta", lead, "para un encargo nuevo distinto pregunta brevemente si se continúa o se deja en pausa"],
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

test("Visual Pipeline 2.0 covers the public-web divergence, synthesis, flagship and fast-path scenarios", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const creative = read(".kilo/skills/creative-web-experience/SKILL.md");
  const designer = read(".kilo/agents/disenador-ui-ux.md");
  const pipelineStart = core.indexOf("### Visual Pipeline 2.0 / Creative Web Experience (BF-066)");
  const pipelineEnd = core.indexOf("\n## Convenciones estructurales de maquetación", pipelineStart);
  assert.ok(pipelineStart >= 0 && pipelineEnd > pipelineStart, "canonical pipeline is scoped in Core");
  const pipeline = core.slice(pipelineStart, pipelineEnd);
  const scenarios = [
    ["A public-web open-direction trigger", pipeline, "Aplica solo a public web Greenfield/rediseño visual material con libertad creativa abierta"],
    ["B two or three real studies", creative, "2–3 Concept Studies reales"],
    ["B concept count remains small", creative, "nunca más de tres por defecto"],
    ["B concepts differ in multiple visual dimensions", creative, "difieren en **varias** decisiones macro"],
    ["C studies are not full Homes or screenshots", creative, "No es moodboard textual, screenshot, UI Kit, Flagship final, Product ni una Home completa"],
    ["D inspect user references and material families first", pipeline, "inspecciona primero el índice/brief/recursos suministrados"],
    ["E material URLs must be opened", creative, "abre e inspecciona las relevantes antes de afirmar Reference Coverage completa"],
    ["F user may choose, mix, reject, or delegate", creative, "elegir un concepto, mezclar piezas, rechazar todos o delegar"],
    ["F a rejected set requires new directional evidence", creative, "no regeneres variantes idénticas ni repitas research sin evidencia nueva"],
    ["G kit is derived after synthesis", creative, "Solo después de Visual Synthesis activa"],
    ["H Approved and Strict fast paths", pipeline, "La ruta **Approved/Strict** no genera Concept Studies artificiales"],
    ["I app UI bypasses public-web concepts", pipeline, "No se activa por app/dashboard (`application-ui`)"],
    ["J Existing and derived pages bypass repeated divergence", pipeline, "Existing localized, página derivada de sistema aprobado"],
    ["K one Flagship is a complete page, not a study", creative, "una sola Flagship de página completa"],
    ["K Flagship is not Product runtime", creative, "no es Product runtime"],
    ["L human approval gates Product", pipeline, "Human Visual Approval → Product implementation si está en scope"],
    ["M Designer does not implement Product before approval", designer, "no edites Product antes de la aprobación visual del Flagship"],
    ["N screenshots are not primary evidence", creative, "sin matrices screenshot"],
    ["N studies demonstrate mobile transformation proportionally", creative, "mobile demuestra cómo se adapta hero y una región compleja"],
    ["O user assets retain priority/provenance", creative, "Reutiliza assets PROVIDED/EXISTING cuando correspondan"],
    ["O Visual Synthesis resolves a mix", creative, "la **Visual Synthesis** convierte esos elementos en una gramática única y coherente"],
    ["P parallel studies are alternatives, not merges", creative, "la síntesis seleccionada es una unidad nueva, no una integración automática de ramas"],
  ];
  for (const [scenario, source, required] of scenarios) assert.ok(source.includes(required), `${scenario}: contract is present`);
});

test("Visual Pipeline sequence does not construct the UI Kit before creative exploration", () => {
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const creative = fs.readFileSync(new URL("../../.kilo/skills/creative-web-experience/SKILL.md", import.meta.url), "utf8");
  const coreStart = core.indexOf("### Visual Pipeline 2.0 / Creative Web Experience (BF-066)");
  const coreEnd = core.indexOf("\n## Convenciones estructurales de maquetación", coreStart);
  const policy = core.slice(coreStart, coreEnd);
  const routeStart = policy.indexOf("Flujo canónico cuando aplica:");
  const route = policy.slice(routeStart);
  const routeStages = ["Reference & Asset Coverage", "2–3 Concept Studies reales", "Human Creative Review", "Visual Synthesis", "UI Kit derivado", "Flagship Page", "Human Visual Approval", "Product implementation"];
  let previousStage = -1;
  for (const stage of routeStages) {
    const index = route.indexOf(stage);
    assert.ok(index > previousStage, `canonical flow orders ${stage}`);
    previousStage = index;
  }

  const coverage = creative.indexOf("## Reference & Asset Coverage");
  const studies = creative.indexOf("## Concept Studies y divergencia visual real");
  const review = creative.indexOf("## Human Creative Review y Visual Synthesis");
  const derivedKit = creative.indexOf("Solo después de Visual Synthesis activa `ui-design-system`/`ui-kit-construction`");
  const flagship = creative.indexOf("una sola Flagship de página completa");
  assert.ok(coverage >= 0 && studies > coverage, "reference coverage precedes studies");
  assert.ok(review > studies && derivedKit > review && flagship > derivedKit, "review/mix and synthesis precede kit and flagship");
  assert.ok(creative.slice(studies, review).includes("No generes UI Kits/component libraries para cada alternativa"));
});

test("/nuevo-proyecto es progresivo, lee antes de preguntar y no es un wizard", () => {
  const command = fs.readFileSync(new URL("../../.kilo/commands/nuevo-proyecto.md", import.meta.url), "utf8");
  const inspect = command.indexOf("## Inspecciona antes de preguntar");
  const ask = command.indexOf("## Conversa por necesidad, no por formulario");
  assert.ok(inspect >= 0 && ask > inspect, "context and resources are inspected before questions");
  assert.ok(command.includes("ni obliga a completar un wizard"));
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

test("visual cleanup removes obsolete restrictions without weakening creative or technical authority", () => {
  const system = fs.readFileSync(new URL("../../.kilo/skills/ui-design-system/SKILL.md", import.meta.url), "utf8");
  const designer = fs.readFileSync(new URL("../../.kilo/agents/disenador-ui-ux.md", import.meta.url), "utf8");
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
  assert.match(creative, /QUIET, REFINED, EXPRESSIVE o IMMERSIVE/);
  assert.match(creative, /Existing conserva `continuity > novelty`/);
  assert.match(creative, /Approved\/Strict mantiene authority BF-048/);
  assert.match(creative, /Genericity Risk/);
  assert.match(creative, /Si este riesgo es material.*Creative Refinement Pass focalizada/s);
  assert.match(creative, /Synthesis\/Flagship sigue genérica.*continúa el refinamiento específico necesario/s);
  assert.match(composition, /No prohíbas cards, simetría, centrado, split layouts ni simplicidad/);
  assert.match(application, /no páginas de marketing/);

  for (const skill of ["creative-web-experience", "page-composition", "visual-art-direction", "motion-interaction", "ui-kit-construction", "visual-parity-review", "application-ui", "accessibility-review", "performance-review", "webapp-testing"]) {
    assert.equal(fs.existsSync(new URL(`../../.kilo/skills/${skill}/SKILL.md`, import.meta.url)), true, `${skill} remains active`);
  }
  assert.equal(fs.existsSync(new URL("../../.kilo/skills/ui-design-system/ATTRIBUTION.md", import.meta.url)), false);
});
