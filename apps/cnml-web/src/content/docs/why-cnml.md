---
title: Why CNML
description: The case for adopting CNML as the digital certificate infrastructure for OIML-CS type approvals, written for Issuing Authorities evaluating the format.
---

# Why CNML

CNML replaces the current PDF-based OIML-CS certificate workflow with a cryptographically signed, machine-verifiable, FAIR-aligned XML format. The legal authority of the underlying certificate is unchanged. The security, longevity, and operability of the certificate improve substantially.

| Property | PDF certificate | CNML certificate |
|---|---|---|
| Carrier | PDF with an ink signature | XML signed with XMLDSig |
| Delivery channel | Email or file transfer | Direct download with CDN-published trust anchors |
| Verification | Manual visual comparison | Drop-file verification with multiple automated checks |
| Forgery resistance | Reproducible with consumer image software | Requires a 128-bit cryptographic break |
| Revocation | No propagation mechanism | CRL distribution through a CDN |
| Timestamp evidence | None | Bitcoin-anchored timestamps through OpenTimestamps |
| Language support | Single language per file | `xml:lang` per element with internationalization built in |
| Programmatic access | None | Open-source TypeScript and Ruby libraries |

## Why this can be trusted

### Air-gapped by design

The root CA private key never resides on a network-connected machine. BIML operators run a local Ruby web application on an offline laptop. Certificate signing requests arrive and signed certificates depart through USB media. There is no network attack surface against the root. Compromise of the CA operator's machine cannot exfiltrate the key because the key is held in a YubiKey or HSM, or alternatively is wrapped at rest under AES-256-GCM with a passphrase that the malware does not possess.

### Hardware-backed keys

The root and intermediate CA private keys are stored in PKCS#11-compatible hardware, including the YubiKey 5 series, Nitrokey devices, smartcard HSMs, and enterprise HSMs such as Thales Luna and Utimaco SecurityServer. The private key is generated on the device and is non-extractable. A fully compromised host cannot steal the key material. Each signing operation requires physical possession of the device, the user PIN entered at signing time and never persisted, and on supported devices a physical touch confirmation. This is the same security model used by government PIV smartcards, FIDO2 security keys, and enterprise code-signing HSMs.

### Cryptographic scope governance

BIML does not extend generic trust to Issuing Authorities. Each IA is cryptographically scoped to specific OIML Recommendations. The scope is encoded as a non-critical X.509 v3 extension on the IA intermediate certificate.

```
OID 1.3.6.1.4.1.<OIML_PEN>.1.1
Value: ASN.1 SEQUENCE OF UTF8String ["R60", "R76", "R117"]
```

A verifier reading a CNML checks two things. The verifier first validates the signature chain for cryptographic validity, then checks that the issuing IA holds scope authority for the Recommendation named in the certificate. An IA scoped to R60 and R76 cannot produce a valid R117 certificate, because the verifier rejects the scope mismatch. BIML governance is therefore enforced by mathematics rather than by policy alone.

### Post-quantum readiness

ECDSA P-256, today's default algorithm, is vulnerable to Shor's algorithm once a cryptographically relevant quantum computer is built. NIST has standardized ML-DSA-65 as FIPS 204 for post-quantum digital signatures. The CNML roadmap commits to hybrid Ed25519 plus ML-DSA-65 signatures. Every CNML will carry two `ds:Signature` elements covering the same content, and verifiers will check both. Documents signed today remain verifiable through the quantum transition because the classical signature continues to protect them until a classical break becomes feasible. RSA is not used. RSA is slower than ECDSA, has larger keys for equivalent security, and offers no advantage in the greenfield CNML context.

### OpenTimestamps anchoring

Every signed CNML can optionally be timestamped against the Bitcoin blockchain through OpenTimestamps. A small proof is embedded in the XML and establishes that the exact signed content existed before a specific block height. If an IA key is compromised at some future date, an attacker cannot back-date a forged CNML. The hash continuity of the Bitcoin chain is independent of the IA key lifecycle. OpenTimestamps is a free public service, and verification works offline once the proof is embedded.

