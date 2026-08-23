---
title: Signing a certificate
coord: GUIDE / 02
---

# Signing a certificate

This guide covers the CNML signing flow: key generation, certificate
creation, and XMLDSig signing.

## Key generation

CNML signing keys are ECDSA P-256 keypairs generated in the browser
via WebCrypto. The private key is encrypted at rest with AES-256-GCM,
using a PBKDF2-derived key from your passphrase.

```typescript
import { generateKey, getKey, loadCryptoKey } from "@oiml/cnml-crypto";

const { id, fingerprint } = await generateKey({
  alias: "My IA signing key",
  algorithm: "ECDSA",
  passphrase: "my-strong-passphrase",
});

// Later: load the key for signing
const stored = await getKey(id);
const privateKey = await loadCryptoKey(stored, "my-strong-passphrase");
```

The key is stored in IndexedDB under the `cnml-crypto` database. It
never leaves the browser.

## Certificate creation

The web app renders a schema-driven form from the per-Recommendation
JSON Schema. Fill in the evaluation results, then sign:

```typescript
import { certToCnmlXml } from "@oiml/cnml-xml";
import { signCnmlXml, issueSelfSignedCert } from "@oiml/cnml-crypto";

// Build the CNML XML from the form data
const xml = certToCnmlXml(certData);

// Issue a self-signed X.509 v3 cert for KeyInfo
const certPem = await issueSelfSignedCert(
  publicKey, privateKey, "O=My IA, CN=Signer 2026, C=NL",
);

// Sign with enveloped XMLDSig + Exclusive C14N
const signedXml = await signCnmlXml(xml, privateKey, certPem);
```

The signed XML contains:
- `<ds:Signature>` inside the root element (enveloped)
- Exclusive C14N canonicalization
- ECDSA-SHA256 signature method
- The X.509 certificate in `<ds:X509Certificate>` for chain verification

## Composite signatures (post-quantum)


## Time attestation (the OpenTimestamps stamp)

Signing includes the OpenTimestamps step: the document digest is
stamped through a calendar (`stampDigest`), and the returned proof is
embedded inside the `ds:Signature` container, so the enveloped
signature covers it. A fresh proof is pending (the attestation is in
flight toward a Bitcoin confirmation) and matures later; verifiers
read the block height and attestation time from the proof, and the
calendar upgrade query can mature a pending proof on the spot. The
stamp and codec surface is importable as `@oiml/cnml-crypto/ots` for
relays and offline tools.

## Co-signatures (multi-dimensional attestation)

A certificate may carry independent co-signatures on the same
canonical payload, each attesting a trust dimension. The certified
tester's key co-signs the certificate they evaluated (the person
dimension), and a calibration authority may co-sign the environment
dimension. Every signature, primary and co-signed, covers the same
canonical payload: the document minus all signature-bearing
elements, exclusive C14N canonicalized, so third-party XMLDSig
verifiers interoperate unchanged. The API is
`signCnmlXmlWithCosignatures(xml, primary, cosigners)`, and the
verification pipeline records each verified dimension in the
coverage report. See [Verification pipeline](/docs/implementation/verification-pipeline).

For post-quantum readiness, CNML supports composite signatures
combining Ed25519 with ML-DSA-65:

```typescript
import { generateCompositeKeyMaterial, compositeSign } from "@oiml/cnml-crypto";

const material = await generateCompositeKeyMaterial(passphrase);
const composite = await compositeSign(message, material);
```

A composite signature is valid only when both components verify.

## Next steps

- [Verifying a certificate](/docs/guides/verifying-a-certificate) for
  the check pipeline.
- [The verification pipeline](/docs/implementation/verification-pipeline)
  for the technical details of each check.
