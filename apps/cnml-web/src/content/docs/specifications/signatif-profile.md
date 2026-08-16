---
title: CNML profile of SIGNATIF
description: The conformance claims, hierarchy mapping, scope dimensions, and gap analysis of CNML as a domain profile of the SIGNATIF trust infrastructure framework.
---

# CNML profile of SIGNATIF

This document specifies CNML as a domain profile of the SIGNATIF
framework (ISO/TC 154 working draft). It maps the legal-metrology
hierarchy onto the SIGNATIF delegation model, declares the
conformance classes CNML claims, and records the gaps with their
closure status.

This document is informative. The normative requirements live in
the SIGNATIF standard. CNML's own specifications (the format
specification, the XMLDSig profile, the scope extension OID, the
deployment manifest) instantiate those requirements for the
OIML-CS type-approval tier.

The phased implementation program that closed the gaps below is the
[conformance plan](signatif-conformance-plan); the test-by-test
evidence is the [test mapping](signatif-test-mapping).


## Profile identifier

This profile is identified as `/profile/cnml-legal-metrology`.


## Conformance claims

CNML claims the following SIGNATIF conformance classes.

.Claimed conformance classes
|===
| Class | Status | Notes

| `/conf/basic-verifier`
| Claimed
| The 9-check pipeline validates format, signature, dimensions,
  scope, and revocation. Runs offline in the browser.

| `/conf/full-verifier`
| Claimed
| The three-stage model is implemented: the coverage report
  (deterministic objective facts), the classification policy
  (scheme-declared), the acceptance policy (verifier-declared).
  Transparency inclusion, consistency proofs, signed tree heads,
  and algorithm agility are verified.

| `/conf/issuing-authority`
| Claimed
| Threshold signing ceremony, key lifecycle, end certificate
  issuance, ceremony records. The Ruby CA server implements all
  four.

| `/conf/root-authority`
| Claimed
| Deployment manifest generation, governance record publication,
  scope definition, delegation to IAs. The confium.toml manifest
  and the CeremonyTranscript cover these.

| `/conf/transparency-operator`
| Claimed
| Append-only Merkle log, inclusion proof issuance, RFC 6962
  consistency proofs, signed tree heads, OTS time anchoring. The
  TransparencyPublisher implements these.

| `/conf/mirror`
| Not claimed
| The mirror is implemented (TransparencyMirror: rebuilds the tree
  from published leaves, validates the consistency proof between
  consecutive heads, rejects forks, republishes with an observation
  record) and the verifier-side machinery exists (signed-head
  verification, fork detection, gossip quorum). Claimed when an
  independent party operates one.

| `/conf/device-signer`
| Claimed
| Per-device key lifecycle, artifact signing, and the
  challenge-response protocol (128-bit nonce, freshness window,
  nonce-bound signing).

| `/conf/hierarchical`
| Claimed
| Single root (OIML/BIML), strict tree topology. No federation,
  no cross-recognition, no mesh. Path enumeration over a DAG is
  implemented for when the topology generalizes.

| `/conf/format-xmldsig`
| Claimed
| W3C XML Signature 1.1 with Exclusive C14N. Satisfies all five
  binding requirements: canonical representation binding,
  algorithm identification, signer identification, chain
  availability, self-description. Co-signatures use the standard
  XPath transform, so third-party XMLDSig verifiers interoperate.

| `/conf/dimension-data`
| Claimed
| The primary signature (threshold quorum or delegated key)
  attests the canonical payload. This is the data dimension.

| `/conf/dimension-person`
| Claimed
| The certified tester credential binds an individual evaluator
  to the Recommendations they are authorized to test, and the
  tester's key co-signs the certificate they worked on.

| `/conf/dimension-time`
| Claimed
| OpenTimestamps anchors the artifact hash to Bitcoin. The time
  dimension is independently established by an external,
  irrefutable source.

| `/conf/dimension-authorization`
| Claimed
| The scope governance model (X.509 v3 extension, four-layer
  enforcement, formal narrowing, scope conditions) attests that
  the signing act was permitted for the named Recommendation.

| `/conf/dimension-location`
| Not claimed
| No location authority co-signature. Not currently required
  for the legal-metrology use case.

| `/conf/dimension-environment`
| Claimed
| The calibration authority co-signs the artifact
  (environment-dimension co-signature), and the calibration
  state is hash-bound into the canonical payload.

