/**
 * HTML sanitization (TODO.cnml/47).
 *
 * Defense in depth: even though today's markdown source is trusted
 * (it lives in the repo, reviewed in PRs), this module strips every
 * XSS vector that could survive a future content addition. The
 * allow-list is the exact set of tags and attributes the docs
 * actually use.
 *
 * DOMPurify does the parsing. The library is "isomorphic" — works
 * at build time with jsdom, no `window` dependency.
 */

import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "a", "p", "br", "hr", "strong", "em", "code", "pre", "kbd", "samp", "var",
  "ul", "ol", "li", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
  "img", "figure", "figcaption",
  "details", "summary",
  "span", "div", "section", "article",
];

const ALLOWED_ATTR = [
  "href", "title", "alt", "src", "srcset",
  "id", "class",
  "colspan", "rowspan", "headers", "scope",
  "lang", "dir",
  "open",
  "data-lang",
];

/**
 * Sanitize a fragment of HTML produced by marked. Strips:
 *   - <script>, <iframe>, <object>, <embed>, <form>, <input>, <style>
 *   - Event handlers (onclick, onerror, onmouseover, etc.)
 *   - javascript: URLs
 *   - inline style attributes
 *
 * Preserves everything in the allow-list above.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|data:image\/|\/|#))/i,
    FORBID_TAGS: ["style", "form", "input", "textarea", "button"],
    FORBID_ATTR: ["style", "srcset"],
  }) as string;
}
