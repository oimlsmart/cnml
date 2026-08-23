/**
 * Unit tests for ots-format.ts — the minimal OpenTimestamps wire codec.
 *
 * The fixture below is a REAL calendar answer: alice.btc.calendar
 * .opentimestamps.org's POST /digest response for
 * sha256("hello ots probe"), captured 2026-08-23. Parsing it is the
 * conformance leg: the codec reads what the public calendars emit.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./checks/_test-polyfill.ts";
import {
  OTS_DETACHED_MAGIC,
  buildDetachedProof,
  collectAttestations,
  mergeTimestamps,
  parseDetachedProof,
  parseTimestamp,
  pendingTimestamp,
  serializeTimestamp,
  sha256Bytes,
} from "./ots-format.ts";

const PROBE_DIGEST_HEX = "a853f652376ee20f4b0ab5f9c65dc56bfa897c60a50817c9b1a214bb6203860c";
// alice's POST /digest answer for the probe digest (207 bytes).
const ALICE_TIMESTAMP_HEX =
  "f00866ec40aab9efbf5e" +
  "08" +
  "f01007ed8eddfd5d6a45f021ebf1d25af9da" +
  "08" +
  "f020e01b758b88ecbbf7f2b7ccb2ede89c44e1c37448817f28d4402b8341daca4b47" +
  "08" +
  "f12027783da03d9f1de5ba82762478b39f014d968877f16f7eac0caa496a133df9f5" +
  "08" +
  "f020d6bf45f12d1828358d7ebce22368e05d70ab6a07322eadb1791d4601d185290a" +
  "08" +
  "f1046a8a735b" +
  "f0080739246c81d36ad5" +
  "00" +
  "83dfe30d2ef90c8e" +
  "2e" +
  "2d68747470733a2f2f616c6963652e6274632e63616c656e6461722e6f70656e74696d657374616d70732e6f7267";

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function bytesToHex(b: Uint8Array): string {
  return Array.from(b)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

describe("ots-format: the wire codec", () => {
  test("parses alice's real calendar answer: one pending attestation naming the calendar", async () => {
    const ts = await parseTimestamp(hexToBytes(ALICE_TIMESTAMP_HEX), hexToBytes(PROBE_DIGEST_HEX));
    const attestations = collectAttestations(ts);
    assert.equal(attestations.length, 1);
    assert.equal(attestations[0]!.kind, "pending");
    if (attestations[0]!.kind === "pending") {
      assert.equal(attestations[0]!.uri, "https://alice.btc.calendar.opentimestamps.org");
    }
  });

  test("a parsed timestamp serializes back byte-identical", async () => {
    const raw = hexToBytes(ALICE_TIMESTAMP_HEX);
    const ts = await parseTimestamp(raw, hexToBytes(PROBE_DIGEST_HEX));
    assert.equal(bytesToHex(serializeTimestamp(ts)), ALICE_TIMESTAMP_HEX);
  });

  test("the detached proof round-trips: magic, version, sha256 op, digest, timestamp", async () => {
    const digest = await sha256Bytes(new TextEncoder().encode("round-trip"));
    const ts = pendingTimestamp(digest, "https://ots-stub.test/calendar");
    const detached = buildDetachedProof(digest, ts);
    // The magic is the file-format's own identification.
    assert.equal(
      bytesToHex(detached.slice(0, OTS_DETACHED_MAGIC.length)),
      bytesToHex(OTS_DETACHED_MAGIC),
    );
    const parsed = await parseDetachedProof(detached);
    assert.equal(bytesToHex(parsed.digest), bytesToHex(digest));
    const attestations = collectAttestations(parsed.timestamp);
    assert.deepEqual(
      attestations.map((a) => (a.kind === "pending" ? `pending:${a.uri}` : a.kind)),
      ["pending:https://ots-stub.test/calendar"],
    );
  });

  test("merge keeps both calendars' attestations under their own op chains", async () => {
    const digest = await sha256Bytes(new TextEncoder().encode("merge me"));
    const a = pendingTimestamp(digest, "https://calendar-one.test/");
    const b = pendingTimestamp(digest, "https://calendar-two.test/");
    // Two zero-op pending timestamps share the digest as msg: mergeable.
    const merged = mergeTimestamps(a, b);
    const uris = collectAttestations(merged)
      .map((x) => (x.kind === "pending" ? x.uri : x.kind))
      .sort();
    assert.deepEqual(uris, ["https://calendar-one.test/", "https://calendar-two.test/"]);
    // And the merged form parses back from its own serialization.
    const reparsed = await parseTimestamp(serializeTimestamp(merged), digest);
    assert.equal(collectAttestations(reparsed).length, 2);
  });

  test("a bitcoin attestation parses with its block height", async () => {
    const digest = await sha256Bytes(new TextEncoder().encode("anchored"));
    const ts = pendingTimestamp(digest, "https://calendar-one.test/");
    // Upgrade the leaf: replace the pending attestation with a bitcoin one.
    ts.attestations = [{ kind: "bitcoin", height: 880_123 }];
    const detached = buildDetachedProof(digest, ts);
    const parsed = await parseDetachedProof(detached);
    const attestations = collectAttestations(parsed.timestamp);
    assert.deepEqual(attestations, [{ kind: "bitcoin", height: 880_123 }]);
  });

  test("a parse applying the op chain commits to the initial digest", async () => {
    // parseTimestamp applies every op starting from initialMsg; a wrong
    // initial digest still parses (ops always apply) but commits
    // elsewhere — the caller compares the detached file's declared
    // digest. Here: the declared digest IS the initial one.
    const raw = hexToBytes(ALICE_TIMESTAMP_HEX);
    const ts = await parseTimestamp(raw, hexToBytes(PROBE_DIGEST_HEX));
    assert.equal(bytesToHex(ts.msg), PROBE_DIGEST_HEX);
  });
});
