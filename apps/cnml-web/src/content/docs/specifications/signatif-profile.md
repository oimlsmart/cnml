---
title: CNML profile of SIGNATIF
description: The conformance claims, hierarchy mapping, and gap analysis of CNML as a domain profile of the SIGNATIF trust infrastructure framework.
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


## Profile identifier

This profile is identified as `/profile/cnml-legal-metrology`.


## Conformance claims

CNML claims the following SIGNATIF conformance classes.

.Claimed conformance classes
|===
| Class | Status | Notes

| `/conf/basic-verifier`
| Claimed
| The 7-check pipeline validates format, signature, chain, scope,
  and revocation. Runs offline in the browser.

| `/conf/full-verifier`
| Partially claimed
| Transparency inclusion and time anchoring are implemented.
  Coverage report and classification are present but not yet
  separated into the SIGNATIF three-stage model (see
  [gap list](#gaps)).

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
| Append-only Merkle log, inclusion proof issuance, OTS time
  anchoring. The TransparencyPublisher implements these.

| `/conf/mirror`
| Not claimed
| Log mirroring and gossip are not yet implemented. Planned.

| `/conf/device-signer`
| Partially claimed
| Per-device key lifecycle and artifact signing are implemented
  (instance cert, signed measurement). Challenge-response is
  deferred to the SMI project but is normative in SIGNATIF (see
  [gap list](#gaps)).

| `/conf/hierarchical`
| Claimed
| Single root (OIML/BIML), strict tree topology. No federation,
  no cross-recognition, no mesh.

| `/conf/format-xmldsig`
| Claimed
| W3C XML Signature 1.1 with Exclusive C14N. Satisfies all five
  binding requirements: canonical representation binding,
  algorithm identification, signer identification, chain
  availability, self-description.

| `/conf/dimension-data`
| Claimed
| The primary signature (threshold quorum or delegated key)
  attests the canonical payload. This is the data dimension.

| `/conf/dimension-person`
| Partially claimed
| The certified tester credential binds an individual evaluator
  to the Recommendation they are authorized to test. Operator
  co-signature on measurements is specified but lives in the
  SMI project.

| `/conf/dimension-time`
| Claimed
| OpenTimestamps anchors the artifact hash to Bitcoin. The time
  dimension is independently established by an external,
  irrefutable source.

| `/conf/dimension-authorization`
| Claimed
| The scope governance model (X.509 v3 extension, four-layer
  enforcement) attests that the signing act was permitted for
  the named Recommendation.

| `/conf/dimension-location`
| Not claimed
| No location authority co-signature. Not currently required
  for the legal-metrology use case.

| `/conf/dimension-environment`
| Not claimed
| No sensor co-signature. The D 11 environmental test results
  are in the certificate payload but are not independently
  signed as a separate trust dimension. Candidate for the
  calibration-state dimension (see [gap list](#gaps)).

| `/conf/dimension-identity`
| Claimed
| The manufacturer model certificate and instance certificate
  attest device genuineness. The firmware hash binds the
  specific hardware/software configuration.

| `/conf/multi-dimensional`
| Not yet claimed
| Requires convergence of three or more independent trust
  dimensions on a single artifact. CNML currently has two
  (data + time). Adding the person dimension (operator
  co-signature) would qualify (see [gap list](#gaps)).
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
  signs evaluation work
| 1-of-1 (personal key)

| Instance certificate
| End certificate
| Per-device certificate binding serial, firmware hash,
  calibration data
| 1-of-1 (device key)

| Signed measurement
| Trusted artifact
| Value, timestamp, conditions, calibration state hash, signature
| Primary + planned co-signatures
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

The `recommendation` dimension is enforced by the X.509 v3 scope
extension OID with four-layer enforcement (CA signing, cert
embedding, verification pipeline, transparency log). The `model`
and `serial` dimensions narrow through the certificate chain
(model cert to instance cert). The `tester` dimension narrows
through the tester credential.

**Gap: CNML's scope is primarily one-dimensional** (recommendation).
The SIGNATIF multi-dimensional narrowing algorithm (wildcard, set,
single, conditions) is not yet implemented. The model and serial
dimensions exist structurally but are not enforced by a formal
narrowing invariant. Scope conditions (executable predicates
evaluated at verification time) are not implemented.


## Algorithms

CNML recognizes the following algorithms from the SIGNATIF
algorithm registry.

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

**Gap: no algorithm agility registry or deprecation process.**
CNML does not declare algorithm statuses (active, deprecated,
retired) in a registry, does not publish deprecation timelines,
and does not declare the migration phase in the deployment
manifest.


## Transparency configuration

CNML operates a transparency log with the following
configuration.

.Transparency log configuration
|===
| Property | Value

| Structure
| Append-only Merkle tree (RFC 6962 model)

| Inclusion proofs
| Implemented; leaf hash plus audit path to signed tree head

| Consistency proofs
| Not yet implemented (see [gap list](#gaps))

| Log head signatures
| Not yet implemented (see [gap list](#gaps))

| External time anchoring
| OpenTimestamps to Bitcoin

| Gossip
| Not yet implemented (see [gap list](#gaps))

| Mirrors
| Not yet implemented

| Multi-log attestation
| Not yet implemented; single log operator
|===


## Deployment manifest

The CNML deployment manifest (confium.toml) declares the
hierarchy, quorums, algorithms, and transparency endpoints per
the SIGNATIF manifest schema. See the
[deployment manifest specification](deployment-manifest).

**Gap: the manifest does not declare the classification policy**
or the migration phase (classical-only, composite,
post-quantum-only).


## Verification pipeline

The CNML verification pipeline runs seven checks in order:
XML well-formed, schema valid, signature, scope, CRL, evaluation
report binding, timestamp, and transparency log inclusion. The
pipeline short-circuits on hard failures; soft checks produce
warnings.

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

| 4. Issuer authorized
| Scope narrowing + scope conditions
| Hard

| 5. Not revoked
| Revocation status
| Hard

| 6. Evaluation report bound
| (CNML-specific; hash-binding to authority state)
| Soft

| 7. Blockchain timestamp
| Time anchor
| Soft

| 8. Transparency log entry
| Transparency inclusion
| Soft
|===

CNML adds one check not in the SIGNATIF baseline: the evaluation
report binding (check 6) binds the certificate to the test
laboratory's signed evaluation report digest. This is a
legal-metrology-specific soft check that anticipates the
SIGNATIF hash-binding model.

The trust grade computation (A+ through F) maps the check
results to a classification label.

**Gap: CNML conflates coverage report, classification policy,
and acceptance policy.** The check results are the coverage
report; the trust grade is the classification label; the
verifier's decision is the acceptance policy. These three are
not yet cleanly separated into the SIGNATIF three-stage model
where the coverage report is a deterministic function of the
artifact and path set, the classification policy is declared by
the scheme, and the acceptance policy is set by the verifier.


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
  named Recommendation
| Implemented

| Identity
| Instance certificate attests device genuineness (serial,
  firmware hash, model chain)
| Implemented

| Person
| Certified tester credential binds the evaluator to their work
  (type-approval tier); operator co-signature on measurements
  (measurement tier, lives in SMI project)
| Partially implemented

| Environment
| Calibration state hash embedded in the signed measurement
| Specified, not fully implemented as an independent dimension
|===

**Gap: no multi-dimensional convergence.** The `/conf/multi-dimensional`
profile requires at least three independent dimension attestations
from different trust dimensions on a single artifact. CNML
currently achieves two (data + time) on type-approval certificates.
Adding the person dimension (operator co-signature) or promoting
the environment dimension (calibration state as a signed
co-signature rather than an embedded hash) would qualify.


## Chain discovery

CNML uses the **hybrid chain discovery strategy**: the artifact
embeds the end certificate and the immediate delegation chain,
resolves the root from the trust anchor bundle, and includes
transparency log sequence numbers for freshness and audit. This
is the strategy SIGNATIF recommends for production deployments.


## Passport

The CNML passport is a machine-readable public projection of an
instance certificate. It carries the certificate identifier,
device identity, certificate chain summary, Recommendation,
revocation status, and verification URL. It is served as HTML
(human-readable) and JSON-LD (machine-readable), satisfying the
SIGNATIF passport requirements.


## Gaps and closure status {#gaps}

The following gaps exist between CNML's current implementation
and the SIGNATIF normative requirements. Gaps are ordered by
impact on conformance. The phased schedule for closing them is
the [conformance plan](signatif-conformance-plan).

### Structural gaps

.Multi-dimensional co-signatures.
SIGNATIF's "Sealed" property requires independent co-signatures,
one per trust dimension. CNML has the primary signature and the
time anchor but does not support co-signatures from independent
signers on the same canonical payload. **Closure: implement
co-signature slots in the artifact format; add the person
dimension (operator co-signature) and the environment dimension
(calibration-state co-signature).**

.Trust graph path-finding.
SIGNATIF generalizes the chain to a DAG with multiple valid
paths. CNML walks a single linear chain. **Closure: implement
path enumeration when the trust graph admits multiple paths.
For the current hierarchical topology, linear chain walking is
sufficient and conforming.**

.Coverage report separation.
SIGNATIF separates coverage report (objective facts),
classification policy (scheme-defined), and acceptance policy
(verifier-defined). CNML conflates these in the check pipeline
and trust grade. **Closure: define the coverage report as a
deterministic JSON structure; declare the classification policy
in the deployment manifest; expose the acceptance policy as
verifier configuration.**

### Feature gaps

.Consistency proofs.
The transparency log cannot prove it is append-only between two
tree heads. **Closure: implement RFC 6962 consistency proofs in
the TransparencyPublisher and the verification check.**

.Log head signatures.
The tree head is published but not signed by the log operator.
**Closure: sign each tree head with the log operator key;
verify in the transparency check.**

.Gossip protocol.
No gossip between mirror operators. **Closure: implement the
gossip protocol when mirrors exist. Depends on `/conf/mirror`.**

.Multi-log attestation.
Single log operator; no M-of-K model. **Closure: declare
multi-log policy in the deployment manifest when multiple log
operators exist.**

.Revocation propagation.
Revocation checks the CRL but does not propagate to hash-bound
measurements. **Closure: implement hash-binding to authority
states in the artifact format; implement the propagation query
against the transparency log index.**

.Algorithm agility registry.
No registry of algorithm statuses, no deprecation process.
**Closure: publish the algorithm registry; declare the migration
phase in the deployment manifest; implement deprecation
timelines.**

.Challenge-response.
Normative for `/conf/device-signer` in SIGNATIF. Deferred to
the SMI project in CNML (ADR-0006). **Closure: implement the
challenge-response protocol (nonce generation, freshness window,
nonce-bound artifact signing) or claim an explicit exception.**

.Scope conditions.
No executable predicates evaluated at verification time.
**Closure: define the scope condition language; embed conditions
in the scope extension; evaluate in check 4.**

.Multi-dimensional scope narrowing.
The `recommendation` dimension has a narrowing invariant but it
is not formalized per the SIGNATIF algorithm (wildcard, set,
single, conditions). **Closure: implement the formal narrowing
algorithm across all scope dimensions.**

### Documentation gaps

.Conformance test suite.
SIGNATIF requires passing the abstract test suite for claimed
conformance classes. **Closure: map CNML's existing test vectors
and unit tests to the SIGNATIF abstract test suite; publish the
mapping.**

.W3C VC composition.
SIGNATIF Annex G describes composition with W3C Verifiable
Credentials. **Closure: document how a CNML certificate can be
expressed as a VC payload with the SIGNATIF dimensions as
co-signatures.**

.EU DPP composition.
SIGNATIF Annex H describes composition with the EU Digital
Product Passport. The CNML passport is structurally similar to
a DPP data carrier. **Closure: document the mapping between
the CNML passport and the DPP data carrier requirements.**

.Federated trust authority.
CNML does not clearly support SIGNATIF's federated trust
authority model (threshold groups of independent organizations).
**Closure: document whether the BIML root quorum of national
representatives constitutes a federated trust authority, or
whether a formal federation model is needed.**


## Composition with W3C Verifiable Credentials

This section is informative. It describes how a CNML certificate
composes with W3C Verifiable Credentials per SIGNATIF Annex G.

A CNML type-approval certificate is the payload of a Verifiable
Credential. The CNML signature (threshold or delegated) is the
VC proof. The SIGNATIF dimensional co-signatures (when
implemented) would add independent attestations on the same
content. The VC credentialSubject is the measuring instrument
type (model designation, manufacturer, Recommendation).

A CNML instance certificate is similarly expressible as a VC
about a specific instrument instance (serial number, firmware
hash, manufacturing date).

The CNML passport JSON-LD is already structurally close to a VC:
it has an `@context`, a `@type`, and subject identification.
Adding a `proof` field with the CNML signature would produce a
valid VC.


## Composition with the EU Digital Product Passport

This section is informative. It describes how CNML composes with
the EU Digital Product Passport per SIGNATIF Annex H.

The CNML QR code on the instrument body is a DPP data carrier:
it is self-contained, carries error correction, and includes a
version identifier. The CNML passport endpoint is the connected
resolution path. The transparency log satisfies the registry
function (with the multi-log model providing the decentralized
registry property).

The unique product identifier maps to the instance certificate
ID. Successive certificate versions (renewal, re-issue) follow
the version compatibility rules. The manufacturer is the
economic operator (delegated trust authority). The IA is the
market surveillance authority's verification reference.


## References

- SIGNATIF framework (ISO/TC 154 working draft), source at
  `cc-signatif/spec/signatif-standard/`
- SIGNATIF website: https://signatif.github.io
- CNML format specification: [cnml-format-spec](cnml-format-spec)
- CNML XMLDSig profile: [xmldsig-profile](xmldsig-profile)
- CNML scope extension OID: [scope-extension-oid](scope-extension-oid)
- CNML deployment manifest: [deployment-manifest](deployment-manifest)
- SIGNATIF conformance plan: [signatif-conformance-plan](signatif-conformance-plan)
