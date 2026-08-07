/**
 * Tests for verifyCertChain (TODO.cnml/86, ADR-0006).
 *
 * Builds self-signed cert chains in memory and walks them through
 * verifyCertChain. No fixtures on disk — everything is generated
 * per-run with ECDSA-P256 keys.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { issueSelfSignedCert, verifyCertChain } from "../index.ts";

const SUBTLE = globalThis.crypto.subtle;

async function freshKeyPair(): Promise<CryptoKeyPair> {
  return await SUBTLE.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
}

test("verifyCertChain: empty chain is invalid", async () => {
  const result = await verifyCertChain([], []);
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /empty/i);
});

test("verifyCertChain: malformed PEM is rejected", async () => {
  const result = await verifyCertChain(["not a pem"], []);
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /parse/i);
});

test("verifyCertChain: single self-signed cert trusted as its own anchor", async () => {
  const kp = await freshKeyPair();
  const pem = await issueSelfSignedCert(
    kp.publicKey,
    kp.privateKey,
    "O=Test Root, CN=Test Root CA, C=NL",
  );
  const result = await verifyCertChain([pem], [pem]);
  assert.equal(result.valid, true);
  assert.equal(result.chainLength, 1);
});

test("verifyCertChain: single cert not in anchor set is rejected", async () => {
  const kp = await freshKeyPair();
  const pem = await issueSelfSignedCert(
    kp.publicKey,
    kp.privateKey,
    "O=Test Root, CN=Test Root CA, C=NL",
  );
  const otherKp = await freshKeyPair();
  const otherPem = await issueSelfSignedCert(
    otherKp.publicKey,
    otherKp.privateKey,
    "O=Other Root, CN=Other Root CA, C=NL",
  );
  const result = await verifyCertChain([pem], [otherPem]);
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /anchor/i);
});
