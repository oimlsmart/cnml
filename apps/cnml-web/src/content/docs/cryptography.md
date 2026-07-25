# Cryptography

CNML uses W3C XML Signature (XMLDSig) — the same standard as PTB DCC.

## Signature algorithm

- **Canonicalization**: C14N Exclusive (canonical XML — handles namespace prefixes safely)
- **Digest**: SHA-256
- **Signature**: ECDSA-SHA256 over the NIST P-256 curve
- **Format**: Enveloped (signature is embedded in the document being signed)

CNML's policy is ECDSA from day one — no legacy RSA. Hybrid Ed25519 + ML-DSA-65 (post-quantum) is on the roadmap.

## Key requirements

Issuing authorities must hold:

1. **A private signing key** — ECDSA P-256
2. **An X.509 certificate** — signed by OIML Root CA, identifying the authority
3. **A CNML software stack** — to generate the cert + sign

The private key **never leaves the authority's control**. It lives in the browser's IndexedDB (encrypted) or in an HSM if the authority has one.

## Trust chain

![Trust chain](/diagrams/trust-chain.svg)

1. **OIML Root CA** — self-signed, published by OIML DoMC. Everyone trusts this.
2. **Issuing authority CA** — signed by Root. Identifies NL1, DE1, etc. Scoped to specific Recommendations.
3. **Per-cert signer** — signed by Issuing authority. Embedded in `<ds:KeyInfo>` of each CNML.

Verifiers rebuild this chain from the CNML file's `<ds:KeyInfo>` up to whatever root is in their local trust store.

## What protects against tampering

The XMLDSig signature covers the **canonicalized XML** (modulo the signature element itself, since it's enveloped). Any change to:
- certificate fields
- characteristics values
- unit references
- revision history

…will cause the digest to mismatch and the signature to fail verification.

## What's not protected

The signature doesn't prove:
- **Authenticity of the issuer's identity** — only that whoever holds the private key signed it. Trust comes from the chain.
- **Non-repudiation beyond key revocation** — once a key is revoked, signatures made before the revocation date may still be valid. OpenTimestamps integration (see `packages/cnml-crypto/src/opentimestamps.ts`) addresses this by anchoring signed cert hashes to the Bitcoin blockchain; wiring it into the sign/verify flow is tracked in `TODO.cnml-pki/11-integration-wiring.md`.
- **Long-term archival** — cryptographic algorithms weaken over decades. LTANS / re-signing is needed for permanent archival.
