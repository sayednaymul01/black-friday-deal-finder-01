// Bargain Beacon — Black Friday 2026 deal finder.
// Hands the site in: copies app/ and screenshots/ from this repository
// into the output directory and writes /output/dossier.json with
// buildDossier from vendor/makefun-frontend.ts, exactly as the kit asks.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.
// Node 22 standard library only; no network, no installs.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function copyTree(name: string): void {
  const from = join(repoRoot, name);
  const to = join(outDir, name);
  if (!existsSync(from)) {
    throw new Error("missing " + name + "/ in the repository");
  }
  cpSync(from, to, { recursive: true });
}

function main(): void {
  // Start clean so a stale file from an earlier run can never leak in.
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  copyTree("app");
  copyTree("screenshots");

  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(outDir, "dossier.json"), dossier);
  console.log("Bargain Beacon handed in: app/, screenshots/ and dossier.json in " + outDir);
}

main();
