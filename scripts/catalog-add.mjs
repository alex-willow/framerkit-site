import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const MANIFEST_PATH = path.resolve(rootDir, "src/shared/catalogManifest.ts");
const DATA_ROOT = path.resolve(rootDir, "catalog-data");

const GROUP_CONFIG = {
  layout: { arrayName: "LAYOUT_SECTIONS", dir: "layout" },
  components: { arrayName: "COMPONENT_SECTIONS", dir: "components" },
  templates: { arrayName: "TEMPLATE_SECTIONS", dir: "templates" },
};

const titleCase = (value) =>
  value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i += 1) {
    const key = args[i];
    if (!key.startsWith("--")) continue;
    const value = args[i + 1];
    if (!value || value.startsWith("--")) continue;
    options[key.slice(2)] = value;
    i += 1;
  }

  return options;
};

const escapeDoubleQuotes = (value) => value.replaceAll('"', '\\"');

const upsertManifestEntry = ({ group, id, label, jsonKey }) => {
  const config = GROUP_CONFIG[group];
  const source = readFileSync(MANIFEST_PATH, "utf-8");
  const entryNeedle = `id: "${id}"`;

  if (source.includes(entryNeedle)) {
    console.log(`Manifest already contains id "${id}" in group "${group}".`);
    return;
  }

  const re = new RegExp(
    `(export const ${config.arrayName}: CatalogSection\\[] = \\[)([\\s\\S]*?)(\\n\\];)`,
    "m",
  );
  const match = source.match(re);
  if (!match) {
    throw new Error(`Could not find ${config.arrayName} in catalog manifest`);
  }

  const entry = `  { id: "${escapeDoubleQuotes(id)}", label: "${escapeDoubleQuotes(label)}", jsonKey: "${escapeDoubleQuotes(
    jsonKey,
  )}" },`;
  const nextBody = match[2].trimEnd() + "\n" + entry;
  const nextSource = source.replace(re, `${match[1]}${nextBody}${match[3]}`);
  writeFileSync(MANIFEST_PATH, nextSource, "utf-8");
  console.log(`Added manifest entry for "${id}" in ${config.arrayName}.`);
};

const ensureCatalogJson = ({ group, id, jsonKey }) => {
  const config = GROUP_CONFIG[group];
  const dirPath = path.resolve(DATA_ROOT, config.dir);
  mkdirSync(dirPath, { recursive: true });
  const filePath = path.resolve(dirPath, `${id}.json`);

  if (existsSync(filePath)) {
    console.log(`Catalog file already exists: ${filePath}`);
    return;
  }

  const payload = { [jsonKey]: [] };
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  console.log(`Created catalog file: ${filePath}`);
};

const run = () => {
  const options = parseArgs();
  const group = String(options.group || "").toLowerCase();
  const id = String(options.id || "").toLowerCase();
  const label = String(options.label || titleCase(id));
  const jsonKey = String(options["json-key"] || id);

  if (!group || !GROUP_CONFIG[group]) {
    throw new Error('Invalid --group. Use one of: layout, components, templates');
  }
  if (!id) {
    throw new Error("Missing --id");
  }

  ensureCatalogJson({ group, id, jsonKey });
  upsertManifestEntry({ group, id, label, jsonKey });

  console.log("Done. Next: npm run sync:catalog && npm run catalog:upload");
};

try {
  run();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
