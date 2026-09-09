---
title: Break it
description: The tamper curriculum: every way a CNML certificate can be attacked, and the check that catches each one.
---

# Break it

The best way to understand what the pipeline verifies is to try to
defeat it. Each case below is a real attack on a CNML certificate,
what the attacker changes, and the check that catches it. Every case
maps to a test in the suite; none is hypothetical.

The lesson is the structure: an attacker must defeat every layer at
once, and the layers are independent. Break one and the others still
hold.

## Forgery

**Edit a measured value.** Someone changes the certified
characteristic after signing. Caught by check 3 (signature): the
signature covers the canonical payload, so any content change breaks
the digest.

**Issue under an invented identity.** An attacker self-issues an
"IA" certificate and signs under it. Caught by check 4 (scope) and
check 3 (chain): the invented issuer has no delegation path to the
OIML root, and its scope extension is absent or unbacked.

**Strip a co-signature.** Someone removes the certified tester's
co-signature to erase individual accountability. Caught by check 4
(dimensions): the artifact identifier still commits to the original
dimension set, and the coverage report shows the attestation gone.

**Reissue a certificate that was already referenced.** The type
evaluation was already hash-bound into a certificate; reissuing
under it produces a different evaluation digest. Caught by check 7
(evaluation-report binding).

**Loosen the schema.** Someone relaxes the per-Recommendation form
so a bogus characteristic validates. Caught by check 2 (schema): the
verifier selects the schema by Recommendation identifier from the
signed registry, not from the document.

## Standing

**Present after the certificate expired.** Caught by check 6 (CRL
and validity): the CRL leg applies the validity window, and a stale
CRL beyond the offline grace period refuses to assert anything.

**Revoke the calibration under a measurement.** The authority state
a measurement was produced under is revoked. Caught by check 6
(revocation propagation): the state binding is inside the canonical
payload, and the propagated state index flags every artifact bound
to the revoked hash.

**Issue outside the accredited Recommendation.** An IA scoped to
R60 signs an R117 certificate. Caught by check 4 (scope): the X.509
scope extension does not list R117; the four-layer enforcement model
rejects at verification even if the CA were compromised.

**Certify against a Recommendation nobody approved.** The scope
extension lists the Recommendation, but the chain's narrowing
invariant was violated at some link. Caught by check 4 (scope
narrowing): the monotonic narrowing invariant must hold at every
delegation link.

**Rest the certificate on an unrecognised laboratory.** The
evaluation report comes from a laboratory outside the IA's
delegation. Caught by check 7: the report digest binds to a chain
that does not resolve.

## Metrological

**Claim a better uncertainty than the evaluation supports.** The
evaluation report states the measured uncertainty; the certificate
understates it. Caught by check 7: the ER binding pins the reported
values to the signed report.

**Evaluate with equipment that was out of calibration.** The
calibration state the evaluation depended on was revoked or expired.
Caught by check 6 (state binding): the evaluation carries a state
binding to the calibration hash; revocation propagates.

**Use an algorithm the scheme retired.** A certificate signed with
an algorithm moved to retired status. Caught by classification: the
registry (signed, well-known) is consulted by the verifier; retired
hard-fails, deprecated downgrades the label one step.

## Infrastructure

**Rewrite the transparency log.** The operator replaces history.
Caught by the mirror: the consistency proof between consecutive
heads fails, the mirror refuses to publish, and the fork is
evidence.

**Present a fabricated log view.** A proof claims inclusion under a
root the log never published. Caught by check 9: the inclusion
proof must resolve to the signed tree head, and the head signature
must verify against the operator key.

**Anchor to a different time.** Someone re-anchors an old proof to
claim an earlier signing. Caught by check 8: the OTS proof commits
to the document's SHA-256; a proof from another document fails the
digest check.

**Replay a challenge response.** An instrument reuses a prior
nonce-bound measurement to answer a fresh challenge. Caught by the
challenge verifier: each nonce is accepted once, and the freshness
window bounds replay.

## See also

- [Verification pipeline](/docs/implementation/verification-pipeline) develops each check.
- [The SIGNATIF test mapping](/docs/specifications/signatif-test-mapping) maps every check to its tests.
- [Transparency operations](/docs/guides/transparency-operations) covers the mirror and fork rejection.
