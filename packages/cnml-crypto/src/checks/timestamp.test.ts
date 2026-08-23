/**
 * Unit tests for checks/timestamp.ts — the pipeline's time-attestation
 * leg. Time attestation is REQUIRED in CNML: the leg is a real verdict
 * (pass / pending / fail), with one honest carve-out — a record signed
 * before the mandate reads as legacy, stated as such.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { timestampCheck } from "./timestamp.ts";
import type { CheckResult } from "./types.ts";
import { buildDetachedProof, bytesToHex, pendingTimestamp, sha256Bytes } from "../ots-format.ts";
import { signCnmlXml } from "../xml/sign.ts";
import { issueSelfSignedCert } from "../index.ts";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0" schemaVersion="1.0">
  <cnml:administrativeData><cnml:coreData><cnml:identifications>
    <cnml:oimlNumber>R60/2021-NL1</cnml:oimlNumber>
  </cnml:identifications></cnml:coreData></cnml:administrativeData>
</cnml:certificatNumeriqueMetrologieLegale>`;

const PRIOR_OK: CheckResult[] = [
  { checkId: "xml-well-formed", status: "pass" },
  { checkId: "schema-valid", status: "pass" },
  { checkId: "signature", status: "pass" },
];

function toBase64(b: Uint8Array): string {
  let bin = "";
  for (const x of b) bin += String.fromCharCode(x);
  return btoa(bin);
}

async function signedXml(): Promise<string> {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
    "sign",
    "verify",
  ]);
  const pem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "CN=Timestamp check test");
  return signCnmlXml(SAMPLE_XML, kp.privateKey, pem);
}

async function pendingProofFor(
  xml: string,
  calendar = "https://ots-stub.test/calendar",
): Promise<string> {
  const digest = await sha256Bytes(new TextEncoder().encode(xml));
  return toBase64(buildDetachedProof(digest, pendingTimestamp(digest, calendar)));
}

describe("check: timestamp (time attestation is required)", () => {
  test("no proof, default posture → FAIL: the mandate, named", async () => {
    const xml = await signedXml();
    const result = await timestampCheck.run(xml, {}, PRIOR_OK);
    assert.equal(result.status, "fail");
    assert.match(result.reason ?? "", /required/);
  });

  test("no proof, legacy posture → the honest legacy mark (skip naming legacy)", async () => {
    const xml = await signedXml();
    const result = await timestampCheck.run(xml, { timestampPosture: "legacy" }, PRIOR_OK);
    assert.equal(result.status, "skip");
    assert.match(result.reason ?? "", /legacy/);
  });

  test("no proof and the signature already failed → skip (the leg is moot upstream)", async () => {
    const xml = await signedXml();
    const prior: CheckResult[] = [
      { checkId: "xml-well-formed", status: "pass" },
      { checkId: "schema-valid", status: "pass" },
      { checkId: "signature", status: "fail", reason: "no signature" },
    ];
    const result = await timestampCheck.run(xml, {}, prior);
    assert.equal(result.status, "skip");
  });

  test("a pending proof → PENDING: the attestation is in flight, the calendar named", async () => {
    const xml = await signedXml();
    const proof = await pendingProofFor(xml);
    const { embedTimestampInXml } = await import("../opentimestamps.ts");
    const embedded = embedTimestampInXml(xml, proof);
    const result = await timestampCheck.run(embedded, {}, PRIOR_OK);
    assert.equal(result.status, "pending");
    assert.match(result.reason ?? "", /ots-stub\.test/);
    assert.match(result.reason ?? "", /in flight|pending/i);
  });

  test("an attested proof → PASS: the block height and time named", async () => {
    const xml = await signedXml();
    const digest = await sha256Bytes(new TextEncoder().encode(xml));
    const ts = pendingTimestamp(digest, "https://ots-stub.test/calendar");
    ts.attestations = [{ kind: "bitcoin", height: 880_123 }];
    const { embedTimestampInXml } = await import("../opentimestamps.ts");
    const embedded = embedTimestampInXml(xml, toBase64(buildDetachedProof(digest, ts)));
    const result = await timestampCheck.run(embedded, {}, PRIOR_OK);
    assert.equal(result.status, "pass");
    assert.match(result.reason ?? "", /880123/);
  });

  test("a proof committing to other bytes → FAIL (the document changed after attestation)", async () => {
    const xml = await signedXml();
    const other = await sha256Bytes(new TextEncoder().encode("other"));
    const { embedTimestampInXml } = await import("../opentimestamps.ts");
    const embedded = embedTimestampInXml(
      xml,
      toBase64(buildDetachedProof(other, pendingTimestamp(other, "https://x.test/"))),
    );
    const result = await timestampCheck.run(embedded, {}, PRIOR_OK);
    assert.equal(result.status, "fail");
    assert.match(result.reason ?? "", /commits to/);
  });

  test("an unparseable proof → FAIL with the parse reason", async () => {
    const xml = await signedXml();
    const { embedTimestampInXml } = await import("../opentimestamps.ts");
    const embedded = embedTimestampInXml(xml, toBase64(new TextEncoder().encode("garbage")));
    const result = await timestampCheck.run(embedded, {}, PRIOR_OK);
    assert.equal(result.status, "fail");
  });

  test("a pending proof + the relay answering attested → PASS and the upgraded proof rides in details", async () => {
    const xml = await signedXml();
    const digest = await sha256Bytes(new TextEncoder().encode(xml));
    const proof = await pendingProofFor(xml);
    const { embedTimestampInXml } = await import("../opentimestamps.ts");
    const embedded = embedTimestampInXml(xml, proof);
    // The relay's answer: the calendar anchored meanwhile.
    const upgradedTs = pendingTimestamp(digest, "https://ots-stub.test/calendar");
    upgradedTs.attestations = [{ kind: "bitcoin", height: 880_200 }];
    const upgradedProof = toBase64(buildDetachedProof(digest, upgradedTs));
    const fetchStub = (async (_input: unknown, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? "{}")) as { digest?: string };
      assert.equal(body.digest, bytesToHex(digest));
      return new Response(
        JSON.stringify({
          status: "attested",
          blockHeight: 880_200,
          attestedAt: "2026-08-23T05:00:00Z",
          calendars: ["https://alice.btc.calendar.opentimestamps.org"],
          upgradedProof,
        }),
        { status: 200 },
      );
    }) as typeof fetch;
    const result = await timestampCheck.run(
      embedded,
      { otsVerifyUrl: "/api/cnml/timestamp/verify", fetchImpl: fetchStub },
      PRIOR_OK,
    );
    assert.equal(result.status, "pass");
    assert.match(result.reason ?? "", /880200/);
    assert.match(result.reason ?? "", /2026-08-23/);
    assert.match(result.reason ?? "", /alice\.btc\.calendar/);
    assert.equal(
      (result.details as { upgradedProof?: string } | undefined)?.upgradedProof,
      upgradedProof,
    );
  });

  test("a pending proof + the relay still pending → PENDING with the calendar named", async () => {
    const xml = await signedXml();
    const proof = await pendingProofFor(xml, "https://alice.btc.calendar.opentimestamps.org");
    const { embedTimestampInXml } = await import("../opentimestamps.ts");
    const embedded = embedTimestampInXml(xml, proof);
    const fetchStub = (async () =>
      new Response(
        JSON.stringify({
          status: "pending",
          calendars: ["https://alice.btc.calendar.opentimestamps.org"],
        }),
        { status: 200 },
      )) as typeof fetch;
    const result = await timestampCheck.run(
      embedded,
      { otsVerifyUrl: "/api/cnml/timestamp/verify", fetchImpl: fetchStub },
      PRIOR_OK,
    );
    assert.equal(result.status, "pending");
    assert.match(result.reason ?? "", /alice\.btc\.calendar/);
  });

  test("a pending proof + the relay unreachable → PENDING honestly (the local proof stands)", async () => {
    const xml = await signedXml();
    const proof = await pendingProofFor(xml);
    const { embedTimestampInXml } = await import("../opentimestamps.ts");
    const embedded = embedTimestampInXml(xml, proof);
    const down = (async () => {
      throw new Error("connection refused");
    }) as typeof fetch;
    const result = await timestampCheck.run(
      embedded,
      { otsVerifyUrl: "/api/cnml/timestamp/verify", fetchImpl: down },
      PRIOR_OK,
    );
    assert.equal(result.status, "pending");
    assert.match(result.reason ?? "", /ots-stub\.test/);
  });
});
