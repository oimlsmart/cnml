/**
 * Tests for the algorithm agility registry (SIGNATIF Phase 5).
 */

import "./_test-polyfill.ts";

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ALGORITHM_REGISTRY,
  statusForAlgorithm,
  algorithmIdForSignatureMethod,
  isMigrationPhase,
} from "../algorithms.ts";
import { verifyArtifact } from "./index.ts";
import { signCnmlXml } from "../xml/sign.ts";
import { verifyCnmlXml } from "../xml/verify.ts";
import { issueSelfSignedCert } from "../index.ts";
import type { AlgorithmRegistry } from "../algorithms.ts";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0" schemaVersion="1.0">
  <cnml:administrativeData><cnml:oimlNumber>R60/2021-NL1</cnml:oimlNumber></cnml:administrativeData>
</cnml:certificatNumeriqueMetrologieLegale>`;

async function signedSample(): Promise<string> {
  const kp = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
  const cert = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "CN=IA");
  return signCnmlXml(SAMPLE_XML, kp.privateKey, cert);
}

test("registry statuses are readable", () => {
  assert.equal(statusForAlgorithm(DEFAULT_ALGORITHM_REGISTRY, "ecdsa-p256"), "active");
  assert.equal(statusForAlgorithm(DEFAULT_ALGORITHM_REGISTRY, "ml-dsa-65"), "active");
  assert.equal(statusForAlgorithm(DEFAULT_ALGORITHM_REGISTRY, "no-such-alg"), undefined);
});

test("signature method URIs map to registry ids", () => {
  const r = DEFAULT_ALGORITHM_REGISTRY;
  assert.equal(
    algorithmIdForSignatureMethod(r, "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256"),
    "ecdsa-p256",
  );
  assert.equal(algorithmIdForSignatureMethod(r, "http://unknown.example/"), undefined);
});

test("migration phases are constrained", () => {
  assert.equal(isMigrationPhase("composite"), true);
  assert.equal(isMigrationPhase("classical-only"), true);
  assert.equal(isMigrationPhase("post-quantum-only"), true);
  assert.equal(isMigrationPhase("quantum"), false);
});

test("signed artifact reports its algorithm", async () => {
  const signed = await signedSample();
  const result = await verifyCnmlXml(signed);
  assert.equal(
    result.signatureMethod,
    "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256",
  );
});

test("active algorithm does not downgrade classification", async () => {
  const signed = await signedSample();
  const outcome = await verifyArtifact(signed, {});
  assert.deepEqual(outcome.coverage.algorithms, [{ id: "ecdsa-p256", status: "active" }]);
});

test("deprecated algorithm downgrades one label end-to-end", async () => {
  const signed = await signedSample();
  const registry: AlgorithmRegistry = {
    ...DEFAULT_ALGORITHM_REGISTRY,
    algorithms: DEFAULT_ALGORITHM_REGISTRY.algorithms.map((a) =>
      a.id === "ecdsa-p256" ? { ...a, status: "deprecated" as const } : a,
    ),
  };
  const outcome = await verifyArtifact(signed, { algorithmRegistry: registry });
  // Bare sample: no OTS proof, no tlog proof → base B (soft downgrades).
  assert.equal(outcome.classification.base_label, "B");
  // Deprecated: exactly one label below the base.
  assert.equal(outcome.classification.label, "C");
});

test("retired algorithm hard-fails end-to-end", async () => {
  const signed = await signedSample();
  const registry: AlgorithmRegistry = {
    ...DEFAULT_ALGORITHM_REGISTRY,
    algorithms: DEFAULT_ALGORITHM_REGISTRY.algorithms.map((a) =>
      a.id === "ecdsa-p256" ? { ...a, status: "retired" as const } : a,
    ),
  };
  const outcome = await verifyArtifact(signed, { algorithmRegistry: registry });
  assert.equal(outcome.classification.label, "F");
});
