# ADR-0001: Monorepo with sharp internal seams

## Status

Accepted (2026-08-06).

## Context

The CNML repository contains multiple operationally distinct
components:

- The CNML web app (TypeScript, Astro, deploys to a public CDN).
- The CNML CA server (Ruby, Sinatra, deploys to an air-gapped
  facility).
- The CNML TS packages (the crypto, schema, and XML libraries).
- The CNML test-vectors corpus.
- The PKI documentation (`docs/pki-*`, `docs/manual-*.md`).

An architecture review on 2026-08-06 considered three shapes:

- **Shape A — split into two repos.** One repo for the web app and
  TS packages, one repo for the CA server and its docs.
- **Shape B — monorepo with sharp internal seams.** One repo, but
  each component is an independent workspace package with its own
  deploy workflow.
- **Shape C — full split into three repos.** Web app, CA server,
  and TS packages each in their own repo, with the TS packages
  published to npm.

Forces in play:

- **Atomic changes.** A change to the verify pipeline touches the
  TS package, the web app, the test vectors, and the docs. Split
  repos make this a multi-PR coordination effort.
- **Independent release cadence.** The CA server ships a security
  fix on its own schedule. A combined deploy forces the web app to
  rebuild for a Ruby-only change.
- **External contributors.** When the proposal reaches pilot
  adoption, an Issuing Authority may want to fork just the CA
  server. Split repos make that natural; a monorepo makes them
  clone the whole tree.
- **Operational simplicity.** One repo, one `git clone`, one
  `pnpm install`. Two repos double the onboarding steps.

The 2026-08-06 deploy workflow had a sharp symptom of the wrong
shape: two `cp -r` steps that copied the CA server's Ruby source
and PKI docs into the web app's `dist/` so the public site hosted
them for download. The web app had become the CA server's
distribution channel by accident.

## Decision

Adopt **Shape B — monorepo with sharp internal seams.**

The CNML project stays in one Git repository. Each operationally
distinct component is an independent workspace package with its
own deploy workflow. The web app's deploy artifact is the web app
only. The CA server ships as a release tarball via a separate
workflow. The TS packages are published to npm under the `@oiml/*`
scope (see ADR-0003).

Reject Shape A (split repos) until external contributors appear.
The coordination cost is not worth paying while every change
still touches multiple components.

Reject Shape C (three-way split) for now. The TS packages do not
yet have external consumers; publishing to npm from the monorepo
gives the same benefit without the source-level split (see
ADR-0003).

## Consequences

**Easier:**

- Atomic changes across components stay possible. A verify-pipeline
  fix lands in one PR.
- Onboarding is one `git clone` + one `pnpm install`.
- The web app's `dist/` becomes what its name says.
- The CA server's release cadence is independent.

**Harder:**

- The release workflow for the CA server is one more file to
  maintain (`release-ca.yml`).
- The pub` workflow for the TS packages is one more file
  (`publish.yml`).
- The two workflows share the same source tree; a contributor
  changing the CA server must remember the release workflow runs
  on tag, not on push.

**Follow-up:**

- Remove the `cp -r` steps from `deploy.yml`.
- Add `release-ca.yml` for the CA server tarball.
- Add `publish.yml` for the TS packages.
- Update CONTRIBUTING.md to describe the new release model.

## References

- Architecture review (2026-08-06): candidate 2
- TODO.cnml/62: CA server split (the implementation)
- ADR-0003: npm namespace (the publishing shape)
