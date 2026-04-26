import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.resolve(__dirname, "..");
const pluginDir = path.resolve(siteDir, "../Framerkit");
const pluginPackagePath = path.join(pluginDir, "package.json");

if (!existsSync(pluginPackagePath)) {
  console.error(`Plugin package not found at: ${pluginPackagePath}`);
  console.error("Expected plugin folder: ../Framerkit");
  process.exit(1);
}

const procs = [];
let shuttingDown = false;

const stopAll = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const proc of procs) {
    if (!proc.killed) proc.kill("SIGTERM");
  }
  setTimeout(() => process.exit(code), 150);
};

const start = (label, cmd, args, cwd) => {
  const proc = spawn(cmd, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });

  procs.push(proc);

  proc.on("exit", (code, signal) => {
    if (shuttingDown) return;
    if (signal) {
      console.error(`[${label}] exited by signal: ${signal}`);
      stopAll(1);
      return;
    }
    if (code !== 0) {
      console.error(`[${label}] exited with code: ${code}`);
      stopAll(code ?? 1);
      return;
    }
    console.log(`[${label}] finished`);
    stopAll(0);
  });
};

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));

console.log("Starting FramerKit site + plugin...");
start("site", "npm", ["run", "dev:site"], siteDir);
start("plugin", "npm", ["--prefix", pluginDir, "run", "dev"], siteDir);
