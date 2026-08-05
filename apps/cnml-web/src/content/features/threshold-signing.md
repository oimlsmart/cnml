---
title: Threshold signing
lede: Signing authority at the root and Issuing Authority tiers is distributed across an international quorum of directors and officers. No single party can produce a CA-level signature.
coord: FEAT / 01
---

# Threshold signing

## Mechanism

CNML distributes signing authority at the root and Issuing Authority tiers using threshold cryptography. A threshold signature scheme splits a single signing key into N shares held by independent participants, and a configured threshold of K shares must collaborate to produce a valid signature under one aggregate public key. The aggregate key is indistinguishable from an ordinary single-key signature to a verifier.

The BIML Root tier uses a 5-of-7 threshold. Five OIML directors, each holding one share on a personal hardware token, must participate to produce a root signature. The Issuing Authority tier uses a 2-of-3 threshold among IA officers. Lower tiers (test laboratory, manufacturer model, manufacturer instance) use 1-of-1 signing because the risk profile at those tiers does not warrant threshold coordination.

CNML uses the FROST family of threshold signature protocols (Flexible Round-Optimized Schnorr Threshold signatures) at the Schnorr-based tiers, and the CMP20 variant (the CMP RFC 9380, formerly known as CMP20) for round-optimized key coordination. Both protocols produce signatures that verify against a standard public key with no special verifier logic.

Participants collaborate asynchronously through a coordinator service. The coordinator buffers encrypted protocol messages between rounds so directors and officers in different time zones can contribute when convenient. The coordinator is honest-but-curious: it observes ciphertext but cannot reconstruct the signing key or produce a signature on its own.

Director rotation preserves the aggregate public key. When a director departs and a replacement joins, the remaining participants run a re-sharing protocol that issues new shares without changing the public key. All previously issued certificates remain valid without re-issuance.

## Why this design

A multisig script could in principle express the same K-of-N authorization policy. The threshold approach was chosen because the signature on the issued certificate is a standard single-key signature. The threshold property is invisible to verifiers, who need no special software and no awareness of the signing configuration. This keeps the verification pipeline simple and keeps the trust model aligned with established X.509 semantics.

Re-sharing without changing the public key is the second reason. Institutional leadership rotates on multi-year cycles. A scheme that required re-issuing every certificate on each director change would be unworkable for an instrument fleet with a multi-decade service lifetime.

## Operational consequence

No single officer can produce a root or IA signature. A court order or other compulsion directed at one director cannot complete a threshold signature. Theft of one hardware token cannot forge a certificate. The compromise threshold is structural rather than procedural.

The asynchronous coordinator model means signing ceremonies do not require all participants to be online simultaneously. A director in one time zone initiates a signing round, the coordinator holds the partial signature, and directors in other time zones contribute when they next authenticate. The signing completes once the threshold is met, regardless of the wall-clock schedule.

## References

- [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography) develops the five-tier model.
- [Distributed management](/docs/architecture/distributed-management) describes the asynchronous coordinator flow.
- [Redundancy and continuity](/docs/architecture/redundancy) covers loss-of-director and loss-of-officer recovery.
- The Confium threshold-cryptography substrate is described in [Confium integration](/docs/architecture/confium-integration).
