/**
 * Unit tests for opentimestamps.ts — the CNML timestamp leg's client side.
 *
 * Time attestation is REQUIRED in CNML: a signed document carries its
 * OpenTimestamps proof inside the signature container (a ds:Object
 * unsigned property — the XAdES posture), committing to the signed
 * bytes with the timestamp element removed. These tests pin that
 * contract: the embed never breaks the enveloped XMLDSig, an upgrade
 * re-embed keeps it valid, and the local verification classifies
 * pending / attested / digest-mismatch honestly.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./checks/_test-polyfill.ts";
import { signCnmlXml } from "./xml/sign.ts";
import { verifyCnmlXml } from "./xml/verify.ts";
import { issueSelfSignedCert } from "./index.ts";
import {
  embedTimestampInXml,
  extractTimestampFromXml,
  fetchCalendarUpgrade,
  stripTimestampElement,
  timestampCnml,
  verifyTimestampProof,
} from "./opentimestamps.ts";
import {
  buildDetachedProof,
  bytesToHex,
  mergeTimestamps,
  parseTimestamp,
  pendingTimestamp,
  sha256Bytes,
} from "./ots-format.ts";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0" schemaVersion="1.0">
  <cnml:administrativeData><cnml:coreData><cnml:identifications>
    <cnml:oimlNumber>R60/2021-NL1</cnml:oimlNumber>
  </cnml:identifications></cnml:coreData></cnml:administrativeData>
</cnml:certificatNumeriqueMetrologieLegale>`;

async function freshSigned(): Promise<string> {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
    "sign",
    "verify",
  ]);
  const pem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "CN=OTS test");
  return signCnmlXml(SAMPLE_XML, kp.privateKey, pem);
}

function toBase64(b: Uint8Array): string {
  let bin = "";
  for (const x of b) bin += String.fromCharCode(x);
  return btoa(bin);
}

/** A stub calendar answer for the digest: the real protocol's bytes
 *  (a one-op chain ending in the stub calendar's pending attestation). */
async function stubCalendarAnswer(digest: Uint8Array, uri: string): Promise<Uint8Array> {
  const { serializeTimestamp } = await import("./ots-format.ts");
  return serializeTimestamp(pendingTimestamp(digest, uri));
}

function stubFetch(uri: string): typeof fetch {
  return (async (input: unknown, init?: RequestInit) => {
    const url = String(input);
    if (url === `${uri}/digest` && init?.method === "POST") {
      const body = new Uint8Array(await new Response(init.body as BodyInit).arrayBuffer());
      return new Response(await stubCalendarAnswer(body, uri), { status: 200 });
    }
    if (url.startsWith(`${uri}/`)) return new Response(null, { status: 404 });
    throw new Error(`connection refused: ${url}`);
  }) as typeof fetch;
}

describe("opentimestamps: the embed contract", () => {
  test("the proof embeds inside ds:Signature and the XMLDSig stays valid", async () => {
    const signed = await freshSigned();
    const digest = await sha256Bytes(new TextEncoder().encode(signed));
    const proof = toBase64(
      buildDetachedProof(digest, pendingTimestamp(digest, "https://ots-stub.test/calendar")),
    );
    const embedded = embedTimestampInXml(signed, proof);
    assert.match(embedded, /<ds:Object><cnml:timestamp>/);
    assert.ok(
      embedded.indexOf("<ds:Object><cnml:timestamp>") < embedded.indexOf("</ds:Signature>"),
    );
    const result = await verifyCnmlXml(embedded);
    assert.equal(
      result.signatureValid,
      true,
      `the embed must never break the signature: ${result.reason ?? ""}`,
    );
  });

  test("an upgrade re-embed REPLACES the proof; the signature still verifies", async () => {
    const signed = await freshSigned();
    const digest = await sha256Bytes(new TextEncoder().encode(signed));
    const pending = buildDetachedProof(
      digest,
      pendingTimestamp(digest, "https://ots-stub.test/calendar"),
    );
    const first = embedTimestampInXml(signed, toBase64(pending));
    // The "upgraded" proof: the same commitment carrying the bitcoin leaf.
    const upgraded = pendingTimestamp(digest, "https://ots-stub.test/calendar");
    upgraded.attestations = [{ kind: "bitcoin", height: 880_123 }];
    const second = embedTimestampInXml(first, toBase64(buildDetachedProof(digest, upgraded)));
    assert.equal((second.match(/<cnml:otsProof/g) ?? []).length, 1, "exactly one proof rides");
    assert.equal(
      stripTimestampElement(second),
      signed,
      "the stripped form is byte-identical across upgrades",
    );
    const result = await verifyCnmlXml(second);
    assert.equal(result.signatureValid, true, result.reason ?? "");
    assert.equal(
      extractTimestampFromXml(second)?.proof,
      toBase64(buildDetachedProof(digest, upgraded)),
    );
  });
});

