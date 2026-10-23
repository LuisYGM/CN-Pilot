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
  assert.equal(report.version, "2.8.0");
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

test("Visual Pipeline 2.0 covers the public-web divergence, synthesis, flagship and fast-path scenarios", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const core = read(".cn-pilot/NUCLEO.md");
  const creative = read(".kilo/skills/creative-web-experience/SKILL.md");
  const designer = read(".kilo/agents/disenador-ui-ux.md");
  const pipelineStart = core.indexOf("### Visual Pipeline 2.0 / Creative Web Experience (BF-066)");
  const pipelineEnd = core.indexOf("\n### Visual Quality Floor de Public Web (BF-068)", pipelineStart);
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
    ["H BF-068 quality floor remains active under BF-066", pipeline, "BF-068 gobierna UI Kit/Motion/media/iconografía y Quality Floor"],
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
  const coreEnd = core.indexOf("\n### Visual Quality Floor de Public Web (BF-068)", coreStart);
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

test("BF-068 Public Web Visual Quality Floor covers requirements A-S", () => {
  const read = (relative) => fs.readFileSync(new URL(`../../${relative}`, import.meta.url), "utf8");
  const core = fs.readFileSync(new URL("../NUCLEO.md", import.meta.url), "utf8");
  const kit = read(".kilo/skills/ui-kit-construction/SKILL.md");
  const motion = read(".kilo/skills/motion-interaction/SKILL.md");
  const media = read(".kilo/skills/visual-art-direction/SKILL.md");
  const creative = read(".kilo/skills/creative-web-experience/SKILL.md");
  const designer = read(".kilo/agents/disenador-ui-ux.md");
  const reviewer = read(".kilo/agents/revisor.md");
  const floorStart = core.indexOf("### Visual Quality Floor de Public Web (BF-068)");
  const floorEnd = core.indexOf("\n## Arquitectura frontend y fidelidad (BF-069)", floorStart);
  assert.ok(floorStart >= 0 && floorEnd > floorStart, "the Quality Floor is scoped to public web and distinct from the visual pipeline");
  const floor = core.slice(floorStart, floorEnd);
  const scenarios = [
    ["A Header and Mobile Header specimens", kit, "Header + Mobile Header"],
    ["B real representative Footer", kit, "Footer"],
    ["B Footer does not invent business facts", kit, "No inventes contacto, horarios, redes"],
    ["C Application UI fast path", floor, "no se impone a Application UI"],
    ["D default public-web Motion System", floor, "Motion forma parte del diseño de public web nuevo por defecto"],
    ["D the UI Kit presents Motion System specimens", kit, "**Motion System:**"],
    ["E explicit static-motion preference", floor, "petición explícita de experiencia estática"],
    ["F page/Hero entrance", motion, "entrada de página/hero"],
    ["G scroll progression when content supports it", motion, "scroll progression/reveals cuando el recorrido y el contenido lo aprovechen"],
    ["G generic fade-up is not the brand language", motion, "ni copies `fade-up + stagger` como idioma de marca"],
    ["H reduced motion", motion, "`prefers-reduced-motion`"],
    ["I client media has priority", media, "Inspecciona lo existente antes de proponer sustitución"],
    ["J no empty high-fidelity slots", media, "no se deja como caja gris"],
    ["J material unresolved media is not final", media, "declara que esa parte aún no puede considerarse final"],
    ["K intentional no-photo direction is valid", media, "Un «sin fotografía» intencional es una solución, no un placeholder"],
    ["L stock is not represented as project reality", media, "No infieras que una foto externa corresponde"],
    ["M asset research returns concrete candidates when chosen", media, "produce candidatos concretos"],
    ["N Lucide default functional icon family", kit, "Lucide es el default general"],
    ["N one primary icon family", kit, "una sola familia primaria de iconos funcionales"],
    ["N no mixing packs", kit, "No mezcles packs"],
    ["O Phosphor is an expressive alternative", kit, "Phosphor puede aportar expresividad"],
    ["O Simple Icons are brand-only and do not grant trademark rights", media, "CC0 no elimina trademark"],
    ["O artwork SVG remains permitted", kit, "custom SVG sigue permitido para artwork"],
    ["P Quality Floor permits a deliberately sober direction", media, "Sobriedad deliberada es un resultado válido"],
    ["P anti-template swap test is present", creative, "si cambian logo/copy/fotos, ¿la propuesta se vendería casi intacta a otro sector?"],
    ["Q real evidence is required for motion", motion, "Flagship muestra el comportamiento en ejecución si motion no fue desactivado"],
    ["R Revisor verifies objective criteria only", reviewer, "comprueba de forma read-only el Visual Quality Floor objetivo BF-068"],
    ["S Designer owns the public-web floor", designer, "verifica el Quality Floor BF-068"],
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
  const frontendAgent = read(".kilo/agents/maquetador-frontend.md");
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
    ["N approved Greenfield fast path still applies frontend architecture", frontendAgent, "aplica el contrato de `frontend-architecture` también durante el fast path aprobado"],
    ["O Application UI does not inherit marketing layout", architecture, "Application UI sigue su shell/datos/roles propios"],
    ["P page composition remains content-driven", page, "qué forma lo comunica mejor"],
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
    ["X exact section/container/column DOM is not mandatory", contract, "no es un árbol DOM obligatorio"],
    ["X this is conceptual architecture, not literal DOM recipe", architecture, "no una jerarquía DOM o un set de clases obligatorio"],
  ];
  for (const [scenario, source, required] of scenarios) assert.ok(source.includes(required), `${scenario}: contract is present`);
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
  const frontendAgent = read(".kilo/agents/maquetador-frontend.md");
  const parity = read(".kilo/skills/visual-parity-review/SKILL.md");
  const media = `${mediaContract}\n${architecture}\n${responsive}\n${frontendAgent}\n${parity}`;

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
  const activePolicy = `${mediaContract}\n${architecture}\n${frontendAgent}`;
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
  const frontend = read(".kilo/agents/maquetador-frontend.md");
  const scenarios = [
    ["approved source preserves output while allowing internals to change", architecture, "no el código literal", "no congela DOM, class names ni organización técnica"],
    ["optimized conversion is the default recommended mode", architecture, "recomienda internamente una conversión optimizada", "conserve materialmente apariencia"],
    ["faithful conversion honors explicit structure constraints", architecture, "Si la persona pide conservar estructura/clases", "usa conversión fiel"],
    ["material visual changes require explicit authorization", architecture, "Mejoras visuales", "requieren scope/autorización explícitos"],
    ["the modes remain internal rather than a user form", architecture, "no un selector/wizard para la persona"],
    ["source authority is inspected before a single material question", architecture, "inspecciónalo primero", "pregunta solo si falta esa decisión material"],
    ["Jefe routes a confirmed approved conversion without asking redundant approval", projectLead, "Si está Approved y se pide implementarlo sin cambio visual, recomienda conversión técnica optimizada por defecto", "No preguntes si ya se autorizó la conversión"],
    ["frontend owner avoids design change from generic optimization/refactor wording", frontend, "los cambios visuales requieren autorización expresa", "no autorizan rediseñar"],
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
  const maquetador = fs.readFileSync(new URL("../../.kilo/agents/maquetador-frontend.md", import.meta.url), "utf8");
  assert.match(responsive, /fuente HTML\/frontend designada Approved también conserva sus puntos de cambio/i);
  assert.match(responsive, /Greenfield sin sistema responsive aprobado[\s\S]{0,100}`\.cn-pilot\/config\/responsive\.json`/i);
  assert.match(responsive, /Approved, los puntos de cambio efectivos del source prevalecen/i);
  assert.match(responsive, /No los sustituyas salvo cambio visual autorizado/i);
  assert.match(theme, /Cuando Product transforma un frontend Approved[\s\S]{0,240}template parts, assets y enqueue nativos/i);
  assert.match(theme, /Conserva literalmente estático lo que se aprobó como estático/i);
  assert.match(theme, /la conversión HTML no implica volver todo dinámico[\s\S]{0,180}fields\/CPT\/ACF/i);
  assert.match(maquetador, /no asumas que hay que conservar exactamente DOM, clases o código/i);
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

test("systematic debugging and analytics have natural-language routes without inflating agents", () => {
  const lead = fs.readFileSync(new URL("../../.kilo/agents/jefe-proyecto.md", import.meta.url), "utf8");
  const developer = fs.readFileSync(new URL("../../.kilo/agents/desarrollador.md", import.meta.url), "utf8");
  const frontend = fs.readFileSync(new URL("../../.kilo/agents/maquetador-frontend.md", import.meta.url), "utf8");
  const content = fs.readFileSync(new URL("../../.kilo/agents/contenido-seo.md", import.meta.url), "utf8");
  assert.match(lead, /Síntoma real de bug, regresión[\s\S]{0,180}`systematic-debugging` antes de editar/i);
  assert.match(lead, /No la actives por feature request, refactor o pregunta conceptual/i);
  assert.match(lead, /Analytics\/event measurement con implementación[\s\S]{0,120}`analytics-instrumentation`/i);
  assert.match(developer, /Ante un bug\/regresión\/fallo de integración[\s\S]{0,180}`systematic-debugging`/i);
  assert.match(developer, /analytics\/event measurement[\s\S]{0,120}`analytics-instrumentation`/i);
  assert.match(frontend, /Ante bug\/regresión o síntoma frontend inesperado[\s\S]{0,140}`systematic-debugging`/i);
  assert.match(frontend, /coordina el trigger\/contract de `analytics-instrumentation` con Desarrollador/i);
  assert.match(content, /estratega de contenidos/);
  assert.doesNotMatch(content, /analytics-instrumentation/, "Contenido/SEO does not become the technical instrumentation owner");
  const agents = fs.readdirSync(new URL("../../.kilo/agents/", import.meta.url)).filter((file) => file.endsWith(".md"));
  assert.equal(agents.length, 7, "routing hardening does not add agents");
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
  const listedAgents = [...agentGuide.matchAll(/^\| (Jefe de proyecto|Arquitecto|Contenido \/ SEO|Diseñador UI\/UX|Desarrollador|Maquetador frontend|Revisor) \|/gm)].map((match) => match[1]).sort();
  const agentLabels = ["Jefe de proyecto", "Arquitecto", "Contenido / SEO", "Diseñador UI/UX", "Desarrollador", "Maquetador frontend", "Revisor"].sort();
  assert.deepEqual(listedSkills, actualSkills, "skill catalog has no omissions or invented skills");
  assert.equal(actualAgents.length, 7, "agent catalog remains at seven");
  assert.deepEqual(listedAgents, agentLabels, "README describes the seven real agents with human-facing names");
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