| `/conf/dimension-identity`
| Claimed
| The manufacturer model certificate and instance certificate
  attest device genuineness. The firmware hash binds the
  specific hardware/software configuration.

| `/conf/multi-dimensional`
| Claimed
| Data + person + environment (+ time) converge on co-signed
  artifacts. The coverage report records the dimension set; the
  classification policy requires data + time for the top label
  and is extensible to require more.

| `/conf/federated`
| Evaluated
| The BIML root quorum of national member representatives is a
  threshold group of independent organizations. Whether it
  constitutes a federated trust authority under the SIGNATIF
  definition is documented as an evaluation, not a claim; the
  trust-graph machinery admits federation when needed.
|===


## Hierarchy mapping

The legal-metrology authority structure maps onto the SIGNATIF
four-level delegation model.

.Legal-metrology hierarchy mapped to SIGNATIF levels
|===
| Metrology tier | SIGNATIF level | Role | Threshold

| OIML / BIML
| Root trust authority
| Defines the global legal-metrology scope; delegates to Issuing
  Authorities
| 5-of-7 directors

| Issuing Authority
| Delegated trust authority
| Scoped to specific Recommendations; issues type approvals;
  delegates to test laboratories and manufacturers
| 2-of-3 officers

| Test laboratory
| Delegated trust authority
| Signs evaluation reports; threshold-encrypted to the IA
| 1-of-1 (lab key)

| Manufacturer (model)
| Delegated trust authority
| Holds a delegated signing key scoped to a specific instrument
  model
| 1-of-1 (manufacturer key)

| Certified tester
| End certificate
| Individual credential scoped to specific Recommendations;
  signs the evaluations they produced
| 1-of-1 (personal key)

| Instance certificate
| End certificate
| Per-device certificate binding serial, firmware hash,
  calibration data
| 1-of-1 (device key)

| Signed measurement
| Trusted artifact
| Value, timestamp, conditions, calibration state hash, nonce,
  signature
| Primary + co-signatures
|===


## Scope dimensions

CNML uses the following scope dimensions.

.CNML scope dimensions
|===
| Dimension | Values | Narrowed by

| `recommendation`
| OIML Recommendation IDs (`R60`, `R76`, `R117`, etc.)
| Root delegates to IA; IA is scoped to its DoMC scope

| `model`
| Instrument model designation
| IA narrows to the manufacturer's model cert

| `serial`
| Instrument serial number
| Manufacturer model cert narrows to the instance cert

| `tester`
| Certified tester identity
| IA narrows to the individual tester credential
|===

The narrowing invariant is implemented (`narrowed(parent, child)` in
`scope-narrowing.ts`): wildcard ⊇ set ⊇ single across every
dimension, with monotonic conditions (a child carries every parent
condition). The `recommendation` dimension is enforced by the X.509
v3 scope extension OID with four-layer enforcement; `model` and
`serial` narrow through the certificate chain; `tester` narrows
through the tester credential.

Scope conditions are implemented: executable predicates
(`<cnml:scopeCondition id="temp-range">`) in a small safe expression
language (AND-joined comparisons over dotted paths), evaluated at
verification time against the artifact's own content. Unknown values
and type mismatches fail closed.


## Algorithms

CNML recognizes the following algorithms from the SIGNATIF
algorithm registry. The registry is a versioned document published
at the well-known URL `/.well-known/cnml/algorithms.json` and
mirrored in the deployment manifest's `[algorithms]` section, which
also declares the migration phase (classical-only, composite,
post-quantum-only).

.CNML algorithm registry entries
|===
| Algorithm | Family | Status | Notes

| ECDSA P-256
| Classical
| Active
| Baseline algorithm for the current era

| Ed25519
| Classical
| Active
| High-throughput signing; component of composite

| ML-DSA-65
| Post-quantum
| Active
| NIST FIPS 204; component of composite

| Ed25519 + ML-DSA-65
| Composite
| Active
| AND semantics: both components must verify

| SHA-256
| Hash
| Active
| Used for digests, transparency log, OTS anchoring
|===

Verifier enforcement is implemented: active algorithms accept
normally, deprecated downgrades the classification one label,
retired hard-fails.


## Transparency configuration

CNML operates a transparency log with the following
configuration.

.Transparency log configuration
|===
| Property | Value

| Structure
| Append-only Merkle tree (RFC 6962 model)

| Inclusion proofs
| Implemented; leaf hash plus audit path to the signed tree head

