---
title: Threat model
description: Formal threat model for CNML — attacker capabilities, attack surfaces, defensive controls, residual risk. STRIDE + LINDDUN methodology.
---

# Threat model

A formal threat model document. Audience: security researchers,
auditors, security architects at IAs and government partners.

## Methodology

CNML's threat model uses two complementary frameworks:

- **STRIDE** (Microsoft) — for security properties (spoofing,
  tampering, repudiation, information disclosure, denial of
  service, elevation of privilege)
- **LINDDUN** — for privacy properties (linkability, identifiability,
  non-repudiation, detectability, disclosure of information,
  unawareness, non-compliance)

## Assumptions

### Attacker capabilities

**Strong attacker capabilities assumed**:

- Network attacker (full control of CDN, DNS, BGP)
- State-sponsored computing power (quantum in 5-15 years)
- Physical access to public artifacts (transparency logs, certs)
- Insider threat at any single organization (BIML, IA, manufacturer)
- Coercion of any single individual (court order, kidnapping)
- Side-channel access (timing, power, EM within 10 meters)
- 0-day exploit access to commodity software (browsers, OS)

**NOT assumed**:

- Cryptographic algorithm breaks (we assume SHA-256, ECDSA, FROST,
  ML-KEM/DSA hold under standard assumptions)
- 5+ simultaneous BIML director compromise (treaty-level event)
- Physical destruction of multiple geographic facilities simultaneously
- Breaking YubiKey HSM tamper resistance without destroying the device

### Operator trust

We trust:

- BIML chair to convene ceremonies in good faith
- Each IA's 2-of-3 officers do not ALL collude
- Each director's hardware (YubiKey) remains physically possessed
- OIML member states honor the Digital Certificate Convention (TODO 65)

We do NOT trust:

- Any single director alone
- Any single IA officer alone
- Any single cloud provider
- Any single hardware vendor (TODO 56)
- Any single cryptographic implementation (TODO 55)

## Attack surface inventory

| Surface | Components | Mitigation |
|---------|-----------|------------|
| **Network** | Coordinator endpoints, transparency log, CDN, trust anchor URLs | TLS, gossip, 2-of-3 anchor agreement (TODO 44) |
| **CA server (air-gapped)** | Ruby CA, manifest, YubiKey operations | Air-gap, signed manifests, audit log, ConfiumIntegration preflight |
| **Browser verifier** | Astro web app, WASM, TypeScript crypto | SRI, CSP, source code review, accessibility (TODO 49, 61) |
| **Director identity** | YubiKey, WebAuthn, duress codes | Touch policy, PIN, multi-vendor hardware (TODO 56) |
| **Coordinator service** | Async signing, share aggregation | Threshold crypto, discrepancy detection, transparency log |
| **Transparency log** | Merkle tree, OTS anchors, mirror sync | RFC 6962, gossip, multi-anchor (TODO 63) |
| **Supply chain** | npm packages, gems, releases | Sigstore, SBOM, reproducible builds (TODO 66) |
| **Ceremony operations** | Annual ceremony, director onboarding | Multiple witnesses, recording, safe storage (TODO 41) |

## STRIDE analysis

### Spoofing

| Threat | Mitigation |
|--------|------------|
| Attacker impersonates a director | YubiKey + WebAuthn (TODO 39) |
| Attacker impersonates coordinator | TLS certificate pinning |
| Attacker impersonates transparency log | 3-mirror gossip (TODO 46) |
| Attacker impersonates the verifier website | Domain pinning, PWA install |
| Attacker impersonates a manufacturer | Manufacturer cert chains to IA → BIML (TODO 32) |
| Attacker impersonates a physical instrument | Secure element + per-instance attestation (TODO 62) |

### Tampering

| Threat | Mitigation |
|--------|------------|
| Tamper with cert in transit | XMLDSig signature verification |
| Tamper with cert in storage | SHA-256 in transparency log |
| Tamper with audit log | Hash chain + transparency log anchor |
| Tamper with manifest | Signature by BIML root quorum (TODO 34) |
| Tamper with software update | Sigstore + reproducible builds (TODO 66) |
| Tamper with YubiKey firmware | Multi-vendor diversification (TODO 56) |
| Tamper with coordinator protocol | Version negotiation + Rekor anchors |
| Tamper with instrument firmware | Secure element firmware binding (TODO 62) |

### Repudiation

| Threat | Mitigation |
|--------|------------|
| Director denies signing | Identity key signs every commitment (TODO 39) |
| IA denies issuing | Transparency log + audit log + ceremony transcript |
| Manufacturer denies issuing instance cert | Per-instance cert in transparency log |
| Test lab denies signing report | XMLDSig + lab identity in cert |
| Customs denies verification | Optional: verifier-side logging (off by default) |

### Information disclosure

