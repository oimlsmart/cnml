import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { sha256Hex } from "./hash.ts";

describe("SHA-256 hex helper (hash.ts)", () => {
  test("empty input produces known empty-string hash", async () => {
    const hex = await sha256Hex(new ArrayBuffer(0));
    assert.equal(hex, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  test("hello world produces known hash", async () => {
    const hex = await sha256Hex(new TextEncoder().encode("hello world"));
    assert.equal(hex, "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  });

  test("accepts ArrayBuffer input", async () => {
    const buf = new TextEncoder().encode("test").buffer;
    const hex = await sha256Hex(buf);
    assert.equal(hex.length, 64);
    assert.match(hex, /^[0-9a-f]{64}$/);
  });

  test("accepts Uint8Array input", async () => {
    const u8 = new TextEncoder().encode("test");
    const hex = await sha256Hex(u8);
    assert.match(hex, /^[0-9a-f]{64}$/);
  });

  test("ArrayBuffer and Uint8Array of same bytes produce same hash", async () => {
    const text = "same bytes";
    const fromBuf = await sha256Hex(new TextEncoder().encode(text).buffer);
    const fromU8  = await sha256Hex(new TextEncoder().encode(text));
    assert.equal(fromBuf, fromU8);
  });

  test("different inputs produce different hashes", async () => {
    const a = await sha256Hex(new TextEncoder().encode("a"));
    const b = await sha256Hex(new TextEncoder().encode("b"));
    assert.notEqual(a, b);
  });

  test("deterministic: same input always produces same output", async () => {
    const input = new TextEncoder().encode("deterministic test");
    const first = await sha256Hex(input);
    const second = await sha256Hex(input);
    assert.equal(first, second);
  });
});
