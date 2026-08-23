/**
 * Post-build script: copies the built site into audience-specific
 * directories. Each audience gets only the pages they need + their
 * manual.
 *
 * Output:
 *   dist/
 *     signer/    ← /create, /keys, /csr, /verify + signer manual
 *     verifier/  ← /verify only + verifier manual
 *     public/    ← everything (full read-only site)
 *
 * Usage: node scripts/audience-build.ts
 */
import {cpSync, existsSync, writeFileSync, readdirSync} from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { readFileSync } from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const DIST = path.resolve(ROOT, "apps", "cnml-web", "dist");

interface AudienceConfig {
  name: string;
  dir: string;
  pages: string[];       // which page directories to include
  assets: boolean;       // include _astro, img, etc?
  manual: string | null; // path to manual markdown
}

const audiences: AudienceConfig[] = [
  {
    name: "signer",
    dir: "signer",
    pages: ["create", "keys", "verify", "certs", "schemas", "docs"],
    assets: true,
    manual: path.resolve(ROOT, "docs", "manual-signer.md"),
  },
  {
    name: "verifier",
    dir: "verifier",
    pages: ["verify"],
    assets: true,
    manual: path.resolve(ROOT, "docs", "manual-verifier.md"),
  },
  {
    name: "public",
    dir: "public",
    pages: [], // empty = include everything
    assets: true,
    manual: null,
  },
];

// Pages that every audience gets (shared)
const sharedPages = ["index.html", "img", "_astro", "favicon.ico"];
const sharedDirs = ["diagrams"];

for (const audience of audiences) {
  const outDir = path.join(DIST, audience.dir);
  console.log(`\n=== Building ${audience.name} → dist/${audience.dir}/ ===`);

  // Start clean
  if (existsSync(outDir)) cpSync(outDir, outDir, { recursive: true });

  // Copy shared assets
  for (const shared of sharedPages) {
    const src = path.join(DIST, shared);
    if (existsSync(src)) {
      const dst = path.join(outDir, shared);
      cpSync(src, dst, { recursive: true });
      console.log(`  ✓ ${shared}`);
    }
  }
  for (const shared of sharedDirs) {
    const src = path.join(DIST, shared);
    if (existsSync(src)) {
      cpSync(src, path.join(outDir, shared), { recursive: true });
      console.log(`  ✓ ${shared}/`);
    }
  }

  if (audience.pages.length === 0) {
    // Public: copy all top-level entries EXCEPT audience directories
    const allEntries = readdirSync(DIST).filter((e) =>
      !["signer", "verifier", "public"].includes(e)
    );
    for (const entry of allEntries) {
      cpSync(path.join(DIST, entry), path.join(outDir, entry), { recursive: true });
      console.log(`  ✓ ${entry}`);
    }
  } else {
    // Copy specific pages
    for (const page of audience.pages) {
      const src = path.join(DIST, page);
      if (existsSync(src)) {
        cpSync(src, path.join(outDir, page), { recursive: true });
        console.log(`  ✓ ${page}/`);
      }
    }
  }

  // Add manual
  if (audience.manual && existsSync(audience.manual)) {
    const manualText = readFileSync(audience.manual, "utf8");
    // Write as plain HTML for easy reading
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>CNML ${audience.name} Manual</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 48rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
  h1 { color: #004996; } h2 { color: #003a78; border-bottom: 1px solid #ddd; padding-bottom: 0.3rem; }
  code { background: #eef0f3; padding: 0.1em 0.3em; border-radius: 3px; }
  pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 1rem; overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
  th, td { border: 1px solid #e2e8f0; padding: 0.5rem; text-align: left; }
</style>
</head><body><pre>${manualText.replace(/</g, "&lt;")}</pre></body></html>`;
    writeFileSync(path.join(outDir, "manual.html"), html);
    console.log("  ✓ manual.html");
  }

  console.log(`  → ${audience.name} build complete`);
}

console.log("\n✓ All audience builds complete");
console.log("  dist/signer/    — for CNML signers (create + sign + keys + verify)");
console.log("  dist/verifier/  — for verifiers (verify only)");
console.log("  dist/public/    — full site (read-only)");
