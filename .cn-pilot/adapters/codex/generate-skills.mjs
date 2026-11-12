import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const OUTPUT = path.join(ROOT, ".agents", "skills");
const RUNTIME_DOC = ".cn-pilot/adapters/codex/RUNTIME.md";

function readDescription(file) {
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const frontmatter = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const description = frontmatter?.[1].match(/^description:\s*(.+?)\s*$/m)?.[1];
  if (!description || /[\r\n]/.test(description)) throw new Error(`Missing single-line description in ${path.relative(ROOT, file)}`);
  return description;
}

function sourceSkills() {
  const entries = [];
  for (const entry of fs.readdirSync(path.join(ROOT, ".kilo", "skills"), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid skill slug: ${slug}`);
    entries.push({ slug, description: readDescription(path.join(ROOT, ".kilo", "skills", slug, "SKILL.md")), source: `.kilo/skills/${slug}/SKILL.md` });
  }
  for (const entry of fs.readdirSync(path.join(ROOT, ".kilo", "commands"), { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const slug = path.basename(entry.name, ".md");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid command slug: ${slug}`);
    entries.push({ slug, description: readDescription(path.join(ROOT, ".kilo", "commands", entry.name)), source: `.kilo/commands/${entry.name}` });
  }
  const names = new Set();
  for (const item of entries) {
    const name = `cnp-${item.slug}`;
    if (names.has(name)) throw new Error(`Duplicate Codex skill name: ${name}`);
    names.add(name);
  }
  return entries.sort((a, b) => a.slug.localeCompare(b.slug, "en"));
}

function render({ slug, description, source }) {
  return `---\nname: cnp-${slug}\ndescription: ${description}\n---\n\n# CN Pilot: ${slug}\n\nSigue \`${RUNTIME_DOC}\` y carga el procedimiento canónico completo desde \`${source}\`, junto con los recursos enlazados que sean necesarios. Ejecuta el contrato canónico para la tarea actual; esta entrada no lo reemplaza.\n`;
}

function ensureSafeDirectory({ create }) {
  let cursor = ROOT;
  for (const segment of [".agents", "skills"]) {
    cursor = path.join(cursor, segment);
    try {
      const stat = fs.lstatSync(cursor);
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Unsafe generated skills directory: ${path.relative(ROOT, cursor)}`);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      if (!create) return false;
      fs.mkdirSync(cursor);
    }
  }
  return true;
}

const mode = process.argv[2] ?? "--check";
if (!new Set(["--check", "--write"]).has(mode)) throw new Error("Usage: node generate-skills.mjs [--check|--write]");
const entries = sourceSkills();
const outputReady = ensureSafeDirectory({ create: mode === "--write" });
const differences = [];
for (const item of entries) {
  const relative = path.join(OUTPUT, `cnp-${item.slug}`, "SKILL.md");
  const expected = render(item);
  if (mode === "--write") {
    const skillDirectory = path.dirname(relative);
    try {
      const directoryStat = fs.lstatSync(skillDirectory);
      if (directoryStat.isSymbolicLink() || !directoryStat.isDirectory()) throw new Error(`Unsafe generated skill directory: ${path.relative(ROOT, skillDirectory)}`);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
      fs.mkdirSync(skillDirectory);
    }
    try {
      const stat = fs.lstatSync(relative);
      if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`Unsafe generated skill path: ${path.relative(ROOT, relative)}`);
    } catch (error) { if (error?.code !== "ENOENT") throw error; }
    fs.writeFileSync(relative, expected, "utf8");
  } else {
    let actual = null;
    try {
      if (!outputReady) throw Object.assign(new Error("skills directory missing"), { code: "ENOENT" });
      const directoryStat = fs.lstatSync(path.dirname(relative));
      if (directoryStat.isSymbolicLink() || !directoryStat.isDirectory()) throw new Error(`Unsafe generated skill directory: ${path.relative(ROOT, path.dirname(relative))}`);
      const stat = fs.lstatSync(relative);
      if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`Unsafe generated skill path: ${path.relative(ROOT, relative)}`);
      actual = fs.readFileSync(relative, "utf8").replace(/\r\n/g, "\n");
    } catch (error) { if (error?.code !== "ENOENT") throw error; }
    if (actual !== expected) differences.push(path.relative(ROOT, relative).replace(/\\/g, "/"));
  }
}
if (mode === "--check" && differences.length) {
  process.stderr.write(`Codex skills out of sync (${differences.length}): ${differences.join(", ")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Codex skill wrappers ${mode === "--write" ? "generated" : "match canonical Kilo sources"}: ${entries.length}\n`);
}
