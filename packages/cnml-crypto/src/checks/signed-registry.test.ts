/**
 * Tests for the signed algorithm registry (gap E).
 */

import "./_test-polyfill.ts";

import { test } from "node:test";
import assert from "node:assert/strict";
import signedRegistry from "./__fixtures__/signed-registry.json" with { type: "json" };
// Inline copy of the published (currently unsigned) registry — the
// app's public/ tree is not importable from the package.
const defaultRegistryJson = {
  "version": 1,
  "published": "2026-08-16",
  "algorithms": [
    {
      "id": "ecdsa-p256",
      "family": "classical",
      "status": "active",
      "reference": "FIPS 186-4",
      "signatureMethodUris": [
        "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256"
      ]
    },
    {
      "id": "ed25519",
      "family": "classical",
      "status": "active",
      "reference": "RFC 8032",
      "signatureMethodUris": [
        "http://www.w3.org/2021/04/xmldsig#ed25519",
        "urn:ietf:params:xml:ns:cite:ed25519"
      ]
    },
    {
      "id": "ml-dsa-65",
      "family": "post-quantum",
      "status": "active",
      "reference": "FIPS 204",
      "signatureMethodUris": [
        "http://www.w3.org/2007/05/xmldsig-more#ml-dsa-65"
      ]
    },
    {
      "id": "composite-ed25519-ml-dsa-65",
      "family": "composite",
      "status": "active",
      "reference": "IETF LAMPS composite signatures (draft)"
    },
    {
      "id": "sha256",
      "family": "hash",
      "status": "active",
      "reference": "FIPS 180-4"
    }
  ]
};

import {
  registryString,
  verifyAlgorithmRegistry,
  DEFAULT_ALGORITHM_REGISTRY,
  type AlgorithmRegistry,
} from "../algorithms.ts";

test("registryString is the canonical signed form", () => {
  assert.equal(
    registryString(DEFAULT_ALGORITHM_REGISTRY),
    registryString(defaultRegistryJson as unknown as AlgorithmRegistry),
  );
  assert.match(registryString(DEFAULT_ALGORITHM_REGISTRY), /^CNML-ALG-REGISTRY-v1\|1\|/);
});

test("a signed registry verifies (Ruby-signed fixture)", async () => {
  const r = await verifyAlgorithmRegistry(signedRegistry as unknown as AlgorithmRegistry);
  assert.deepEqual(r, { signed: true, verified: true });
});

test("a tampered registry fails verification", async () => {
  const tampered = {
    ...(signedRegistry as unknown as AlgorithmRegistry),
    algorithms: [
      { id: "rsa-1024", family: "classical", status: "active" },
      ...(signedRegistry as unknown as AlgorithmRegistry).algorithms.slice(1),
    ],
  };
  const r = await verifyAlgorithmRegistry(tampered);
  assert.equal(r.verified, false);
  assert.equal(r.reason, "signature mismatch");
});

test("an unsigned registry is rejected when signing is required", async () => {
  const r = await verifyAlgorithmRegistry(defaultRegistryJson as unknown as AlgorithmRegistry, true);
  assert.equal(r.verified, false);
  assert.equal(r.reason, "registry is not signed");
});

test("an unsigned registry is tolerated when signing is optional", async () => {
  const r = await verifyAlgorithmRegistry(defaultRegistryJson as unknown as AlgorithmRegistry);
  assert.deepEqual(r, { signed: false, verified: true });
});
