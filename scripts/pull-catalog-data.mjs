import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outDir = path.resolve(rootDir, "catalog-data");

const DATA_ORIGIN = "https://raw.githubusercontent.com/alex-willow/framerkit-data";

const layoutSections = [
  "navbar",
  "hero",
  "logo",
  "feature",
  "gallery",
  "testimonial",
  "contact",
  "pricing",
  "faq",
  "cta",
  "footer",
];

const componentSections = [
  "accordion",
  "accordiongroup",
  "avatar",
  "avatargroup",
  "badge",
  "button",
  "card",
  "icon",
  "input",
  "form",
  "pricingcard",
  "rating",
  "testimonialcard",
];

const templateSections = ["framerkitdaily"];

const ensureDir = (dir) => mkdirSync(dir, { recursive: true });

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: HTTP ${res.status}`);
  return await res.text();
};

const writeJsonFile = (group, id, content) => {
  const groupDir = path.resolve(outDir, group);
  ensureDir(groupDir);
  const filePath = path.resolve(groupDir, `${id}.json`);
  writeFileSync(filePath, content, "utf-8");
  return filePath;
};

const pullGroup = async (group, ids, urlBuilder) => {
  for (const id of ids) {
    const url = urlBuilder(id);
    const content = await fetchJson(url);
    const filePath = writeJsonFile(group, id, content);
    console.log(`Saved ${group}/${id}.json <- ${url}`);
    console.log(`  ${filePath}`);
  }
};

const run = async () => {
  ensureDir(outDir);

  await pullGroup("layout", layoutSections, (id) => `${DATA_ORIGIN}/main/${id}.json`);
  await pullGroup("components", componentSections, (id) => `${DATA_ORIGIN}/components/${id}.json`);
  await pullGroup("templates", templateSections, (id) => `${DATA_ORIGIN}/main/${id}`);

  console.log("Catalog pull complete.");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
