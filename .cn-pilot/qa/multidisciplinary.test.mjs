import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { suite, prepareMultidisciplinary } from "../agent-evals/prepare-multidisciplinary.mjs";
import { buildManifest, listTrackedManagedFiles, planUpdate, verifyManifestFiles } from "../update/updater.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8").replace(/\r\n/g, "\n");
const requireContracts = (text, patterns) => patterns.forEach((pattern) => assert.match(text, pattern));

test("BF-074/075: proyecto abierto, fuentes únicas y descubrimiento real", () => {
  const core = read(".cn-pilot/NUCLEO.md");
  requireContracts(core, [/Proyecto universal y entregables \(BF-074\)/, /selección profesional de capacidades \(BF-075\)/, /single-deliverable existente sigue siendo válido sin migración/, /no perfiles adicionales obligatorios/, /no se impone[n]? a|No convierten un documento/, /Una aprobación de un entregable no aprueba los demás/, /No crees un tablero/, /no presenta|No conviertas cualquier resultado en código/]);
  requireContracts(read("PROYECTO.md"), [/## Entregables/, /formato/, /dependencias/, /opcional/, /runtime\/stack.*opcionales/]);
  requireContracts(read("ARTEFACTOS.md"), [/fuente editable/, /outputs.*entregable|output con el entregable/, /Estado y aprobación son individuales/]);
  requireContracts(read(".kilo/commands/nuevo-proyecto.md"), [/cualquier disciplina/, /marca de videojuegos/, /no repitas onboarding/, /no exige.*stack global/, /Core original.*presentación/]);
});

test("discovery: controles positivos y negativos del contrato, no de conducta", () => {
  const skill = read(".kilo/skills/tool-discovery/SKILL.md");
  const required = [/expuestas en esta sesión/, /Disponible y utilizable/, /Presente sin conexión o autorización/, /Requiere instalación/, /Requiere cuenta, licencia o pago/, /No disponible o no verificada/, /pueden coexistir/, /no presentes un sustituto rudimentario/, /No cambies permisos/, /sin autorización aplicable/, /editabilidad/, /fuentes oficiales externas solo/];
  requireContracts(skill, required);
  for (const pattern of required) assert.throws(() => requireContracts("Herramienta documentada = instalada; generar SVG siempre.", [pattern]));
});

test("seis agentes, siete perfiles y 41 skills previas conservados; ACL intactas", () => {
  const agents = ["arquitecto", "desarrollador", "disenador", "jefe-proyecto", "redactor", "revisor"];
  assert.equal(fs.readdirSync(path.join(root, ".kilo/agents")).filter((name) => name.endsWith(".md")).length, 6);
  assert.equal(fs.readdirSync(path.join(root, ".cn-pilot/perfiles")).length, 7);
  const baselineSkills = execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", "--", ".kilo/skills"], { cwd: root, encoding: "utf8" }).trim().split(/\r?\n/).filter((name) => name.endsWith("/SKILL.md"));
  assert.ok(baselineSkills.length >= 41);
  for (const relative of baselineSkills) assert.ok(fs.existsSync(path.join(root, relative)), relative);
  for (const agent of agents) {
    const relative = `.kilo/agents/${agent}.md`;
    const current = read(relative);
    const baseline = execFileSync("git", ["show", `HEAD:${relative}`], { cwd: root, encoding: "utf8" }).replace(/\r\n/g, "\n");
    assert.equal(current.split("\n---\n")[0].replace(/^description:.*$/m, ""), baseline.split("\n---\n")[0].replace(/^description:.*$/m, ""), `Permisos/frontmatter ${agent}`);
    assert.match(current, /BF-074\/075/);
    if (!["revisor", "jefe-proyecto"].includes(agent)) assert.match(current, /tool-discovery/);
  }
  for (const relative of ["kilo.jsonc", ".cn-pilot/perfiles/sitio-wordpress.md"]) {
    assert.equal(read(relative), execFileSync("git", ["show", `HEAD:${relative}`], { cwd: root, encoding: "utf8" }).replace(/\r\n/g, "\n"));
  }
  requireContracts(read(".cn-pilot/NUCLEO.md"), [/BF-073/, /Existing.*root.*excepción/, /BF-070/, /Approved\/Strict/]);
});

test("cuatro fixtures aislados se preparan sin Git, outputs anticipados ni contaminación", () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "cn-pilot-multi-test-"));
  try {
    assert.equal(suite.scenarios.length, 4);
    for (const scenario of suite.scenarios) {
      const target = path.join(parent, scenario.id);
      const record = prepareMultidisciplinary(scenario.id, target);
      assert.equal(record.evidenceLevel, "PREPARED_NOT_EXECUTED");
      assert.equal(record.result, "INCONCLUSIVE");
      assert.match(record.fingerprint, /^[a-f0-9]{64}$/);
      assert.equal(fs.existsSync(path.join(target, ".git")), false);
      for (const name of ["producto", "artefactos"]) assert.equal(fs.existsSync(path.join(target, name)), false);
      assert.match(fs.readFileSync(path.join(target, "PROYECTO.md"), "utf8"), /NOVA/);
      assert.match(record.request, /[Nn]o.*commits|[Nn]o.*commit/);
      assert.ok(record.acceptance.length >= 4);
      if (scenario.id === "MULTI-01") assert.match(record.request, /presentación comercial editable.*segundo entregable/i);
      if (scenario.id === "MULTI-02") assert.match(record.acceptance.join(" "), /no afirma generación ni conexión/i);
      if (scenario.id === "MULTI-03") {
        assert.match(fs.readFileSync(path.join(target, "wp-content/themes/nova/header.php"), "utf8"), /Contactar/);
        assert.match(record.request, /DIRECT.*no actives discovery ni auditoría global/i);
      }
      if (scenario.id === "MULTI-04") assert.match(record.acceptance.join(" "), /Dependencia concreta landing→automatización/i);
      assert.throws(() => prepareMultidisciplinary(scenario.id, target), /already exists/);
    }
    assert.throws(() => prepareMultidisciplinary("MULTI-99", path.join(parent, "unknown")), /desconocido/);
    assert.throws(() => prepareMultidisciplinary("MULTI-01", root), /inside the CN Pilot/);
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});