### Long-term archival

A CNML signed in 2026 may need to remain verifiable for the lifetime of the instrument it covers, which can extend to fifty years or more. Over that period, algorithms weaken, X.509 may be superseded, and the original trust anchors will long since have expired. CNML supports multiple `ds:Signature` elements per document, one per algorithm era. Migration to a new algorithm is a re-signing operation that preserves the original signature as historical evidence.

### Open source, fully auditable

Every line of code is published. There is no proprietary cryptography and no opaque component. Independent security researchers can audit the signature pipeline in `packages/cnml-crypto/src/`, the X.509 certificate factory in `oiml-pki-server/lib/oiml_pki/cert_factory.rb`, the keystore encryption in `oiml-pki-server/lib/oiml_pki/ca_store.rb`, the audit log hash chain in `oiml-pki-server/lib/oiml_pki/audit_log.rb`, and the verifier in `apps/cnml-web/src/islands/VerifyDrop.vue`. Pull requests are welcome, and security issues receive priority review.

### Tamper-evident audit log

Every CA operation, including root creation, CSR signing, CRL generation, and artifact publication, appends an entry to an append-only JSONL log. Each entry includes the SHA-256 hash of the previous entry, forming a hash chain. The log is tamper-evident rather than tamper-proof, because an attacker with filesystem access could in principle rewrite the log and recompute the chain. High-assurance deployments mirror the log to a remote append-only service or anchor it periodically to a public blockchain. The `/audit` route in the CA server visualizes the log and verifies chain integrity in real time.

## Technology

| Area | Implementation |
|---|---|
| Signature format | W3C XMLDSig 1.1 with Exclusive C14N |
| Classical algorithm | ECDSA P-256 with SHA-256, with Ed25519 planned |
| Post-quantum algorithm | ML-DSA-65 standardized as NIST FIPS 204, on the hybrid roadmap |
| CA key storage | PKCS#11 compatible hardware including YubiKey, Nitrokey, smartcard HSM, and enterprise HSM |
| Signer key storage | Browser IndexedDB encrypted with AES-GCM under a PBKDF2-derived key |
| Key derivation | PBKDF2-HMAC-SHA256 with 100,000 iterations |
| Audit hash chain | SHA-256 over canonical JSON |
| Blockchain anchor | OpenTimestamps over Bitcoin |
| Distribution | Static GitHub Pages CDN with no dynamic request surface |
| Web framework | Astro 7 with Vue 3.5 islands and Tailwind 4 |
| CA server | Ruby 3.4 with Sinatra 4 and OpenSSL 3.x |
| Test coverage | Playwright end-to-end, RSpec unit, and node:test integration suites |
| Accessibility | WCAG 2.2 AA target, in progress |
| Internationalization | English first, with French and additional languages planned |

## Robustness guarantees

The architecture defends against several classes of compromise. Compromise of an IA CA machine does not expose private keys, because the keys are in hardware or encrypted at rest, every operation is recorded in the hash-chained audit log, and CRLs can revoke the IA signer keys within hours. Compromise of a signer's browser exposes only that single signer's keys, which are revocable through CRL publication, and cannot escalate to IA keys held on a different machine. Algorithm breakage is mitigated through classical-plus-post-quantum hybrid signatures and through multi-signature documents that support algorithm migration. Network attacks are bounded because the CA never touches the network, the verifier works offline against a cached CDN bundle, and the static CDN exposes no API. Malicious insiders are bounded because every CA operation is audit-logged, the scope extension prevents out-of-scope signing, and the entire codebase is open to inspection.

## Sovereignty through threshold cryptography

