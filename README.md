# CNML. OIML Certificat Numérique de Métrologie Légale.

CNML is a cryptographically-signed digital certificate format for OIML type approvals, developed under the OIML SMART programme. It provides machine-verifiable certification of measuring instruments subject to legal metrology, built on recognized international standards including X.509 v3, W3C XMLDSig, and NIST FIPS 204.

CNML is complementary to the PTB Digital Calibration Certificate (DCC). CNML operates at the type-approval tier under OIML-CS. DCC operates at the calibration tier under ISO/IEC 17025. A measuring instrument in legal use typically holds both a CNML type approval covering the model and periodic DCC calibrations covering each individual recalibration.

The threshold-cryptography substrate is provided by Confium. The implementation is developed by Ribose. This repository is a proposal for OIML from the OIML SMART programme. Every specification, diagram, and operational description is a draft and may change without notice as the proposal evolves.

## Architecture

### Five-tier certificate hierarchy

```
Tier 1  BIML Root (international directors, threshold-signed)
        │ signs intermediate with X.509 v3 scope extension
        ▼
Tier 2  Issuing Authority CA (per IA, threshold-signed)
        │ signs end-entity cert
        ▼
Tier 3  Test Lab cert (1-of-1)
        │ signs test reports
        ▼
Tier 4  Manufacturer Model cert (1-of-1, scoped delegation)
        │ signs instance certs
        ▼
Tier 5  Manufacturer Instance cert (per-instrument end entity)
```

The root and IA tiers use threshold cryptography so that no single party can produce a signature. The lower tiers use single-party keys held in PKCS#11-compatible hardware.

### System components

| Component | Description |
|-----------|-------------|
| `apps/cnml-web/` | Astro 7 web application with Vue 3 islands. Browser-based certificate creation, signing, and verification. |
| `packages/cnml-crypto/` | Cryptographic primitives: ECDSA-P256, Ed25519, ML-DSA-65 composite signatures, XMLDSig, scope and CRL parsers, OpenTimestamps, the verify pipeline. |
| `packages/cnml-xml/` | CNML XML serializer and the JSON Schema validator based on ajv. |
| `packages/cnml-schemas/` | The 22 per-Recommendation JSON Schemas, auto-discovered from YAML. The schema is the specification. |
| `packages/cnml-types/` | TypeScript types generated from the YAML schemas. |
| `packages/cnml-dcoc/` | NoBoMet V1.2 D-CoC output in RDF/XML and JSON-LD for FAIR-aligned interchange. |
| `packages/cnml-units/` | UnitsDB-backed unit resolution tied to BIPM Digital SI. |
| `packages/ptb-dcc-compat/` | Round-trip importer that consumes DCC files and produces CNML test-report payloads. |
| `oiml-pki-server/` | Ruby air-gapped PKI server providing root CA, CSR signing, CRL issuance, scope governance, audit log, and PKCS#11 hardware key support. |

### Data-driven design

Three architectural patterns dominate the codebase.

The schema is the specification. All Recommendation forms are rendered from JSON Schema YAML. Adding a Recommendation requires only a new `R<NN>.yaml` file with `x-oiml-*` metadata plus a `pnpm gen` invocation. There is no per-Recommendation code.

The verification pipeline is open and closed. Each check is a module exporting a `Check` object. The registry iterates a `CHECKS` array generically. Adding a check requires one new file and one new line in the array. Earlier checks short-circuit later ones.

The key-storage backend is open and closed. Software keys, PKCS#11 hardware keys, and the threshold-cryptography backend all implement the same `Base` interface. Adding a backend requires one new file, one autoload entry, and one dispatch rule.

### npm packages

The TypeScript packages are published under the `@oiml` scope on npm. External integrators can install them without forking the repository:

```bash
npm install @oiml/cnml-crypto     # the verification pipeline
npm install @oiml/cnml-schemas    # per-Recommendation JSON Schemas
npm install @oiml/cnml-xml        # CNML XML parser
```

The full package list:

