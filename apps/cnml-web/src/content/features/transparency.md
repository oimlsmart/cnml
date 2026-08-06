---
title: Transparency
lede: Every issued certificate is appended to a public Merkle transparency log. Tree roots are anchored to Bitcoin. Gossip protocols prevent equivocation.
coord: FEAT / 04
---

# Transparency

## Mechanism

Every CNML certificate issued under the production hierarchy is appended to a public append-only Merkle transparency log. The log is a hash-chained data structure: each entry is hashed, pairs of entries are hashed together, and the tree root commits to the entire history. An inclusion proof demonstrates that a specific certificate appears at a specific position in a specific tree, and the tree root is the cryptographic commitment.

Tree roots are anchored to the Bitcoin blockchain through OpenTimestamps. OpenTimestamps creates a transaction-layer commitment that ties a Merkle tree root to a Bitcoin block at a known time. Once the Bitcoin block is buried under subsequent blocks, the timestamp becomes practically immutable. The combination of the transparency log and the Bitcoin anchor gives every issued certificate a publicly verifiable issuance time that no single operator can rewrite.

The log is mirrored across independent operators. Each mirror runs the same append-only data structure and serves the same inclusion proofs. Mirrors agree through gossip protocols: each mirror compares its view of the log with other mirrors and flags any divergence. An operator that presents a different tree to different verifiers (an equivocation) is detectable by any mirror that observed the conflicting views.

A verifier that demands an inclusion proof rejects any certificate that did not appear in the log. This is a verifier-side policy, enforced by the verification pipeline's transparency check.

## Why this design

A public append-only log provides issuance auditability without a trusted registrar. If the log operator were the sole authority on what was issued, the operator could silently omit, backdate, or retroactively insert certificates. The Merkle structure plus Bitcoin anchoring removes that trust: the tree root committed to Bitcoin at time T cannot be changed, and any certificate that verifies against that tree root was present at time T.

The choice of a Merkle log with Bitcoin anchoring, rather than a general-purpose public blockchain, reflects the volume and the verification pattern. Legal-metrology issuance is low-volume (thousands of certificates per year, not thousands per second). The verification pattern reads inclusion proofs against published tree roots. Bitcoin provides the anchor primitive without the per-transaction overhead of a smart-contract blockchain.

## Operational consequence

No certificate can be silently issued. Every issued certificate appears in the public log with a Bitcoin-backed issuance time. A market-surveillance authority or any other verifier can confirm issuance by requesting an inclusion proof and checking it against a tree root that the authority independently observed or that is anchored to Bitcoin.

A revoked certificate remains in the log with its revocation recorded as a subsequent entry. The log is append-only, so revocation is an additional record rather than a deletion. This preserves the complete history of issuance and revocation for the lifetime of the format.

## See also

- [Transparency and audit](../docs/architecture/transparency) develops the Merkle log, gossip, and OpenTimestamps anchoring.
- [For verifiers](../audiences/verifiers) covers the field-verification flow that demands inclusion proofs.
- [How it works](../about/how-it-works) introduces the transparency log in the verification pipeline. RFC 6962 is the IETF Certificate Transparency specification; the OpenTimestamps specification defines the Bitcoin anchoring format.
- [Transparency flow](../diagrams/transparency-flow.svg) diagrams the log, mirrors, and anchor.
