/**
 * Content-Security-Policy builder.
 *
 * Extracted from Base.astro so the dev/prod CSP split is unit-testable.
 * Two constraints drive the shape:
 *
 * - frame-ancestors, report-uri, sandbox are NOT enforceable via <meta>
 *   (they require an HTTP header). Omitting rather than carrying dead
 *   directives that give a false sense of protection.
 *
 * - In dev mode Astro injects inline scripts for HMR/hydration; the
 *   production CSP (script-src 'self') would block them and flood the
 *   console. Dev widens to 'unsafe-inline'; production stays strict.
 */

export interface CspOptions {
  /** Whether the CSP is for dev mode (looser) or production (strict). */
  dev: boolean;
}

export function buildCsp(opts: CspOptions): string {
  const scriptSrc = opts.dev
    ? "script-src 'self' 'unsafe-inline'"
    : "script-src 'self'";
  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://www.oimlsmart.org",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}
