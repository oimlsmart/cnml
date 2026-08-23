---
title: Verification pipeline
description: The nine-check verification pipeline, the Check registry pattern, the SIGNATIF three-stage model, and the scope check that binds the OIML-CS DoMC framework to the verifier.
---

# Verification pipeline

CNML verification is a sequential pipeline of independent checks. Each check is a module that conforms to a uniform interface and is registered in an ordered array. The verifier iterates the array, runs each check against the submitted certificate, renders the result, and short-circuits on failure. The pipeline is open for extension: adding a new check requires one new file and one entry in the registry array. The scope check, described below, is the check that binds the OIML-CS Declaration of Mutual Confidence framework to the cryptographic verifier.

![Verification flow](/diagrams/verification-flow.svg)

## The Check interface

Every check is a module that exports a `Check` object. The `Check` interface is defined in `packages/cnml-crypto/src/checks/types.ts`. A check has an identifier, a human-readable name, a description of what it confirms, and an `execute` function that accepts the certificate and a context object and returns a result. The result carries a pass or fail status, a human-readable explanation, and optional structured data that the verifier renders.

The verifier component in the web application (`VerifyDrop.vue`) iterates the `CHECKS` array from `packages/cnml-crypto/src/checks/index.ts`. It runs each check in order, renders the outcome generically, and stops the pipeline at the first failure. The ordering is deliberate: a check that depends on a property established by an earlier check can assume that property holds.

## The nine checks

The current pipeline runs nine checks in the following order.

**XML well-formedness.** The submitted file must parse as valid XML. This check catches encoding errors, truncated files, and malformed markup. A file that fails this check cannot be processed further.

**Schema validity.** The parsed XML must conform to the CNML XSD schema and to the per-Recommendation JSON Schema. The verifier reads the recommendation identifier from the certificate, selects the corresponding Recommendation schema from the schema registry, and validates the certificate against it. A file that fails this check may have missing required fields, invalid field values, or a recommendation identifier that does not correspond to a loaded schema.

**Signature validity.** The XMLDSig signature embedded in the certificate must be mathematically correct. The verifier canonicalizes the signed element using Exclusive C14N, recomputes the digest, and validates the signature against the public key in the `ds:KeyInfo` element. This check confirms that the certificate has not been tampered with after signing. It does not confirm that the signer is trusted, which is the purpose of later checks.

**Dimensional co-signatures.** Each `cnml:coSignature` wrapper on the certificate is verified against the same canonical payload as the primary signature. Every verified co-signature records its trust dimension (person, environment) in the coverage report. A broken co-signature is evidence of tampering and downgrades the classification; absent co-signatures are simply unattested dimensions.

**Scope enforcement.** The recommendation identifier in the certificate must fall within the scope of the Issuing Authority that signed it. The scope check reads the `oimlAuthorizedRecommendations` X.509 v3 extension from the IA intermediate certificate in the chain, or falls back to the `trust-anchors.json` manifest entry that matches the intermediate's fingerprint. If the recommendation identifier is not in the authorized list, the check fails. This check is developed further below.

**CRL status.** The certificate's serial number must not appear on the Certificate Revocation List published by the issuing IA. The verifier fetches the CRL, validates its signature, and checks the serial number against the revoked set. A certificate that has been revoked before its natural expiration fails this check.

**Timestamp anchoring.** Time attestation is required in CNML: a signed document carries its OpenTimestamps proof inside the signature container. A proof that commits to a different digest fails, because the document changed after attestation or the proof was transplanted. A pending proof (the attestation is in flight toward a Bitcoin confirmation) reports as pending, naming the calendars; the verifier may mature it on the spot through the calendar upgrade query. Records signed before the mandate are marked legacy: the verifier declares the posture explicitly, and the legacy record skips with a re-sign recommendation rather than failing.

**Transparency-log inclusion.** The certificate must appear in the public Merkle transparency log. The verifier checks the inclusion proof against the current log head. A certificate that is not in the log may be a forgery, since every legitimately issued certificate is appended to the log at issuance time.

## The three-stage model

