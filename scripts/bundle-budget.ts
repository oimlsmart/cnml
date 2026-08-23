/**
 * Bundle size budget (TODO.cnml/27).
 *
 * Reads the built HTML at three representative pages, sums the
 * gzipped size of every JS and CSS chunk the page references, and
 * compares to the per-page budget. Exits non-zero on overrun.
 *
 *   pnpm budget
 *
 * The budget is data — the BUDGETS array is the single source of
 * truth. Adjust the limits there, not in code.
 */

import {readFileSync, existsSync} from "node:fs";
import {join} from "node:path";
import { fileURLToPath } from "node:url";

import { gzipSize } from "./_gzip.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(here, "..", "apps", "cnml-web", "dist");

interface BudgetEntry {
  /** HTML path under dist/. */
  page: string;
  /** Maximum gzipped size of JS + CSS referenced by the page, in bytes. */
  maxGzippedBytes: number;
  /** Note for the report. */
  note: string;
}

const BUDGETS: BudgetEntry[] = [
  {
    page: "index.html",
    maxGzippedBytes: 80 * 1024,
    note: "home page — no islands, minimal JS",
  },
  {
    page: "docs/why-cnml/index.html",
    maxGzippedBytes: 90 * 1024,
    note: "docs page — marked only",
  },
  {
    page: "verify/index.html",
    maxGzippedBytes: 250 * 1024,
    note: "verify page — VerifyDrop + crypto pipeline",
  },
  {
    page: "qr-code/index.html",
    maxGzippedBytes: 100 * 1024,
    note: "QR code page — QrCodeGenerator + qrcode library",
  },
];

interface AssetRef {
  file: string;
  gzipped: number;
}

function readHtml(path: string): string {
  return readFileSync(path, "utf8");
}

function extractAssetRefs(html: string): string[] {
  const refs = new Set<string>();
  // <script type="module" src="/cnml/_astro/foo.abc123.js"></script>
  for (const m of html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)) {
    refs.add(stripBase(m[1]!));
  }
  // <link rel="stylesheet" href="/cnml/_astro/foo.abc123.css">
  for (const m of html.matchAll(/<link[^>]+href="([^"]+\.css)"/g)) {
    refs.add(stripBase(m[1]!));
  }
  // Astro islands reference their JS via component-url and
  // renderer-url attributes on <astro-island>. Both are needed:
  // the renderer is the per-page Astro client runtime; the
  // component is the island itself. Each loads eagerly when the
  // island hydrates.
  for (const m of html.matchAll(/(?:component-url|renderer-url)="([^"]+\.js)"/g)) {
    refs.add(stripBase(m[1]!));
  }
  // before-hydration-url (rare, but counts if present).
  for (const m of html.matchAll(/before-hydration-url="([^"]+)"/g)) {
    if (m[1]!.endsWith(".js")) refs.add(stripBase(m[1]!));
  }
  return [...refs];
}

function stripBase(href: string): string {
  // Convert /cnml/foo to foo. Other prefixes (https://, //) are
  // external and ignored.
  if (!href.startsWith("/")) return "";
  const stripped = href.replace(/^\/cnml\//, "").replace(/^\//, "");
  return stripped;
}

function resolveAsset(rel: string): string | null {
  if (!rel) return null;
  if (/^https?:\/\//.test(rel)) return null;
  if (rel.startsWith("//")) return null;
  const abs = join(DIST, rel);
  if (!existsSync(abs)) return null;
  return abs;
}

function sumGzipped(htmlPath: string): { total: number; refs: AssetRef[] } {
  const html = readHtml(htmlPath);
  const refs = extractAssetRefs(html);
  const assets: AssetRef[] = [];
  for (const rel of refs) {
    const abs = resolveAsset(rel);
    if (!abs) continue;
    const gz = gzipSize(readFileSync(abs));
    assets.push({ file: rel, gzipped: gz });
  }
  const total = assets.reduce((sum, a) => sum + a.gzipped, 0);
  return { total, refs: assets };
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} kB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function main(): number {
  if (!existsSync(DIST)) {
    console.error(`dist/ not found at ${DIST} — run \`pnpm build\` first.`);
    return 2;
  }
  let failed = 0;
  console.log("Bundle size budget (gzipped, JS + CSS per page)\n");
  for (const entry of BUDGETS) {
    const pagePath = join(DIST, entry.page);
    if (!existsSync(pagePath)) {
      console.error(`  ✖ ${entry.page} — not found in dist/`);
      failed++;
      continue;
    }
    const { total, refs } = sumGzipped(pagePath);
    const pct = (total / entry.maxGzippedBytes) * 100;
    const ok = total <= entry.maxGzippedBytes;
    const status = ok ? "OK " : "OVER";
    console.log(`  ${ok ? "✔" : "✖"} ${entry.page.padEnd(28)} ${formatBytes(total).padStart(8)} / ${formatBytes(entry.maxGzippedBytes).padEnd(8)} ${pct.toFixed(0).padStart(3)}%  ${status}`);
    console.log(`     ${entry.note}`);
    if (!ok) {
      failed++;
      console.log("     Largest contributors:");
      const top = [...refs].sort((a, b) => b.gzipped - a.gzipped).slice(0, 5);
      for (const r of top) {
        console.log(`       ${formatBytes(r.gzipped).padStart(8)}  ${r.file}`);
      }
    }
  }
  console.log("");
  if (failed > 0) {
    console.error(`${failed} page(s) over budget.`);
    return 1;
  }
  console.log("All pages within budget.");
  return 0;
}

process.exit(main());
