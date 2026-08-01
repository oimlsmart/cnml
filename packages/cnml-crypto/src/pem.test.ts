import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { pemToDer, derToPem } from "./pem.ts";

describe("PEM / DER helpers (pem.ts)", () => {
  test("derToPem wraps bytes in BEGIN/END markers with the supplied label", () => {
    const der = new Uint8Array([1, 2, 3, 4, 5]).buffer;
    const pem = derToPem(der, "TEST");
    assert.match(pem, /^-----BEGIN TEST-----\n/);
    assert.match(pem, /\n-----END TEST-----\n$/);
  });

  test("derToPem base64-encodes the body", () => {
    const der = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]).buffer; // "Hello"
    const pem = derToPem(der, "DATA");
    // "Hello" base64 is SGVsbG8=
    assert.ok(pem.includes("SGVsbG8="), `expected base64 of "Hello" in pem, got: ${pem}`);
  });

  test("derToPem wraps lines at 64 characters", () => {
    const der = new Uint8Array(200).buffer; // 200 bytes → ~267 base64 chars → multiple lines
    const pem = derToPem(der, "LONG");
    const lines = pem.split("\n").filter((l) => l && !l.startsWith("-----"));
    for (const line of lines) {
      assert.ok(line.length <= 64, `line longer than 64 chars: ${line.length}`);
    }
    assert.ok(lines.length > 1, "expected multiple wrapped lines");
  });

  test("pemToDer parses a PEM produced by derToPem (round-trip)", () => {
    const original = new Uint8Array([0xde, 0xad, 0xbe, 0xef, 0x10, 0x20, 0x30, 0x40]).buffer;
    const pem = derToPem(original, "ROUNDTRIP");
    const { der, label } = pemToDer(pem);
    assert.equal(label, "ROUNDTRIP");
    assert.deepEqual(new Uint8Array(der), new Uint8Array(original));
  });

  test("pemToDer preserves multi-byte sequences through round-trip", () => {
    const original = new Uint8Array(Array.from({ length: 256 }, (_, i) => i)).buffer;
    const pem = derToPem(original, "MULTI");
    const { der } = pemToDer(pem);
    assert.deepEqual(new Uint8Array(der), new Uint8Array(original));
  });

  test("pemToDer extracts the label from BEGIN line", () => {
    const pem = "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\n-----END PUBLIC KEY-----\n";
    const { label } = pemToDer(pem);
    assert.equal(label, "PUBLIC KEY");
  });

  test("pemToDer rejects malformed PEM", () => {
    assert.throws(() => pemToDer("not a pem at all"), /Invalid PEM format/);
  });

  test("pemToDer rejects PEM with mismatched BEGIN/END labels", () => {
    const broken = "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\n-----END PRIVATE KEY-----\n";
    assert.throws(() => pemToDer(broken), /Invalid PEM format/);
  });
});
