/**
 * Audit tests — link integrity + page rendering sanity.
 *
 * Run after `pnpm build` to verify the built site:
 *   - Every internal href resolves to a real file in dist/
 *   - No empty <main> tags
 *   - No empty astro-island hydration failures
 *   - No legacy --color-cnml-* tokens in class attributes
 *   - No "No bundled samples" warnings on create pages
 *
 * Run: pnpm --filter @cnml/cnml-test-vectors test:audit
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..");
const DIST = path.resolve(ROOT, "apps", "cnml-web", "dist");

// The Astro base path (see astro.config.mjs). Links in the built HTML are
// prefixed with this path, but files in dist/ are at the root level. Strip
// the prefix when resolving links against the local filesystem.
const BASE_PATH = "/cnml/";

describe("Build artifacts exist", () => {
  test("dist/ directory is present", () => {
    assert.ok(existsSync(DIST), `dist/ not found at ${DIST} — run \`pnpm build\` first`);
  });
});

describe("Internal link integrity", () => {
  test("every internal href resolves", () => {
    if (!existsSync(DIST)) return; // skip if build missing
    const pages = walk(DIST, ".html");
    const links = new Set();
    for (const f of pages) {
      const html = readFileSync(f, "utf8");
      const re = /href="([^":?#]+)"/g;
      let m;
      while ((m = re.exec(html))) {
        const raw = m[1]!;
        if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(raw)) continue;
        let norm = raw.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
        if (!norm.startsWith("/")) norm = "/" + norm;
        // Strip the Astro base prefix so links resolve against dist/ root.
        if (norm.startsWith(BASE_PATH)) {
          norm = "/" + norm.slice(BASE_PATH.length);
        }
        links.add(norm);
      }
    }
    const broken: string[] = [];
    for (const link of [...links].sort()) {
      const candidates = [
        link,
        link + (link.endsWith("/") ? "index.html" : ""),
        link + "/index.html",
        link.replace(/\/$/, "") + "/index.html",
      ];
      const found = candidates.some((c) => {
        const p = join(DIST, c);
        return existsSync(p) && statSync(p).isFile();
      });
      if (!found) broken.push(link);
    }
    assert.deepEqual(broken, [], `${broken.length} broken links:\n${broken.join("\n")}`);
  });
});

describe("Page rendering sanity", () => {
  test("no empty <main> tags", () => {
    if (!existsSync(DIST)) return;
    const pages = walk(DIST, ".html");
    const bad: string[] = [];
    for (const p of pages) {
      const html = readFileSync(p, "utf8");
      if (/<main[^>]*>\s*<\/main>/.test(html)) bad.push(relative(DIST, p));
    }
    assert.deepEqual(bad, [], `${bad.length} pages with empty <main>:\n${bad.join("\n")}`);
  });

  test("no empty <astro-island> (broken hydration)", () => {
    if (!existsSync(DIST)) return;
    const pages = walk(DIST, ".html");
    const bad: string[] = [];
    for (const p of pages) {
      const html = readFileSync(p, "utf8");
      const emptyIslands = html.match(/<astro-island[^>]*>\s*<\/astro-island>/g) ?? [];
      if (emptyIslands.length > 0) bad.push(`${relative(DIST, p)} (${emptyIslands.length} empty)`);
    }
    assert.deepEqual(bad, [], `${bad.length} pages with broken hydration:\n${bad.join("\n")}`);
  });

  test("no leaked JS errors in HTML", () => {
    if (!existsSync(DIST)) return;
    const pages = walk(DIST, ".html");
    const bad: string[] = [];
    for (const p of pages) {
      const html = readFileSync(p, "utf8");
      const err = html.match(/(?:TypeError|ReferenceError):[^<"]{0,200}/);
      if (err) bad.push(`${relative(DIST, p)}: ${err[0]}`);
    }
    assert.deepEqual(bad, [], `${bad.length} pages with JS errors in HTML:\n${bad.join("\n")}`);
  });

  test("no legacy --color-cnml-* tokens in class attributes", () => {
    if (!existsSync(DIST)) return;
    const pages = walk(DIST, ".html");
    const bad: string[] = [];
    for (const p of pages) {
      const html = readFileSync(p, "utf8");
      const matches = html.match(/(?:class|className)="[^"]*--color-cnml-[^"]+"/g) ?? [];
      if (matches.length > 0) bad.push(`${relative(DIST, p)} (${matches.length} occurrences)`);
    }
    assert.deepEqual(bad, [], `${bad.length} pages still using legacy --color-cnml-* tokens:\n${bad.join("\n")}`);
  });

  test("create pages have sample data available", () => {
    if (!existsSync(DIST)) return;
    const createDir = join(DIST, "create");
    if (!existsSync(createDir)) return;
    const pages = walk(createDir, ".html");
    const bad: string[] = [];
    for (const p of pages) {
      const html = readFileSync(p, "utf8");
      if (/No bundled samples/.test(html)) bad.push(relative(DIST, p));
    }
    assert.deepEqual(bad, [], `${bad.length} create pages with no samples:\n${bad.join("\n")}`);
  });
});

describe("Static asset integrity", () => {
  test("all diagram SVGs exist", () => {
    const diagramsDir = join(DIST, "diagrams");
    if (!existsSync(diagramsDir)) return;
    const slugs = ["architecture", "certificate-layers", "signing-flow", "verification-flow", "trust-chain", "unitsml-embedding"];
    for (const slug of slugs) {
      const p = join(diagramsDir, `${slug}.svg`);
      assert.ok(existsSync(p), `${slug}.svg missing in dist/diagrams/`);
    }
  });

  test("all R schema YAMLs exist", () => {
    const schemasDir = join(DIST, "schemas");
    if (!existsSync(schemasDir)) return;
    const ids = ["R21", "R31", "R46", "R49", "R50", "R51", "R60", "R61", "R76", "R85", "R99", "R105", "R106", "R107", "R111", "R117", "R126", "R129", "R134", "R136", "R137", "R139"];
    for (const id of ids) {
      assert.ok(existsSync(join(schemasDir, `${id}.yaml`)), `${id}.yaml missing in dist/schemas/`);
    }
  });

  test("sample cert files exist (3 per R where available)", () => {
    const certsDir = join(DIST, "certs");
    if (!existsSync(certsDir)) return;
    const files = readdirSync(certsDir).filter((f) => /^r\d+-sample-\d+\.yaml$/.test(f));
    assert.ok(files.length >= 20, `expected ≥20 sample files, got ${files.length}`);
  });

  test("OIML logo present", () => {
    assert.ok(existsSync(join(DIST, "img", "oiml-logo.svg")), "OIML logo missing");
  });
});

function walk(dir: string, ext: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, ext, out);
    else if (extname(p) === ext) out.push(p);
  }
  return out;
}
