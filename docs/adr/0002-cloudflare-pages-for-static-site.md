# ADR-0002: Cloudflare Pages for the static site

## Status

**Superseded by [ADR-0004](0004-stay-on-github-pages.md)** (2026-08-06).

The Cloudflare scaffolding (the `_headers`, `_redirects`,
`wrangler.toml`, Pages Function, and `deploy-cloudflare.yml`) stays
in the repo as a documented future migration. Activation is gated
on the triggers defined in ADR-0004. GitHub Pages remains the
production deploy target.

## Status (original, 2026-08-06)

Accepted (superseded the same day by ADR-0004 after reassessment).

## Context

The CNML static site deploys to GitHub Pages today. The 2026-08-06
architecture review surfaced three limitations of Pages that the
project should not accept long-term:

1. **No real security headers.** Pages serves no HTTP headers
   beyond `Content-Type`. The CSP, Referrer-Policy,
   Permissions-Policy, and X-Content-Type-Options live in
   `<meta http-equiv>` tags, which are weaker than real headers.
   Specifically: no CSP `report-uri`, some browsers ignore
   `frame-ancestors` via meta, no HSTS preload.
2. **No compute surface.** The passport endpoint at
   `/passport/[certid].json` is a static demo file today. A
   production passport endpoint needs to query the transparency
   log by cert id, which requires server-side compute. Pages has
   none.
3. **No edge caching.** Pages serves from a single region. The
   trust anchor bundle, the schemas, and the fonts cache only
   through the browser; there is no CDN.

Cloudflare Pages gives the project:

1. **A real `_headers` file.** CSP `report-uri`, HSTS preload,
   COEP/COOP for the WASM verify path, all as real HTTP headers.
2. **Pages Functions.** A Pages Function at
   `/passport/[certid].json` can read from Workers KV when a
   transparency log exists, falling back to the static file when
   it does not.
3. **Edge caching.** Trust anchors, schemas, and fonts cache
   aggressively at the edge.

Forces in play:

- **Vendor lock-in.** Pages is a GitHub product; Cloudflare Pages
  is a Cloudflare product. Switching is some lock-in. The
  mitigate: the Astro build output is portable. Moving back to
  Pages (or to Netlify, Vercel, etc.) is one workflow change.
- **DNS control.** The OIML SMART programme owns
  `www.oimlsmart.org`. The DNS cutover is the programme's call,
  not GitHub's or Cloudflare's.
- **Cost.** Cloudflare Pages's free tier covers the project's
  traffic many times over. The Pages Function compute is also
  free at the project's expected volume.

## Decision

Adopt **Cloudflare Pages** as the static site's deploy target.

The Astro build produces the same `dist/`. The audience-build
produces the same per-audience subdirs. The Pagefind index is
unchanged. The Cloudflare deploy uploads the same artifact as
GitHub Pages.

Add:
- `apps/cnml-web/public/_headers` with the real CSP, HSTS, etc.
- `apps/cnml-web/public/_redirects` (empty initially).
- `wrangler.toml` for Pages project configuration.
- `apps/cnml-web/functions/passport/[certid].json.ts` as a Pages
  Function.
- `.github/workflows/deploy-cloudflare.yml` using
  `cloudflare/wrangler-action`.

The existing GitHub Pages deploy (`deploy.yml`) is kept as a warm
standby for one release cycle. After the DNS cutover is verified,
the Pages deploy is removed.

## Consequences

**Easier:**

- Real security headers without the `<meta http-equiv>` workaround.
- The passport endpoint can serve live data when the transparency
  log exists, without a separate backend service.
- Edge caching for the trust anchor bundle and the schemas.

**Harder:**

- One more deploy target in the CI matrix during the cutover.
- The Pages Function is one more file to maintain.
- The DNS cutover is a one-time operational task that needs
  coordination with the OIML SMART programme's DNS admin.

**Follow-up:**

- Add `_headers`, `_redirects`, `wrangler.toml`, the Pages
  Function, and the deploy workflow.
- Document the cutover plan in CONTRIBUTING.md.
- After cutover: remove the Pages deploy workflow.

## References

- Architecture review (2026-08-06): candidate 3
- TODO.cnml/63: Cloudflare Pages (the implementation)
- TODO.cnml/36: Security headers (the meta-equiv workaround this
  ADR makes obsolete)
