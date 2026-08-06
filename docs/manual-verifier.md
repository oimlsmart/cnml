# CNML Verifier Manual

## Who you are

You are a market surveillance officer, customs official, regulator, or
quality assurance professional who needs to verify the authenticity of
an OIML-CS digital certificate (CNML).

## What you need

- A web browser (any modern browser)
- The `.cnml.xml` file you received from a manufacturer or found in the
  OIML-CS certificate database
- Access to https://www.oimlsmart.org/cnml/verify

No keys. No accounts. No technical knowledge required.

## How to verify

1. Open https://www.oimlsmart.org/cnml/verify
2. Drag the `.cnml.xml` file onto the page (or click to browse)
3. The browser performs all checks automatically
4. Read the result

## Understanding the result

### All checks pass ✓
```
✓ XML well-formed
✓ Schema valid (R60)
✓ Certificate chain: M.Schmidt → NMi CA → OIML Root CA
✓ Certificate valid (2026-01-15 to 2028-01-15)
✓ Not revoked (CRL checked 2026-07-24 14:23 UTC)
✓ Certificate status: Valid
✓ Signature valid (Ed25519)
```
This certificate is authentic and valid. The product is certified.

### Any check fails ✗
```
✗ FAILED: [step] [reason]
```
Stop. Do not accept this certificate. Contact the issuing authority for clarification.

### Common failure reasons

| Reason | Meaning |
|---|---|
| "Signature invalid" | The file was tampered with or corrupted |
| "Key revoked" | The signer's key was compromised after this CNML was signed |
| "Certificate withdrawn" | OIML withdrew this certificate (product found non-compliant) |
| "Certificate expired" | The signer's certificate expired before signing this CNML |
| "Untrusted issuer" | The cert chain doesn't lead to a trusted OIML root CA |
| "No signature found" | The file is not a signed CNML |

## Privacy

All verification happens in your browser. The `.cnml.xml` file never
leaves your device. The browser only fetches public PKI artifacts
(trust anchors, CA certs, CRLs) from the OIML CDN.
