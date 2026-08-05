# AGENTS.md

This file provides guidance to AI agents of any framework (Claude Code, the OpenAI Agents SDK, Aider, Continue, Cursor, and others) when working in this repository. It mirrors `CLAUDE.md` for frameworks that consume the cross-tool `AGENTS.md` convention.

## What this is

CNML (Certificat Numérique de Métrologie Légale) is a cryptographically-signed digital certificate format for OIML type approvals, developed under the OIML SMART program. It provides machine-verifiable certification of measuring instruments subject to legal metrology, built on recognized international standards including X.509 v3, W3C XMLDSig, and NIST FIPS 204. CNML is complementary to the PTB Digital Calibration Certificate (DCC), which operates at the calibration tier under ISO/IEC 17025. See `README.md` and `TESTING.md` for the project overview and full manual test workflow.

## Writing style

All public-facing content in this repository follows the [OIML SMART style guide](https://github.com/oimlsmart/styleguide/blob/main/WRITING_STYLE.md). Read that guide before drafting or editing README sections, documentation pages, FAQ entries, or any prose published under the OIML SMART program. The guide is binding on register, prohibited patterns, content rules, and vocabulary. Perform a self-review pass against the guide before reporting any writing task as complete.

## Commands

The workspace is pnpm with a Ruby gem. Run from the repository root unless otherwise noted.

```bash
pnpm install                              # install all dependencies
pnpm dev                                  # Astro dev server on http://localhost:4321
pnpm build                                # production build with audience-build split
pnpm gen                                  # regenerate schemas index and TS types from YAML
pnpm test                                 # TS unit tests via cnml-test-vectors
pnpm test:e2e                             # Playwright, auto-starts dev on port 4455
pnpm vectors:gen                          # regenerate the pre-signed test vectors
pnpm vectors:verify                       # verify all test vectors round-trip
pnpm smoke                                # minimal sign-and-verify via Node

# Ruby CA server, separate Gemfile
cd oiml-pki-server && bundle install
cd oiml-pki-server && ruby app.rb         # Sinatra on http://localhost:4455
cd oiml-pki-server && bundle exec rspec   # full Ruby suite
```

Playwright runs against port 4455 rather than 4321 to avoid dev-lock conflicts. See `playwright.config.cjs`. The webServer block auto-starts Astro with `ASTRO_DEV_BACKGROUND=1` and `--ignore-lock`. Bundle analysis runs with `ANALYZE=1 pnpm build` and writes `dist/stats.html`.

## Architecture

```
OIML Root CA (BIML, hardware-backed, air-gapped)
    │ signs intermediate with X.509 v3 scope extension
    ▼
Issuing Authority CA (per-IA hardware key)
    │ signs end-entity cert
    ▼
Per-cert Signer (browser IndexedDB, AES-GCM with PBKDF2)
    │ signs CNML XML (XMLDSig enveloped with Exclusive C14N)
    ▼
Signed CNML (XMLDSig with optional OpenTimestamps proof)
    │ verified by any party
    ▼
Verifier (browser, multi-check pipeline)
```

The five-tier deployment uses threshold cryptography at the BIML Root and IA tiers. Lower tiers stay single-party. See the architecture and confium-integration documentation under `apps/cnml-web/src/content/docs/architecture/` for details.

### Source of truth

The canonical OIML-CS certificate schemas and the corpus of real certificate instances live in the OIML-CS certificates repository. The threshold-cryptography core lives in the confium repository. This repository holds the synced schema copies, the TypeScript web application, and the Ruby PKI server. When schema fields or certificate shapes disagree, the OIML-CS certificates repository is authoritative.

### Data-driven schemas

All OIML Recommendation forms are rendered from JSON Schema YAML. There is no per-Recommendation code. To add a new Recommendation, drop a `R<NN>.yaml` file with `x-oiml-*` metadata into `packages/cnml-schemas/src/schemas/` and run `pnpm gen`. The new Recommendation then appears in the UI, the schemas page, and the forms automatically. Shared schema fragments live in `packages/cnml-schemas/src/_core.yaml`, `_units.yaml`, `_units_local.yaml`, and `modules/`.

### Check pipeline

The verify page runs a data-driven pipeline in `packages/cnml-crypto/src/checks/`. Each check is a module exporting a `Check` object. The `VerifyDrop.vue` component iterates the `CHECKS` array and renders results generically. Adding a check requires one new file and one new line in the `CHECKS` array. Order is significant because earlier checks short-circuit later ones.

Current pipeline order: XML well-formed, schema valid, signature, scope, CRL, timestamp, transparency.

### Ruby autoload

`oiml-pki-server/lib/oiml_pki.rb` is the namespace entry point. Every public module is wired through `autoload`. Adding a module requires one new file under `lib/oiml_pki/` and one new `autoload` line in `oiml_pki.rb`. The codebase does not use `require_relative` or string-form `require` for files inside the library. External gems are required normally.

### KeyProvider dispatch

`OimlPki::KeyProvider.for(entry)` selects a backend from the entry shape. An entry with `confium` resolves to the `Confium` backend, an entry with `pkcs11` resolves to the `Pkcs11` backend, and an entry with `privateKey` resolves to the `Software` backend. Adding a backend requires one new file under `key_provider/`, one autoload entry, and one dispatch rule in `for`. Backends implement `Base`, which defines `sign`, `sign_cert`, `sign_crl`, `public_key`, `extractable?`, and `to_h`.

## Roadmap

Roadmap and planning documents are maintained locally under `TODO.*/` directories and are gitignored. They are not part of the published repository. Each planning document is self-contained and follows the form: problem statement, design, acceptance criteria, implementation plan, tests, and cross-references.

## Generated and runtime paths

The following paths are gitignored and are not source. Do not commit them, and do not rely on them as source. `oiml-pki-server/output/` and the root `output/` hold CA-generated artifacts. `apps/cnml-web/dist/` holds the production build. `~/.oiml-pki/` is the runtime keystore directory created on first access. `packages/cnml-schemas/src/index.ts` and `packages/cnml-types/` are generated by `pnpm gen`.