| Package | Purpose |
|---|---|
| `@oiml/cnml-crypto` | Check pipeline, composite signatures, SMI twin client |
| `@oiml/cnml-schemas` | Per-Recommendation JSON Schemas |
| `@oiml/cnml-types` | Generated TypeScript types |
| `@oiml/cnml-xml` | XML parser and canonicalization |
| `@oiml/cnml-units` | Unit resolver (UnitsDB to BIPM Digital SI) |
| `@oiml/cnml-dcoc` | D-CoC output (RDF/XML and JSON-LD) |
| `@oiml/cnml-xsd` | XML Schema Definition for CNML |
| `@oiml/ptb-dcc-compat` | PTB DCC compatibility layer |

## Roles

| Role | What they do | Where in this repository |
|------|--------------|--------------------------|
| BIML director | Holds one share of the BIML Root threshold quorum. Participates in certificate signing ceremonies through the director app. | CA server (`oiml-pki-server/`) issues the director identity certificate. The browser provides the director signing surface. |
| BIML staff (operations) | Operate the air-gapped CA, run the coordinator service, publish trust anchors and CRLs to the CDN, maintain the transparency log. | CA server, coordinator client, publisher. |
| CIML member | Sets policy. Approves director credentials and IA scope allocations. Reviews audit reports. | Out of band; the manifest encodes the resulting policy. |
| Issuing Authority officer | Holds one share of the IA threshold quorum. Approves CSR signing requests within the IA's authorized scope. | CA server signs CSRs and produces CNML end-entity certificates. |
| Test laboratory | Issues signed test reports against the IA's threshold-encryption public key. | The web app's signing flow; the DCC compatibility importer. |
| Manufacturer | Issues per-instance certificates under a scoped Model Certificate delegation. | The web app's signing flow. |
| Verifier (market surveillance, customer, regulator) | Drops a `.cnml.xml` file into the verifier to confirm authenticity, scope, revocation status, timestamp, and transparency-log inclusion. | The web app's verify page runs the multi-check pipeline entirely in the browser. |
| Developer | Builds and extends the system. Adds Recommendations, checks, key backends, and verification features. | All packages. The schema-driven design keeps extension additive. |

## How it works

### Certificate creation flow

A signer opens the web app's Create page. The data-driven form renders fields from the per-Recommendation JSON Schema. The signer fills the form, selects a key from IndexedDB, enters the passphrase, and signs. The web app canonicalizes the XML using Exclusive C14N, signs with the selected algorithm (ECDSA-P256 by default, with composite Ed25519 plus ML-DSA-65 available for forward-secure issuance), embeds the X.509 certificate chain in `ds:KeyInfo`, and offers the resulting `.cnml.xml` for download.

### Verification flow

A verifier opens the web app's Verify page and drops a `.cnml.xml` file. The verify pipeline runs a sequence of checks in order, short-circuiting on the first hard failure. The current pipeline runs XML well-formed, schema valid, signature, scope, CRL, timestamp, transparency, and evaluation-report binding. Each check populates a context object that subsequent checks can read. The final result is a list of check outcomes plus a trust grade derived from which checks passed.

### Threshold signing flow

The BIML Root and IA Intermediate tiers use threshold signatures produced through an asynchronous coordinator-mediated ceremony. The coordinator buffers protocol messages so that directors in different time zones can participate when convenient. The coordinator is honest-but-curious: it observes encrypted protocol messages but cannot reconstruct the signing key. Once the quorum threshold is reached, the coordinator aggregates the partial signatures and produces the final signature, which is appended to the public transparency log. The aggregate public key is preserved across director rotation through re-sharing, so all previously issued certificates remain valid without modification.

### Revocation flow

The IA threshold quorum signs a CRL entry naming the revoked certificate by serial number. The CRL is published to the CDN. Verifiers fetch the CRL on the verify path and reject any certificate listed. The CRL itself is signed by the IA quorum, so a single IA officer cannot revoke a certificate unilaterally.

### Transparency flow

Every issued certificate is appended to a public Merkle transparency log. The log is mirrored across multiple independent operators. Tree roots are anchored to Bitcoin through OpenTimestamps. Gossip protocols ensure a log operator cannot present different views to different verifiers. A verifier that demands an inclusion proof rejects any certificate that did not appear in the log.

## System design

### Air-gapped root

The BIML Root signing key never resides on a network-connected machine. CSRs arrive and signed certificates depart through USB media. There is no network attack surface against the root.

