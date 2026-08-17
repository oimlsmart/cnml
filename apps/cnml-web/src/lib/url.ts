// Resolve BASE lazily so this module is importable from contexts where
// import.meta.env is not yet populated (e.g., the node:test runner
// sets a polyfill before the first call). The fallback covers dev
// (BASE_URL is "/") and the bare node test runner (BASE_URL is undefined).
const base = (): string => {
  const env = (import.meta as unknown as { env?: { BASE_URL?: string } }).env;
  return env?.BASE_URL ?? "/";
};
const BASE = base();

export function url(path: string): string {
  return `${BASE}${path.replace(/^\//, '')}`;
}

// Prefix every internal link in a rendered markdown HTML body with the
// configured BASE_URL so absolute paths resolve under /cnml/ in
// production.
//
// Content markdown in this project uses three link conventions:
//
//   href="/about/foo"        absolute, prefix with BASE
//   href="../audiences/foo"  root-relative via "..", strip the leading
//                            ".." and prefix with BASE
//   href="how-it-works"      bare slug — sibling relative, resolved
//                            against `currentDir` and prefixed with BASE
//
// External URLs (https://, mailto:, etc.), protocol-relative URLs
// (//cdn.example/...), and links already prefixed with BASE are left
// untouched.
export function prefixHtmlLinks(html: string, currentDir: string): string {
  const baseDir = currentDir.endsWith('/') ? currentDir : currentDir + '/';
  return html.replace(
    /((?:href|src))="([^"]+)"/g,
    (match, attr, raw) => {
      if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/.test(raw)) return match;
      if (raw.startsWith(BASE)) return match;
      let resolved = raw;
      if (resolved.startsWith('../')) {
        resolved = '/' + resolved.slice(3);
      } else if (resolved.startsWith('./')) {
        resolved = baseDir + resolved.slice(2);
      } else if (!resolved.startsWith('/') && !resolved.startsWith('#')) {
        // Bare slug or relative path — resolve against the page's directory.
        resolved = baseDir + resolved;
      }
      const prefixed = `${BASE}${resolved.replace(/^\//, '')}`;
      return `${attr}="${prefixed}"`;
    },
  );
}
