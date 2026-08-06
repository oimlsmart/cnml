---
title: Composite signatures
lede: Each CNML carries an Ed25519 signature and an ML-DSA-65 signature combined under AND semantics. Both components must verify. Documents signed today remain secure through the transition to quantum computing.
coord: FEAT / 02
---

# Composite signatures

## Mechanism

CNML signs each certificate with a composite signature. A composite signature combines two independent signature algorithms over the same document, and verification requires both components to succeed. The construction uses AND semantics: the composite is valid if and only if both the classical and the post-quantum components verify.

The two algorithms are Ed25519 (classical, RFC 8032) and ML-DSA-65 (post-quantum, NIST FIPS 204). Ed25519 provides the classical security property that the broader cryptographic ecosystem already understands and validates. ML-DSA-65 (Module-Lattice-Based Digital Signature Algorithm, security level 3) provides security against an adversary equipped with a cryptographically relevant quantum computer.

The composite is carried as two `ds:Signature` elements in the W3C XMLDSig envelope. Each element wraps a detached signature over the same canonicalized XML (Exclusive C14N). The verifier checks both elements and fails the signature check if either is absent or invalid.

FIPS 204 is the NIST standard that finalized ML-DSA in August 2024. CNML adopted ML-DSA-65 from the FIPS 204 finalization rather than earlier draft parameter sets, so signatures produced today conform to the published standard.

## Why this design

A single-algorithm signature, whether classical or post-quantum, concentrates risk in one algorithm. A classical-only signature becomes forgeable if a cryptographically relevant quantum computer is built. A post-quantum-only signature carries the residual risk that the newer lattice algorithm has an undiscovered weakness. The composite construction hedges both risks under a single verification rule.

The migration path is the second reason for the composite. When the classical component is no longer considered safe, it can be dropped from new signatures without re-issuing existing certificates. The ML-DSA-65 component, already present on every certificate, continues to verify. Re-issuance of a multi-decade instrument fleet is operationally infeasible; the composite structure makes the migration a signing-policy change rather than a fleet-wide re-issuance.

## Operational consequence

Documents signed today remain verifiable under both algorithm assumptions for the service lifetime of the certificate. A verifier in 2046 checking a certificate signed in 2026 validates the Ed25519 component under the classical trust assumption and the ML-DSA-65 component under the post-quantum trust assumption. Both checks must pass.

The signing ceremony runs both algorithms in sequence and produces a slightly larger file. The signature-element overhead is the operational cost of post-quantum readiness; verification latency is approximately twice that of a single-algorithm signature because both elements must be checked.

CNML supports multiple `ds:Signature` elements per document so that a future algorithm era can add a third component without disturbing the existing two. The verifier evaluates all present elements.

## See also

- [CNML architecture choices](../docs/architecture/cnml-architecture-choices) develops the post-quantum migration path.
- [Threshold signing](../features/threshold-signing) covers the distributed quorum that produces the composite signature.
- [Technology](../about/technology) lists every standard CNML builds on, including FIPS 204 and RFC 8032.
- [Standards index](../docs/reference/standards-index) lists every standard CNML references.
