/**
 * Content-Security-Policy builder.
 *
 * Extracted from Base.astro so the dev/prod CSP split is unit-testable.
 * Two constraints drive the shape:
 *
 * - frame-ancestors, report-uri, sandbox are NOT enforceable via <meta>
 *   (they require an HTTP header). Omitted rather than carrying dead
 *   directives that give a false sense of protection.
 *
 * - Astro generates inline scripts for island hydration (the
 *   astro-island custom element registration, the FOUC prevention,
 *   the Vue runtime bootstrap). These inline scripts are essential for
 *   every Vue island to work. On static hosting (GitHub Pages) there
 *   is no server to generate nonces, so 'unsafe-inline' is required
 *   for scripts in both dev and production. The default-src 'self'
 *   still prevents loading external scripts from untrusted origins.
 */

export interface CspOptions {
  /** Whether the CSP is for dev mode (looser) or production (strict). */
  dev: boolean;
}

export function buildCsp(_opts: CspOptions): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://www.oimlsmart.org https://alice.btc.calendar.opentimestamps.org https://finney.calendar.opentimestamps.org",
    // The two OTS calendar origins: the CNML time attestation (required)
    // stamps the signed document's digest from the browser — the calendar
    // protocol's POST /digest + the upgrade's GET /timestamp/<hex>. A
    // digest submission is never a custody event; the origins are exactly
    // the calendars, nothing wider.
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}
