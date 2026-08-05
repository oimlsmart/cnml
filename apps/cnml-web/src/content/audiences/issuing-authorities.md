---
title: 'For Issuing Authorities'
lede: 'CNML distributes signing authority across a threshold quorum of IA officers and constrains each certificate to the OIML Recommendations the IA holds under the DoMC.'
coord: 'AUD / 01'
---

## The world today

An Issuing Authority under OIML-CS holds a scope of OIML Recommendations for which it issues type-approval certificates. The scope is governed by the Declaration of Mutual Confidence. The certificate itself is a PDF document. The signing authority is concentrated in the IA as an institution, and the operational practice around who produces the signature, on which machine, and with what oversight varies across IAs.

Verification of a PDF certificate today requires the verifier to trust the document and the channel that delivered it. A market-surveillance inspector who questions a certificate contacts the IA through correspondence, which takes days. The IA has no mechanism to publish a revocation that reaches every verifier before the instrument is next inspected. The transparency of the issuance record depends on the IA maintaining an archive that verifiers know to consult.

## What changes

CNML distributes signing authority across a threshold quorum of IA officers. No single officer can produce an IA-level signature. Every IA-level signature requires a configured quorum of officers operating from separate locations on separate hardware. The threshold model removes single-officer compromise as a system-wide risk and removes compelled-action risk: a court order directed at one officer cannot complete a threshold signature.

The scope of the IA is encoded in the X.509 v3 scope extension on the IA intermediate certificate. The extension carries the OIML Recommendation identifiers the IA is authorized to issue for. The extension is enforced at four layers: at signing time in the CA, at verification time in the check pipeline, at the schema layer in the per-Recommendation JSON Schema, and at the transparency log layer in the inclusion proof. An IA that attempts to issue a certificate for a Recommendation outside its scope fails at every layer.

Revocation reaches every verifier through the certificate revocation list published by the IA. The CRL is a static file on a CDN with no API surface. A verifier that has cached the CRL rejects any certificate listed in it. The transparency log records every issued certificate, so an IA cannot issue a certificate that does not appear in the public record.

## What it looks like in practice

The IA intermediate signing ceremony runs in the app at `/issue/ia-intermediate`. The participating officers each open the app on their own hardware token, review the certificate to be signed, and submit their signature shares. The coordinator combines the shares once the threshold is reached. The combined signature is the IA intermediate certificate, signed by the BIML Root.

The per-Recommendation type-approval signing runs at `/issue/per-recommendation`. The IA selects the OIML Recommendation, fills the per-Recommendation form rendered from the JSON Schema, attaches the test-report evidence, and submits. The signing ceremony proceeds through the threshold quorum as above. The output is a CNML file that any verifier can validate.

The IA manages its officer roster and its hardware tokens through the keys page at `/keys`. Officer onboarding is a threshold ceremony itself: the new officer's hardware token is enrolled by a quorum of existing officers. Officer offboarding is a re-sharing ceremony that removes the departed officer's share without re-issuing the certificate.

## Proof

The 22 pre-signed test vectors exercise the per-Recommendation schema coverage and round-trip through the signer and the verifier. Any contributor can regenerate the vectors with `pnpm vectors:gen` and verify them with `pnpm vectors:verify`. The verify page at `/verify` runs the seven-check pipeline on any CNML file dropped onto it, including the scope check that validates the IA's authorization for the Recommendation named in the certificate.

## Your next step

Read the [operational guide for IAs and BIML/CIML](../docs/roles/for-ias-biml-ciml), then open the [app](../app) and walk the IA intermediate and per-Recommendation issuing flows against the test root.