### Cryptographic scope governance

Each Issuing Authority is bound to a specific subset of OIML Recommendations through an X.509 v3 extension named `oimlAuthorizedRecommendations`. The extension is enforced at four layers: BIML writes scope to the IA certificate, the IA refuses out-of-scope end-entity issuance, the signer browser checks scope before signing, and the verifier rejects scope mismatches.

### Threshold cryptography

The root and IA tiers use threshold signing (FROST-style protocols) and threshold encryption (ML-KEM-768 and ElGamal-P256). The cryptographic primitives align with the research surveyed in NIST IR 8214 and the NIST Multi-Party Threshold Schemes project. CNML applies these techniques in the legal-metrology context with institutional governance overlays.

### Post-quantum readiness

ECDSA-P256 is the default classical algorithm. CNML ships composite signatures combining Ed25519 (classical) with ML-DSA-65 (post-quantum, NIST FIPS 204) for forward-secure issuance. A composite signature is valid only when both components verify, so an attacker must break both algorithms to forge a signature. The composite encoding is two base64 values joined by a period, embedded in the certificate's `ds:SignatureValue`. The verifier decodes and verifies each component independently.

### Hardware-backed keys

All three signing tiers (BIML Root, IA intermediate, signer) accept any PKCS#11-compatible hardware device. The technical interface is uniform: the device exposes PKCS#11, the CA server's KeyProvider dispatch calls through PKCS#11, and the private key is generated on the device and never leaves it. The choice of device at each tier is a deployment policy driven by capacity and certification requirements, not a software constraint.

The BIML Root tier holds a small number of high-value signing keys and typically uses devices with the highest certification level available in the deployment's regulatory regime. The IA intermediate tier holds one device per officer, with each device carrying that officer's threshold share. The signer tier holds one device per signer, with each device carrying that signer's end-entity key. The only meaningful differentiator between devices is capacity: how many private keys the device can hold simultaneously.

A separate reference list of compatible PKCS#11 devices is maintained at [compatible hardware devices](/docs/architecture/hardware-tiers#compatible-devices), covering vendor, model, certification regime, capacity, and the PKCS#11 driver name. The list is factual. Inclusion does not constitute an endorsement.

Where the deployment's regulatory framework requires FIPS-validated cryptographic modules, devices validated under FIPS 140-2 (and, as the NIST Cryptographic Module Validation Program modernizes, FIPS 140-3) are suitable. Where FIPS validation is not required, any PKCS#11-compatible device is suitable. For development and low-assurance deployments, browser IndexedDB with AES-GCM encryption under a PBKDF2-derived key provides a software-only signer path with no hardware requirement.

### Long-term archival

CNML supports multiple `ds:Signature` elements per document, one per algorithm era. Migration to a new algorithm is a re-signing operation that preserves the original signature as historical evidence. The archival renewal path follows RFC 4998 Evidence Record Syntax.

### Transparency log

The transparency log is a Merkle tree. Every append produces a new tree root. Tree roots are anchored to Bitcoin through OpenTimestamps, providing an independent timestamp proof that does not depend on the IA key lifecycle. Mirrors run by independent operators gossip to detect equivocation.

### Tamper-evident audit log

Every CA operation appends an entry to an append-only JSONL log. Each entry includes the SHA-256 hash of the previous entry, forming a hash chain. The log is tamper-evident rather than tamper-proof. High-assurance deployments mirror the log to a remote append-only service or anchor it periodically to a public blockchain.

## Security features

| Feature | Status |
|---------|--------|
| ECDSA P-256 signatures with XMLDSig and Exclusive C14N | shipped |
| Composite Ed25519 with ML-DSA-65 post-quantum signatures | shipped |
| Air-gapped CA built on Ruby Sinatra with USB-only data transfer | shipped |
| AES-256-GCM keystore derived from PBKDF2 with 100,000 iterations | shipped |
| BIML scope governance through an X.509 v3 extension per Recommendation | shipped |
| PKCS#11 hardware key support for YubiKey, HSM, and TPM | shipped |
| Tamper-evident hash-chained audit log in JSONL | shipped |
| Shamir's Secret Sharing for 2-of-2 root key splitting | shipped |
| OpenTimestamps proof of existence anchored to Bitcoin | shipped |
| CRL revocation status check | parser shipped, distribution pending |
| WCAG 2.2 AA accessibility | shipped |
| Coordinator-mediated asynchronous threshold signing | shipped |
| Transparency-log inclusion proof with gossip-based mirror agreement | shipped |
| Threshold encryption of confidential test-report sections | shipped |