CNML is the OIML SMART program's certificate format built on the Confium threshold-cryptography substrate. No single party can produce a CA-level signature. Every CA-level signature is produced by a configured quorum of independent parties using their own hardware, with the participants geographically distributed. This eliminates compelled-revocation risk, single-person compromise risk, and insider-trust requirements.

The five-tier hierarchy organizes signing authority from the international root through national Issuing Authorities to the per-instrument end entity.

| Tier | Held by | Threshold | Purpose |
|---|---|---|---|
| BIML Root | International directors | Configurable, for example 5-of-7 | Signs IA intermediate certificates at an annual in-person ceremony |
| IA Intermediate | IA officers per nation | Configurable, for example 2-of-3 | Signs test-lab and manufacturer model certificates, asynchronous |
| Test Lab | A single laboratory operator | 1-of-1 | Signs measurement reports |
| Manufacturer Model | A single manufacturer | 1-of-1 | Issued by the IA under scoped delegation, signs instance certificates |
| Manufacturer Instance | A single manufacturer | 1-of-1 | Per-instrument end-entity certificate |

A court order compelling one IA officer cannot complete a threshold signature. Theft of one director's hardware key cannot produce a valid signature on its own. A manufacturer whose model certificate is revoked loses all instance-signing authority immediately.

### Asynchronous director signing

Directors are distributed across time zones. The coordinator service allows a director to participate when convenient. A director reviews the pending certificate on a laptop, taps their hardware key, uploads a partial signature, and disconnects. The coordinator aggregates the partial signatures once the threshold is reached and produces the final signature. Active director time per ceremony is on the order of minutes, while the total wall-clock duration depends on director availability. No travel is required and no scheduled meetings are needed. This operational model is what makes an international threshold quorum feasible in practice.

### Public accountability through the transparency log

Every issued certificate, every threshold decryption event, and every share re-sharing ceremony is appended to a public Merkle transparency log. Tree roots are anchored to the Bitcoin blockchain through OpenTimestamps. Gossip protocols ensure that a log operator cannot present different views to different verifiers, defending against the equivocation attack described in RFC 6962. A verifier that demands an inclusion proof rejects any certificate that did not appear in the log. Covert issuance, which has been the historical failure mode of single-key PKI, is structurally impossible in this model.

### Threshold encryption for trade-secret protection

Test reports contain manufacturer intellectual property, including calibration curves and failure analysis. CNML allows a test laboratory to encrypt the confidential section of a report to the IA quorum's threshold public key. Decryption requires a threshold ceremony, and every decryption event is recorded to the transparency log with a stated reason. Compromise of IA storage cannot reveal plaintexts. A subpoena compelling one IA officer cannot decrypt a report alone. The decryption audit trail deters casual abuse.

### Threshold escrow and recovery

If a manufacturer loses a signing key, recovery is a threshold ceremony at the issuing IA. The recovery does not require reissuance of every dependent certificate. If a director departs the quorum, the remaining directors re-share to a new committee that excludes the departing director. The aggregate public key is preserved across the re-sharing, so all previously issued certificates remain valid without modification.

## Path forward

CNML adoption proceeds through three phases. In the pilot phase, BIML issues a test root and a small number of IA intermediates on hardware keys, and sample CNMLs are signed for evaluation with no production use. In the parallel-run phase, real CNMLs are issued alongside the existing PDF certificates while Issuing Authorities and verifiers become familiar with the format. In the production phase, CNML becomes the official format, and the PDF certificate is progressively retired.

## See also

- [CNML vs typical PKI](/docs/cnml-vs-typical-pki) covers the architectural differences between CNML and conventional PKI
- [Cryptography](/docs/cryptography) describes the algorithms and key-management model
- [Trust model](/docs/trust-model) explains who is trusted to issue what
- [BIML scope governance](/docs/biml-governance) describes per-Recommendation authorization
- [Hardware keys](/docs/hardware-keys) is the operational guide for YubiKey and HSM deployment
