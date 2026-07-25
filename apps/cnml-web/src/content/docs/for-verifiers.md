# For Verifiers

How to verify a CNML file — at point of sale, during audit, or for compliance checking.

## Verification flow

![Verification flow](/diagrams/verification-flow.svg)

## Steps

### 1. Open the Verify tab

Click **Verify** in the top nav. Drag-drop a `.cnml.xml` file, or browse to select.

### 2. Review the four checks

The app runs four sequential checks:

| # | Check | What it confirms |
|---|---|---|
| 1 | **XML well-formed** | The file parses as valid XML |
| 2 | **Schema valid** | The XML conforms to `cnml-1.0.xsd` + the per-Recommendation schema |
| 3 | **Signature valid** | The XMLDSig signature is mathematically correct (file not tampered) |
| 4 | **Issuer trusted** | The X.509 cert in `<ds:KeyInfo>` chains to a root in your trust store |

A failure at any step short-circuits and shows the reason.

### 3. View certificate details

On success, the app shows the certificate's read-only details:
- Recommendation, accuracy class, classification symbol
- Issuer, applicant, manufacturer
- All characteristics (type_level, model_level, config_level)
- Test reports
- Revision history

### 4. Optionally check trust

If check 4 fails ("Issuer unknown"), you can either:
- Trust the issuer's cert for this session (one-click)
- Add it to your permanent trust store
- Decline and report untrusted

## What's NOT verified

- Whether the cert is *legally valid* (CNML only confirms the issuer signed it; legal authority is a separate question)
- Whether the cert has been *revoked* — CRL fetch is on the roadmap (see [Trust Model](/docs/trust-model)); for now, cross-reference the OIML-CS certificate status index manually if revocation is a concern
- Whether the instrument matches the cert (that's a separate physical inspection)
