---
title: For Decision Makers
description: The business case for CNML — longevity, security, ease of management, and cost of ownership compared to current OIML-CS PDF certificates and typical web PKI.
---

# For Decision Makers

> **Executive summary**: CNML replaces OIML-CS PDF certificates with
> cryptographically-signed, machine-verifiable XML. It lasts longer,
> resists attacks single-key systems cannot, costs ~37% less over
> 10 years, and is the only path forward as customs, regulators,
> and manufacturers demand digital verification.

This page is for finance directors, IA CEOs, BIML policy staff, and
government auditors. Technical details are in
[/docs/why-cnml](/docs/why-cnml) and
[/docs/cnml-vs-typical-pki](/docs/cnml-vs-typical-pki).

## At a glance: three options

| | **PDF (today)** | **Typical PKI (TLS-style)** | **CNML** |
|---|---|---|---|
| **Longevity** | Ink fades 5-10 yrs | 1-2 yr cert lifetime | **25-yr root + archival renewal** |
| **Security** | Forgeable with Photoshop | Single-key catastrophic failure | **5-of-7 threshold; no single point of failure** |
| **Management** | Manual verify, manual revoke | ACME-automated issuance only | **Async director signing; full automation** |
| **Cost / 10 yr** | ~$540K per IA | Cloud HSM + per-cert fees | **~$340K per IA (37% savings)** |
| **Status** | Frozen (40-year-old format) | Wrong threat model | **Built for legal metrology** |

## Longevity

Legal metrology instruments have multi-decade lifetimes. A load cell
installed in 2026 may still be in service in 2046. The certificate
must remain verifiable for that entire period.

### PDF: ink on paper (or its digital equivalent)

- Paper certificates fade; PDFs depend on viewer software that may not exist in 20 years
- No archival renewal mechanism
- No defense against algorithm obsolescence (a 2006 PDF signed with SHA-1 is forgeable today)

### Typical PKI

- Cert lifetimes of 1-2 years (TLS cadence)
- No archival story — expired certs become unverifiable
- Format-breaking changes every 5-10 years (SHA-1 → SHA-256 → PQC)

### CNML

- **Root cert lifetime: 25 years**
- **ERS archival renewal every 5 years** (RFC 4998) — hash algorithms renewed as they age
- **Format versioning** (TODO 28) — backward-compatible evolution, no breaking changes
- **Composite signatures** (TODO 08) — classic + post-quantum, migrate without reissuing
- **Bitcoin-anchored timestamps** (TODO 06) — proof of existence independent of any CA

A CNML issued today will be verifiable in 2051. No other format makes
that claim.

## Security

### PDF: forgeable with consumer tools

A determined attacker with Photoshop and a printer can produce a
convincing PDF certificate. Past OIML-CS fraud cases (manufacturer
self-issuing, lab fraud) exploited exactly this. There is no
revocation path — once a forged PDF is in circulation, only manual
recourse remains.

### Typical PKI: single point of catastrophic failure

The history of web PKI is the history of single-key compromises:

- **DigiNotar (2011)**: single breach → 500+ fraudulent certs → company liquidation
- **Comodo (2011)**: single RA compromise → 9 fraudulent certs
- **Symantec (2015-2017)**: repeated mis-issuance → distrusted by browsers
- **Sectigo (2020)**: RA subsystem bug → 5-year mis-issuance window

Each case: one key, one breach, system-wide fallout. CT logs help
detect the breach but cannot prevent it.

### CNML: threshold cryptography + transparency

The single biggest architectural difference: **no single person can
sign a CNML at the root or IA tier.** Every signature requires a
threshold of independent parties.

![Five-tier certificate hierarchy](/diagrams/five-tier-hierarchy.svg)

| Attack | PDF | Typical PKI | CNML |
|--------|-----|-------------|------|
| Forgery (Photoshop) | Trivial | N/A (TLS cert) | **Impossible (128-bit key)** |
| Compelled revocation | N/A | One employee folds | **Requires 2-of-3 IA officers (5-of-7 directors for root)** |
| Burglary of one signer's key | N/A | Forge anything | **Useless without quorum** |
| Covert backdoor issuance | Common | One insider can do it | **Public in transparency log within hours** |
| Algorithm breakage | Sealed | Reissue everything | **Composite signatures migrate gracefully** |
| Key loss | Reissue (weeks) | Reissue (days) | **Threshold escrow recovers in hours** |
| Network attack on CA | N/A | Common (ACME exposed) | **Air-gapped; no network surface** |

[Read the full cryptographic architecture →](/docs/confium-architecture)

## Ease of management

### PDF: fully manual

