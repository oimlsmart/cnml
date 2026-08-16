---
title: SIGNATIF conformance plan
description: The phased implementation plan for full SIGNATIF framework conformance across coverage reports, co-signatures, transparency integrity, and scope enhancements.
---

# Plan: Full SIGNATIF conformance for CNML

**Status (2026-08-16): phases 1 through 10 are implemented.** The
record of what each phase delivered and the tests that pin it is the
[test mapping](signatif-test-mapping); the resulting conformance
claims are the [profile](signatif-profile). This document stands as
the design record.

## Goal state

CNML claims every SIGNATIF conformance class that applies to legal
metrology, closes every structural and feature gap, and uses
SIGNATIF's benefits: graduated trust, multi-dimensional
verification, cross-scheme interoperability, and orderly
post-quantum migration.

.Target conformance classes after this plan
|===
| Class | Current | After | What changes

| `/conf/full-verifier`
| Partial
| Claimed
| Coverage report, classification policy, acceptance policy
  separated into the SIGNATIF three-stage model

| `/conf/mirror`
| Not claimed
| Claimed
| Gossip protocol, mirror replication, inclusion proof serving

| `/conf/device-signer`
| Partial
| Claimed
| Challenge-response implemented (nonce, freshness, bound
  signing)

| `/conf/dimension-person`
| Partial
| Claimed
| Certified tester co-signature on type approvals; operator
  co-signature on measurements

| `/conf/dimension-environment`
| Not claimed
| Claimed
| Calibration state as an independent co-signed dimension

| `/conf/multi-dimensional`
| Not claimed
| Claimed
| Data + person + time + environment converge on signed
  measurements (4 dimensions, minimum is 3)

| `/conf/federated`
| Not claimed
| Evaluated
| Document whether BIML's quorum of national representatives
  constitutes a federated TA; if not, design the federation
|===


## Phase 1: Coverage report, classification, acceptance (foundation)

*Implemented. Delivered: checks/coverage.ts, checks/classification.ts, checks/acceptance.ts, verifyArtifact() in checks/index.ts; trust_grade.ts now delegates to the shared classification engine.*

Everything else reports into this. Build it first.

### 1.1 Define the CoverageReport type

Add to `packages/cnml-crypto/src/checks/`:

```typescript
// coverage.ts
export interface CoverageReport {
  /** Deterministic identifier for this verification run. */
  artifact_id: string;
  /** When the verification was performed. */
  verification_time: string;
  /** Hard check results. Any fail = overall fail. */
  hard_checks: HardCheckResult[];
  /** Soft check results. Populate coverage but don't fail. */
  soft_checks: SoftCheckResult[];
  /** All valid verification paths from artifact to root anchors. */
  paths: VerificationPath[];
  /** Dimensional coverage: which trust dimensions are attested. */
  dimensions: DimensionCoverage[];
}

export interface HardCheckResult {
  check_id: string;
  status: "pass" | "fail";
  reason?: string;
}

export interface SoftCheckResult {
  check_id: string;
  status: "pass" | "fail" | "warn" | "skip";
  reason?: string;
}

export interface VerificationPath {
  /** Fingerprint of the root anchor this path terminates at. */
  root_anchor_fingerprint: string;
  /** Number of delegation links in the path. */
  path_length: number;
  /** Which dimensions this path validates. */
  dimensions: string[];
}

export interface DimensionCoverage {
  /** The trust dimension (data, person, time, location, ...). */
  dimension: string;
  /** Fingerprint of the signer's key or certificate. */
  source_fingerprint: string;
  /** Whether the dimension's signature verified. */
  verified: boolean;
}
```

The coverage report is a **deterministic function** of the
artifact, the trust anchor bundle, and the verifier's cached
state. Two conforming verifiers with the same inputs produce
identical coverage reports.

### 1.2 Define the ClassificationPolicy

The classification policy maps a coverage report to a label. It
is declared in the deployment manifest (scheme-defined, not
verifier-defined):

```toml
# confium.toml
[classification]
labels = ["A+", "A", "B", "C", "F"]

[classification.A-plus]
all_hard_pass = true
required_dimensions = ["data", "time"]
requires_transparency = true
requires_timestamp = true

[classification.A]
all_hard_pass = true
required_dimensions = ["data"]

[classification.B]
all_hard_pass = true
# no additional requirements

[classification.C]
any_soft_fail = true

[classification.F]
any_hard_fail = true
```

### 1.3 Define the AcceptancePolicy

The acceptance policy is the verifier's own decision layer. It
maps a classification label to accept/reject:

