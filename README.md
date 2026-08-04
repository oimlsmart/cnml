# CNML — OIML Certificat Numérique de Métrologie Légale

CNML is the digital certificate format developed under the OIML SMART program to succeed the PDF-based OIML-CS (Certificate System for Measuring Instruments) certificate of conformity. The format was produced by analyzing all existing published OIML-CS Type Approval certificates and digitizing them in a manner compatible with OIML SMART and the relevant OIML R-Recommendations.

CNML is a cryptographically signed, machine-verifiable, FAIR-aligned XML format. It is complementary to the PTB Digital Calibration Certificate (DCC): CNML operates at the type-approval tier under OIML-CS, while DCC operates at the calibration tier under ISO/IEC 17025. A measuring instrument in legal use typically has both a CNML type approval covering its model and periodic DCC calibrations covering each individual recalibration.

The threshold-cryptography substrate is provided by [Confium](https://www.confium.org). The implementation is developed by [Ribose](https://www.ribose.com).

## Quick start

```bash
pnpm install
pnpm dev          # Astro dev server on http://localhost:4321
pnpm test         # TypeScript unit tests via node:test
pnpm test:e2e     # Playwright browser tests
pnpm build        # Static production build
cd oiml-pki-server && bundle install && ruby app.rb   # Air-gapped Ruby CA server
cd oiml-pki-server && bundle exec rspec               # Ruby RSpec suite
```

## Components

| Component | Description |
|-----------|-------------|
| **CNML web app** (`apps/cnml-web/`) | Astro 7 with Vue 3 islands. The web application provides browser-based certificate creation, signing, and verification. |
| **CNML crypto** (`packages/cnml-crypto/`) | ECDSA P-256 signing and verification, XMLDSig with Exclusive C14N, parsers for scope, CRL, and OpenTimestamps, and the data-driven check pipeline. |
| **CNML XML** (`packages/cnml-xml/`) | The XML serializer for CNML documents and the JSON Schema validator based on ajv. |
| **CNML schemas** (`packages/cnml-schemas/`) | The 22 per-Recommendation JSON Schemas, auto-discovered from `schemas/R*.yaml`. The schema is the specification, and the rendering layer contains no per-Recommendation code. |
| **CNML types** (`packages/cnml-types/`) | TypeScript types generated from the YAML schemas. |
| **D-CoC** (`packages/cnml-dcoc/`) | NoBoMet V1.2 RDF/XML and JSON-LD output for FAIR-aligned certificate exchange. |
| **PTB DCC compat** (`packages/ptb-dcc-compat/`) | A round-trip importer that consumes DCC files and produces CNML test-report payloads. |
| **CA server** (`oiml-pki-server/`) | The Ruby air-gapped PKI server, providing root CA, CSR signing, CRL issuance, scope governance, hash-chained audit log, and hardware key support through PKCS#11. |

## Architecture

```
OIML Root CA (BIML, hardware-backed, air-gapped)
    │ signs intermediate with X.509 v3 scope extension
    ▼
Issuing Authority CA (per-IA hardware key)
    │ signs end-entity cert
    ▼
Per-cert Signer (browser IndexedDB)
    │ signs CNML XML
    ▼
Signed CNML (XMLDSig with optional OpenTimestamps proof)
    │ verified by anyone
    ▼
Verifier (browser, multi-check pipeline)
```

### Data-driven design

Three architectural patterns dominate the codebase. First, the schema is the specification: all 22 Recommendation forms are rendered from JSON Schema YAML, and adding a new Recommendation requires only a new `R<NN>.yaml` file plus a `pnpm gen:schemas` invocation. Second, the verification pipeline is open/closed: each check is a module exporting a `Check` object, the registry iterates the `CHECKS` array generically, and adding a check requires one new file plus one line in the array. Third, the key-storage backend follows the same pattern: software, PKCS#11, and threshold backends all implement `Base`, and adding a backend requires one new file plus one autoload entry.

## Security features

| Feature | Status |
|---------|--------|
| ECDSA P-256 signatures with XMLDSig and Exclusive C14N | shipped |
| Air-gapped CA built on Ruby Sinatra with USB-only data transfer | shipped |
| AES-256-GCM keystore derived from PBKDF2 with 100,000 iterations | shipped |
| BIML scope governance through an X.509 v3 extension per Recommendation | shipped |
| PKCS#11 hardware key support for YubiKey, HSM, and TPM | shipped |
| Tamper-evident hash-chained audit log in JSONL | shipped |
| Shamir's Secret Sharing for 2-of-2 root key splitting | shipped |
| OpenTimestamps proof of existence anchored to Bitcoin | shipped |
| CRL revocation status check | parser shipped, distribution pending |
| Ed25519 with ML-DSA-65 post-quantum composite signatures | specified |
| WCAG 2.2 AA accessibility | specified |

## Tech stack

The web application is built on Astro 7 and Vite 8 as a static site with no server-side rendering. Interactive components are Vue 3.5 islands mounted inside Astro pages, with Tailwind 4 supplying the design system through the official Vite plugin. The CA server is Ruby 3.4 with Sinatra 4 and uses OpenSSL 3.x for X.509 certificate issuance, CRL production, and PKCS#11 hardware access. Browser-side XMLDSig processing uses xmldsigjs, pkijs, and asn1js. JSON Schema validation uses ajv at draft-07. End-to-end browser testing uses Playwright, Ruby unit testing uses RSpec, and TypeScript unit testing uses the built-in node:test runner.

## Source of truth

The canonical OIML-CS certificate schemas and the corpus of real certificate instances live in the OIML-CS certificates repository. This repository holds the synced schema copies, the TypeScript web application, and the Ruby PKI server. When schema fields or certificate shapes disagree, the OIML-CS certificates repository is authoritative.

## License

To be determined in coordination with OIML.
