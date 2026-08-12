---
title: 'For verifiers'
lede: 'Verification runs in a browser from a cached trust-anchor bundle. Market surveillance, regulators, and customers verify any CNML file or scan any instrument QR code offline.'
coord: 'AUD / 05'
---

## The world today

A verifier of an OIML-CS certificate today holds a PDF. The PDF carries the IA signature, the type-approval reference, and the instrument model description. The verifier trusts the document on the basis of its appearance and the channel that delivered it. Verification that the certificate is genuine, that it has not been revoked, and that it actually applies to the instrument in front of the verifier requires correspondence with the IA.

Market-surveillance inspection happens in the field. The inspector is at a factory, a port of entry, or a retail premises. The network connectivity at the point of inspection is unreliable. The correspondence with the IA takes days. The inspector makes a decision on the spot based on the document and the marking, and the decision may be wrong.

## What changes

CNML moves verification from correspondence to computation. A verifier drops a CNML file onto the verify page and the seven-check pipeline runs in the browser. The result is deterministic and arrives in milliseconds. The pipeline validates XML well-formedness, schema validity, signature validity, scope validity, CRL status, timestamp validity, and transparency inclusion. Each check is a module, and the order matters: earlier checks short-circuit later ones.

The trust-anchor bundle is a static CDN download with no API surface and no usage limits. A verifier that has cached the bundle once can verify CNML certificates indefinitely without further network access. The bundle contains the OIML Root certificate, the IA intermediate certificates, the current CRLs, and the transparency log snapshots. The bundle is refreshed at the verifier's discretion.

For instruments in the field, the verifier scans the QR code printed on the device body. The QR code encodes the passport URL. The passport endpoint serves the certificate chain, the revocation status, and a verification link. The verifier follows the link to the verify page, which runs the seven-check pipeline on the instance certificate.

## What it looks like in practice

The verify page at `/verify` accepts a CNML file dropped onto it. The pipeline runs and renders the result of each check. The verifier reads the result and reaches a decision. No registration, no account, no contact with the IA.

For an instrument in the field, the verifier scans the QR code on the device. The QR code resolves to `https://www.oimlsmart.org/cnml/passport/<instance-cert-id>`. The passport page shows the instrument identity (manufacturer, model, serial number), the certificate chain (instance to model to IA to root), and the revocation status. The verifier follows the verification link to run the full pipeline.

A verifier that integrates CNML validation into an existing system uses the library packages. The `cnml-crypto` package exports the check pipeline and the CHECKS array. The `cnml-xml` package exports the CNML XML parser. The `cnml-schemas` package exports the per-Recommendation JSON Schemas. The library packages are the same code that the verify page uses.

## Proof

The verify page runs the seven-check pipeline on any CNML file. The 22 pre-signed test vectors exercise the per-Recommendation schema coverage and round-trip through the signer and the verifier. The test vectors are regenerated with `the test vector generation scripts`. The passport endpoint is exercised by integration tests.

The trust-anchor bundle is reproducible from the transparency log and the public certificates. A verifier that demands an independent bundle can construct one from the log.

## Your next step

Read the [verification pipeline](../docs/implementation/verification-pipeline) documentation, then open the [verify page](../verify) and drop a test vector onto it.

## See also

- [QR code delivery](../features/qr-code-delivery) describes the passport endpoint a field verifier reaches by scanning a device.
- [Transparency](../features/transparency) covers the inclusion proof the pipeline checks.
- [For developers](../audiences/developers) describes the library packages that embed the same check pipeline in an integration.