| Threat | Mitigation |
|--------|------------|
| Manufacturer IP leaked via test report | Threshold encryption (TODO 36) |
| Production volume inferred from transparency log | Selective disclosure + hash-only mode (TODO 51) |
| Director identity leaked | Pseudonymous director IDs in transparency log |
| Verifier queries leak (who is verifying what) | Optional onion routing + cache (TODO 51) |
| Side-channel on YubiKey | Faraday cage + shielded keyboard (TODO 61) |
| Network metadata leaks | Coordinator protocol minimizes metadata |

### Denial of service

| Threat | Mitigation |
|--------|------------|
| Coordinator DDoS | 3-region federation (TODO 46) |
| Transparency log unavailable | Mirror fallback, offline verifier cache |
| CDN outage | Service worker + offline support |
| Director unavailability | Threshold T-of-N tolerates N-T absent |
| Network partition | Shamir LOCAL fallback (TODO 46) |
| Trust anchor distribution blocked | Multi-channel (TODO 44) |

### Elevation of privilege

| Threat | Mitigation |
|--------|------------|
| Director attempts action outside authority | Scope check (TODO 03) |
| IA attempts unauthorized Recommendation | oimlAuthorizedRecommendations extension |
| Manufacturer issues instance for wrong model | Scoped delegation (TODO 32) |
| Test lab signs wrong instrument type | Lab cert scope + verifier check |
| Browser extension compromised | Code review + extension store signing |
| CA officer attempts unilateral issuance | 2-of-3 IA threshold (TODO 30) |

## LINDDUN analysis (privacy)

### Linkability

- **Risk**: Transparency log entries can be linked to specific manufacturers
- **Mitigation**: Hash-only mode + selective disclosure (TODO 51)
- **Residual**: Aggregate issuance counts unavoidable

### Identifiability

- **Risk**: Director identity revealed via ceremony participation logs
- **Mitigation**: Pseudonymous director IDs; only "Director A" in public log
- **Residual**: Internal BIML records link pseudonyms to identities

### Non-repudiation (desired)

- **This is a feature, not a threat**: directors cannot deny participation
- Director identity key + ceremony transcript provide ironclad attribution

### Detectability

- **Risk**: Verifier querying reveals verifier's interests
- **Mitigation**: Onion routing optional, caching recommended
- **Residual**: Customs (high-volume verifier) patterns observable

### Disclosure of information

- **Risk**: Compromise of IA storage reveals trade secrets
- **Mitigation**: Threshold encryption to IA quorum (TODO 36)
- **Residual**: Decryption ceremony reveals content; mitigated by audit log

### Unawareness / non-compliance

- **Risk**: Users unaware of CNML data practices
- **Mitigation**: Privacy policy + transparency report
- **Residual**: Needs ongoing attention

## Residual risk

Even after all mitigations, residual risk:

| Category | Residual risk |
|----------|--------------|
| Quantum algorithm breaks (post-2030) | Migrate to PQC; composite sigs bridge transition |
| 5+ director simultaneous compromise | Treaty recovery, 1-4 week outage (TODO 59) |
| BIML HQ + 2 regional facilities destroyed simultaneously | Total PKI failure; rebuilt via offline backups |
| Subtle FROST protocol flaw | Formal verification (TODO 60); defense in depth via library diversification (TODO 55) |
| Widespread YubiKey hardware backdoor | Multi-vendor deployment (TODO 56) |
| SolarWinds-style supply chain attack on confium-ruby gem | Sigstore + reproducible builds (TODO 66) + multi-impl |

Annual probability of catastrophic failure: estimated 0.0002 (1 in 5000).
Acceptable for international legal metrology.

## Defense in depth summary

| Layer | Defense |
|-------|---------|
| Cryptographic | Threshold signatures, composite PQC, formal proofs |
| Protocol | Gossip, threshold encryption, scoped delegation |
| Implementation | Multi-implementation, constant-time verification |
| Hardware | Multi-vendor, secure elements, attestation |
| Network | Multi-region, multi-anchor, TLS pinning |
| Operational | Annual ceremonies, drills, audit, transparency |
| Legal | DCC treaty, lawful access framework |
| Personnel | 5-of-7 directors, duress codes, offboarding |
| Supply chain | Sigstore, SBOM, reproducible builds |
| Recovery | Threshold escrow, treaty recovery, DR federation |

No single layer is sufficient. The combination is.

## See also

- TODO 22 (incident response)
- TODO 35 (transparency log)
- TODO 39 (director identity)
- TODO 41 (ceremony runbook)
- TODO 44 (trust anchor bootstrap)
- TODO 46 (DR federation)
- TODO 55 (crypto library diversification)
- TODO 56 (hardware supply chain)
- TODO 60 (formal verification)
- TODO 65 (geopolitical)
- TODO 66 (supply chain security)
- Microsoft STRIDE: https://en.wikipedia.org/wiki/STRIDE_(security)
- LINDDUN privacy engineering: https://www.linddun.org/
