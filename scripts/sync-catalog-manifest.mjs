import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, "..");
const source = path.resolve(siteRoot, "src/shared/catalogManifest.ts");
const pluginTargetDir = path.resolve(siteRoot, "../Framerkit/src/config");
const pluginTarget = path.resolve(pluginTargetDir, "catalogManifest.ts");

if (!existsSync(source)) {
  console.error(`Source manifest not found: ${source}`);
  process.exit(1);
}

mkdirSync(pluginTargetDir, { recursive: true });
copyFileSync(source, pluginTarget);
console.log(`Synced catalog manifest to plugin: ${pluginTarget}`);
