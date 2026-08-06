/**
 * Code-block highlighting (TODO.cnml/43).
 *
 * Post-processes HTML produced by marked. Finds every `<pre><code
 * class="language-X">...</code></pre>` block and replaces it with
 * Shiki-rendered HTML. Both light and dark themes are emitted; the
 * page's theme toggle (the `dark` class on <html>) controls which
 * is visible via CSS.
 *
 * The caller (markdown-page.ts → docs routes) appends a copy button
 * to each block. The copy button is a single delegated listener on
 * `<main>` so we don't ship one Vue island per code block.
 */

import { codeToHtml, createHighlighter } from "shiki";

const LIGHT_THEME = "github-light";
const DARK_THEME = "github-dark";
const SUPPORTED_LANGS = [
  "typescript", "javascript", "ruby", "xml", "yaml", "json",
  "bash", "shell", "python", "sql", "html", "css",
];

let highlighterPromise: Promise<unknown> | null = null;

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [LIGHT_THEME, DARK_THEME],
      langs: SUPPORTED_LANGS,
    });
  }
  return highlighterPromise;
}

/**
 * Find every `<pre><code ...>...</code></pre>` block in the HTML and
 * replace it with Shiki-highlighted output. Unknown languages fall
 * back to the original block.
 */
export async function highlightExistingPre(html: string): Promise<string> {
  const h = await getHighlighter();
  const shiki = h as Awaited<ReturnType<typeof createHighlighter>>;
  // Match <pre><code class="language-X">CODE</code></pre> blocks. The
  // CODE may contain HTML entities (`&lt;` for `<` etc.) — unescape
  // before passing to Shiki, re-escape on the fallback path.
  const re = /<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g;
  const replacements: Array<{ match: string; replacement: string }> = [];
  for (const m of html.matchAll(re)) {
    const lang = m[1] ?? "text";
    const code = unescapeHtml(m[2] ?? "");
    try {
      const light = shiki.codeToHtml(code, { lang, theme: LIGHT_THEME });
      const dark = shiki.codeToHtml(code, { lang, theme: DARK_THEME });
      const replacement = `<div class="cnml-code-block" data-lang="${escapeAttr(lang)}">${light}${dark}<button class="cnml-code-copy" type="button" aria-label="Copy code">Copy</button></div>`;
      replacements.push({ match: m[0]!, replacement });
    } catch {
      // Unknown language — leave the original block.
    }
  }
  let out = html;
  for (const { match, replacement } of replacements) {
    out = out.replace(match, replacement);
  }
  return out;
}

function unescapeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

// Re-export for tests that want to call Shiki directly.
export { codeToHtml };
