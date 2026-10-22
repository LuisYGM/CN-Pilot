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
  put(".cn-pilot-version", "2.1.1\n");
  put(".cn-pilot/NUCLEO.md", "**Versión:** `2.1.1`\n\nLas superficies propias de CN Pilot destinadas a personas usan español por defecto, incluidos los nombres visibles de roles, documentos, comandos y estructuras.\n");
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
    cnPilotVersion: "2.1.1",
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
  assert.equal(report.version, "2.1.1");
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

  fixture.put(".cn-pilot/NUCLEO.md", "**Versión:** `2.1.1`\n\nLa estructura técnica permanece en inglés: archivos, carpetas, agentes.\n");
  const check = getCheck(runCoreChecks({ rootDir: fixture.root }), "language.spanishFirst");
  assert.equal(check.status, "FAIL");
  assert.ok(check.details.findings.some((finding) => finding.code === "SPANISH_FIRST_DOCTRINE_MISSING_OR_CONTRADICTORY"));
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

  for (const contract of ["primer fallo", "Segundo fallo comparable", "STOP VERIFYING THAT SURFACE", "INCOMPLETE + RECOVERABLE", "BLOCKED_HUMAN", "BLOCKED_EXTERNAL", "Completion Mode", "BF-062", "continuidad"])
    assert.ok(guard.includes(contract), `Progress Guard keeps ${contract}`);
  assert.match(devLead, /La respuesta de un especialista que deja trabajo incompleto es un handoff/);
  assert.match(devLead, /Si acceptance sigue pendiente y el trabajo es recuperable.*continúa/s);
  assert.match(guard, /no crea mecanismos automáticos de resume/);
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
  assert.match(creative, /si queda Genericity Risk material.*continúa el refinamiento específico/s);
  assert.match(composition, /No prohíbas cards, simetría, centrado, split layouts ni simplicidad/);
  assert.match(application, /no páginas de marketing/);

  for (const skill of ["creative-web-experience", "page-composition", "visual-art-direction", "motion-interaction", "ui-kit-construction", "visual-parity-review", "application-ui", "accessibility-review", "performance-review", "webapp-testing"]) {
    assert.equal(fs.existsSync(new URL(`../../.kilo/skills/${skill}/SKILL.md`, import.meta.url)), true, `${skill} remains active`);
  }
  assert.equal(fs.existsSync(new URL("../../.kilo/skills/ui-design-system/ATTRIBUTION.md", import.meta.url)), false);
});
