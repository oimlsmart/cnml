# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CNML (Certificat Numérique de Métrologie Légale) — a cryptographically-signed,
machine-verifiable digital certificate format for OIML type approvals. The OIML
equivalent of PTB's DCC (Digital Calibration Certificate). See `README.md` and
`TESTING.md` for the project pitch and full manual test workflow.

## Commands

Workspace is pnpm + a Ruby gem. Run from repo root unless noted.

```bash
pnpm install                              # install all deps
pnpm dev                                  # Astro dev server, http://localhost:4321
pnpm build                                # production build + audience-build.ts split
pnpm gen                                  # regenerate schemas index + TS types from YAML
pnpm test                                 # TS unit tests (cnml-test-vectors)
pnpm test:e2e                             # Playwright (auto-starts dev on :4455)
pnpm vectors:gen                          # regenerate 22 pre-signed test vectors
pnpm vectors:verify                       # verify all test vectors round-trip
pnpm smoke                                # minimal sign+verify via Node

# Ruby CA server (separate Gemfile)
cd oiml-pki-server && bundle install
cd oiml-pki-server && ruby app.rb         # Sinatra on http://localhost:4455
cd oiml-pki-server && bundle exec rspec   # full Ruby suite
cd oiml-pki-server && bundle exec rspec spec/oiml_pki/ca_store_spec.rb          # one file
cd oiml-pki-server && bundle exec rspec -e "encrypts the private key"           # one example
```

Playwright runs against port **4455**, not 4321, to avoid dev-lock conflicts
(see `playwright.config.cjs`). The webServer block auto-starts Astro with
`ASTRO_DEV_BACKGROUND=1` and `--ignore-lock`.

Bundle analysis: `ANALYZE=1 pnpm build` then open `dist/stats.html`.

## Architecture: the big picture

```
OIML Root CA (BIML, hardware-backed, air-gapped)
    │ signs intermediate with X.509 v3 scope extension
    ▼
Issuing Authority CA (per-IA Yubikey/HSM)
    │ signs end-entity cert
    ▼
Per-cert Signer (browser IndexedDB, AES-GCM + PBKDF2)
    │ signs CNML XML (XMLDSig enveloped + Exclusive C14N)
    ▼
Signed CNML (XMLDSig + optional OpenTimestamps proof)
    │ verified by anyone
    ▼
Verifier (browser, 7-check pipeline)
```

The five-tier Mode 3 deployment uses **threshold cryptography (FROST)** at the
BIML Root (5-of-7 directors) and IA (2-of-3 officers) tiers; lower tiers stay
1-of-1. See `TODO.roadmap/README.md` and the `confium-architecture.md` doc.

### Source of truth

- **Canonical YAML schemas + 880 real cert instances**: the OIML-CS
  certificates repo (Ruby source-of-truth)
- **Confium Rust core** (threshold crypto, transparency log,
  coordinator): the confium repo
- **This repo**: synced schema copies + TS web app + Ruby PKI server

When schema fields or cert shapes disagree, the OIML-CS certificates
repo wins.

### Data-driven schemas (no per-Recommendation code)

All 22+ OIML Recommendation forms are rendered from JSON Schema YAML — there is
**no bespoke per-R code**. To add a new Recommendation:

1. Drop `packages/cnml-schemas/src/schemas/R<NN>.yaml` (with `x-oiml-*` metadata)
2. Run `pnpm gen` → regenerates `packages/cnml-schemas/src/index.ts` and `packages/cnml-types/`
3. The new R shows up in the UI, schemas page, and forms automatically

Shared schema fragments live in `packages/cnml-schemas/src/_core.yaml`,
`_units.yaml`, `_units_local.yaml`, and `modules/`.

### Check pipeline (open/closed)

Verify page runs a data-driven pipeline (`packages/cnml-crypto/src/checks/`).
Each check is a module exporting a `Check` object; `VerifyDrop.vue` iterates the
`CHECKS` array and renders results generically. Adding a check = new file + one
line in `CHECKS`. Order matters — earlier checks short-circuit later ones.

Current order: XML well-formed → schema valid → signature → scope → CRL →
timestamp → transparency.

### Ruby autoload (no require_relative for internal library code)

