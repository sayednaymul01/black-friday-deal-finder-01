// Bargain Beacon — Black Friday 2026 deal finder.
// Delivery program: stages the app and its screenshots into the output
// directory and builds the dossier the grader reads.
//
// The output directory itself is NEVER removed. In the grading sandbox
// /output is a mounted directory and the process cannot delete the mount
// point, so this program only clears what is inside it, then recreates
// the directory (a no-op when it already exists).

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const ENTRY_NAME = "Bargain Beacon";

// The repository root is the directory holding this script.
const repoRoot = dirname(fileURLToPath(import.meta.url));

// The grader sets MAKEFUN_OUTPUT_DIR; /output is the sandbox default.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Clear only the CONTENTS of a directory, never the directory itself.
// Deleting the mount point would fail in the grading sandbox.
function clearContents(dir: string): void {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

// Copy one folder from the repository root into the output directory.
function stageFolder(name: string): void {
  const source = join(repoRoot, name);
  if (!existsSync(source)) {
    throw new Error(`missing folder to stage: ${source}`);
  }
  cpSync(source, join(outDir, name), { recursive: true });
}

// Build the dossier over everything staged in the output directory and
// write it next to the staged files. buildDossier returns the dossier as
// raw bytes, so write them as-is: stringifying them would inflate the
// file several times over.
function writeDossier(): void {
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(outDir, "dossier.json"), dossier);
}

function main(): void {
  clearContents(outDir);
  mkdirSync(outDir, { recursive: true });
  stageFolder("app");
  stageFolder("screenshots");
  writeDossier();
  console.log(`${ENTRY_NAME} delivered to ${outDir}`);
}

main();
