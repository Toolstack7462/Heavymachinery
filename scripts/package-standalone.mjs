#!/usr/bin/env node
/**
 * Assemble a deployable standalone bundle in `.next/standalone`.
 *
 * WHY THIS SCRIPT EXISTS — a real production incident:
 *
 * `next build` with `output: "standalone"` emits `.next/standalone/` containing
 * the server and its traced modules, and it ALREADY creates an (empty) `public`
 * directory there. `.next/static` and the real `public/` are deliberately
 * outside the trace and must be copied in.
 *
 * The obvious command is wrong:
 *
 *     cp -r public .next/standalone/public      # WRONG
 *
 * Because the destination already exists, `cp -r` nests the source inside it —
 * producing `.next/standalone/public/public/...`. The server then serves
 * nothing from `/brand/*` or `/clients/*`, so the company logo 404s on every
 * page and all 25 partner logos vanish. The page still returns 200, every route
 * still passes a status check, and the failure is invisible to anything that is
 * not actually loading the images. It shipped to production exactly once.
 *
 * This script copies directory *contents* and then verifies that a known asset
 * resolves, so the same mistake fails loudly at build time instead of silently
 * in the browser.
 *
 * Usage:  node scripts/package-standalone.mjs
 */

import { cp, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");

/** Assets that must resolve in the finished bundle, or the deploy is broken. */
const REQUIRED = [
  "public/brand/jowain-emblem.png",
  "public/brand/jowain-emblem-512.png",
  "public/clients/saudi-aramco.png",
  ".next/static",
];

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(standalone))) {
    console.error(
      "✗ .next/standalone not found. Run `npm run build` first " +
        '(next.config.ts must keep output: "standalone").',
    );
    process.exit(1);
  }

  // Copy CONTENTS into the destination, never the directory itself.
  for (const dir of ["public", ".next/static"]) {
    const from = path.join(root, dir);
    const to = path.join(standalone, dir);
    if (!(await exists(from))) {
      console.error(`✗ missing source: ${dir}`);
      process.exit(1);
    }
    await mkdir(to, { recursive: true });
    await cp(from, to, { recursive: true, force: true });
    console.log(`  copied ${dir}/ → .next/standalone/${dir}/`);
  }

  // Passenger restarts when this file is touched.
  await mkdir(path.join(standalone, "tmp"), { recursive: true });

  let ok = true;
  for (const rel of REQUIRED) {
    const target = path.join(standalone, rel);
    if (await exists(target)) {
      console.log(`  ✓ ${rel}`);
    } else {
      console.error(`  ✗ MISSING ${rel}`);
      ok = false;
    }
  }

  // The specific failure this script exists to prevent.
  if (await exists(path.join(standalone, "public", "public"))) {
    console.error(
      "  ✗ nested public/public detected — assets would 404 in production",
    );
    ok = false;
  }

  if (!ok) {
    console.error("\n✗ bundle is incomplete; do not deploy it.");
    process.exit(1);
  }
  console.log("\n✓ .next/standalone is ready to upload.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
