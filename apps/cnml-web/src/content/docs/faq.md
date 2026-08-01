---
title: FAQ
description: Frequently asked questions about CNML — for Issuing Authorities, verifiers, and manufacturers.
---

# FAQ

Common questions and objections. Grouped by audience.

## For Issuing Authorities

### "We've issued PDFs for 40 years. Why change now?"

Three forces make the change urgent:

1. **Quantum computing** is breaking classical cryptography. PDFs signed with SHA-1 are already forgeable; SHA-256 has 10-15 years before serious threat. CNML ships composite signatures (classic + post-quantum) from day one.
2. **Cross-border digital trade** requires machine-verifiable documents. WTO TFA, EU eIDAS 2.0, and equivalent national frameworks are mandating this. PDFs no longer qualify.
3. **Document fraud** is getting easier. AI tools produce convincing forgeries of paper certificates. Threshold-signed XML with public transparency is the defensive response.

CNML is also ~37% cheaper over 10 years (see [TCO analysis](/docs/for-decision-makers)).

### "Won't this require hiring new specialized staff?"

No. CNML is designed for the staff IAs already have:

- CA officers continue approving CSRs; they just click "Sign" instead of printing
- Test lab technicians use the same measurement data; signing is one extra click
- IT staff familiar with PKCS#11 / YubiKey manage the hardware (existing skills)
- Annual ceremony requires directors' time (~5 min each, async — no travel)

CNML training: 2-day workshop for CA officers, 1-day for test labs, half-day for verifiers.

### "What if a director refuses to participate?"

This is by design. Threshold signing (2-of-3 for IA, 5-of-7 for root) means **no single person can compel action**. If one director refuses, the threshold cannot be reached and the operation pauses.

This protects against:
- **Compelled action** (court order against one director)
- **Insider threats** (one rogue director cannot sign covertly)
- **Coercion** (kidnap one director; useless without quorum)

The trade-off: occasional operational delays when directors are unavailable. The 4-hour unlock window + async protocol mitigates this.

### "How do we handle a YubiKey loss?"

Two recovery paths:

1. **Backup YubiKey** (TODO 39): every director has two; the backup is in a tamper-evident envelope in a safe. Activate within hours.
2. **Threshold escrow** (TODO 38): the lost YubiKey's share is recoverable via 5-of-7 quorum ceremony. Estimated recovery time: 1 hour with quorum available.

In either case, the lost YubiKey's identity cert is revoked (cannot be used even if found).

### "Can we keep our existing PDF workflow during transition?"

Yes. CNML has a 36-month dual-run migration plan (TODO 48):

- Phase 1 (months 4-18): issue both PDF and CNML for new applications
- Phase 2 (months 19-30): CNML becomes primary; PDFs generated from CNML XML
- Phase 3 (months 31+): PDFs deprecated

Existing PDFs remain valid throughout. No re-issuance required.

### "What if we want to leave CNML later?"

CNML is open-source. You can:

- Continue operating your IA independently
- Migrate to a successor format (CNML XML is documented, no lock-in)
- Keep your existing certs verifiable (transparency log + ERS archival are public)

There is no vendor lock-in. The CP/CPS documents your operational independence.

## For Verifiers (customs, auditors, marketplace)

### "How do I verify a CNML cert without internet?"

Pre-load the trust anchor bundle (TODO 44). Once loaded:

- All signature checks work offline
- CRL is cached; stale CRL warns but doesn't fail
- Transparency log proofs are embedded in the cert
- Bitcoin-anchored timestamps verify locally

Internet is only needed for:
- Initial trust anchor fetch (one-time, ~10 KB)
- CRL refresh (monthly)
- Reveal endpoint for hash-only mode certs (rare)

A USB-stick verifier distribution covers completely air-gapped environments.

### "How do I know the cert isn't revoked?"

Two layers:

1. **CRL** (TODO 05): the IA publishes a Certificate Revocation List. Verifier checks the cert's serial against the CRL. CRL is signed by the IA and timestamped.
2. **Transparency log** (TODO 35): revocation events are public. Verifier can subscribe to "notify me if cert X is revoked" notifications.

### "What if the cert looks valid but the manufacturer says it's forged?"

The transparency log is your friend:

1. Check the cert hash in the log
2. If present: the cert was issued by the IA (manufacturer is mistaken or lying)
3. If absent: the cert is forged (sign the manufacturer's affidavit, report to IA)

This is a fundamental change from PDFs: every legitimately-issued cert has a public audit trail. Forgery is structurally impossible to hide.

### "Can I integrate CNML verification into our customs software?"

Yes — open-source libraries:

- TypeScript: `@cnml/cnml-crypto` (browser + Node)
- Ruby: `oiml_pki` gem (server-side)
- Rust: confium crates (native)
- Browser extension: one-click install for non-developers

REST API: not provided by design. CNML is offline-first. If you need an API, wrap the library.

## For Manufacturers

### "Do I need to change my production line?"

Only if you want **manufacturer delegated signing** (TODO 32), where you issue instance certs yourself.

For the basic flow (IA issues your cert per model), no production line change. The cert arrives via the same channels as today's PDFs.

For delegated signing (high-volume manufacturers):

- YubiKey at the end of each production line
- Operator taps YubiKey per instrument → instance cert issued in seconds
- Cert embedded in instrument firmware or printed as QR code

### "Will my competitors see my production volume?"

By default, the transparency log shows the hash of each cert. From
the hash alone, **your competitors cannot determine which
manufacturer issued it**. They can see aggregate issuance volume
but not per-manufacturer breakdown.

For sensitive sectors, CNML supports three privacy modes (TODO 51):

- **Full**: hash + content public (default)
- **Hash-only**: hash public, content held by IA (revealed on verifier request)
- **Quorum-revealed**: hash public, content encrypted to IA quorum (revealed via 2-of-3 ceremony)

### "What if I lose my signing YubiKey?"

Two paths:

1. **Backup YubiKey** at your facility (recommended)
2. **Threshold escrow recovery** via BIML/IA quorum (TODO 38) — ~1 hour if quorum available

Lost YubiKey's identity cert revoked; cannot be used even if found.

### "Will CNML work in China / Russia / etc.?"

CNML is jurisdictionally neutral:

- Open-source code; no export restrictions on algorithms
- No dependency on US cloud providers (air-gapped CA, distributed coordinators)
- Multi-language UI (English, French, German, Spanish, Chinese, Russian planned)
- Per-jurisdiction deployment manifests (TODO 34) for local policy

Some jurisdictions may require cross-certification (TODO 50) with national PKIs. CNML supports this via bridge CAs.

### "Will customers accept CNML instead of PDFs?"

The verifier is free, browser-based, works on phones. Customers verify by scanning a QR code or uploading a file. No software install needed.

The verifier shows a trust grade (TODO 49): "Grade A+ Trusted" with green check. Non-technical customers understand this immediately.

## For Standards Bodies

### "How does CNML relate to OIML R-* Recommendations?"

CNML is a **format** for certificates issued under existing OIML R-*
Recommendations. It does not change the technical requirements of
any Recommendation. It only changes how the resulting certificate
is signed, distributed, and verified.

CNML schemas are per-Recommendation (R60, R76, R117, etc.) and
reflect the existing test report structures. The Recommendation
itself remains authoritative.

### "How does CNML relate to PTB DCC?"

PTB's Digital Calibration Certificate (DCC) is a parallel effort
focused on test report data. CNML is compatible (TODO 14):

- CNML can embed DCC XML as the test report payload
- Test labs can produce DCC + sign it + reference it from CNML
- Round-trip conversion works

CNML and DCC are complementary, not competing.

### "How does CNML relate to BIPM Digital SI?"

BIPM Digital SI is the authoritative source for unit definitions
(kilogram, metre, etc.). CNML uses UnitsML/UnitsDB as the
implementation layer for unit references, anchored to Digital SI
for authority. This is documented in [BIPM Digital SI alignment](/docs/architecture).

### "What standards does CNML use?"

| Standard | Role |
|----------|------|
| RFC 5280 | X.509 certificates |
| RFC 5652 | CMS SignedData |
| RFC 6962 | Certificate Transparency (transparency log) |
| RFC 8555 | Trust Anchor Format |
| RFC 3161 | Time-Stamp Protocol |
| RFC 4998 | Evidence Record Syntax (long-term archival) |
| RFC 9776 | Composite ML-DSA signatures |
| FIPS 203 | ML-KEM (PQC KEM) |
| FIPS 204 | ML-DSA (PQC signature) |
| W3C XMLDSig | XML signature |
| W3C Exclusive C14N | Canonicalization |
| ETSI EN 319 411+ | EU CA audit framework |
| ETSI TS 119 612 | Trust list format |
| ISO 15489 | Records management |

No vendor-specific standards. No lock-in.

## For Security Researchers

### "Has CNML been audited?"

CNML is built on confium (43 Rust crates, 725+ tests), which has
been internally audited by Ribose. Independent third-party audits
are planned annually starting 2027.

Open source: all code at [github.com/oimlsmart/digital-certificates](https://github.com/oimlsmart/digital-certificates)
and [github.com/confium/confium](https://github.com/confium/confium).

### "What's the threat model?"

Documented in [CNML vs typical PKI](/docs/cnml-vs-typical-pki).
Summary: defends against compelled revocation, single-key compromise,
covert issuance, algorithm breakage, network attacks, malicious
insiders, AI-generated document fraud, and quantum computing.

Out of scope: physical attacks on YubiKey firmware (mitigated by
hardware attestation), zero-day vulnerabilities in browsers
(standard web security), side-channel attacks on signing hardware
(physical security).

### "How is the transparency log gossip-monitored?"

Per RFC 6962 §3. Three independent log operators (BIML, NIST, PTB)
replicate every entry. Verifiers require 2-of-3 agreement. A
diverging log is detected within hours. See TODO 46.

## For Open-Source Contributors

### "How do I contribute?"

See [For Developers](/docs/for-developers). Quick start:

- Rust core: [github.com/confium/confium](https://github.com/confium/confium) — Rust workspace, `cargo build --workspace`
- Ruby CA: `oiml-pki-server/` in this repo — `bundle exec rspec`
- TypeScript packages: `packages/cnml-*` — `pnpm test`
- Web app: `apps/cnml-web` — `pnpm dev`

All contributions via PR. CLA required (Ribose CLA, similar to
Metanorma).

### "What license?"

To be finalized. Likely MIT or Apache 2.0 for the libraries;
possibly BSL or copyleft for the web app.

## Still have questions?

Open an issue at [github.com/oimlsmart/digital-certificates](https://github.com/oimlsmart/digital-certificates/issues)
or contact BIML operations.
