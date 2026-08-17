---
title: SMI integration
coord: GUIDE / 05
---

# SMI integration

This guide covers how CNML connects to the SMART Measuring Instrument
(SMI) ecosystem and enables the full chain: from type-approval
certificate to signed measurements at the instrument.

## The full chain

The vision of the OIML SMART programme is that every measurement an
instrument produces is cryptographically signed and bound to the
instrument's CNML type-approval certificate. The chain runs:

1. The OIML root delegates type-approval authority to an IA
2. The IA issues a CNML type-approval certificate for an instrument model
3. The manufacturer issues a per-device instance certificate (tier 5)
4. The instrument signs every measurement with its attested key
5. Each signed measurement's hash is anchored to Bitcoin via OpenTimestamps
6. A regulator can challenge the instrument for a fresh, nonce-bound measurement

A counterfeit instrument cannot answer the challenge because it lacks
the attested key. A tampered measurement is detectable because the
signature does not verify. A revoked certificate propagates to bound
measurements through the passport endpoint.

## The boundary

Per ADR-0006, CNML owns the certificate and SMI owns the instrument's
attestation. CNML provides:

- `verifyCnmlXml()` and `runChecks()` for certificate verification
- The check registry (extensible for SMI-specific checks)
- CRL checking and certificate chain parsing
- The passport endpoint (public view of an instance certificate)
- Trust anchor bundle distribution

SMI imports these and builds:

- **Signed measurements**: every measurement carries a value, timestamp,
  conditions, calibration state, and a cryptographic signature from the
  instrument's key
- **Challenge-response**: a regulator or trading partner challenges the
  instrument to produce a fresh, nonce-bound signed measurement
- **Calibration attestation**: calibration events are signed and
  revocable, bound to the instrument's certificate
- **Continuous compliance**: the twin reports live indication alongside
  certificate validity
- **Evidence persistence**: signed evidence is stored both on-device
  and in a durable store, with matching signatures

## The twin GraphQL interface


## Challenge-response (counterfeit detection)

A verifier challenges the instrument with a fresh 128-bit nonce; the
instrument answers with a signed measurement that includes the nonce
and a fresh timestamp. The nonce is inside the canonical payload, so
the instrument's signature covers it, and the verifier applies a
freshness window: a replayed or static answer cannot satisfy the
challenge, and each nonce is accepted once. The API is
`generateChallenge`, `embedChallenge`, and
`verifyChallengeResponse` in `@oiml/cnml-crypto`.

A SMART Measuring Instrument exposes a digital twin at a `/twin`
GraphQL endpoint. The twin carries:

- `get_indication`: the current measurement reading
- `watch_state`: the instrument's state changes
- `Provenance`: the CNML instance certificate reference

The twin client queries `Provenance` alongside `get_indication`, so
any measurement read can be accompanied by a check of the certificate
that authorizes the instrument for legal use.

## The passport projection

The passport endpoint serves the same read-only view to both
QR-scanning inspectors and twin-querying management systems. A single
projection serves both paths. If a certificate is revoked, the
passport reflects the revocation, and the twin's next `Provenance`
read carries the new status.

## OpenTimestamps anchoring

Each signed measurement's hash is submitted to OpenTimestamps. Within
one to two hours, the hash is anchored in a Bitcoin block. The
resulting proof is embedded alongside the measurement. This means
every measurement is independently timestamped by a public,
tamper-evident, globally verifiable ledger. No trusted timestamp
authority is required.

## See also

- [SMI interface feature](/features/smi-interface) for the design
  rationale.
- [QR code delivery](/docs/guides/qr-code-delivery) for the non-SMART
  delivery path.
- The SMI full-chain explainer for the complete vision described for
  management audiences.