- Verification: visual comparison, manual lookup
- Revocation: broadcast via post / email, no propagation guarantee
- Archival: physical storage, periodic re-scan
- Audit: paper records, manual review

### Typical PKI: issuance-only automation

- ACME automates issuance
- No automated revocation checking (OCSP unreliable)
- No archival story
- No multi-party controls

### CNML: end-to-end automation with human oversight

![Async director signing flow](/diagrams/async-signing-flow.svg)

- **Issuance**: CA officer approves; threshold signing runs async across directors
- **Verification**: drop file → instant 7-check pipeline → trust grade (TODO 49)
- **Revocation**: threshold CRL signing + automated CDN distribution
- **Archival**: ERS auto-renewal every 5 years
- **Audit**: hash-chained log, every action traceable to a director identity
- **Incident response**: documented runbook (TODO 22), scriptable

Directors participate when convenient — no travel, no synchronized
global ceremonies. Active director time per ceremony: ~5 minutes.

## Cost of ownership (10-year TCO)

### Per IA, 1,000 certs over 10 years

| Component | PDF | CNML |
|-----------|-----|------|
| Upfront ceremony | $0 | $50,000 |
| Hardware (YubiKeys, safes, laptop) | $0 | $5,000 |
| Software licenses | varies | $0 (all open-source) |
| Annual operations staff | $40,000/yr | $25,000/yr |
| Per-cert issuance | $200 × 1,000 = $200,000 | $20 × 1,000 = $20,000 |
| Per-cert verification | $50 × 5,000 = $250,000 | $0 |
| Incident response (3 incidents) | $30,000 | $6,000 |
| Audit/compliance | $20,000/yr | $15,000/yr |
| Archival | $5,000/yr | $1,000/yr |
| **10-year total** | **~$540,000** | **~$340,000** |
| **Savings** | — | **~37%** |

### For BIML with 30+ IAs

- Cumulative savings: **$6M+ over 10 years**
- Plus: production verifiers (customs, auditors, manufacturers) save at similar rates
- Plus: incident response is faster and cheaper when it does happen

### Cost calculator

Interactive TCO calculator (planned, TODO 52) — enter your cert
volume and country for a per-IA estimate.

## Why this matters now

### The threat landscape has changed

- **Quantum computing**: NIST PQC standardization complete (FIPS 203/204/205, 2024). CNML ships composite signatures from day one.
- **State-sponsored attackers**: APT groups target national infrastructure. Single-key PKIs are sitting ducks.
- **Cross-border digital trade**: WTO TFA (Trade Facilitation Agreement) requires digital document acceptance. PDFs don't qualify; signed XML does.
- **AI-generated document fraud**: Ink-and-paper certificates are trivially forgeable with modern AI tools.

### The regulatory landscape has changed

- **EU eIDAS 2.0** (2024): qualified electronic seals recognized across all member states. CNML qualifies.
- **WTO TFA**: digital trade documents must be machine-verifiable. CNML satisfies.
- **BIPM Digital SI** (2023+): the SI is going digital. CNML's unit handling is BIPM-aligned.
- **National cyber-resilience acts** (EU NIS2, US PRA): mandate threshold authentication for critical infrastructure.

### The competitive landscape is moving

- **PTB (Germany)** has shipped DCC (Digital Calibration Certificate) — CNML is compatible (TODO 14)
- **NIST MPTS** (Q2 2027) will evaluate threshold-PKI submissions. CNML is positioned as a flagship
- **China** is reportedly developing a national digital metrology cert — international standards engagement now prevents fragmentation

Adopting CNML early establishes your IA as a leader. Adopting late
means catching up.

## Reading order for decision makers

1. **This page** — the business case
2. **[Why CNML](/docs/why-cnml)** — fuller pitch with all 8 trust pillars
3. **[CNML vs typical PKI](/docs/cnml-vs-typical-pki)** — architectural differences
4. **[Confium integration architecture](/docs/confium-architecture)** — how it's built
5. **[Hardware keys](/docs/hardware-keys)** — YubiKey operational guide
6. **[FAQ](/docs/faq)** — common objections answered

## Next steps

- **For IA leadership**: schedule a 30-minute briefing with BIML operations
- **For BIML policy**: review the CP/CPS draft (TODO 45) and migration plan (TODO 48)
- **For finance**: run the TCO calculator (planned, TODO 52) with your cert volume
- **For government auditors**: review the [liability framework](TODO 52) and [standards engagement plan](TODO 52)
- **For legal**: review the [legal standing framework](TODO 52) per jurisdiction

## See also

- TODO.roadmap/48 (migration from PDFs)
- TODO.roadmap/49 (verifier UX — trust grade)
- TODO.roadmap/52 (cost model + liability)
