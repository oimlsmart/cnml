/**
 * Unit tests for the TOC + reading-time + glossary-linker helpers
 * (TODOs 42, 44, 45).
 *
 * These are pure functions, easy to test with Vitest. The Vue island
 * wrappers (DocsToc, DocsReadingAffordances) are presentation-only
 * and are tested separately.
 */

import { describe, test, expect } from "vitest";
import { extractToc, slugifyHeading } from "./toc";
import { readingTimeMinutes } from "./reading-time";
import { linkGlossaryTerms, buildRegistryFromGlossaryMarkdown } from "./glossary-linker";

describe("toc.ts", () => {
  test("extracts H2 and H3 headings", () => {
    const md = [
      "# Title",
      "",
      "## First section",
      "",
      "Some body.",
      "",
      "### Sub-section",
      "",
      "## Second section",
    ].join("\n");
    const toc = extractToc(md);
    expect(toc.map((t) => t.text)).toEqual([
      "First section",
      "Sub-section",
      "Second section",
    ]);
    expect(toc.map((t) => t.level)).toEqual([2, 3, 2]);
  });

  test("ignores headings inside fenced code blocks", () => {
    const md = [
      "# Title",
      "",
      "## Real",
      "",
      "```markdown",
      "## Fake (inside code block)",
      "```",
      "",
      "## Also real",
    ].join("\n");
    const toc = extractToc(md);
    expect(toc.map((t) => t.text)).toEqual(["Real", "Also real"]);
  });

  test("slugifies headings the GitHub way", () => {
    expect(slugifyHeading("Hello World")).toBe("hello-world");
    expect(slugifyHeading("CSP & sandbox")).toBe("csp-sandbox");
    expect(slugifyHeading("C++ / Rust")).toBe("c-rust");
    expect(slugifyHeading("  Multiple   Spaces  ")).toBe("multiple-spaces");
  });
});

describe("reading-time.ts", () => {
  test("220 words → 1 minute (rounded)", () => {
    expect(readingTimeMinutes("word ".repeat(220).trim())).toBe(1);
  });

  test("1100 words → 5 minutes", () => {
    expect(readingTimeMinutes("word ".repeat(1100).trim())).toBe(5);
  });

  test("empty body floors to 1 minute", () => {
    expect(readingTimeMinutes("")).toBe(1);
  });

  test("sub-220 words floors to 1 minute", () => {
    expect(readingTimeMinutes("a few words")).toBe(1);
  });
});

describe("glossary-linker.ts", () => {
  const registry = buildRegistryFromGlossaryMarkdown([
    "# Glossary",
    "",
    "## A",
    "**BIML.** Bureau International de Metrologie Legale.",
    "**HSM.** Hardware Security Module.",
    "**FROST.** A threshold signature scheme.",
  ].join("\n"));

  test("builds the registry from glossary markdown", () => {
    const terms = registry.map((r) => r.term).sort();
    expect(terms).toEqual(["BIML", "FROST", "HSM"]);
  });

  test("wraps a BIML mention in an <a>", () => {
    const html = "<p>The BIML operates the root.</p>";
    const linked = linkGlossaryTerms(html, registry);
    expect(linked).toMatch(/<a [^>]*>BIML<\/a>/);
  });

  test("matches plural form (HSMs)", () => {
    const html = "<p>Multiple HSMs are deployed.</p>";
    const linked = linkGlossaryTerms(html, registry);
    expect(linked).toMatch(/<a [^>]*>HSMs<\/a>/);
  });

  test("does not link inside <code>", () => {
    const html = "<p>Run <code>BIML --help</code> for help.</p>";
    const linked = linkGlossaryTerms(html, registry);
    // The <code> body should be unchanged.
    expect(linked).toMatch(/<code>BIML --help<\/code>/);
    expect(linked).not.toMatch(/<code><a/);
  });

  test("does not link inside existing <a>", () => {
    const html = '<p>See <a href="/x">BIML page</a> for details.</p>';
    const linked = linkGlossaryTerms(html, registry);
    expect(linked).toMatch(/<a href="\/x">BIML page<\/a>/);
  });

  test("does not link inside <h1>", () => {
    const html = "<h1>BIML Overview</h1><p>BIML is great.</p>";
    const linked = linkGlossaryTerms(html, registry);
    expect(linked).toMatch(/<h1>BIML Overview<\/h1>/);
    expect(linked).toMatch(/<p><a [^>]*>BIML<\/a> is great\.<\/p>/);
  });

  test("limits occurrences per page (MAX_OCCURRENCES_PER_TERM)", () => {
    const html = "<p>BIML BIML BIML BIML BIML</p>";
    const linked = linkGlossaryTerms(html, registry);
    const count = (linked.match(/cnml-glossary-link/g) ?? []).length;
    expect(count).toBeLessThanOrEqual(3);
  });
});
