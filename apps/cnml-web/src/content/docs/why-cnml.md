# Why CNML

A pitch for Issuing Authorities evaluating CNML as their digital
certificate infrastructure.

## What you get

CNML replaces the current OIML-CS PDF certificate workflow with a
cryptographically-signed, machine-verifiable, FAIR-aligned XML format.
Same legal authority, dramatically better security and usability.

| Old (PDF)                         | New (CNML)                              |
|-----------------------------------|-----------------------------------------|
| PDF + ink signature               | XMLDSig-signed XML, browser-verifiable  |
| Email / FTP delivery              | Direct download + CDN-published trust anchors |
| Manual visual verification        | Drop-file verify, 8 automated checks    |
| Forgery possible with Photoshop   | Forgery requires 128-bit key break      |
| No revocation path                | CRL distribution via CDN                |
| No timestamp proof                | Bitcoin-anchored timestamps (OTS)       |
| No multi-language support         | i18n built in (xml:lang per element)    |
| No programmatic access            | Open-source libraries (TS, Ruby)        |

## Why trust this

### 1. Air-gapped by design

The root CA's private key never touches a network-connected machine.
BIML operators run a local Ruby web app on an offline laptop; CSRs
arrive and signed certs leave via USB. **There is no network attack
surface against the root.**

Compromise of the CA operator's machine cannot exfiltrate the key
because the key is either (a) in a Yubikey/HSM (preferred) or (b) in
an AES-256-GCM encrypted keystore with a passphrase the malware
doesn't have.

### 2. Hardware-backed keys

The root and intermediate CA private keys live in PKCS#11-compatible
hardware — Yubikey 5 series ($50), Nitrokey, smartcard HSM, or
enterprise HSM (Thales Luna, Utimaco). The private key is generated
**on the device** and is **non-extractable** — even a fully-compromised
host cannot steal it.

Each signing operation requires:
- Physical possession of the device
- The user PIN (typed at sign time, never persisted)
- (Optional) Touch presence on Yubikey 5.2.3+

This is the same security model used by government PIV smartcards,
FIDO2 security keys, and enterprise code-signing HSMs.

### 3. Cryptographic scope governance

BIML doesn't just trust IAs generically — each IA is cryptographically
scoped to specific OIML Recommendations. The scope is encoded as a
non-critical X.509 v3 extension on the IA's intermediate cert:

```
OID 1.3.6.1.4.1.<OIML_PEN>.1.1
Value: ASN.1 SEQUENCE OF UTF8String ["R60", "R76", "R117"]
```

A verifier reading a CNML checks both:
1. The signature chain (cryptographic validity)
2. The IA's scope (authorization for this Recommendation)

PTB cannot forge an R117 (fuel dispenser) certificate even with a
valid PTB-issued signer key — the verifier rejects it because PTB's
intermediate cert doesn't list R117 in its scope. **BIML governance is
enforced by math, not policy.**

### 4. Post-quantum ready

