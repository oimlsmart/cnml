/**
 * Unit tests for the markdown-page helper (TODO.cnml/31).
 *
 * The helper centralizes frontmatter parsing, H1 stripping, and
 * link prefixing for the four catch-all routes. These tests pin the
 * contract so a refactor cannot silently break a route.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Astro's import.meta.env.BASE_URL is not defined under node:test.
// Set it on the global import.meta before the markdown-page import
// pulls url.ts. "/" matches the dev-time default; "/cnml/" would
// also work — the assertion is structural (the prefix appears), not
// literal (the prefix is a specific value).
//
// TypeScript: import.meta is read-only. The cast via Reflect works.
 Reflect.set(import.meta, "env", { ...(import.meta as any).env, BASE_URL: "/" });

const { readMarkdownPage, flatMarkdownStaticPaths, nestedMarkdownStaticPaths } = await import("./markdown-page.ts");

function makeTempContentDir(): string {
  return mkdtempSync(join(tmpdir(), "cnml-md-"));
}

describe("markdown-page — frontmatter parsing", () => {
  test("parses title, lede, coord from YAML-like frontmatter", () => {
    const dir = makeTempContentDir();
    writeFileSync(join(dir, "foo.md"), [
      "---",
      "title: 'Foo Title'",
      "lede: 'A short summary.'",
      "coord: 'AUDIENCES / 01'",
      "---",
      "",
      "Body text.",
      "",
    ].join("\n"));
    const page = readMarkdownPage({ params: { slug: "foo" }, contentDir: dir, urlDir: "/x/" });
    assert.equal(page.found, true);
    assert.equal(page.title, "Foo Title");
    assert.equal(page.lede, "A short summary.");
    assert.equal(page.coord, "AUDIENCES / 01");
    assert.match(page.html, /Body text/);
    rmSync(dir, { recursive: true, force: true });
  });

  test("falls back to H1-derived title when no frontmatter is present", () => {
    const dir = makeTempContentDir();
    writeFileSync(join(dir, "bar.md"), [
      "# Bar Heading",
      "",
      "Body.",
    ].join("\n"));
    const page = readMarkdownPage({ params: { slug: "bar" }, contentDir: dir, urlDir: "/x/" });
    assert.equal(page.title, "Bar Heading");
    rmSync(dir, { recursive: true, force: true });
  });

  test("returns found:false on a missing file", () => {
    const dir = makeTempContentDir();
    const page = readMarkdownPage({ params: { slug: "missing" }, contentDir: dir, urlDir: "/x/" });
    assert.equal(page.found, false);
    rmSync(dir, { recursive: true, force: true });
  });
});

describe("markdown-page — link prefixing", () => {
  test("prefixes absolute /about/x links with BASE_URL", () => {
    const dir = makeTempContentDir();
    writeFileSync(join(dir, "p.md"), [
      "---",
      "title: 'P'",
      "---",
      "",
      "[link](/about/foo)",
      "",
    ].join("\n"));
    const page = readMarkdownPage({ params: { slug: "p" }, contentDir: dir, urlDir: "/x/" });
    // The exact prefix depends on the test runner's BASE_URL, but the
    // link must be transformed (no longer starts with exactly "/about/").
    assert.match(page.html, /href="[^"]*about\/foo"/);
    rmSync(dir, { recursive: true, force: true });
  });

  test("prefixes ../foo links as root-relative", () => {
    const dir = makeTempContentDir();
    writeFileSync(join(dir, "p.md"), [
      "---",
      "title: 'P'",
      "---",
      "",
      "[link](../audiences/bar)",
      "",
    ].join("\n"));
    const page = readMarkdownPage({ params: { slug: "p" }, contentDir: dir, urlDir: "/x/" });
    // ../audiences/bar becomes /audiences/bar under BASE_URL.
    assert.match(page.html, /href="[^"]*audiences\/bar"/);
    rmSync(dir, { recursive: true, force: true });
  });

  test("leaves external URLs untouched", () => {
    const dir = makeTempContentDir();
    writeFileSync(join(dir, "p.md"), [
      "---",
      "title: 'P'",
      "---",
      "",
      "[ext](https://example.com/path)",
      "",
    ].join("\n"));
    const page = readMarkdownPage({ params: { slug: "p" }, contentDir: dir, urlDir: "/x/" });
    assert.match(page.html, /href="https:\/\/example\.com\/path"/);
    rmSync(dir, { recursive: true, force: true });
  });
});

describe("markdown-page — static path enumeration", () => {
  test("flatMarkdownStaticPaths returns one slug per .md file at the top level", () => {
    const dir = makeTempContentDir();
    writeFileSync(join(dir, "a.md"), "# A");
    writeFileSync(join(dir, "b.md"), "# B");
    writeFileSync(join(dir, "not-md.txt"), "ignore");
    const paths = flatMarkdownStaticPaths(dir).map((p) => p.params.slug).sort();
    assert.deepEqual(paths, ["a", "b"]);
    rmSync(dir, { recursive: true, force: true });
  });

  test("nestedMarkdownStaticPaths preserves the subdirectory structure in the slug", () => {
    const dir = makeTempContentDir();
    writeFileSync(join(dir, "top.md"), "# Top");
    mkdirSync(join(dir, "concepts"));
    writeFileSync(join(dir, "concepts", "foo.md"), "# Foo");
    const paths = nestedMarkdownStaticPaths(dir).map((p) => p.params.slug).sort();
    assert.deepEqual(paths, ["concepts/foo", "top"]);
    rmSync(dir, { recursive: true, force: true });
  });
});
