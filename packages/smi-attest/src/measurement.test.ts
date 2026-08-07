/**
 * Unit tests for the signed measurement format (TODO.cnml/79).
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  canonicalize,
  measurementHash,
  signMeasurement,
  verifyMeasurement,
  type MeasurementPayload,
} from "./measurement.ts";

const samplePayload: MeasurementPayload = {
  instrumentId: "CNML-INSTANCE-TEST-001",
  recommendationId: "R60",
  value: 42.5,
  unit: "kg",
  timestamp: "2026-08-07T12:00:00Z",
  quality: "valid",
  conditions: {
    temperature: { value: 22.1, unit: "degC" },
  },
  calibrationStateHash: "abc123def456",
  calibrationStateTimestamp: "2026-07-01T00:00:00Z",
};

describe("measurement.ts", () => {
  test("canonicalize is deterministic", () => {
    const a = canonicalize(samplePayload);
    const b = canonicalize({ ...samplePayload });
    assert.equal(a, b);
  });

  test("canonicalize changes when value changes", () => {
    const a = canonicalize(samplePayload);
    const b = canonicalize({ ...samplePayload, value: 99.9 });
    assert.notEqual(a, b);
  });

  test("measurementHash is 64 hex chars", async () => {
    const hash = await measurementHash(samplePayload);
    assert.match(hash, /^[0-9a-f]{64}$/);
  });

  test("signMeasurement + verifyMeasurement round-trip", async () => {
    const keyPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"],
    );
    const signed = await signMeasurement(
      samplePayload,
      keyPair.privateKey,
      ["test-cert-pem"],
    );
    assert.ok(signed.signature.value);
    assert.equal(signed.signature.algorithm, "ECDSA-P256-SHA256");
    assert.equal(signed.value, 42.5);

    const result = await verifyMeasurement(signed, keyPair.publicKey);
    assert.ok(result.valid, result.reason);
  });

  test("tampered measurement fails verification", async () => {
    const keyPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"],
    );
    const signed = await signMeasurement(samplePayload, keyPair.privateKey, ["test-cert"]);
    signed.value = 999.99;
    const result = await verifyMeasurement(signed, keyPair.publicKey);
    assert.ok(!result.valid);
  });

  test("nonce is included when provided", async () => {
    const keyPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign", "verify"],
    );
    const signed = await signMeasurement(
      samplePayload,
      keyPair.privateKey,
      ["test-cert"],
      "challenge-nonce-12345",
    );
    assert.equal(signed.signature.nonce, "challenge-nonce-12345");
  });
});