test("minor aditiva: updater planifica nuevas capacidades sin migrar contexto/producto", () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "cn-pilot-multi-update-"));
  try {
    const before = JSON.parse(execFileSync("git", ["show", "HEAD:.cn-pilot/update/manifest.json"], { cwd: root, encoding: "utf8" }));
    const files = [...before.managedFiles.map(({ path: name }) => name), ".kilo/skills/tool-discovery/SKILL.md", ".cn-pilot/qa/multidisciplinary.test.mjs", ".cn-pilot/agent-evals/multidisciplinary.json", ".cn-pilot/agent-evals/prepare-multidisciplinary.mjs"];
    // Fixture usa los bytes actuales y una minor sintética; no modifica la versión del Core.
    for (const name of new Set(files)) {
      fs.mkdirSync(path.dirname(path.join(parent, name)), { recursive: true });
      fs.copyFileSync(path.join(root, name), path.join(parent, name));
    }
    fs.writeFileSync(path.join(parent, ".cn-pilot-version"), "3.1.0\n");
    const after = buildManifest(parent, { files, previousManifest: before });
    const cleanTarget = path.join(parent, "clean-target");
    fs.mkdirSync(cleanTarget);
    for (const { path: name } of before.managedFiles) {
      fs.mkdirSync(path.dirname(path.join(cleanTarget, name)), { recursive: true });
      fs.copyFileSync(path.join(parent, name), path.join(cleanTarget, name));
    }
    const plan = planUpdate(cleanTarget, before, after);
    assert.ok(after.addedFiles.includes(".kilo/skills/tool-discovery/SKILL.md") || before.managedFiles.some(({ path: name }) => name === ".kilo/skills/tool-discovery/SKILL.md"));
    assert.equal(after.removedFiles.length, 0);
    assert.equal(plan.conflicts.length, 0);
    assert.ok(plan.actions.some((action) => action.type === "add" && action.path === ".kilo/skills/tool-discovery/SKILL.md"));
    assert.equal(after.migrations.some((migration) => migration.to === "3.1.0"), false);
    assert.equal(after.managedFiles.some(({ path: name }) => /^(PROYECTO|REQUISITOS|ESTADO|DECISIONES|ARTEFACTOS)\.md$/.test(name)), false);
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});

test("3.1.0 manifest hashes match the candidate payload and inventory", () => {
  const manifest = JSON.parse(read(".cn-pilot/update/manifest.json"));
  const additions = [".cn-pilot/agent-evals/multidisciplinary.json", ".cn-pilot/agent-evals/prepare-multidisciplinary.mjs", ".cn-pilot/qa/multidisciplinary.test.mjs", ".kilo/skills/tool-discovery/SKILL.md"];
  const generated = buildManifest(root, { files: [...listTrackedManagedFiles(root), ...additions], previousManifest: manifest });
  assert.equal(manifest.cnPilotVersion, "3.1.0");
  assert.deepEqual(generated.managedFiles, manifest.managedFiles);
  assert.deepEqual(manifest.addedFiles, additions.slice().sort());
  assert.deepEqual(manifest.removedFiles, []);
  assert.equal(verifyManifestFiles(root, manifest).verified, manifest.managedFiles.length);
});
