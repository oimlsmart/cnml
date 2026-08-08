#!/usr/bin/env node
// Crawl every internal link in the built CNML site and report broken ones.
// Run: node --experimental-strip-types scripts/audit-links.mjs
import { readFileSync, existsSync } from "node:fs";
import { walkDir } from "./_fs.ts";

const ROOT = "apps/cnml-web/dist";
if (!existsSync(ROOT)) {
  console.error(`✗ dist/ not found — run \`pnpm build\` first.`);
  process.exit(2);
}

// 1. Collect every internal link from every built HTML file
const htmlFiles = walkDir(ROOT, ".html");
const links = new Set();
const linkSources = new Map(); // link → [file, ...]
for (const f of htmlFiles) {
  const html = readFileSync(f, "utf8");
  const re = /href="([^":?#]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1]!;
    // Skip externals + data: + javascript:
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(raw)) continue;
    // Normalise: strip trailing /index.html
    let norm = raw.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    if (!norm.startsWith("/")) norm = "/" + norm;
    links.add(norm);
    push(linkSources, norm, f);
  }
}

// 2. For each link, check if it resolves in dist/
const broken = [];
const ok = [];
for (const link of [...links].sort()) {
  const candidates = [
    link,
    link + (link.endsWith("/") ? "index.html" : ""),
    link + "/index.html",
    link.replace(/\/$/, "") + "/index.html",
  ];
  const found = candidates.some((c) => {
    const p = join(ROOT, c);
    return existsSync(p) && statSync(p).isFile();
  });
  if (found) ok.push(link);
  else broken.push({ link, sources: linkSources.get(link) ?? [] });
}

// 3. Report
console.log(`✓ ${ok.length} links resolve`);
console.log(`✗ ${broken.length} broken links`);
console.log();
for (const { link, sources } of broken) {
  console.log(`  ✗ ${link}`);
  for (const s of sources.slice(0, 3)) {
    console.log(`      from: ${s.replace(ROOT + "/", "")}`);
  }
}

if (broken.length > 0) {
  console.log(`\nFAIL: ${broken.length} broken links`);
  process.exit(1);
}

// --- helpers ---
function push(map, key, val) {
  if (!map.has(key)) map.set(key, []);
  map.get(key)!.push(val);
}
