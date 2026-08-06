/**
 * Audit tests (TODO.cnml/21, moved to web app per TODO.cnml/61).
 *
 * 29 tests covering: link integrity, page rendering, OG/Twitter
 * metadata, JSON-LD structured data, sitemap, fonts, PWA manifest,
 * security headers, search index, CONTRIBUTING/SECURITY, Dependabot,
 * CodeQL, issue templates, accessibility/privacy pages, architecture
 * artifacts (CONTEXT, ADRs, Cloudflare), CA server split, npm
 * namespace, IA-deep-audit runbooks.
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// apps/cnml-web/test/audit → 4 levels up to repo root.
const ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const DIST = path.resolve(ROOT, "apps", "cnml-web", "dist");
const BASE_PATH = "/cnml/";

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

describe("Build artifacts exist", () => {
  test("dist/ directory is present", () => {
    assert.ok(existsSync(DIST), `dist/ not found at ${DIST} — run pnpm build first`);
  });
});

describe("Internal link integrity", () => {
  test("every internal href resolves", () => {
    if (!existsSync(DIST)) return;
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
        if (norm.startsWith(BASE_PATH)) norm = "/" + norm.slice(BASE_PATH.length);
        links.add(norm);
      }
    }
    const broken = [];
    for (const link of [...links].sort()) {
      const candidates = [link, link + (link.endsWith("/") ? "index.html" : ""), link + "/index.html", link.replace(/\/$/, "") + "/index.html"];
      const found = candidates.some((c) => { const p = join(DIST, c); return existsSync(p) && statSync(p).isFile(); });
      if (!found) broken.push(link);
    }
    assert.deepEqual(broken, [], broken.length + " broken links:\n" + broken.join("\n"));
  });
});

describe("Page rendering sanity", () => {
  test("no empty <main> tags", () => {
    if (!existsSync(DIST)) return;
    for (const p of walk(DIST, ".html")) {
      const html = readFileSync(p, "utf8");
      assert.ok(!/<main[^>]*>\s*<\/main>/.test(html), "empty main: " + relative(DIST, p));
    }
  });

  test("no empty astro-island", () => {
    if (!existsSync(DIST)) return;
    for (const p of walk(DIST, ".html")) {
      const html = readFileSync(p, "utf8");
      const empty = html.match(/<astro-island[^>]*>\s*<\/astro-island>/g) ?? [];
      assert.equal(empty.length, 0, "broken hydration: " + relative(DIST, p));
    }
  });

  test("every page has OG/Twitter metadata", () => {
    if (!existsSync(DIST)) return;
    const pages = walk(DIST, ".html").filter((p) => !relative(DIST, p).endsWith("/manual.html"));
    const required = ["og:type","og:title","og:description","og:url","og:image","twitter:card","twitter:title","twitter:description","twitter:image"];
    for (const p of pages) {
      const html = readFileSync(p, "utf8");
      for (const tag of required) {
        const re = new RegExp('(?:property|name)="' + tag + '"', "i");
        assert.ok(re.test(html), relative(DIST, p) + " missing " + tag);
      }
    }
  });

  test("doc pages carry article metadata", () => {
    if (!existsSync(DIST)) return;
    const docsDir = join(DIST, "docs");
    if (!existsSync(docsDir)) return;
    for (const p of walk(docsDir, ".html")) {
      if (relative(DIST, p) === "docs/index.html") continue;
      const html = readFileSync(p, "utf8");
      assert.match(html, /og:type" content="article"/, relative(DIST, p) + " og:type not article");
      assert.match(html, /article:section/, relative(DIST, p) + " missing article:section");
    }
  });

  test("every page carries JSON-LD with the right type", () => {
    if (!existsSync(DIST)) return;
    const pages = walk(DIST, ".html").filter((p) => !relative(DIST, p).endsWith("/manual.html"));
    function expectedType(rel) {
      if (rel === "index.html") return "Organization";
      if (rel.startsWith("docs/")) return "TechArticle";
      if (rel.startsWith("about/")) return "AboutPage";
      if (rel.startsWith("audiences/") || rel.startsWith("features/")) return "Article";
      return null;
    }
    for (const p of pages) {
      const rel = relative(DIST, p);
      const html = readFileSync(p, "utf8");
      const m = html.match(/<script[^>]+application\/ld\+json[^>]*>([^<]+)</);
      if (!m) { assert.fail(rel + " no JSON-LD"); continue; }
      let doc;
      try { doc = JSON.parse(m[1] ?? ""); } catch (e) { assert.fail(rel + " JSON-LD parse"); continue; }
      assert.equal(doc["@context"], "https://schema.org", rel + " wrong @context");
      const exp = expectedType(rel);
      if (exp) assert.equal(doc["@type"], exp, rel + " wrong @type: " + doc["@type"]);
    }
  });
});

describe("Static asset integrity", () => {
  test("all diagram SVGs exist", () => {
    const d = join(DIST, "diagrams");
    if (!existsSync(d)) return;
    for (const s of ["architecture","certificate-layers","signing-flow","verification-flow","trust-chain","unitsml-embedding"])
      assert.ok(existsSync(join(d, s + ".svg")), s + ".svg missing");
  });

  test("R schema YAMLs exist", () => {
    const d = join(DIST, "schemas");
    if (!existsSync(d)) return;
    for (const id of ["R21","R31","R46","R49","R50","R51","R60","R61","R76","R85","R99","R105","R106","R107","R111","R117","R126","R129","R134","R136","R137","R139"])
      assert.ok(existsSync(join(d, id + ".yaml")), id + ".yaml missing");
  });

  test("sample cert files exist", () => {
    const d = join(DIST, "certs");
    if (!existsSync(d)) return;
    const files = readdirSync(d).filter((f) => /^r\d+-sample-\d+\.yaml$/.test(f));
    assert.ok(files.length >= 20, "expected >= 20, got " + files.length);
  });

  test("OIML logo present", () => {
    assert.ok(existsSync(join(DIST, "img", "oiml-logo.svg")), "OIML logo missing");
  });

  test("sitemap well-formed", () => {
    assert.ok(existsSync(join(DIST, "sitemap-index.xml")), "sitemap-index.xml missing");
    assert.ok(existsSync(join(DIST, "sitemap-0.xml")), "sitemap-0.xml missing");
    const s = readFileSync(join(DIST, "sitemap-0.xml"), "utf8");
    assert.match(s, /<urlset/, "sitemap-0.xml wrong root");
    assert.match(s, /https:\/\/www\.oimlsmart\.org\/cnml\//, "sitemap URLs wrong");
  });

  test("search index present", () => {
    const dir = join(DIST, "pagefind");
    assert.ok(existsSync(dir), "pagefind/ missing");
    const contents = readdirSync(dir);
    assert.ok(contents.some((f) => f.startsWith("pagefind.")), "pagefind runtime missing");
    assert.ok(existsSync(join(DIST, "search", "index.html")), "search/index.html missing");
  });

  test("PWA manifest well-formed", () => {
    const m = JSON.parse(readFileSync(join(DIST, "manifest.json"), "utf8"));
    assert.equal(typeof m.name, "string");
    assert.equal(m.start_url, "/cnml/");
    assert.ok(Array.isArray(m.icons) && m.icons.length >= 1);
  });

  test("every page links manifest + security headers", () => {
    if (!existsSync(DIST)) return;
    const pages = walk(DIST, ".html").filter((p) => !relative(DIST, p).endsWith("/manual.html"));
    const required = [
      { tag: "manifest", re: /<link[^>]+rel="manifest"/i },
      { tag: "CSP", re: /http-equiv="Content-Security-Policy"/i },
      { tag: "Referrer-Policy", re: /http-equiv="Referrer-Policy"/i },
      { tag: "Permissions-Policy", re: /http-equiv="Permissions-Policy"/i },
    ];
    for (const p of pages) {
      const html = readFileSync(p, "utf8");
      for (const { tag, re } of required)
        assert.ok(re.test(html), relative(DIST, p) + " missing " + tag);
    }
  });

  test("no third-party font hosts", () => {
    if (!existsSync(DIST)) return;
    for (const p of walk(DIST, ".html")) {
      const html = readFileSync(p, "utf8");
      assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(html), relative(DIST, p) + " references Google Fonts");
    }
  });

  test("self-hosted fonts present", () => {
    const d = join(DIST, "_astro");
    if (!existsSync(d)) return;
    const fonts = readdirSync(d).filter((f) => /\.(woff2?|ttf|otf)$/.test(f));
    assert.ok(fonts.length >= 6, "expected >= 6 font files, got " + fonts.length);
    assert.ok(fonts.some((f) => /ibm-plex/i.test(f)), "no IBM Plex");
    assert.ok(fonts.some((f) => /fraunces/i.test(f)), "no Fraunces");
  });
});

describe("Repo-level artifacts", () => {
  test("CONTRIBUTING + SECURITY exist", () => {
    assert.ok(existsSync(join(ROOT, "CONTRIBUTING.md")));
    assert.ok(existsSync(join(ROOT, "SECURITY.md")));
    assert.match(readFileSync(join(ROOT, "CONTRIBUTING.md"), "utf8"), /pnpm test/);
    assert.match(readFileSync(join(ROOT, "SECURITY.md"), "utf8"), /Report a vulnerability/);
  });

  test("Dependabot + CodeQL workflows exist", () => {
    assert.ok(existsSync(join(ROOT, ".github/dependabot.yml")));
    assert.ok(existsSync(join(ROOT, ".github/workflows/codeql.yml")));
  });

  test("issue templates + PR template exist", () => {
    const d = join(ROOT, ".github/ISSUE_TEMPLATE");
    assert.ok(existsSync(join(d, "bug-report.md")));
    assert.ok(existsSync(join(d, "feature-request.md")));
    assert.ok(existsSync(join(d, "schema-request.md")));
    assert.ok(existsSync(join(d, "config.yml")));
    assert.ok(existsSync(join(ROOT, ".github/pull_request_template.md")));
  });

  test("accessibility + privacy pages exist", () => {
    assert.ok(existsSync(join(DIST, "about", "accessibility", "index.html")));
    assert.ok(existsSync(join(DIST, "about", "privacy", "index.html")));
    const home = readFileSync(join(DIST, "index.html"), "utf8");
    assert.match(home, /\/cnml\/about\/accessibility/);
    assert.match(home, /\/cnml\/about\/privacy/);
  });

  test("architecture artifacts: CONTEXT.md + ADRs + Cloudflare", () => {
    assert.ok(existsSync(join(ROOT, "CONTEXT.md")));
    assert.match(readFileSync(join(ROOT, "CONTEXT.md"), "utf8"), /## Domain glossary/);
    const adr = join(ROOT, "docs", "adr");
    assert.ok(existsSync(join(adr, "0000-template.md")));
    assert.ok(existsSync(join(adr, "0001-monorepo-with-sharp-seams.md")));
    assert.ok(existsSync(join(adr, "0004-stay-on-github-pages.md")));
    assert.ok(existsSync(join(adr, "0005-federated-transparency-logs.md")));
    assert.ok(existsSync(join(ROOT, "wrangler.toml")));
    assert.ok(existsSync(join(DIST, "_headers")));
  });

  test("CA server split: deploy.yml has no copy steps", () => {
    const d = readFileSync(join(ROOT, ".github/workflows/deploy.yml"), "utf8");
    assert.ok(!/Copy PKI documentation/.test(d), "still has copy-PKI step");
    assert.ok(!/Copy CA server docs/.test(d), "still has copy-CA step");
    assert.ok(existsSync(join(ROOT, ".github/workflows/release-ca.yml")));
  });

  test("npm namespace: every package is @oiml/*", () => {
    const pkgsDir = join(ROOT, "packages");
    if (!existsSync(pkgsDir)) return;
    for (const name of readdirSync(pkgsDir)) {
      const p = join(pkgsDir, name, "package.json");
      if (!existsSync(p)) continue;
      const pkg = JSON.parse(readFileSync(p, "utf8"));
      if (pkg.name) assert.ok(pkg.name.startsWith("@oiml/"), name + " not @oiml/*: " + pkg.name);
    }
  });

  test("IA-deep-audit runbooks + scripts exist", () => {
    const rb = join(ROOT, "docs", "runbooks");
    assert.ok(existsSync(join(rb, "biml-root-backup.md")));
    assert.ok(existsSync(join(rb, "ia-keystore-backup.md")));
    assert.ok(existsSync(join(rb, "incident-response.md")));
    assert.ok(existsSync(join(rb, "tabletop-exercise.md")));
    const sc = join(ROOT, "oiml-pki-server", "scripts");
    assert.ok(existsSync(join(sc, "provision-root-backup.rb")));
    assert.ok(existsSync(join(sc, "provision-keystore-backup.rb")));
    assert.ok(existsSync(join(sc, "anchor-audit-log.rb")));
    assert.ok(existsSync(join(sc, "re-share-officers.rb")));
    const ns = readFileSync(join(ROOT, "oiml-pki-server/lib/oiml_pki.rb"), "utf8");
    assert.match(ns, /ENV\.fetch\(["']OIML_SCOPE_OID["']/);
    const al = readFileSync(join(ROOT, "oiml-pki-server/lib/oiml_pki/audit_log.rb"), "utf8");
    assert.match(al, /def anchor_to_transparency_log!/);
  });
});