`oiml-pki-server/lib/oiml_pki.rb` is the namespace entry point. Every public
module is wired via `autoload`. New module = new file under `lib/oiml_pki/` +
one `autoload` line in `oiml_pki.rb`. **Never** use `require_relative` or
string-form `require` for files inside the library — only `autoload`. External
gems are required normally.

### KeyProvider dispatch (open/closed)

`OimlPki::KeyProvider.for(entry)` auto-picks a backend from entry shape:
`confium` → `Confium`, `pkcs11` → `Pkcs11`, `privateKey` → `Software`. Adding a
backend = new file under `key_provider/` + autoload entry + dispatch rule in
`for`. Backends implement `Base` (`sign`, `sign_cert`, `sign_crl`, `public_key`,
`extractable?`, `to_h`).

### Confium Rust integration (three binding paths + Mode 2 adapters)

| Path | Used by | Wire format | Code |
|------|---------|-------------|------|
| Ruby FFI (`confium-ruby ~> 0.3`) | CA server (in-process, secret-bearing) | C ABI over `libconfium.{so,dylib,dll}` | `KeyProvider::Confium`, `CoordinatorClient` |
| WebAssembly (`@confium/confium-wasm ^0.3.0`) | Browser (no secrets at rest) | WASM imports/exports, lazy-loaded | `loadConfiumWasm()` |
| TCP/WSS/QUIC (`confium-net` v1) | Cross-machine (director ↔ coordinator) | Length-prefixed CBOR | `CoordinatorClient.endpoints` |
| PKCS#11 / OpenSSL / JCE / TLS adapters | Existing enterprise apps (zero code change) | Standard legacy APIs | `confium-pkcs11-server`, `confium-openssl-provider`, `confium-jce-provider`, `confium-tls-signer` |

Single source of truth per concern: `ConfiumIntegration` (capability
detection), `loadConfiumWasm()` (WASM), `CoordinatorClient` (TCP).
Confium ships ~50 crates spanning threshold schemes (FROST variants,
BLS, CMP20, GG18, ML-KEM, FHE-BVF), store backends (PKCS#11, TPM,
OpenPGP card, cloud KMS), and transports (TCP, QUIC, WebSocket).
See `apps/cnml-web/src/content/docs/confium-architecture.md`.

### Audience builds

`scripts/audience-build.ts` splits the production build into per-audience
directories: `dist/signer/`, `dist/verifier/`, `dist/public/`. The Ruby CA
server stays in `oiml-pki-server/` for air-gapped deployment.

## Tech stack

- **Astro 7** + **Vite 8** — static build, no SSR
- **Vue 3.5** islands — interactive components mounted inside Astro pages
- **Tailwind 4** via `@tailwindcss/vite`
- **Ruby 3.4** + **Sinatra 4** — air-gapped CA server
- **OpenSSL 3.x** — X.509 cert + CRL + PKCS#11
- **xmldsigjs** / **pkijs** / **asn1js** — XMLDSig + X.509 in the browser
- **ajv** — JSON Schema validation (draft-07)
- **Playwright** — E2E; **RSpec** — Ruby unit; **node:test** — TS unit

## Roadmap

`TODO.roadmap/` contains 80 prioritized specs (P0–P3) with status
(DONE / PARTIAL / SPEC / BLOCKED). `TODO.roadmap/README.md` is the index —
update it whenever a TODO changes status or a new one is added. Each spec is
self-contained: problem → design → acceptance criteria → implementation plan →
tests → see-also.

TODOs 67-80 specifically adapt new confium features (Mode 2 adapters,
BLS cross-recognition, async re-sharing, FHE analytics, attribute
predicates, QUIC/WS transports, plugin marketplace, PQC composite
signatures, continuous security). TODOs 67 (drop-in adapters) and 69
(async re-sharing) are P0 — the first opens enterprise adoption, the
second makes director rotation operationally real.

Older scoped TODO dirs (`TODO.cnml/`, `TODO.cnml-pki/`, `TODO.fixup/`) exist
for historical context — prefer `TODO.roadmap/` for new work.

## Generated / runtime paths (not source)

These are gitignored — do not commit, do not rely on for source:
- `oiml-pki-server/output/` and root `output/` — CA-generated artifacts
- `apps/cnml-web/dist/` — production build
- `~/.oiml-pki/` — runtime keystore dir (auto-created on first access)
- `packages/cnml-schemas/src/index.ts` and `packages/cnml-types/` — generated by `pnpm gen`