The check engine feeds a three-stage verification model (the SIGNATIF framework's separation of concerns):

1. **Coverage report.** A deterministic function of the artifact, the trust anchor bundle, and the verifier's cached state: the hard and soft check results, all valid verification paths to the root anchors, the dimensional coverage (which trust dimensions are attested and by whom), and the algorithms observed with their registry status. Two conforming verifiers with the same inputs produce identical coverage reports.
2. **Classification policy.** The scheme declares how a coverage report maps to a label (A+ through F). Any hard check failure is F; hard warnings cap at B; soft outcomes downgrade per policy; the top label requires the data and time dimensions plus transparency inclusion and a time anchor; deprecated algorithms downgrade one label and retired algorithms hard-fail.
3. **Acceptance policy.** The verifier configures which labels it accepts (a customs inspection may require B or better while a routine check accepts C), which dimensions it demands beyond the classification, and how fresh its verification state must be. The default accepts anything that is not F.

The verify page surfaces all three: the check tiles, the classification label with the attested dimensions, and the acceptance verdict.

## Adding a new check

Adding a new verification check follows the open/closed pattern. A new file is created under `packages/cnml-crypto/src/checks/` that exports a `Check` object conforming to the `Check` interface. One entry is added to the `CHECKS` array in `index.ts` at the position that reflects the check's dependency on earlier checks. No existing check module is modified.

For example, a future check that validates a post-quantum composite signature alongside the classical signature would be placed after the signature-validity check. It would read the composite-signature element from the certificate, validate it against the post-quantum public key, and return a result that the verifier renders alongside the classical-signature result.

## The scope check

The scope check is the check that makes the OIML-CS Declaration of Mutual Confidence (DoMC) framework cryptographically verifiable. Under the DoMC framework, each Issuing Authority is authorized to issue certificates for a specific subset of OIML Recommendations. No IA is blanket-approved for all Recommendations. The scope check enforces this authorization at verification time, so that a verifier can reject a certificate issued outside the IA's authorized scope without consulting an external registry.

![Scope enforcement flow](/diagrams/scope-enforcement-flow.svg)

Scope is encoded in two parallel locations for defense in depth. The first location is the X.509 v3 extension `oimlAuthorizedRecommendations`, carried in the IA intermediate certificate. The extension value is an ASN.1 sequence of UTF8String elements, one Recommendation identifier per element. The extension is marked non-critical, so that verifiers that do not understand it still accept the certificate chain (graceful degradation). The second location is the `trust-anchors.json` manifest, a JSON document published alongside the certificate chain that maps each intermediate's fingerprint to its scope list. Browsers and verifiers that do not parse X.509 extensions can read the manifest directly. Both sources must agree, and a verifier warns on mismatch.

The scope check executes four steps. First, it validates the certificate chain from the end-entity signer through the IA intermediate to the root trust anchor. Second, it extracts the recommendation identifier from the certificate's `cnml:recommendation` element. Third, it reads the scope list from the intermediate certificate's X.509 extension, falling back to the `trust-anchors.json` entry that matches the intermediate's fingerprint if the extension is absent. Fourth, it confirms that the recommendation identifier is in the authorized list. If the identifier is not in the list, the check fails with a message stating that the IA is not authorized to issue certificates for that Recommendation.

The scope check applies the authorization at the certificate's `notBefore` timestamp, not at verification time. A certificate signed when the IA had broader scope remains valid even after the IA's scope narrows. This retroactive rule ensures that a scope reduction does not invalidate previously issued certificates.

## Proposal status

CNML is a proposal for OIML from the OIML SMART programme. The verification pipeline described here is a draft architecture. The check set, the check ordering, and the scope-encoding mechanism are subject to revision as the proposal evolves and as OIML Member States and Corresponding Members provide feedback.

## See also

- [Schema-driven design](/docs/implementation/schema-driven-design) describes the open/closed pattern that the check registry and the schema layer share.
- [Transparency and audit](/docs/architecture/transparency) describes the Merkle transparency log that the inclusion check verifies against.
- [For verifiers](/docs/roles/for-verifiers) covers the operational use of the pipeline from a verifier's perspective.