describe("opentimestamps: stamp against the calendar protocol", () => {
  test("timestampCnml returns a detached proof committing to the signed bytes", async () => {
    const signed = await freshSigned();
    const proofB64 = await timestampCnml(signed, {
      calendars: ["https://calendar-one.test", "https://calendar-two.test"],
      fetchImpl: stubFetch("https://calendar-one.test"),
    });
    const extracted = verifyTimestampProof(signed, proofB64);
    assert.equal((await extracted).status, "pending");
    assert.deepEqual((await extracted).calendars, ["https://calendar-one.test"]);
  });

  test("every calendar unreachable throws with the per-calendar reasons named", async () => {
    const signed = await freshSigned();
    const down: typeof fetch = (async () => {
      throw new Error("connection refused");
    }) as typeof fetch;
    await assert.rejects(
      () =>
        timestampCnml(signed, {
          calendars: ["https://down-one.test", "https://down-two.test"],
          fetchImpl: down,
        }),
      (e: Error) => e.message.includes("down-one.test") && e.message.includes("down-two.test"),
    );
  });
});

describe("opentimestamps: the local verdict", () => {
  test("pending proof → pending, calendars named", async () => {
    const signed = await freshSigned();
    const digest = await sha256Bytes(new TextEncoder().encode(signed));
    const proof = toBase64(
      buildDetachedProof(
        digest,
        pendingTimestamp(digest, "https://alice.btc.calendar.opentimestamps.org"),
      ),
    );
    const verdict = await verifyTimestampProof(signed, proof);
    assert.equal(verdict.status, "pending");
    assert.deepEqual(verdict.calendars, ["https://alice.btc.calendar.opentimestamps.org"]);
  });

  test("a bitcoin attestation → attested, the block height named", async () => {
    const signed = await freshSigned();
    const digest = await sha256Bytes(new TextEncoder().encode(signed));
    const ts = pendingTimestamp(digest, "https://x.test/");
    ts.attestations = [{ kind: "bitcoin", height: 880_123 }];
    const verdict = await verifyTimestampProof(signed, toBase64(buildDetachedProof(digest, ts)));
    assert.equal(verdict.status, "attested");
    assert.equal(verdict.blockHeight, 880_123);
  });

  test("a proof committing to OTHER bytes → digest-mismatch, honestly", async () => {
    const signed = await freshSigned();
    const otherDigest = await sha256Bytes(new TextEncoder().encode("other document"));
    const proof = toBase64(
      buildDetachedProof(otherDigest, pendingTimestamp(otherDigest, "https://x.test/")),
    );
    const verdict = await verifyTimestampProof(signed, proof);
    assert.equal(verdict.status, "digest-mismatch");
  });

  test("garbage proof bytes → invalid, never a crash", async () => {
    const signed = await freshSigned();
    const verdict = await verifyTimestampProof(
      signed,
      toBase64(new TextEncoder().encode("not an ots proof")),
    );
    assert.equal(verdict.status, "invalid");
  });
});

describe("opentimestamps: the upgrade query", () => {
  test("fetchCalendarUpgrade: 404 → null (not yet anchored), 200 → the timestamp bytes", async () => {
    const digest = await sha256Bytes(new TextEncoder().encode("upgradable"));
    const uri = "https://calendar-one.test";
    assert.equal(await fetchCalendarUpgrade(bytesToHex(digest), uri, stubFetch(uri)), null);
    const digestHex = bytesToHex(digest);
    const upgraded = await stubCalendarAnswer(digest, uri);
    const answering: typeof fetch = (async () =>
      new Response(upgraded, { status: 200 })) as typeof fetch;
    const got = await fetchCalendarUpgrade(digestHex, uri, answering);
    assert.ok(got);
    const parsed = await parseTimestamp(got!, digest);
    assert.equal(parsed.attestations[0]!.kind, "pending");
  });

  test("merge of two calendar answers keeps both attestations", async () => {
    const digest = await sha256Bytes(new TextEncoder().encode("multi"));
    const a = await parseTimestamp(await stubCalendarAnswer(digest, "https://a.test/"), digest);
    const b = await parseTimestamp(await stubCalendarAnswer(digest, "https://b.test/"), digest);
    const merged = mergeTimestamps(a, b);
    const uris = (await import("./ots-format.ts"))
      .collectAttestations(merged)
      .map((x) => (x.kind === "pending" ? x.uri : x.kind))
      .sort();
    assert.deepEqual(uris, ["https://a.test/", "https://b.test/"]);
  });
});