| Consistency proofs
| Implemented; RFC 6962 §2.1.4, exhaustive verification across
  all size pairs, cross-language (Ruby log → browser verifier)

| Log head signatures
| Implemented; ECDSA P-256 over the canonical head string,
  verified before trusting proofs against the head

| External time anchoring
| OpenTimestamps to Bitcoin

| Fork detection
| Implemented; the gossip invariant (one root per tree size)

| Mirrors
| Verification-side and publication-side machinery implemented;
  no second mirror deployed

| Multi-log attestation
| Not yet implemented; single log operator
|===


## Deployment manifest

The CNML deployment manifest (confium.toml) declares the
hierarchy, quorums, algorithms, transparency endpoints, and the
algorithm migration phase per the SIGNATIF manifest schema. See the
[deployment manifest specification](deployment-manifest).


## Verification pipeline

The CNML verification pipeline runs nine checks in order: XML
well-formed, schema valid, signature, dimensional co-signatures,
scope, CRL, evaluation report binding, timestamp, and transparency
log inclusion. The pipeline short-circuits on hard failures; soft
checks produce warnings.

The check-to-SIGNATIF-pipeline mapping.

.Check mapping
|===
| CNML check | SIGNATIF check | Classification

| 1. XML well-formed
| Format validity
| Hard

| 2. Schema valid
| Format validity (schema layer)
| Hard

| 3. Signature valid
| Signature validity
| Hard

| 4. Dimensional co-signatures
| Dimensional attestation (multi-dimensional)
| Soft (broken co-signature downgrades to C)

| 5. Issuer authorized
| Scope narrowing + scope conditions
| Hard

| 6. Not revoked
| Revocation status + state-binding propagation
| Hard

| 7. Evaluation report bound
| (CNML-specific; hash-binding to authority state)
| Soft

| 8. Blockchain timestamp
| Time anchor
| Soft

| 9. Transparency log entry
| Transparency inclusion
| Soft
|===

CNML adds one check not in the SIGNATIF baseline: the evaluation
report binding (check 7) binds the certificate to the test
laboratory's signed evaluation report digest. This is a
legal-metrology-specific soft check that instantiates the
SIGNATIF hash-binding model.

The three-stage model is implemented:

1. **Coverage report**: a deterministic function of the artifact,
   the trust anchor bundle, and the verifier's cached state:
   hard/soft check results, all verification paths, dimensional
   coverage, algorithm observations.
2. **Classification policy**: scheme-declared label rules
   (A+ through F): any hard failure is F; hard warnings cap at B;
   soft outcomes downgrade per policy; the top label requires the
   data and time dimensions plus transparency and time anchoring;
   deprecated algorithms downgrade one label, retired hard-fail.
3. **Acceptance policy**: the verifier's own decision layer:
   minimum label, required dimensions, transparency and timestamp
   requirements, freshness window. Default: accept anything not F.


## Dimensional attestation model

CNML artifacts carry the following dimensional attestations.

.Current dimensional attestations
|===
| Dimension | Attestation source | Status

| Data
| Threshold quorum or delegated key signs the certificate
  payload
| Implemented

| Time
| OpenTimestamps anchors the artifact hash to Bitcoin
| Implemented

| Authorization
| Scope extension attests the signing act was permitted for the
  named Recommendation; formal narrowing + scope conditions
| Implemented

| Identity
| Instance certificate attests device genuineness (serial,
  firmware hash, model chain)
| Implemented

| Person
| Certified co-signature on the certificate the tester
  evaluated
| Implemented

| Environment
| Calibration-authority co-signature; calibration state
  bound into the canonical payload
| Implemented
|===

Co-signatures cover the same canonical payload as the primary
signature (the root element minus all Signature and coSignature
nodes, exclusive C14N), via the standard W3C XPath transform. Each
is independently verifiable and carries its dimension in the
wrapper element.


## Revocation propagation

Artifacts hash-bind the authority states they were produced under
(`<cnml:stateBinding>`): calibration, evaluation, compliance. The
binding is part of the canonical payload, so every signer attests
the bound states. When a state is revoked, the log's state index
identifies every artifact bound to that hash, and verification
(check 6) fails any artifact whose binding intersects the revoked
set. Revocation reaches measurements.


## Challenge-response

The device-signer challenge-response protocol is implemented: the
verifier generates a 128-bit nonce; the instrument answers with a
signed measurement carrying that nonce and a fresh timestamp; the
verifier checks nonce equality and the freshness window. The nonce
is inside the canonical payload, so a replayed or static answer
cannot satisfy the challenge.


