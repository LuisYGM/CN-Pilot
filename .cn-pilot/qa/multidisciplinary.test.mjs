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
const ADDED_IN_3_1_0 = [
  ".cn-pilot/agent-evals/multidisciplinary.json",
  ".cn-pilot/agent-evals/prepare-multidisciplinary.mjs",
  ".cn-pilot/qa/multidisciplinary.test.mjs",
  ".kilo/skills/tool-discovery/SKILL.md",
];

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

test("checkout 3.1.x contiene seis agentes, siete perfiles y 42 skills; ACL intactas", () => {
  const agents = ["arquitecto", "desarrollador", "disenador", "jefe-proyecto", "redactor", "revisor"];
  assert.equal(fs.readdirSync(path.join(root, ".kilo/agents")).filter((name) => name.endsWith(".md")).length, 6);
  assert.equal(fs.readdirSync(path.join(root, ".cn-pilot/perfiles")).length, 7);
  const checkoutSkills = execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", "--", ".kilo/skills"], { cwd: root, encoding: "utf8" }).trim().split(/\r?\n/).filter((name) => name.endsWith("/SKILL.md"));
  assert.equal(checkoutSkills.length, 42);
  for (const relative of checkoutSkills) assert.ok(fs.existsSync(path.join(root, relative)), relative);
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

test("3.0.2 → 3.1.0: updater detecta las cuatro incorporaciones sin tocar contexto/producto", () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), "cn-pilot-multi-update-"));
  try {
    const source = path.join(parent, "source");
    const baselineRoot = path.join(parent, "baseline");
    const installed = path.join(parent, "installed");
    fs.mkdirSync(source);
    fs.mkdirSync(baselineRoot);
    fs.mkdirSync(installed);
    const candidatePaths = [".cn-pilot-version", ...ADDED_IN_3_1_0];
    fs.writeFileSync(path.join(source, ".cn-pilot-version"), "3.1.0\n");
    fs.writeFileSync(path.join(baselineRoot, ".cn-pilot-version"), "3.0.2\n");
    fs.writeFileSync(path.join(installed, ".cn-pilot-version"), "3.0.2\n");
    for (const relative of ADDED_IN_3_1_0) {
      const destination = path.join(source, relative);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(path.join(root, relative), destination);
    }

    const projectContext = "# Contexto sintético que el updater debe preservar\n";
    const product = "<!doctype html><title>Existing product intacto</title>\n";
    fs.writeFileSync(path.join(installed, "PROYECTO.md"), projectContext);
    fs.mkdirSync(path.join(installed, "producto"));
    fs.writeFileSync(path.join(installed, "producto/index.html"), product);

    // This explicit 3.0.2 inventory is generated in the temp fixture; it does
    // not depend on HEAD, a parent commit, or fetched Git history.
    const baseline = buildManifest(baselineRoot, { files: [".cn-pilot-version"] });
    const next = buildManifest(source, { files: candidatePaths, previousManifest: baseline });
    const plan = planUpdate(installed, baseline, next);
    const addedActions = plan.actions.filter((action) => action.type === "add").map(({ path: name }) => name);

    assert.equal(next.cnPilotVersion, "3.1.0");
    assert.deepEqual(next.addedFiles, ADDED_IN_3_1_0);
    assert.deepEqual(addedActions, ADDED_IN_3_1_0);
    assert.ok(addedActions.includes(".kilo/skills/tool-discovery/SKILL.md"));
    assert.ok(plan.actions.some((action) => action.path === ".cn-pilot-version" && action.type === "update"));
    assert.equal(plan.conflicts.length, 0);
    assert.deepEqual(next.migrations, baseline.migrations);
    const projectOrProduct = /^(PROYECTO|REQUISITOS|ESTADO|DECISIONES|ARTEFACTOS)\.md$|^producto(?:\/|$)/;
    assert.equal(next.managedFiles.some(({ path: name }) => projectOrProduct.test(name)), false);
    assert.equal(plan.actions.some(({ path: name }) => projectOrProduct.test(name)), false);
    assert.equal(fs.readFileSync(path.join(installed, "PROYECTO.md"), "utf8"), projectContext);
    assert.equal(fs.readFileSync(path.join(installed, "producto/index.html"), "utf8"), product);
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});

test("3.1.2 manifest hashes match the candidate payload and inventory", () => {
  const manifest = JSON.parse(read(".cn-pilot/update/manifest.json"));
  const generated = buildManifest(root, { files: listTrackedManagedFiles(root) });
  assert.equal(manifest.cnPilotVersion, "3.1.2");
  assert.deepEqual(generated.managedFiles, manifest.managedFiles);
  assert.deepEqual(manifest.addedFiles, []);
  assert.deepEqual(manifest.removedFiles, []);
  assert.equal(verifyManifestFiles(root, manifest).verified, manifest.managedFiles.length);
});
