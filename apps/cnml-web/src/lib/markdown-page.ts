/**
 * Shared markdown-page helpers (TODO.cnml/31).
 *
 * The four catch-all routes — about/[...slug], audiences/[...slug],
 * features/[...slug], docs/[...slug] — share the same shape:
 *
 *   1. Walk a content directory at build time, emit slugs.
 *   2. Read the markdown file for the current slug.
 *   3. Parse frontmatter (title, lede, coord) and strip the H1.
 *   4. Render the body through `marked.parse` and `prefixHtmlLinks`
 *      with the right per-route URL directory.
 *
 * Centralizing those four steps here means a change to frontmatter
 * format, link-prefix logic, or static-path generation happens in
 * one place, not four.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {join} from "node:path";
import { marked } from "marked";
import { prefixHtmlLinks } from "./url.ts";
import { highlightExistingPre } from "./code-highlight.ts";
import { linkGlossaryTerms } from "./glossary-linker.ts";
import { sanitizeHtml } from "./sanitize.ts";

export interface MarkdownStaticPath {
  params: { slug: string };
}

export interface MarkdownPageInput {
  /** The current route params (Astro.params). */
  params: { slug?: string };
  /** Absolute path to the content directory. */
  contentDir: string;
  /** URL directory for link prefixing (e.g., "/about/"). */
  urlDir: string;
}

export interface MarkdownPageResult {
  slug: string;
  title: string;
  lede: string;
  coord: string;
  /** Raw markdown body (frontmatter + H1 stripped). */
  body: string;
  /** Rendered HTML with internal links prefixed by BASE_URL. */
  html: string;
  /** Source path on disk. */
  sourcePath: string;
  found: boolean;
}

/**
 * Build the getStaticPaths body for a flat content directory.
 * Reads every .md file under contentDir and emits one path per file.
 * The slug is the filename without the .md extension.
 */
export function flatMarkdownStaticPaths(contentDir: string): MarkdownStaticPath[] {
  return readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ params: { slug: f.slice(0, -3) } }));
}

/**
 * Build the getStaticPaths body for a nested content directory.
 * A file at contentDir/foo/bar.md becomes the slug "foo/bar".
 */
export function nestedMarkdownStaticPaths(contentDir: string): MarkdownStaticPath[] {
  const walk = (dir: string, base: string[]): string[] => {
    const out: string[] = [];
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const rel = [...base, name];
      const st = statSync(full);
      if (st.isDirectory()) {
        out.push(...walk(full, rel));
      } else if (name.endsWith(".md")) {
        out.push(rel.slice(0, -1).concat(name.slice(0, -3)).join("/"));
      }
    }
    return out;
  };
  return walk(contentDir, []).map((slug) => ({ params: { slug } }));
}

/**
 * Read a `key: value` line from frontmatter. Handles single-quoted,
 * double-quoted, and bare values. Returns undefined when the key is
 * not present.
 */
function readFrontmatterValue(fm: string, key: string): string | undefined {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"));
  if (!m) return undefined;
  let val = m[1]!;
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
    val = val.slice(1, -1);
  }
  return val;
}

/**
 * Read a markdown page from disk, parse frontmatter, render the body,
 * and prefix internal links. Returns `found: false` if the file is
 * missing.
 *
 * Frontmatter is parsed as YAML-like key:value pairs at the top of
 * the file between `---` markers. The known keys are `title`,
 * `lede`, `coord`. Unknown keys are ignored.
 *
 * The first H1 is stripped from the body when it restates the title
 * (avoids duplicate display when the route renders its own <h1>).
 */
export function readMarkdownPage(input: MarkdownPageInput): MarkdownPageResult {
  const slug = input.params.slug ?? "";
  const sourcePath = join(input.contentDir, `${slug}.md`);
  if (!existsSync(sourcePath)) {
    return {
      slug,
      title: slug,
      lede: "",
      coord: "",
      body: "",
      html: "<p>Not found.</p>",
      sourcePath,
      found: false,
    };
  }
  const md = readFileSync(sourcePath, "utf8");

  let title = slug;
  let lede = "";
  let coord = "";
  let body = md;

  // YAML-like frontmatter between --- markers.
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (fmMatch) {
    const fm = fmMatch[1]!;
    body = fmMatch[2]!;
    title = readFrontmatterValue(fm, "title") ?? title;
    lede = readFrontmatterValue(fm, "lede") ?? lede;
    coord = readFrontmatterValue(fm, "coord") ?? coord;
  } else {
    // No frontmatter — derive title from the first H1.
    const lines = md.split("\n");
    const h1Line = lines.find((l) => l.startsWith("# "));
    if (h1Line) title = h1Line.slice(2).trim();
    const h1Idx = lines.findIndex((l) => l.startsWith("# "));
    body = h1Idx >= 0 ? lines.slice(h1Idx + 1).join("\n") : md;
  }

  // marked.parse produces plain `<pre><code>` blocks. The
  // `renderMarkdownBody` async helper in `code-highlight.ts`
  // Optionally post-processes them with Shiki (TODO 43) and runs
  // the glossary linker (TODO 45). Callers that do not need
  // highlighting or linking use the sync `html` field directly.
  //
  // The output is sanitized (TODO 47) before being returned. The
  // sanitization is defense-in-depth — today's markdown source is
  // trusted (it lives in the repo and is reviewed in PRs), but a
  // future contributor who pastes raw HTML into a markdown file
  // would inject it without this gate.
  const html = sanitizeHtml(prefixHtmlLinks(marked.parse(body), input.urlDir));

  return { slug, title, lede, coord, body, html, sourcePath, found: true };
}

/**
 * Async post-processor for a `MarkdownPageResult.html`:
 *   - Replaces `<pre><code>` blocks with Shiki-highlighted HTML (TODO 43).
 *   - Wraps glossary term mentions in `<a>` tags (TODO 45).
 *
 * Used by docs routes where the prose-heavy body benefits from both.
 * About/audience/features pages typically do not need this (their
 * content rarely has code blocks and glossary mentions are sparse).
 */
export async function renderMarkdownBody(html: string): Promise<string> {
  const highlighted = await highlightExistingPre(html);
  return linkGlossaryTerms(highlighted);
}

/**
 * Resolve a content directory relative to the calling module's file.
 *
 * Works in both dev (where import.meta.url points at the source
 * .astro file at apps/cnml-web/src/pages/<route>/) and build (where
 * it points at a compiled chunk at
 * apps/cnml-web/dist/.prerender/chunks/). Both paths are 4 levels
 * below apps/cnml-web/, so the same relative resolution works in
 * either environment.
 *
 * `pathFromAppsDir` is the path from `apps/cnml-web/` (e.g.,
 * `src/content/about`).
 */
export function contentDirFrom(moduleUrl: string, pathFromAppsDir: string): string {
  const here = fileURLToPath(new URL(moduleUrl));
  return join(here, "..", "..", "..", "..", pathFromAppsDir);
}
