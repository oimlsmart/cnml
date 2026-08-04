import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  generateCompositeKeyMaterial,
  compositeSign,
  compositeVerify,
  encodeCompositeSignature,
  decodeCompositeSignature,
  encodeCompositePublicKeys,
  decodeCompositePublicKeys,
} from "./composite.ts";

describe("Composite signatures: Ed25519 with ML-DSA-65", () => {
  test("round-trip sign and verify succeeds when both components are intact", async () => {
    const keys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("hello CNML composite signature");
    const signature = await compositeSign(payload, keys);
    const result = await compositeVerify(payload, signature, keys);
    assert.equal(result.ed25519Valid, true);
    assert.equal(result.mlDsa65Valid, true);
    assert.equal(result.valid, true);
  });

  test("Ed25519 public key is 32 bytes", async () => {
    const keys = await generateCompositeKeyMaterial();
    assert.equal(keys.ed25519.publicKey.length, 32);
  });

  test("Ed25519 secret key is 32 bytes", async () => {
    const keys = await generateCompositeKeyMaterial();
    assert.equal(keys.ed25519.secretKey.length, 32);
  });

  test("Ed25519 signature is 64 bytes", async () => {
    const keys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("test");
    const signature = await compositeSign(payload, keys);
    assert.equal(signature.ed25519.length, 64);
  });

  test("ML-DSA-65 public key is 1952 bytes", async () => {
    const keys = await generateCompositeKeyMaterial();
    assert.equal(keys.mlDsa65.publicKey.length, 1952);
  });

  test("composite verify fails when the payload is tampered", async () => {
    const keys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("original payload");
    const signature = await compositeSign(payload, keys);
    const tampered = new TextEncoder().encode("tampered payload");
    const result = await compositeVerify(tampered, signature, keys);
    assert.equal(result.ed25519Valid, false);
    assert.equal(result.mlDsa65Valid, false);
    assert.equal(result.valid, false);
  });

  test("composite verify fails when only the Ed25519 component is tampered", async () => {
    const keys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("payload");
    const signature = await compositeSign(payload, keys);
    const tamperedEd = new Uint8Array(signature.ed25519);
    tamperedEd[0] ^= 0xff;
    const result = await compositeVerify(payload, { ...signature, ed25519: tamperedEd }, keys);
    assert.equal(result.ed25519Valid, false);
    assert.equal(result.mlDsa65Valid, true);
    assert.equal(result.valid, false, "composite must fail when any component fails");
  });

  test("composite verify fails when only the ML-DSA-65 component is tampered", async () => {
    const keys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("payload");
    const signature = await compositeSign(payload, keys);
    const tamperedMl = new Uint8Array(signature.mlDsa65);
    tamperedMl[0] ^= 0xff;
    const result = await compositeVerify(payload, { ...signature, mlDsa65: tamperedMl }, keys);
    assert.equal(result.ed25519Valid, true);
    assert.equal(result.mlDsa65Valid, false);
    assert.equal(result.valid, false, "composite must fail when any component fails");
  });

  test("composite verify fails when the Ed25519 public key is wrong", async () => {
    const signerKeys = await generateCompositeKeyMaterial();
    const verifierKeys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("payload");
    const signature = await compositeSign(payload, signerKeys);
    const result = await compositeVerify(payload, signature, verifierKeys);
    assert.equal(result.valid, false);
  });

  test("signature is deterministic for ML-DSA-65 (stateless variant) and randomized for Ed25519 (deterministic by design)", async () => {
    const keys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("payload");
    const sig1 = await compositeSign(payload, keys);
    const sig2 = await compositeSign(payload, keys);
    // Ed25519 is deterministic: two signatures over the same payload with
    // the same key should be byte-identical.
    assert.deepEqual(sig1.ed25519, sig2.ed25519);
    // Both still verify regardless.
    const v1 = await compositeVerify(payload, sig1, keys);
    const v2 = await compositeVerify(payload, sig2, keys);
    assert.equal(v1.valid, true);
    assert.equal(v2.valid, true);
  });
});

describe("Composite signature encoding", () => {
  test("encodeCompositeSignature produces two base64 strings separated by a period", async () => {
    const keys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("payload");
    const signature = await compositeSign(payload, keys);
    const encoded = encodeCompositeSignature(signature);
    const parts = encoded.split(".");
    assert.equal(parts.length, 2);
    assert.ok(parts[0].length > 0);
    assert.ok(parts[1].length > 0);
  });

  test("decodeCompositeSignature reverses encodeCompositeSignature", async () => {
    const keys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("payload");
    const signature = await compositeSign(payload, keys);
    const encoded = encodeCompositeSignature(signature);
    const decoded = decodeCompositeSignature(encoded);
    assert.deepEqual(decoded.ed25519, signature.ed25519);
    assert.deepEqual(decoded.mlDsa65, signature.mlDsa65);
  });

  test("decoded signature still verifies", async () => {
    const keys = await generateCompositeKeyMaterial();
    const payload = new TextEncoder().encode("payload");
    const signature = await compositeSign(payload, keys);
    const encoded = encodeCompositeSignature(signature);
    const decoded = decodeCompositeSignature(encoded);
    const result = await compositeVerify(payload, decoded, keys);
    assert.equal(result.valid, true);
  });

  test("decodeCompositeSignature rejects malformed input without a separator", () => {
    assert.throws(
      () => decodeCompositeSignature("just-one-base64-blob-no-separator"),
      /missing separator/,
    );
  });

  test("encodeCompositePublicKeys produces the expected two-part encoding", async () => {
    const keys = await generateCompositeKeyMaterial();
    const encoded = encodeCompositePublicKeys(keys);
    const parts = encoded.split(".");
    assert.equal(parts.length, 2);
    assert.ok(parts[0].length > 0);
    assert.ok(parts[1].length > 0);
  });

  test("decodeCompositePublicKeys reverses encodeCompositePublicKeys", async () => {
    const keys = await generateCompositeKeyMaterial();
    const encoded = encodeCompositePublicKeys(keys);
    const decoded = decodeCompositePublicKeys(encoded);
    assert.deepEqual(decoded.ed25519, keys.ed25519.publicKey);
    assert.deepEqual(decoded.mlDsa65, keys.mlDsa65.publicKey);
  });
});