```typescript
// acceptance.ts
export interface AcceptancePolicy {
  /** Minimum classification label to accept. */
  minimum_label: string;
  /** Whether transparency inclusion is required (overrides classification). */
  require_transparency: boolean;
  /** Maximum age of the verification state (for freshness). */
  freshness_window_ms: number;
  /** Additional dimensions the verifier demands beyond the classification. */
  required_dimensions: string[];
}

export function evaluate(
  report: CoverageReport,
  classification: ClassificationResult,
  policy: AcceptancePolicy,
): AcceptanceResult {
  // ...
}
```

### 1.4 Refactor the pipeline

Current signature:
```typescript
runChecks(xml, ctx): CheckResult[]
computeTrustGrade(results): TrustGradeResult
```

New signature:
```typescript
verifyArtifact(xml, ctx): {
  coverage: CoverageReport;
  classification: ClassificationResult;
  acceptance: AcceptanceResult;  // uses the verifier's policy
}
```

The existing `runChecks` becomes the internal check engine. The
existing `computeTrustGrade` becomes the default classification
policy (backward compatible). The `AcceptancePolicy` defaults to
"accept anything not F".

**Files to create:** `checks/coverage.ts`, `checks/classification.ts`,
`checks/acceptance.ts`
**Files to modify:** `checks/index.ts` (add `verifyArtifact`),
`trust_grade.ts` (adapt to classification policy interface)
**Tests:** coverage report determinism, classification mapping,
acceptance policy evaluation

**Delivers:** Graduated trust with clean separation. CNML's
verification output becomes a structured, interoperable coverage
report rather than a list of check results.


## Phase 2: Multi-dimensional co-signatures (the "S" in SIGNATIF)

*Implemented. Delivered: xml/cosign.ts (standard XPath-transform co-signatures), checks/dimensions.ts, the CoSignatureType XSD element.*

### 2.1 Add co-signature slots to the XML format

The CNML XML gains a co-signature wrapper:

```xml
<cnml:certificatNumeriqueMetrologieLegale>
  <!-- payload -->
  <ds:Signature Id="cnml-primary">...</ds:Signature>
  <cnml:coSignature dimension="person">
    <ds:Signature Id="cnml-cosig-person">...</ds:Signature>
  </cnml:coSignature>
  <cnml:coSignature dimension="environment">
    <ds:Signature Id="cnml-cosig-environment">...</ds:Signature>
  </cnml:coSignature>
</cnml:certificatNumeriqueMetrologieLegale>
```

Each co-signature:
- Covers the **same canonical payload** (the root element minus
  all Signature blocks, canonicalized with Exclusive C14N)
- Is from a **different signer** with its own delegation chain
- Carries a `dimension` attribute identifying the trust dimension
- Is independently verifiable

### 2.2 Dimension signers for legal metrology

For a **type-approval certificate**:
- **data** (primary): IA threshold signature (existing)
- **person**: certified tester's personal key co-signs
- **time**: OTS anchoring (existing, becomes a dimension)
- **authorization**: scope extension (existing, becomes a dimension)