## Chain discovery

CNML uses the **hybrid chain discovery strategy**: the artifact
embeds the end certificate and the immediate delegation chain,
resolves the root from the trust anchor bundle, and includes
transparency log sequence numbers for freshness and audit. This
is the strategy SIGNATIF recommends for production deployments.

For topologies that admit multiple paths, path enumeration over
the trust-graph DAG is implemented (all paths, root diversity,
strongest path per dimension). For the current hierarchical
topology it yields exactly one path, which is conforming.


## Passport

The CNML passport is a machine-readable public projection of an
instance certificate. It carries the certificate identifier,
device identity, certificate chain summary, Recommendation,
revocation status, and verification URL. It is served as HTML
(human-readable) and JSON-LD (machine-readable), satisfying the
SIGNATIF passport requirements. Its composition with W3C Verifiable
Credentials and the EU Digital Product Passport is specified in
the [composition document](composition).


## Gaps and closure status {#gaps}

The gaps below were recorded against the SIGNATIF normative
requirements and closed by the [conformance plan](signatif-conformance-plan).
The remaining open items are listed last.

### Closed

- **Multi-dimensional co-signatures**: closed. Co-signature slots
  in the artifact format; person (certified tester) and
  environment (calibration authority) dimensions implemented.
- **Coverage report separation**: closed. Deterministic coverage
  report, scheme-declared classification policy, verifier-declared
  acceptance policy.
- **Consistency proofs**: closed. RFC 6962 §2.1.4 in the log and
  the verifier, cross-language tested.
- **Log head signatures**: closed. Signed heads published and
  verified before trusting proofs.
- **Revocation propagation**: closed. Hash-binding to authority
  states; the state index propagates revocation to bound
  artifacts.
- **Algorithm agility registry**: closed. Versioned registry at
  the well-known URL, mirrored in the manifest, enforced by the
  classification policy.
- **Challenge-response**: closed. Nonce generation, freshness
  window, nonce-bound signing.
- **Scope conditions**: closed. Safe expression language,
  evaluated at verification time, fail-closed.
- **Multi-dimensional scope narrowing**: closed. Formal
  narrowing invariant across all dimensions with monotonic
  conditions.
- **Trust graph path-finding**: closed. Path enumeration with
  cycle protection and root diversity.
- **Conformance test suite mapping**: closed. See the
  [test mapping](signatif-test-mapping).
- **W3C VC composition**: closed. See the
  [composition document](composition).
- **EU DPP composition**: closed. See the
  [composition document](composition).

### Federated trust authority evaluation

SIGNATIF defines a federated trust authority as a threshold group of
independent organizations jointly operating a root. The BIML root
quorum (5-of-7 CIML directors, each a national member
representative) satisfies that definition in substance: the signers
are independent organizations, no single signer can produce a
signature, and the ceremony records bind each signing act to its
director. CNML therefore documents the BIML quorum as a de-facto
federated trust authority and does not build a separate federation
construct. Should cross-recognition with another root arrive, the
trust-graph machinery (path enumeration, root diversity) already
admits the multi-root topology, and a formal federation model can be
adopted then.

### Open

- **Mirror operation.** The mirror software and the verifier's
  gossip machinery are complete and tested; `/conf/mirror` is
  claimed when an independent party operates one.
- **Multi-log operation.** The M-of-K policy and quorum evaluation
  are implemented; a second log operator is not yet run.
- **Registry signing.** The ceremony tooling is implemented; the
  published registry is signed when the scheme operator runs it.
- **Location dimension.** Not required for the legal-metrology use
  case; the co-signature format supports it if needed.


## References

- SIGNATIF framework (ISO/TC 154 working draft), source at
  `cc-signatif/spec/signatif-standard/`
- SIGNATIF website: https://signatif.github.io
- CNML format specification: [cnml-format-spec](cnml-format-spec)
- CNML XMLDSig profile: [xmldsig-profile](xmldsig-profile)
- CNML scope extension OID: [scope-extension-oid](scope-extension-oid)
- CNML deployment manifest: [deployment-manifest](deployment-manifest)
- SIGNATIF conformance plan: [signatif-conformance-plan](signatif-conformance-plan)
- SIGNATIF test mapping: [signatif-test-mapping](signatif-test-mapping)
- Interoperability composition: [composition](composition)
