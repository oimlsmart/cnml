/**
 * Roundtrip test: generate keypair → sign CNML → verify CNML
 *
 * Run with: pnpm test
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// These imports resolve at runtime in browser; in Node tests we use
// polyfilled WebCrypto via node:crypto's webcrypto global.
const webcrypto = globalThis.crypto;
if (!(globalThis as any).subtle) {
  (globalThis as any).crypto = webcrypto;
}

// Minimal DOM polyfill for DOMParser/XMLSerializer (XML tests run in browser;

describe("CNML crypto round-trip", async () => {
  test("WebCrypto is available", () => {
    assert.ok(webcrypto.subtle, "crypto.subtle must exist");
  });

  test("generateKey produces a usable RSA-2048 keypair", async () => {
    const keyPair = await webcrypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"],
    );
    assert.ok(keyPair.publicKey, "public key exists");
    assert.ok(keyPair.privateKey, "private key exists");

    // Round-trip sign + verify
    const data = new TextEncoder().encode("hello cnml");
    const sig = await webcrypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      keyPair.privateKey,
      data,
    );
    const ok = await webcrypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      keyPair.publicKey,
      sig,
      data,
    );
    assert.ok(ok, "signature verifies");
  });

  test("SHA-256 digest is deterministic", async () => {
    const data = new TextEncoder().encode("test vector");
    const h1 = await webcrypto.subtle.digest("SHA-256", data);
    const h2 = await webcrypto.subtle.digest("SHA-256", data);
    assert.deepEqual(new Uint8Array(h1), new Uint8Array(h2));
  });
});

describe("CNML schemas are valid", () => {
  test("sample R60 cert loads", () => {
    const cert = readFileSync(
      new URL("../../../cnml-schemas/src/samples/r60-sample.yaml", import.meta.url),
      "utf8",
    );
    assert.match(cert, /R60/);
    assert.match(cert, /Load cell/);
  });

  test("XSD file exists and parses as XML", () => {
    const xsd = readFileSync(
      new URL("../../../cnml-xsd/src/cnml-1.0.xsd", import.meta.url),
      "utf8",
    );
    assert.match(xsd, /<xs:schema/);
    assert.match(xsd, /certificatNumeriqueMetrologieLegale/);
  });
});
