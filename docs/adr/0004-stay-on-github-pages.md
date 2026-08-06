# ADR-0004: Stay on GitHub Pages until a concrete trigger fires

## Status

Accepted (2026-08-06).

Supersedes [ADR-0002](0002-cloudflare-pages-for-static-site.md).

## Context

ADR-0002 proposed moving the static site from GitHub Pages to
Cloudflare Pages for three benefits: real HTTP security headers
(via `_headers`), Pages Functions (compute at the edge), and edge
caching beyond what GitHub's Fastly-backed CDN provides.

Reassessment on 2026-08-06 found that none of these benefits
materialize at the proposal stage. The site serves a fixed corpus
of static HTML/CSS/JS to a small audience of OIML SMART programme
participants and interested public-sector verifiers. Traffic is
far below GitHub Pages's 100GB/month ceiling. No compute is
required at the edge (the passport endpoint is a static JSON file
today). The current security headers via `<meta http-equiv>` cover
the project's actual needs (Confium WASM does not use
SharedArrayBuffer; no CSP violation reporting is configured; HSTS
preload is nice-to-have, not critical).

The cost-benefit at the proposal stage:

```
                       Staying on Pages            Moving to Cloudflare
                       ──────────────────          ────────────────────
  Setup cost           zero                        DNS cutover, Worker
                                                   deployment, secrets,
                                                   one operational cycle
  Maintenance         none                          Worker + Pages project
  Risk                zero                          DNS misconfiguration,
                                                   Worker bug = 404 on
                                                   /cnml/* for everyone
  Benefit             zero                          (none materializing
                                                   today)
```

The Cloudflare scaffolding put in place by TODO.cnml/63 is not
wasted; it sits dormant in the repo and costs nothing to keep.
Activating it requires only DNS changes plus a configured
`CLOUDFLARE_API_TOKEN` secret in GitHub.

## Decision

Stay on GitHub Pages. The Cloudflare scaffolding (the `_headers`,
`_redirects`, `wrangler.toml`, Pages Function at
`apps/cnml-web/functions/passport/[certid].json.ts`, and the
`deploy-cloudflare.yml` workflow) stays in place as a documented
future migration, ready to activate when one of the following
triggers fires.

## Triggers

Activate Cloudflare when **any one** of these becomes true:

1. **The transparency log exists and the passport endpoint must
   serve live data.** Today the passport endpoint is a static JSON
   file baked at build time. When the OIML Root is live and every
   issued certificate is in the transparency log, the endpoint
   needs to query the log by cert id, which requires compute at
   the edge. The Pages Function at
   `apps/cnml-web/functions/passport/[certid].json.ts` is the
   ready implementation.

2. **Confium WASM adopts threading.** SharedArrayBuffer (which
   threaded WASM needs) requires `Cross-Origin-Embedder-Policy:
   require-corp` and `Cross-Origin-Opener-Policy: same-origin` as
   real HTTP headers. The meta-tag versions of these are ignored
   by browsers. Today the Confium WASM does not use threading.

3. **Traffic exceeds 80% of GitHub Pages's 100GB/month ceiling.**
   Not in any plausible pilot; relevant only at scale.

4. **The site is being attacked and GitHub's Fastly-fronted CDN is
   insufficient.** Reactive, not preventive.

When a trigger fires, the migration is mechanical: configure the
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets in
GitHub, push to enable the `deploy-cloudflare.yml` workflow,
update DNS to point at Cloudflare, verify, then delete the
`deploy.yml` workflow.

## Consequences

**Easier:**

- No DNS cutover. The current `www.oimlsmart.org/cnml/...` URL
  keeps its current resolution path.
- No Worker to maintain. The Worker code in
  `apps/cnml-web/workers/` (had we written it) would have been
  one more thing to debug.
- No second deploy target. The `deploy.yml` workflow continues to
  use `actions/deploy-pages@v4`.

**Harder:**

- Security headers remain in `<meta http-equiv>` tags. The
  limitations (no `report-uri`, `frame-ancestors` partially
  honored, no HSTS preload, no COEP/COOP) are accepted as the
  price of staying on Pages.
- The Pages Function stays dormant. The static JSON file at
  `/passport/[certid].json` continues to be what Pages serves.

**Follow-up:**

- This ADR supersedes ADR-0002 in place; ADR-0002's status flips
  to "Superseded by ADR-0004".
- TODO.cnml/63 stays DONE (the scaffolding shipped) with a note
  that activation is gated on the triggers above.
- The README documents both workflows and marks `deploy.yml` as
  production and `deploy-cloudflare.yml` as dormant.

## References

- ADR-0002 (superseded)
- TODO.cnml/63 (Cloudflare scaffolding, dormant)
- TODO.cnml/36 (Security headers — the meta-tag implementation
  this ADR accepts as the price of staying on Pages)
