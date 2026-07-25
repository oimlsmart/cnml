#!/usr/bin/env node
// Audit each built HTML page for visible problems:
//   - empty `<main>` tags (broken SSR)
//   - "astro-island" with no children (broken hydration)
//   - placeholder text still present
//   - Vue runtime errors inlined
//   - legacy color token references (CSS regression)
// Run: node --experimental-strip-types scripts/audit-pages.ts
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOT = "apps/cnml-web/dist";

const pages = walk(ROOT, ".html");
console.log(`Scanning ${pages.length} built pages…\n`);

const issues = [];
for (const p of pages) {
  const rel = relative(ROOT, p);
  const html = readFileSync(p, "utf8");
  const checks = [];

  // 1. CSS regressions: legacy --color-cnml-* tokens still referenced in
  //    class attributes (NOT in the @theme alias definitions in app.css)
  const legacyMatches = html.match(/(?:class|className)="[^"]*--color-cnml-[^"]+"/g) ?? [];
  if (legacyMatches.length > 0) {
    checks.push({ kind: "css-legacy", detail: `${legacyMatches.length} class attributes use legacy --color-cnml-* tokens` });
  }

  // 2. astro-island with no inner content (broken hydration)
  const islandMatches = html.match(/<astro-island[^>]*>\s*<\/astro-island>/g) ?? [];
  if (islandMatches.length > 0) {
    checks.push({ kind: "empty-island", detail: `${islandMatches.length} empty <astro-island> (failed hydration)` });
  }

  // 3. Error messages leaked into HTML
  if (/TypeError|ReferenceError|is not defined/i.test(html)) {
    const errLine = html.match(/(?:TypeError|ReferenceError)[^<"]{0,200}/i)?.[0];
    checks.push({ kind: "js-error", detail: `JS error visible in HTML: ${errLine}` });
  }

  // 4. Empty main tag
  if (/<main[^>]*>\s*<\/main>/.test(html)) {
    checks.push({ kind: "empty-main", detail: "<main> has no content" });
  }

  // 5. "no bespoke form" + "no bundled samples" warnings on create pages
  if (rel.startsWith("create/") && /No bundled samples/.test(html)) {
    checks.push({ kind: "no-samples", detail: "create page shows 'No bundled samples'" });
  }

  if (checks.length > 0) issues.push({ page: rel, checks });
}

if (issues.length === 0) {
  console.log("✓ No issues detected in built pages.");
  process.exit(0);
}

console.log(`✗ ${issues.length} pages with issues:\n`);
for (const { page, checks } of issues) {
  console.log(`  ${page}`);
  for (const c of checks) console.log(`    ${c.kind}: ${c.detail}`);
}
process.exit(1);

function walk(dir, ext, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, ext, out);
    else if (extname(p) === ext) out.push(p);
  }
  return out;
}