ECDSA P-256 (today's default) is vulnerable to Shor's algorithm once
a cryptographically-relevant quantum computer is built. NIST has
standardized ML-DSA-65 (FIPS 204) as the post-quantum replacement.

CNML's roadmap commits to **hybrid Ed25519 + ML-DSA-65** signatures
within 12 months. Every CNML will carry two `<ds:Signature>` elements
covering the same content; verifiers check both. Documents signed
today remain verifiable through the quantum transition because the
classical signature still protects them until classical break.

We will NOT use RSA. RSA-2048 has been the de-facto standard for
decades but is slower, has larger keys, and is just as quantum-vulnerable
as ECDSA. CNML is greenfield — no legacy.

### 5. OpenTimestamps anchoring

Every signed CNML can optionally be timestamped against the Bitcoin
blockchain via OpenTimestamps. A 300-byte proof is embedded in the XML
and proves "this exact content existed before block N".

Why this matters: if an IA's key is compromised in 2027, an attacker
can't back-date a forged CNML claiming it was signed in 2026. The
Bitcoin chain's hash continuity is independent of the IA's key
lifecycle.

Cost: free (OpenTimestamps is a free public service). Verification
works offline once the proof is embedded.

### 6. Long-term archival (LTANS)

A CNML signed in 2026 may need to be verifiable in 2076. Over 50 years:

- Algorithms weaken (transition path documented)
- X.509 may be deprecated (multi-signature format preserves original)
- Trust anchors long-since expired (timestamp chain preserves proof)

CNML supports multiple `<ds:Signature>` elements per document, one per
algorithm era. Migration is a re-sign operation that preserves the
original signature as evidence. Spec is in `TODO.roadmap/20-long-term-archival-ltans.md`.

### 7. Open source, fully auditable

Every line of code is on GitHub. No proprietary crypto. No "trust us".
Independent security researchers can (and should) audit:

- The signature pipeline (`packages/cnml-crypto/src/`)
- The X.509 cert factory (`oiml-pki-server/lib/oiml_pki/cert_factory.rb`)
- The keystore encryption (`oiml-pki-server/lib/oiml_pki/ca_store.rb`)
- The audit log hash chain (`oiml-pki-server/lib/oiml_pki/audit_log.rb`)
- The verifier (`apps/cnml-web/src/islands/VerifyDrop.vue`)

Pull requests welcome. Security issues get priority review.

### 8. Tamper-evident audit log

Every CA operation (root creation, CSR signing, CRL generation,
artifact publication) appends an entry to an append-only JSONL log.
Each entry includes the SHA-256 of the previous entry — a hash chain.

Tamper-evident, not tamper-proof (an attacker with filesystem access
could rewrite the log AND recompute the chain). For high-assurance
deployments, mirror the log to a remote append-only service
(CloudWatch Logs with retention lock, or a blockchain anchor).

The `/audit` route in the CA server visualizes the log and verifies
chain integrity in real time.

## Industry-leading edge technology

| Area                  | What we use                                                |
|-----------------------|------------------------------------------------------------|
| Signature format      | W3C XMLDSig 1.1 with Exclusive C14N                        |
| Classical algorithm   | ECDSA P-256 (SHA-256); Ed25519 coming                      |
| Post-quantum          | ML-DSA-65 (NIST FIPS 204) — hybrid roadmap                 |
| Key storage (CA)      | PKCS#11 — Yubikey, Nitrokey, smartcard HSM, enterprise HSM |
| Key storage (signer)  | Browser IndexedDB encrypted via PBKDF2-derived AES-GCM     |
| Key derivation        | PBKDF2-HMAC-SHA256, 100,000 iterations                     |
| Hash chain (audit)    | SHA-256 over canonical JSON                                |
| Blockchain anchor     | OpenTimestamps over Bitcoin (free, decentralized)          |
| Distribution          | Static GitHub Pages CDN (no DDoS surface)                  |
| Web framework         | Astro 7 + Vue 3.5 islands + Tailwind 4                     |
| CA server             | Ruby 3.4 + Sinatra 4 + OpenSSL 3.x                        |
| Test coverage         | Playwright e2e + RSpec unit + node:test integration        |
| Accessibility         | Targeting WCAG 2.2 AA (in progress)                       |
| i18n                  | English + French v1; German/Spanish/Chinese v2             |

## Robustness guarantees

### Against compromise of an IA's CA machine

- Private keys are in hardware (Yubikey/HSM) — exfiltration impossible
- Software fallback keys are AES-256-GCM encrypted at rest
- Audit log records every operation with hash chain
- CRLs can revoke the entire IA's signer keys within hours

### Against compromise of a signer's browser

- Browser keys live in IndexedDB, encrypted with a passphrase
- Compromise = ONE signer's keys (revocable via CRL)
- Cannot escalate to IA keys (different machine, different secret)
- Cannot forge past signatures (no time-travel)

### Against algorithm breakage

- Classical + post-quantum hybrid signatures protect against Shor's
- Multiple signatures per document allow algorithm migration
- OpenTimestamps anchors prove existence independent of signature

### Against network attacks

- CA never touches the network (air-gapped)
- Verifier works offline (cached CDN bundle)
- Static CDN has no API to attack
- Trust anchors are public — exfiltration gives nothing

### Against malicious insiders

- Every CA operation is audit-logged (hash chain)
- Scope extension prevents out-of-scope signing
- Multi-person controls can be added (TODO: dual-control CSR signing)
- All code is open-source — no hidden backdoors

## Operational maturity

| Property                | Status                                  |
|-------------------------|-----------------------------------------|
| Spec completeness       | All 22 Recommendations have schemas     |
| Sample corpus           | 880 real certs imported from OIML-CS    |
| Test coverage           | 52 Playwright e2e + 38 Ruby specs       |
| Documentation           | 10 docs pages + 20 roadmap specs        |
| Internationalization   | English today; French planned           |
| Accessibility           | Basic a11y; WCAG 2.2 AA in progress     |
| Performance             | Bundle size audited; targets set        |
| Continuous deployment   | Pipeline specified; CI/CD to wire       |

## Adoption path

1. **Pilot** (3 months): BIML issues a test root + 2-3 IA intermediates
   on Yubikeys. Sample CNMLs signed for evaluation. No production use.
2. **Parallel run** (6 months): Real CNMLs issued alongside PDFs. IAs
   get comfortable. Verifiers (customs, auditors) test the flow.
3. **Production** (12 months): CNML is the official format. PDF
   becomes legacy, eventually deprecated.


## Sovereignty by threshold cryptography (the confium layer)

The single biggest upgrade CNML makes over typical PKI: **no single
person can sign anything**. Every CA-level signature is produced by
a threshold of independent parties, geographically distributed, using
their own hardware. This eliminates compelled-revocation risk,
single-person compromise risk, and insider-trust requirements.

CNML uses the open-source [**confium**](https://github.com/confium/confium)
threshold-cryptography framework (43 Rust crates, 725+ tests) to drive
the entire five-tier hierarchy.

![Five-tier certificate hierarchy](/diagrams/five-tier-hierarchy.svg)

### The five-tier hierarchy

| Tier | Held by | Threshold | Purpose |
|------|---------|-----------|---------|
| **BIML Root** | 7 international directors | 5-of-7 | Signs IA intermediates; annual in-person ceremony |
| **IA Intermediate** | 3 IA officers per nation | 2-of-3 | Signs test labs + manufacturer model certs; async |
| **Test Lab** | 1 lab operator | 1-of-1 | Signs measurement reports |
| **Manufacturer Model** | 1 manufacturer | 1-of-1 | Issued by IA with scoped delegation; signs instances |
| **Manufacturer Instance** | 1 manufacturer | 1-of-1 | Per-instrument end-entity cert |

A court order compelling one IA officer cannot complete revocation.
A burglar stealing one director's YubiKey cannot sign anything.
A manufacturer whose model cert is revoked loses all instance signing
authority immediately.

### Async director signing — no synchronized global ceremony

Directors are globally distributed. CNML's coordinator service lets
them participate when convenient — a director on the other side of
the planet reviews the cert on their laptop, taps their YubiKey,
uploads a partial signature, and walks away. The coordinator
aggregates 5-of-7 and produces the final signature.

![Async director signing flow](/diagrams/async-signing-flow.svg)

Active director time per ceremony: ~5 minutes. Total wall time:
hours to days. No travel. No scheduled meetings. **This is the
operational model that makes 5-of-7 internationally-feasible.**

### Every signature is publicly accountable

Every issued cert, every decryption event, every re-share ceremony
is appended to a **public Merkle transparency log**. Tree roots are
anchored to the Bitcoin blockchain via OpenTimestamps. Gossip
protocols ensure no log operator can present different views to
different verifiers (RFC 6962 attack model).

A verifier demanding an inclusion proof rejects any cert that
silently appeared. Covert issuance — the historical PKI failure
mode — is structurally impossible.

### Threshold encryption for trade secrets

Test reports contain manufacturer IP (calibration curves, failure
analysis). CNML lets test labs encrypt the confidential section of
each report to the IA quorum's threshold public key. Decryption
requires a 2-of-3 ceremony — and every decryption event is logged
to the transparency log with a stated reason.

Compromise of IA storage cannot reveal plaintexts. A subpoena
compelling one IA officer cannot decrypt alone. The decryption
audit trail deters casual abuse.

### Threshold escrow + revocation

If a manufacturer loses their signing key, recovery is a 5-of-7
director threshold ceremony — not a reissuance process that takes
weeks and invalidates in-flight inventory. If a director dies or
resigns, the remaining quorum re-shares to exclude them.

[Read the full confium integration architecture →](/docs/confium-architecture)

![Confium integration points](/diagrams/confium-integration-points.svg)

### Strategic alignment

The CNML 5-tier deployment is the flagship Mode 3 deployment of the
confium framework. It is targeted for NIST MPTS (Migration to
Post-Quantum Cryptography Test) submission in Q2 2027, with
partnerships locked in across BIML (institutional partner), NIST
(performance evaluation), and Ribose (operations).

PQC migration is built in from day one: composite signatures
(ECDSA + ML-DSA-65) ship in CMS envelopes so legacy verifiers
continue to work while PQC-aware verifiers validate the
post-quantum branch.

## What you can do today

- **Read the architecture**: `/docs/cnml-vs-typical-pki`
- **Try the verifier**: `/verify` (drag any `.cnml.xml` file)
- **Read the roadmap**: `/TODO.roadmap/README.md`
- **Audit the code**: https://github.com/oimlsmart/digital-certificates
- **Join the discussion**: open an issue or PR

## See also

- [CNML vs typical PKI](/docs/cnml-vs-typical-pki) — architectural differences
- [Cryptography](/docs/cryptography) — algorithms and key management
- [Trust model](/docs/trust-model) — who trusts whom
- [BIML scope governance](/docs/biml-governance) — per-Recommendation authorization
- [Hardware keys](/docs/hardware-keys) — Yubikey/HSM operational guide
