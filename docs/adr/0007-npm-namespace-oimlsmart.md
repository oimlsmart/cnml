# ADR-0007: npm namespace `@oimlsmart`

## Status

Accepted (2026-08-23).

Supersedes ADR-0003.

## Context

ADR-0003 adopted `@oiml/cnml-*` before anything was published. Two
things changed since:

- **The program's npm org is `@oimlsmart`.** The program's other
  TypeScript packages (`@oimlsmart/oiml-pubid`, `@oimlsmart/site-shell`)
  publish there. ADR-0003's own rationale said the npm org should
  match the GitHub org; the GitHub org is `oimlsmart`, and
  `@oimlsmart` is the scope that exists on npmjs.com with the
  program's packages in it.
- **The CNML v1 freeze sets the first publish.** The freeze trigger
  is the demo nightly producing an attested record. The packages
  have never been published, so the freeze's first publish is 1.0.0
  and no registry version history carries the old scope.

Forces in play:

- **One org to administer.** Two scopes would split the trusted
  publisher enrollments, the access control, and the discoverability
  story for no benefit.
- **Trusted publishing.** The release path is npm trusted publishing
  (GitHub Actions OIDC) with provenance attestations, the same
  machinery as the oiml-pubid repository. No npm token is stored
  anywhere; the earlier `publish.yml` (a `pkgs-v*` tag plus a stored
  `NPM_TOKEN`) is removed in favor of it.
- **One version line.** The ten packages move together. A single
  shared version keeps the inter-package `workspace:*` ranges honest
  and makes the tag check one comparison per package.

## Decision

Adopt the **`@oimlsmart` scope** for every published package in this
repository: `@oimlsmart/cnml-crypto`, `@oimlsmart/cnml-dcoc`,
`@oimlsmart/cnml-schemas`, `@oimlsmart/cnml-test-vectors`,
`@oimlsmart/cnml-types`, `@oimlsmart/cnml-units`, `@oimlsmart/cnml-xml`,
`@oimlsmart/cnml-xsd`, `@oimlsmart/ptb-dcc-compat`, and
`@oimlsmart/smi-attest`.

All ten packages share one version line. The first publish is 1.0.0
at the CNML v1 freeze. Releases ride `v*` tags:
`.github/workflows/release.yml` refuses a tag that does not equal
every package's version, runs the CI battery, and publishes the ten
packages in dependency order with `pnpm publish --provenance --access
public`. A package not yet registered on npm is skipped green with a
notice until the one-time manual first publish and the
trusted-publisher enrollment land (runbook:
`docs/deployment/npm-releases.md` in the smart repository).

## Consequences

**Easier:**

- One npm org (`@oimlsmart`) holds the whole program. The trusted
  publisher enrollments and the access control live in one place.
- The scope matches the GitHub org, which was ADR-0003's stated
  intent.
- Nothing was ever published under `@oiml`, so no deprecation or
  rename-on-registry dance is needed.

**Harder:**

- Every internal consumer updates its specifiers: this workspace,
  the web app, and the smart platform's CNML bridge (its bundler
  aliases and dynamic imports move from `@cnml/*` to
  `@oimlsmart/cnml-*`).
- The one-time bootstrap is ten manual publishes and ten trusted
  publisher enrollments instead of one, all at the freeze.

**Follow-up:**

- At the freeze signal: the manual first publish of all ten packages
  from `main`, then the ten trusted-publisher enrollments on
  npmjs.com (organization `oimlsmart`, repository `cnml`, workflow
  `release.yml`, no environment). After that, releases are tags-only.

## References

- ADR-0003 (the earlier `@oiml/cnml-*` decision, superseded)
- `.github/workflows/release.yml` (the trusted-publishing path)
- Runbook: `docs/deployment/npm-releases.md` in the smart repository
- pnpm workspace: `pnpm-workspace.yaml`
