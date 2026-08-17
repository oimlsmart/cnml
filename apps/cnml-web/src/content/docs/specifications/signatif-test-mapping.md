---
title: SIGNATIF conformance test mapping
description: The mapping from CNML test suites to the SIGNATIF abstract test suite, with the requirement each test group exercises.
---

# Conformance test mapping

This document maps CNML's test suites to the SIGNATIF abstract test
suite: which test exercises which conformance requirement, for every
conformance class CNML claims. It is the demonstrable-conformance
record for standards review.

Suite totals at publication:

| Suite | Command | Tests |
|---|---|---|
| Crypto (checks, XML, keys, trust) | `pnpm test:crypto` | 249 |
| Integration vectors + pipeline | `pnpm test` | 84 |
| Site audit (links, metadata, security) | `pnpm test:audit` | 25 |
| CA server (Ruby RSpec) | `bundle exec rspec` | 226 |
| Web islands (Vitest) | `pnpm test:vitest` | 25 |
| Markdown-page helpers | `pnpm test:web` | 12 |
| End-to-end (Playwright) | `pnpm test:e2e` | 29 |


## /conf/basic-verifier

| Requirement | CNML tests |
|---|---|
| Format validity (well-formed XML) | `checks/xml_well_formed.test.ts` |
| Format validity (schema layer) | `checks/schema_valid.test.ts`, vectors pipeline (`packages/cnml-test-vectors`) |
| Signature validity | `xml/sign-verify.test.ts`, `checks/signature.test.ts` |
| Scope narrowing + conditions | `checks/scope.test.ts`, `checks/scope-narrowing.test.ts` (narrowing invariant, condition language) |
| Revocation status + propagation | `checks/crl.test.ts`, `checks/state-binding.test.ts` |
| Offline operation | Playwright `e2e/*.spec.js` (the verify page runs with no network), `checks/transparency.test.ts` |
| Deterministic coverage report | `checks/coverage.test.ts` (artifact id determinism, hard/soft partition) |


## /conf/full-verifier

| Requirement | CNML tests |
|---|---|
| Three-stage separation (coverage / classification / acceptance) | `checks/coverage.test.ts` (classification mapping, acceptance evaluation, custom policies) |
| Transparency inclusion | `checks/transparency.test.ts` |
| Consistency proofs | `transparency_publisher_spec.rb` (all size pairs to 17, head-to-head to 40), `checks/transparency-consistency.test.ts` (cross-language: Ruby proofs verify in TS; leafless head-to-head) |
| Gossip quorum | `checks/transparency-consistency.test.ts` (t-of-n agreement) |
| Multi-log attestation | `checks/transparency-consistency.test.ts` (m-of-k recognized logs) |
| Typed verification result | `checks/coverage.test.ts` (typed failures, downgrades, chain_broken) |
| Signed tree heads | `transparency_publisher_spec.rb` (signed heads), `checks/transparency-consistency.test.ts` (Ruby signature verifies in TS, tamper rejected) |
| Gossip / fork detection | `checks/transparency-consistency.test.ts` (detectFork) |
| Trust graph path enumeration | `trust-graph.test.ts` (linear, diamond, cross-recognition, cycles, pruning) |
| Algorithm agility enforcement | `checks/algorithms.test.ts` (deprecated downgrade, retired hard fail, end-to-end) |


## /conf/issuing-authority

| Requirement | CNML tests |
|---|---|
| Certificate issuance | `cert_factory_spec.rb`, `api_enroll_spec.rb` |
| Key lifecycle | `key_provider_spec.rb`, `ca_store_spec.rb` |
| End certificate issuance | `api_sign_spec.rb` (local quorum attestation) |
| Revocation | `api_crl_revoke_spec.rb` (revoke, reinstate, CRL serving) |
| Concurrency integrity | `ca_store_concurrency_spec.rb` |


## /conf/root-authority

| Requirement | CNML tests |
|---|---|
| Deployment manifest generation + validation | `deployment_manifest_spec.rb` (14 + 13 examples, cross-port agreement) |
| Manifest [algorithms] section | `deployment_manifest_spec.rb`, `manifest.test.ts` |
| Ceremony records | `ceremony_transcript_spec.rb` |
| Trust anchor agreement | `trust_anchor_agreement.test.ts`, `trust_anchor_spec.rb` |


## /conf/transparency-operator

| Requirement | CNML tests |
|---|---|
| Append-only Merkle log | `transparency_publisher_spec.rb` (append, root, inclusion) |
| Inclusion proof issuance | `transparency_publisher_spec.rb`, `checks/transparency.test.ts` |
| Consistency proofs (RFC 6962 §2.1.4) | `transparency_publisher_spec.rb` (exhaustive pairs to 17, doctored-proof and wrong-root rejection) |
| Signed tree heads | `transparency_publisher_spec.rb` (sign + verify, publication, unsigned backward compatibility) |
| Publication (leaf/, proof/, consistency/, head.json) | `transparency_publisher_spec.rb` (publishes a signed head and consistency proofs) |


## /conf/device-signer

| Requirement | CNML tests |
|---|---|
| Per-device key lifecycle | `keys/*.test.ts` (generate, store, import/export, composite) |
| Artifact signing | `xml/sign-verify.test.ts`, `xml/cosign.test.ts` |
| Challenge-response | `challenge.test.ts` (128-bit nonce, freshness window, replay rejection, nonce covered by signature) |


## /conf/format-xmldsig

| Requirement | CNML tests |
|---|---|
| Five binding requirements | `xml/sign-verify.test.ts` (round-trip with cert, tamper rejection, multi-cert chains) |
| Canonical payload binding (co-signatures) | `xml/cosign.test.ts` (same canonical payload for all signers, tamper detection, wrapper structure) |


## Dimensional conformance classes

| Class | CNML tests |
|---|---|
| `/conf/dimension-data` | `checks/signature.test.ts`, coverage tests (data dimension on signature pass) |
| `/conf/dimension-person` | `xml/cosign.test.ts` (tester co-signature, dimension coverage, acceptance requiring person, scope enforcement on the tester credential) |
| `/conf/dimension-environment` | `xml/cosign.test.ts` (calibration co-signature), `checks/state-binding.test.ts` |
| `/conf/dimension-time` | `checks/timestamp.test.ts`, OTS tests, coverage tests (time dimension) |
| `/conf/dimension-authorization` | `checks/scope.test.ts`, `checks/scope-narrowing.test.ts` |
| `/conf/dimension-identity` | `cert/chain-verify.test.ts`, `cert/self-signed.test.ts` |
| `/conf/multi-dimensional` | `xml/cosign.test.ts` (verifyArtifact reports person + environment + data on one artifact), coverage tests (top-label dimension requirements) |


## /conf/hierarchical

| Requirement | CNML tests |
|---|---|
| Strict tree topology | `trust-graph.test.ts` (linear chain yields exactly one path), `manifest.test.ts` (tier chain validation, single root) |
| Threshold quorums | `secret_sharing_spec.rb`, `deployment_manifest_spec.rb` (threshold validation) |


## Known environment-dependent exclusions

One RSpec example (`api_sign_spec.rb` "a local quorum signs the
bytes") requires the confium FFI bindings and fails in environments
without them; it passes in the deployment environment. It is the
only failing example across the 577 tests and is unrelated to the
SIGNATIF-mapped requirements above.