For a **signed measurement** (SMI layer, consuming CNML's format):
- **data** (primary): instrument's attested key
- **person**: operator's hardware token co-signs
- **time**: OTS anchoring
- **environment**: calibration-state authority co-signs
- **identity**: instance cert chain (existing)

### 2.3 Signing API

```typescript
// co-sign.ts
export interface CosignerSpec {
  dimension: string;
  privateKey: CryptoKey;
  certPem?: string;
}

export async function signCnmlXmlWithCosignatures(
  xml: string,
  primary: { privateKey: CryptoKey; certPem?: string },
  cosigners: CosignerSpec[],
): Promise<string>;
```

### 2.4 Verification API

The verification pipeline enumerates all co-signatures:

```typescript
// In the signature check:
// 1. Find the primary Signature
// 2. Find all cnml:coSignature wrappers
// 3. Verify each signature against its own chain
// 4. Record each in ctx.dimensions
```

The coverage report's `dimensions` field is populated from the
verified co-signatures. The classification policy checks whether
the required dimensions are present and verified.

### 2.5 Certified tester credential

The IA issues a tester credential: an X.509 cert with:
- Subject: the tester's name
- Scope extension: the Recommendations they are certified for
- Validity period tied to their certification

The tester's key co-signs the certificate they worked on:

```typescript
await signCnmlXmlWithCosignatures(xml, iaSigner, [
  {
    dimension: "person",
    privateKey: testerPrivateKey,
    certPem: testerCredentialPem,
  },
]);
```

**Files to create:** `xml/cosign.ts` (signing),
`checks/dimensions.ts` (verification of co-signatures)
**Files to modify:** `xml/sign.ts` (canonical payload for
co-signatures), `checks/index.ts` (add dimension check),
`packages/cnml-schemas/src/schemas/_core.yaml` (co-signature
element)
**Tests:** co-sign round-trip, co-sign tamper detection,
multi-dimension coverage

**Delivers:** The "Sealed" property. Independent attestations
converge on the same payload. Individual accountability (who
signed what). Qualifies for `/conf/multi-dimensional`.


## Phase 3: Transparency integrity

*Implemented. Delivered: Ruby: consistency_proof/verify_consistency + signed heads + consistency/ publication. TS: transparency-consistency.ts (verifyConsistency, verifySignedHead, detectFork) with a cross-language fixture.*

### 3.1 Consistency proofs

Add to `MerkleTree` (Ruby) and the TS verifier:

```ruby
# transparency_publisher.rb
def consistency_proof(old_size, new_size)
  # RFC 6962 consistency proof: the audit path of intermediate
  # hashes connecting tree heads at old_size and new_size
end
```

```typescript
// checks/transparency.ts
export function verifyConsistency(
  oldHead: TreeHead,
  newHead: TreeHead,
  proof: ConsistencyProof,
): boolean;
```

A verifier that has seen tree head N can verify that tree head
M > N is a valid extension (no entries removed or modified).

### 3.2 Log head signatures

The log operator signs each tree head:

```ruby
# On each log append:
signed_head = {
  tree_size: tree.length,
  root_hash: tree.root,
  timestamp: Time.now.utc.iso8601,
  signature: sign(root_hash + tree_size + timestamp, operator_key)
}
```

The verifier checks the tree head signature before trusting an
inclusion proof against that head.

### 3.3 Mirror and gossip (when mirrors exist)

Mirrors replicate the log and serve inclusion proofs. The gossip
protocol exchanges signed tree heads between mirrors. A fork
(two different signed heads at the same tree size) is evidence
of misbehavior.

**Delivers:** Verifiable log integrity. Detection of log
rewriting. Foundation for `/conf/mirror`.


## Phase 4: Revocation propagation

*Implemented. Delivered: xml/state-binding.ts, revocation.ts (state index + propagation), the CRL check extension, the StateBindingType XSD element.*

### 4.1 Hash-binding to authority states

Add to the artifact format:

```xml
<cnml:stateBinding>
  <cnml:boundState type="calibration" hash="sha256:..." />
  <cnml:boundState type="evaluation" hash="sha256:..." />
  <cnml:boundState type="compliance" hash="sha256:..." />
</cnml:stateBinding>
```

The state binding is part of the canonical payload. All signers
(primary and co-signers) attest the bound states.

### 4.2 Propagation algorithm

When a state is revoked:

1. Identify the revoked state by hash
2. Query the transparency log index for artifacts whose state
   binding includes that hash
3. Flag each affected artifact as bound-to-revoked
4. Propagate through co-signatures: if any co-signer's state is
   revoked, the artifact is flagged

### 4.3 Verification extension

Check 5 (Not revoked) extends:

```typescript
// Current: check the cert's CRL status
// New: also check the artifact's state bindings against the
// revocation index
```

**Delivers:** Revocation reaches measurements. A revoked
calibration or a revoked evaluation flags every measurement
produced under it.


## Phase 5: Algorithm agility

*Implemented. Delivered: algorithms.ts + the published /.well-known/cnml/algorithms.json, the [algorithms] manifest section (TS + Ruby), SignatureMethod-to-status wiring with classification enforcement.*

### 5.1 Algorithm registry

Publish as a signed, versioned document (served from a well-known
URL, mirrored in the deployment manifest):

```json
{
  "version": 1,
  "algorithms": [
    {
      "id": "ecdsa-p256",
      "family": "classical",
      "status": "active",
      "reference": "FIPS 186-4"
    },
    {
      "id": "ed25519",
      "family": "classical",
      "status": "active",
      "reference": "RFC 8032"
    },
    {
      "id": "ml-dsa-65",
      "family": "post-quantum",
      "status": "active",
      "reference": "FIPS 204"
    },
    {
      "id": "composite-ed25519-ml-dsa-65",
      "family": "composite",
      "status": "active"
    }
  ]
}
```

### 5.2 Migration phase in the manifest

```toml
[algorithms]
phase = "composite"
active = ["ecdsa-p256", "ed25519", "ml-dsa-65", "composite-ed25519-ml-dsa-65"]
```

### 5.3 Verifier enforcement

The verifier checks the artifact's algorithm identifier against
the registry:
- Active: accept normally
- Deprecated: downgrade one classification level
- Retired: hard fail

**Delivers:** Orderly post-quantum migration. Verifiers can
enforce deprecation timelines.


## Phase 6: Scope enhancements

*Implemented. Delivered: scope-narrowing.ts (the narrowing invariant + the safe condition language), the scope check evaluating conditions against artifact content.*

### 6.1 Formal narrowing algorithm

Implement the SIGNATIF narrowing algorithm across all scope
dimensions:

```typescript
// scope.ts
export type ScopeValue = string | string[] | "*";

export interface Scope {
  recommendation?: ScopeValue;
  model?: ScopeValue;
  serial?: ScopeValue;
  tester?: ScopeValue;
  conditions?: ScopeCondition[];
}

export function narrowed(parent: Scope, child: Scope): boolean {
  for (const dim of new Set([...Object.keys(parent), ...Object.keys(child)])) {
    const p = parent[dim] ?? "*";
    const c = child[dim] ?? "*";
    if (p === "*") continue;
    if (c === "*") return false;
    if (typeof p === "string" && typeof c === "string") {
      if (p !== c) return false;
    } else if (Array.isArray(p) && typeof c === "string") {
      if (!p.includes(c)) return false;
    } else if (Array.isArray(p) && Array.isArray(c)) {
      if (!c.every((v) => p.includes(v))) return false;
    }
  }
  const pc = parent.conditions ?? [];
  const cc = child.conditions ?? [];
  if (!pc.every((cond) => cc.some((c) => c.id === cond.id))) return false;
  return true;
}
```

### 6.2 Scope conditions

A small, safe expression language for executable predicates:

```xml
<cnml:scopeCondition id="temp-range">
  measurement.temperature >= -10 AND measurement.temperature <= 40
</cnml:scopeCondition>
```

Evaluated at verification time against the artifact content.
Conditions are monotonic: child conditions must be a superset of
parent conditions.

**Delivers:** Provable scope enforcement. Live conditions bind
signing authority to the artifact's actual content.


## Phase 7: Challenge-response

*Implemented. Delivered: challenge.ts (nonce generation, nonce embedding, freshness-window verification).*

### 7.1 Challenge generation (verifier side)

```typescript
export function generateChallenge(): Uint8Array {
  const nonce = new Uint8Array(16); // 128 bits per SIGNATIF
  crypto.getRandomValues(nonce);
  return nonce;
}
```

### 7.2 Nonce-bound signing (instrument side)

The instrument signs a fresh measurement that includes the nonce:

```xml
<cnml:signedMeasurement>
  <cnml:value>42.5</cnml:value>
  <cnml:unit>u-kilogram</cnml:unit>
  <cnml:nonce>a3f8e2...</cnml:nonce>
  <cnml:timestamp>2026-08-16T12:00:00Z</cnml:timestamp>
  <ds:Signature>...</ds:Signature>
</cnml:signedMeasurement>
```

### 7.3 Freshness window (verifier side)

```typescript
export interface ChallengePolicy {
  /** Max age of the response (e.g., 30_000 ms). */
  freshness_window_ms: number;
}
```

**Delivers:** Counterfeit detection. A static copy of a prior
measurement cannot satisfy the nonce challenge.


## Phase 8: Trust graph path-finding

*Implemented. Delivered: trust-graph.ts (findAllPaths over the delegation DAG, root diversity, strongest path per dimension).*

For the current hierarchical topology, linear chain walking is
conforming. But the infrastructure should support DAGs when
cross-recognition or federation arrives.

### 8.1 Generalize to path enumeration

```typescript
export function findAllPaths(
  artifact: TrustedArtifact,
  anchors: TrustAnchorBundle,
): VerificationPath[] {
  const paths: VerificationPath[] = [];
  for (const sig of artifact.signatures) {
    extendPath([sig], paths, anchors);
  }
  return paths;
}

function extendPath(
  path: SignatureChainLink[],
  paths: VerificationPath[],
  anchors: TrustAnchorBundle,
): void {
  const tail = path[path.length - 1];
  const anchor = anchors.findByFingerprint(tail.issuerFingerprint);
  if (anchor) {
    paths.push({
      root_anchor_fingerprint: anchor.fingerprint,
      path_length: path.length,
      dimensions: path.map((l) => l.dimension).filter(Boolean),
    });
    return;
  }
  for (const parent of tail.issuerParents) {
    if (validateLink(tail, parent) && !path.includes(parent)) {
      extendPath([...path, parent], paths, anchors);
    }
  }
}
```

### 8.2 Coverage report includes all paths

The coverage report records all valid paths, the root diversity
(distinct independent roots), and the strongest path per dimension.

**Delivers:** Future-proofing for cross-recognition and
federation. The coverage report naturally captures multi-path
verification.


## Phase 9: Conformance test suite mapping

*Implemented. Delivered: the [test mapping](signatif-test-mapping) document.*

### 9.1 Map existing tests to SIGNATIF abstract test suite

| SIGNATIF class | CNML test coverage |
|---|---|
| `/conf/basic-verifier` | 127 crypto tests + 67 e2e tests |
| `/conf/full-verifier` | 25 audit tests + trust_grade tests |
| `/conf/issuing-authority` | 186 Ruby RSpec tests |
| `/conf/root-authority` | ceremony_transcript_spec.rb + deployment_manifest_spec.rb |
| `/conf/transparency-operator` | transparency_publisher_spec.rb |
| `/conf/device-signer` | sign-verify round-trip tests |

### 9.2 Publish the mapping

A document showing which SIGNATIF requirement maps to which CNML
test, with pass/fail status.

**Delivers:** Demonstrable conformance for ISO review.


## Phase 10: Composition documents

*Implemented. Delivered: the [interoperability composition](composition) document.*

### 10.1 W3C VC composition

Document how to express a CNML certificate as a Verifiable
Credential: the CNML payload is the credentialSubject, the
threshold signature is the proof, the co-signatures are additional
proofs with their dimensions.

### 10.2 EU DPP composition

Document how the CNML passport satisfies the DPP data carrier
requirements: the QR code is the carrier, the passport endpoint
is the resolution, the transparency log is the registry.

**Delivers:** Interoperability positioning for EU regulatory
contexts.


## Dependency graph

```
Phase 1 (coverage report)
  ├── Phase 2 (co-signatures report dimensions into coverage)
  │     └── Phase 7 (challenge-response uses co-signature format)
  ├── Phase 3 (transparency populates soft checks in coverage)
  │     └── Phase 3.3 (gossip needs mirrors)
  ├── Phase 4 (revocation propagation reports into coverage)
  ├── Phase 5 (algorithm agility affects classification)
  └── Phase 6 (scope conditions are hard checks in coverage)

Phase 8 (trust graph): independent, low priority for hierarchical
Phase 9 (test mapping): after all phases
Phase 10 (composition docs): independent
```

## Build order

Build phases 1 and 2 together (they are the core). Then 3, 4, 5
in parallel. Then 6, 7. Phase 8 is optional. Phases 9 and 10 are
documentation.

.Phase priority and effort
|===
| Phase | What | Effort | Priority

| 1
| Coverage report + classification + acceptance
| 2 weeks
| Critical (foundation)

| 2
| Multi-dimensional co-signatures
| 3 weeks
| Critical (core SIGNATIF value)

| 3
| Consistency proofs + log head sigs
| 2 weeks
| High (transparency integrity)

| 4
| Revocation propagation
| 2 weeks
| High (measurement trust)

| 5
| Algorithm agility
| 1 week
| Medium (PQ governance)

| 6
| Scope conditions + narrowing
| 2 weeks
| Medium (formal enforcement)

| 7
| Challenge-response
| 1 week
| Medium (counterfeit detection)

| 8
| Trust graph path-finding
| 2 weeks
| Low (hierarchical is conforming)

| 9
| Test suite mapping
| 1 week
| Required for ISO submission

| 10
| VC + DPP composition docs
| 1 week
| Positioning
|===

Total: approximately 17 weeks for full conformance. Phases 1+2
(5 weeks) deliver the core SIGNATIF benefits.


## What full conformance buys CNML

**Interoperability.** Any SIGNATIF-conforming verifier can verify
CNML artifacts. A verifier built for the supply-chain profile
can verify a CNML certificate by running the same pipeline with
the CNML classification policy.

**Graduated trust.** A market-surveillance officer sees a
coverage report showing exactly what was verified and what
wasn't, mapped to a grade they can set policy on. Not binary
valid/invalid.

**Individual accountability.** The person dimension means every
evaluation and every measurement is attributable to a specific
human who signed it.

**Revocation that reaches measurements.** A revoked calibration
flags every measurement produced under it. No more "the cert
was revoked but the readings are still being accepted."

**Counterfeit detection.** Challenge-response means a physical
inspection can prove the instrument is genuine, not just that
its paperwork exists.

**Orderly post-quantum migration.** The algorithm agility
framework gives verifiers a governance mechanism for the
transition from classical to post-quantum signatures.

**Regulatory positioning.** EU DPP composition positions CNML
for the European market. W3C VC composition positions it for
the verifiable-credentials ecosystem. ISO/TC 154 alignment
positions it for international standardization.
