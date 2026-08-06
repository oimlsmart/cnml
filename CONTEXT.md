# CNML project context

This file is the domain glossary and concept index for the CNML
project. It is the stable vocabulary that contributors,
architecture reviews, and AI agents should use when discussing the
project.

The file is updated whenever:
- A new domain concept enters the codebase.
- An existing concept is renamed.
- A PR uses a term that is not yet in the glossary.

The architecture-review command reads this file first. Decisions
about names live in `docs/adr/`.

## Domain glossary

### Programme-level terms

- **OIML** — Organisation Internationale de Métrologie Légale. The
  international body that publishes OIML Recommendations and
  operates the OIML-CS framework.
- **OIML SMART** — the OIML programme that develops CNML and the
  wider digital metrology infrastructure. Owner of the `@oiml/*`
  npm namespace.
- **BIML** — Bureau International de Métrologie Légale. The
  permanent secretariat of OIML, headquartered in Paris. Operates
  the CNML root tier.
- **CIML** — Comité International de Métrologie Légale. The
  steering committee of OIML, one delegate per member state. Sets
  CNML policy.
- **OIML-CS** — the OIML Certificate System. The framework under
  which member states mutually recognize type approvals.
- **DoMC** — Declaration of Mutual Confidence. The OIML-CS
  instrument under which Issuing Authorities recognize each other.

### CNML format terms

- **CNML** — Certificat Numérique de Métrologie Légale. The digital
  certificate format defined by this proposal. Cryptographically
  signed XML conforming to a per-Recommendation JSON Schema.
- **CNML document** — a single XML instance conforming to the CNML
  format. Carries an XMLDSig signature.
- **CNML five-tier hierarchy** — the chain from OIML Root CA
  through Issuing Authority intermediates, manufacturer model
  certificates, down to per-device instance certificates.
- **Per-Recommendation schema** — the JSON Schema YAML under
  `packages/cnml-schemas/src/schemas/R*.yaml` that defines the
  fields for a single OIML Recommendation.
- **Composite signature** — an Ed25519 + ML-DSA-65 signature pair
  with AND semantics. Provides post-quantum defense.
- **Scope extension** — the X.509 v3 extension that binds an IA to
  its DoMC scope.
- **Transparency log** — the Merkle log that records every issued
  certificate. Anchored to Bitcoin via OpenTimestamps.

### CNML project artifacts

- **CNML web app** — the public-facing Astro site at
  `apps/cnml-web/`. Deployed to `www.oimlsmart.org/cnml/`.
- **CNML CA server** — the Ruby/Sinatra CA at
  `oiml-pki-server/`. Air-gapped deployment; ships as a
  release tarball.
- **CNML test-vectors** — the 22-vector corpus at
  `packages/cnml-test-vectors/`. Generates and verifies the corpus.
- **CNML TS packages** — the workspace packages under
  `packages/cnml-*`. Published to npm as `@oiml/cnml-*`.
- **Passport endpoint** — the machine-readable certificate view at
  `/passport/[certid].json`. Returns JSON-LD.
- **Check pipeline** — the seven-check verification pipeline at
  `packages/cnml-crypto/src/checks/`. Open/closed: a check is one
  file plus one line in the `CHECKS` array.
- **Audience build** — the per-audience split of the production
  build (signer, verifier, public) at `scripts/audience-build.ts`.

### Operational terms

- **Trust anchor bundle** — the static JSON bundle of root CA
  certificates the verifier downloads once. Served from
  `/trust-anchors.json`.
- **CRL** — Certificate Revocation List. CNML uses RFC 5280 CRLs.
- **Confium** — the threshold-cryptography substrate. CNML uses
  the FFI path (Ruby CA) and the WASM path (browser verifier).
- **Confium WASM** — the browser-loadable Confium bundle. Lazy-
  loaded via `loadConfiumWasm()`. Optional; degrades silently.

## Concept index

| Term                | Location                                                        |
|---------------------|-----------------------------------------------------------------|
| CNML web app        | `apps/cnml-web/`                                                |
| CNML CA server      | `oiml-pki-server/`                                              |
| CNML TS packages    | `packages/cnml-*/`                                              |
| CNML test-vectors   | `packages/cnml-test-vectors/`                                   |
| Per-R schemas       | `packages/cnml-schemas/src/schemas/R*.yaml`                     |
| Check pipeline      | `packages/cnml-crypto/src/checks/`                              |
| Passport endpoint   | `apps/cnml-web/src/pages/passport/`                             |
| Passport model      | `apps/cnml-web/src/lib/passport.ts`                             |
| Markdown rendering  | `apps/cnml-web/src/lib/markdown-page.ts`                        |
| URL/HTML helpers    | `apps/cnml-web/src/lib/url.ts`                                  |
| Style-guide linter  | `scripts/styleguide-lint.ts`                                    |
| Glossary linker     | `apps/cnml-web/src/lib/glossary-linker.ts`                      |
| Glossary registry   | `apps/cnml-web/src/data/glossary-terms.json`                    |
| Code highlighting   | `apps/cnml-web/src/lib/code-highlight.ts`                       |
| Sanitizer           | `apps/cnml-web/src/lib/sanitize.ts`                             |
| Reading-time        | `apps/cnml-web/src/lib/reading-time.ts`                         |
| TOC extractor       | `apps/cnml-web/src/lib/toc.ts`                                  |
| Service worker      | `apps/cnml-web/public/sw.js`                                    |
| Audience build      | `scripts/audience-build.ts`                                     |
| Bundle budget       | `scripts/bundle-budget.ts`                                      |
| Test vectors        | `packages/cnml-test-vectors/src/vectors/`                       |
| Vector generation   | `packages/cnml-test-vectors/src/generate-vectors.ts`            |
| Vector verification | `packages/cnml-test-vectors/src/verify-vectors.ts`              |
| PKI docs (source)   | `docs/pki-*`, `docs/manual-*.md`                                |
| CA server releases  | `.github/workflows/release-ca.yml`                              |
| Audit suite         | `apps/cnml-web/test/audit/audit.test.ts`                        |
| Vitest suite        | `apps/cnml-web/src/**/*.vitest.ts`                              |
| Playwright e2e      | `e2e/`                                                          |
| ADRs                | `docs/adr/`                                                     |

## See also

- [CLAUDE.md](CLAUDE.md) — the AI-agent guide.
- [CONTRIBUTING.md](CONTRIBUTING.md) — the contributor guide.
- [SECURITY.md](SECURITY.md) — the security policy.
- [docs/adr/](docs/adr/) — the architecture decision records.
- [TODO.cnml/](TODO.cnml/) — the planning archive.
