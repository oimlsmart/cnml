---
title: Interoperability composition
description: How CNML composes with W3C Verifiable Credentials and the EU Digital Product Passport.
---

# Interoperability composition

This document is informative. It specifies how a CNML certificate
composes with the two interoperability frameworks CNML's audience
most often meets: W3C Verifiable Credentials (the verifiable-data
ecosystem) and the EU Digital Product Passport (the European
regulatory context). Both compositions follow the SIGNATIF annexes
on VC and DPP composition.


## Composition with W3C Verifiable Credentials

A CNML type-approval certificate is expressible as a Verifiable
Credential: the CNML payload becomes the credential subject, the
CNML signature becomes the proof, and each dimensional co-signature
becomes an additional proof with its trust dimension identified.

### Type-approval certificate as a VC

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://www.oimlsmart.org/schemas/cnml/1.0"
  ],
  "type": ["VerifiableCredential", "CNMLTypeApproval"],
  "issuer": "did:web:ia.example.org",
  "credentialSubject": {
    "type": "MeasuringInstrumentType",
    "recommendation": "R60",
    "model": "LC-500",
    "manufacturer": "…",
    "oimlCertificateNumber": "R60/2021-NL1"
  },
  "proof": {
    "type": "CNMLXMLDSig2026",
    "canonicalPayload": "the CNML XML, exclusive C14N, minus all Signature blocks",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "the IA threshold key, X.509 chain embedded in KeyInfo"
  }
}
```

Each `cnml:coSignature` wrapper in the CNML XML maps to an entry in
a `proofSet`: the certified tester's person-dimension co-signature,
the calibration authority's environment-dimension co-signature. The
dimension attribute identifies which independent attestation the
proof carries.

### Instance certificate as a VC

An instance certificate is a VC about a specific instrument
instance: `credentialSubject` carries the serial number, firmware
hash, and manufacturing date; the manufacturer's delegated key is
the proof.

### Emission

The mapping is implemented: `certificateToVerifiableCredential()` and
`instanceToVerifiableCredential()` (in `@oimlsmart/cnml-crypto`) emit the
VC JSON from a parsed certificate plus the coverage report's proof
facts, with each verified co-signature landing in the proof set under
its trust dimension.

### What CNML adds over a bare VC

A VC proof says "this issuer signed this subject." It does not say:

- **that the signing act was within the issuer's delegated
  authority** (CNML: the scope extension, check 4),
- **that a distributed quorum, not one individual, produced the
  signature** (CNML: threshold signatures, ceremony records),
- **that the certificate cannot have been silently issued**
  (CNML: the transparency log),
- **which independent attestations converge on the payload**
  (CNML: dimensional co-signatures and the coverage report).

A SIGNATIF-conforming verifier can therefore treat a CNML-derived VC
as a VC whose trust metadata is richer than the VC model alone
carries: the coverage report, the classification label, and the
acceptance decision travel with the credential.


## Composition with the EU Digital Product Passport

The CNML passport is structurally a DPP data carrier system: the QR
code on the instrument body is the carrier, the passport endpoint is
the resolution path, and the transparency log provides the unique
product identifier's integrity.

### Element mapping

| DPP element | CNML realization |
|---|---|
| Data carrier | QR code on the instrument body (error-corrected, versioned) |
| Unique product identifier | The instance certificate identifier |
| Resolver | The passport endpoint (`/passport/<cert-id>`, HTML + JSON-LD) |
| Economic operator | The manufacturer (delegated trust authority) |
| Verification reference | The issuing authority and its scope |
| Registry function | The transparency log (single operator today; the multi-log model generalizes it) |
| Version compatibility | Successive certificate versions (renewal, re-issue) |
| Access control | Classed projections (public passport vs. regulator view) |

### The verification flow

A market-surveillance officer scanning the DPP carrier:

1. resolves the QR code to the passport endpoint;
2. reads the device identity, certificate chain summary,
   Recommendation, and revocation status;
3. runs the full verification pipeline against the certificate
   (offline trust anchors, CRL, transparency);
4. receives the coverage report: what was verified, which trust
   dimensions were attested, the classification label;
5. applies their acceptance policy (member-state configuration).

Steps 3 to 5 are exactly the SIGNATIF three-stage model, so the DPP
verification flow needs no CNML-specific verifier: any SIGNATIF
conforming verifier with the CNML profile configured performs it.
