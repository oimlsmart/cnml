# CNML — OIML Certificat Numérique de Métrologie Légale

A cryptographically-signed, machine-verifiable, FAIR-aligned digital
certificate format for OIML type approvals. The OIML equivalent of
PTB's DCC (Digital Calibration Certificate).

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm test         # 46 TS unit tests
cd oiml-pki-server && rspec  # 49 Ruby specs
pnpm test:e2e     # 52 Playwright browser tests
pnpm build        # 66-page static build
```

## What this is

| Component | Description |
|-----------|-------------|
| **CNML web app** (`apps/cnml-web/`) | Astro 7 + Vue 3 islands. Create, sign, verify CNML certificates entirely in the browser. |
| **CNML crypto** (`packages/cnml-crypto/`) | ECDSA P-256 signing, XMLDSig, scope/CRL/OTS parsers, 6-check verify pipeline. |
| **CNML XML** (`packages/cnml-xml/`) | CNML ↔ XML serializer, JSON Schema validator (ajv). |
| **CNML schemas** (`packages/cnml-schemas/`) | 22 per-Recommendation JSON Schemas, auto-discovered from `schemas/R*.yaml`. Data-driven: no R-specific code. |
| **CNML types** (`packages/cnml-types/`) | TypeScript types generated from YAML schemas. |
| **D-CoC** (`packages/cnml-dcoc/`) | NoBoMet V1.2 RDF/XML + JSON-LD output. |
| **PTB DCC compat** (`packages/ptb-dcc-compat/`) | DCC ↔ CNML round-trip importer. |
| **CA server** (`oiml-pki-server/`) | Ruby air-gapped PKI: root CA, CSR signing, CRL, scope governance, audit log, hardware keys (Yubikey/HSM via PKCS#11). |

## Architecture

```
OIML Root CA (BIML, hardware-backed, air-gapped)
    │ signs intermediate with scope extension
    ▼
Issuing Authority CA (per-IA Yubikey)
    │ signs end-entity cert
    ▼
Per-cert Signer (browser IndexedDB)
    │ signs CNML XML
    ▼
Signed CNML (XMLDSig + optional OpenTimestamps proof)
    │ verified by anyone
    ▼
Verifier (browser, 6 automated checks)
```

### Data-driven design

- **Schema IS the spec.** All 22 Recommendation forms are rendered from
  JSON Schema data — no bespoke per-R code. Adding a new R = drop a
  `R<NN>.yaml` with `x-oiml-*` metadata, run `pnpm gen:schemas`.
- **Check pipeline.** Verify runs 6 ordered checks (XML well-formed →
  schema valid → signature → scope → CRL → timestamp). Adding a check =
  one new file + one array line. Open/closed.
- **KeyProvider abstraction.** Software keys (OpenSSL) or hardware keys
  (PKCS#11 / Yubikey / HSM). Same `sign_cert` interface. Adding a backend
  = one new file + one autoload entry.

## Security features

| Feature | Status |
|---------|--------|
| ECDSA P-256 signatures (XMLDSig + Exclusive C14N) | ✅ |
| Air-gapped CA (Ruby Sinatra, USB-only data transfer) | ✅ |
| AES-256-GCM keystore (PBKDF2 100K iterations) | ✅ |
| BIML scope governance (X.509 v3 extension per-Recommendation) | ✅ |
| PKCS#11 hardware key support (Yubikey/HSM/TPM) | ✅ |
| Tamper-evident audit log (hash-chained JSONL) | ✅ |
| Shamir's Secret Sharing (2-of-2 root key split) | ✅ |
| OpenTimestamps (Bitcoin blockchain proof of existence) | ✅ |
| CRL revocation status check | parser ✅, CDN wiring pending |
| Ed25519 + ML-DSA-65 (post-quantum hybrid) | spec'd (TODO 08) |
| WCAG 2.2 AA accessibility | spec'd (TODO 12) |

## Roadmap

See [TODO.roadmap/](./TODO.roadmap/) for 29 prioritized work items.
9 are done, 5 partial, 12 spec'd, 2 blocked on external resources.

## Tech stack

- **Astro 7** + **Vite 8** — app framework (static build, no SSR)
- **Vue 3.5** islands — interactive components
- **Tailwind 4** — design system via `@tailwindcss/vite`
- **Ruby 3.4** + **Sinatra 4** — air-gapped CA server
- **OpenSSL 3.x** — X.509 cert + CRL + PKCS#11
- **xmldsigjs** — W3C XMLDSig signing/verification
- **pkijs** + **asn1js** — X.509 cert parsing in the browser
- **ajv** — JSON Schema validation (draft-07)
- **Playwright** — end-to-end browser testing
- **RSpec** — Ruby unit testing

## Source of truth

- **Ruby project**: `~/src/oimlsmart/oiml-cs-certificates/` — 880 real
  OIML cert instances + canonical JSON Schema YAMLs
- **This project**: synced copies + TS web app + Ruby PKI server

## License

TBD — likely same as upstream OIML data license.
