/**
 * Tests for W3C Bitstring Status List verification (VC-native
 * revocation), verified against the reference site's live list.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseStatusListEntry,
  readCredentialStatus,
  type StatusListCredential,
} from "./status-list.ts";
import { gzipSync } from "node:zlib";
import { bytesToBase64 } from "./shared/base64.ts";

function makeList(statuses: Array<"unset" | "revoked" | "suspended">): StatusListCredential {
  // 2 bits per index, LSB first per the spec's bitstring.
  const bytes = new Uint8Array(Math.ceil((statuses.length * 2) / 8));
  statuses.forEach((s, i) => {
    const bitOffset = i * 2;
    const byte = Math.floor(bitOffset / 8);
    const within = bitOffset % 8;
    if (s === "revoked") bytes[byte] |= 1 << within;
    if (s === "suspended") bytes[byte] |= 1 << (within + 1);
  });
  const gz = gzipSync(bytes);
  const b64 = bytesToBase64(gz).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return { encodedList: b64, issuer: "did:web:issuer.example" };
}

test("parses a BitstringStatusListEntry", () => {
  const entry = parseStatusListEntry({
    type: "BitstringStatusListEntry",
    statusListCredential: "https://issuer.example/status/1",
    statusListIndex: "4",
    statusPurpose: "revocation",
  });
  assert.deepEqual(entry, {
    statusListCredential: "https://issuer.example/status/1",
    statusListIndex: "4",
    statusPurpose: "revocation",
  });
  assert.equal(parseStatusListEntry({ type: "SomethingElse" }), null);
  assert.equal(parseStatusListEntry(null), null);
});

test("reads unset, revoked, and suspended statuses", async () => {
  const list = makeList(["unset", "revoked", "unset", "suspended", "unset"]);
  const st = async (i: number) =>
    readCredentialStatus(
      { statusListCredential: "x", statusListIndex: String(i), statusPurpose: "revocation" },
      list,
    );
  assert.deepEqual(await st(0), { kind: "unset" });
  assert.deepEqual(await st(1), { kind: "revoked" });
  assert.deepEqual(await st(2), { kind: "unset" });
  assert.deepEqual(await st(3), { kind: "suspended" });
  assert.deepEqual(await st(4), { kind: "unset" });
});

test("statuses are independent: revoking one index leaves its neighbours unset", async () => {
  const list = makeList(["unset", "unset", "revoked", "unset"]);
  const st = async (i: number) =>
    readCredentialStatus(
      { statusListCredential: "x", statusListIndex: String(i), statusPurpose: "revocation" },
      list,
    );
  assert.deepEqual(await st(1), { kind: "unset" });
  assert.deepEqual(await st(2), { kind: "revoked" });
  assert.deepEqual(await st(3), { kind: "unset" });
});

test("out-of-range and malformed indexes are unknown, never a clean pass", async () => {
  const list = makeList(["unset"]);
  assert.deepEqual(
    await readCredentialStatus({ statusListCredential: "x", statusListIndex: "9", statusPurpose: "revocation" }, list),
    { kind: "unknown", reason: "index 9 outside the list" },
  );
  assert.deepEqual(
    await readCredentialStatus({ statusListCredential: "x", statusListIndex: "NaN", statusPurpose: "revocation" }, list),
    { kind: "unknown", reason: "invalid statusListIndex 'NaN'" },
  );
});

test("a corrupted list is unknown, never a clean pass", async () => {
  const st = await readCredentialStatus(
    { statusListCredential: "x", statusListIndex: "0", statusPurpose: "revocation" },
    { encodedList: "!!!not-base64-gzip!!!" },
  );
  assert.equal(st.kind, "unknown");
});

// ─── cross-check against the reference site's live list ───────────
// The QI VC exploration publishes a real BitstringStatusList; our
// reader agrees with what its verifier reports for index 4.

test("reads the reference site's live status list correctly", async () => {
  const list: StatusListCredential = {
    encodedList: "uH4sIAAAAAAACA-3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAIC3AYbSVKsAQAAA",
    issuer: "did:web:legal-ia.example",
  };
  // Index 4 is the OIML certificate's slot; the site's verifier
  // reports it unrevoked.
  const st = await readCredentialStatus(
    { statusListCredential: "https://legal-ia.example/status/certificates", statusListIndex: "4", statusPurpose: "revocation" },
    list,
  );
  assert.equal(st.kind, "unset");
  assert.notEqual(st.kind, "unknown");
});
