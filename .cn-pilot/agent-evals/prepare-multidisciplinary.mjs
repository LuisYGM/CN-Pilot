import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { validateWorkspaceTarget } from "./prepare.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const suite = JSON.parse(fs.readFileSync(new URL("./multidisciplinary.json", import.meta.url), "utf8"));
const SCAFFOLD = ["AGENTS.md", "kilo.jsonc", ".cn-pilot-version", ".cn-pilot/NUCLEO.md", ".kilo/agents", ".kilo/commands", ".kilo/skills"];

// Sin Git, commits, conexiones, config global ni modificación de permisos.
export function prepareMultidisciplinary(id, targetPath, { tempRoot = os.tmpdir() } = {}) {
  const scenario = suite.scenarios.find((item) => item.id === id);
  if (!scenario) throw new Error(`Escenario desconocido: ${id}`);
  const target = validateWorkspaceTarget(targetPath, { repoRoot: ROOT, tempRoot });
  fs.mkdirSync(target);
  const hashes = [];
  const fingerprint = (file, relative) => hashes.push([relative, crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")]);
  for (const relative of SCAFFOLD) {
    const source = path.join(ROOT, relative);
    const destination = path.join(target, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.cpSync(source, destination, { recursive: true, filter(entry) {
      const stat = fs.lstatSync(entry);
      if (stat.isSymbolicLink()) throw new Error("No se copian symlinks al fixture.");
      if (stat.isFile()) fingerprint(entry, path.relative(ROOT, entry).split(path.sep).join("/"));
      return true;
    } });
  }
  for (const [relative, content] of Object.entries({ ...suite.sharedContext, ...scenario.context })) {
    if (path.isAbsolute(relative) || relative.split(/[\\/]/).some((part) => part === ".." || part === ".")) throw new Error("Ruta de fixture inválida.");
    if (!/^(PROYECTO|REQUISITOS|DECISIONES|ESTADO|ARTEFACTOS|README)\.md$|^recursos\/brief\.txt$|^wp-content\/themes\/nova\/header\.php$/.test(relative)) throw new Error("Ruta de fixture fuera de scope.");
    const destination = path.join(target, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content, "utf8");
    fingerprint(destination, relative);
  }
  const record = { scenario: id, workspace: target, coreVersion: fs.readFileSync(path.join(ROOT, ".cn-pilot-version"), "utf8").trim(), fingerprint: crypto.createHash("sha256").update(JSON.stringify(hashes.sort())).digest("hex"), request: scenario.request, acceptance: scenario.acceptance, evidenceLevel: "PREPARED_NOT_EXECUTED", result: "INCONCLUSIVE" };
  fs.mkdirSync(path.join(target, ".cn-pilot/runtime"), { recursive: true });
  fs.writeFileSync(path.join(target, ".cn-pilot/runtime/eval-setup.json"), `${JSON.stringify(record, null, 2)}\n`);
  return record;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(prepareMultidisciplinary(process.argv[2], process.argv[3]), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