## Validation

### Unit tests

The TypeScript unit tests live in `packages/cnml-crypto/src/` and `packages/cnml-test-vectors/src/`. They run through Node's built-in test runner with TypeScript stripping enabled. The composite signature tests cover round-trip sign and verify, single-component tampering, public-key mismatch, and the base64 encoding round-trip.

```bash
pnpm test                                  # cnml-test-vectors integration suite
node --test --experimental-strip-types \
  packages/cnml-crypto/src/keys/composite.test.ts   # composite signatures
```

### Ruby RSpec

The Ruby CA server has its own RSpec suite covering CaStore encryption, CertFactory (root CA, CSR signing, scope, CRL), KeyProvider backends (Software, Pkcs11, Confium), AuditLog hash chaining, SecretSharing, DeploymentManifest, ConfiumIntegration, TrustAnchor, CoordinatorClient, TransparencyPublisher, CeremonyTranscript, and UpdateIntegrity.

```bash
cd oiml-pki-server && bundle exec rspec
```

### End-to-end tests

Playwright runs end-to-end against the dev server on port 4455. The suite covers page loads across all 22 Recommendation schemas, form fill and reset and save, key generation and download and delete, sign-and-verify round-trips, and verifier dropzone behavior including malformed-input handling.

```bash
pnpm test:e2e
```

### Test vectors

Twenty-two pre-signed CNML files cover every Recommendation that ships with a schema. The vectors are regenerated on demand and verified end-to-end through the verify pipeline.

```bash
pnpm vectors:gen       # regenerate the vectors
pnpm vectors:verify    # verify every vector round-trips
```

### Smoke test

A minimal sign-and-verify round-trip exercises the real `xmldsigjs` signing path against the verify pipeline.

```bash
pnpm smoke
```

### Verify-pipeline audit

The `packages/cnml-test-vectors/src/audit.test.ts` test verifies that every internal `/docs/...` link in the built site resolves, that no `<main>` is empty, that no JavaScript error leaked into the static HTML, that all referenced SVGs exist, and that all referenced schema YAMLs exist. It runs as part of `pnpm test`.

### Accessibility audit

WCAG 2.2 AA conformance is documented in `apps/cnml-web/src/content/docs/implementation/accessibility.md`. The conformance covers perceivable, operable, understandable, and robust success criteria applied to the interactive Vue components and the layout.

## Quick start

```bash
pnpm install
pnpm dev                                  # Astro dev server on http://localhost:4321
pnpm build                                # production build, static site
pnpm test                                 # TS unit and integration tests
pnpm test:e2e                             # Playwright browser tests
cd oiml-pki-server && bundle install
cd oiml-pki-server && ruby app.rb         # Sinatra CA server on http://localhost:4455
cd oiml-pki-server && bundle exec rspec   # Ruby RSpec suite
```

Playwright runs against port 4455 rather than 4321 to avoid dev-lock conflicts. See `playwright.config.cjs`. The webServer block auto-starts Astro with `ASTRO_DEV_BACKGROUND=1` and `--ignore-lock`. Bundle analysis runs with `ANALYZE=1 pnpm build` and writes `dist/stats.html`.

## Source of truth

The canonical OIML-CS certificate schemas and the corpus of real certificate instances live in the OIML-CS certificates repository. The threshold-cryptography core lives in the Confium repository. This repository holds the synced schema copies, the TypeScript web application, and the Ruby PKI server. When schema fields or certificate shapes disagree, the OIML-CS certificates repository is authoritative.

## Writing style

All public-facing content in this repository follows the [OIML SMART style guide](https://github.com/oimlsmart/styleguide/blob/main/WRITING_STYLE.md). Read that guide before drafting or editing README sections, documentation pages, FAQ entries, or any prose published under the OIML SMART programme.

## License

To be determined in coordination with OIML.
