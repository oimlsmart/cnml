/**
 * Tests for challenge-response (SIGNATIF Phase 7).
 */

import "./checks/_test-polyfill.ts";

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateChallenge,
  embedChallenge,
  verifyChallengeResponse,
  readChallengeResponse,
  createChallengeRegistry,
} from "./challenge.ts";
import { signCnmlXml } from "./xml/sign.ts";
import { verifyCnmlXml } from "./xml/verify.ts";
import { issueSelfSignedCert } from "./index.ts";

const MEASUREMENT_XML = `<?xml version="1.0"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0" schemaVersion="1.0">
  <cnml:administrativeData><cnml:oimlNumber>R60/2021-NL1</cnml:oimlNumber></cnml:administrativeData>
  <cnml:signedMeasurement>
    <cnml:value>42.5</cnml:value>
    <cnml:unit>u-kilogram</cnml:unit>
    <cnml:timestamp>2026-08-16T12:00:00.000Z</cnml:timestamp>
  </cnml:signedMeasurement>
</cnml:certificatNumeriqueMetrologieLegale>`;

test("challenges are 128 bits and unique", () => {
  const a = generateChallenge();
  const b = generateChallenge();
  assert.equal(a.length, 16);
  assert.notDeepEqual([...a], [...b]);
});

test("embed + read round-trip", () => {
  const nonce = generateChallenge();
  const embedded = embedChallenge(MEASUREMENT_XML, nonce, "2026-08-16T12:00:00.000Z");
  const read = readChallengeResponse(embedded);
  assert.equal(read.nonce, [...nonce].map((x) => x.toString(16).padStart(2, "0")).join(""));
  assert.equal(read.timestamp, "2026-08-16T12:00:00.000Z");
});

test("embed requires a signedMeasurement element", () => {
  assert.throws(() => embedChallenge("<cnml:x xmlns:cnml='u'/>", generateChallenge()));
});

test("fresh response with matching nonce verifies", () => {
  const nonce = generateChallenge();
  const now = Date.now();
  const embedded = embedChallenge(MEASUREMENT_XML, nonce, new Date(now - 1000).toISOString());
  const r = verifyChallengeResponse(embedded, nonce, { freshness_window_ms: 30_000 }, now);
  assert.equal(r.ok, true, r.reason);
});

test("wrong nonce is rejected", () => {
  const nonce = generateChallenge();
  const other = generateChallenge();
  const embedded = embedChallenge(MEASUREMENT_XML, nonce, new Date().toISOString());
  const r = verifyChallengeResponse(embedded, other);
  assert.equal(r.ok, false);
  assert.match(r.reason ?? "", /nonce mismatch/);
});

test("stale response is rejected by the freshness window", () => {
  const nonce = generateChallenge();
  const now = Date.parse("2026-08-16T12:05:00.000Z");
  const embedded = embedChallenge(MEASUREMENT_XML, nonce, "2026-08-16T12:00:00.000Z");
  const r = verifyChallengeResponse(embedded, nonce, { freshness_window_ms: 30_000 }, now);
  assert.equal(r.ok, false);
  assert.match(r.reason ?? "", /ms old/);
});

test("a replayed future timestamp is rejected", () => {
  const nonce = generateChallenge();
  const now = Date.parse("2026-08-16T12:00:00.000Z");
  const embedded = embedChallenge(MEASUREMENT_XML, nonce, "2026-08-16T12:00:10.000Z");
  const r = verifyChallengeResponse(embedded, nonce, { freshness_window_ms: 30_000 }, now);
  assert.equal(r.ok, false);
  assert.match(r.reason ?? "", /future/);
});

test("missing nonce is rejected", () => {
  const r = verifyChallengeResponse(MEASUREMENT_XML, generateChallenge());
  assert.equal(r.ok, false);
  assert.match(r.reason ?? "", /no nonce/);
});

test("nonce is covered by the instrument's signature", async () => {
  const kp = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
  const cert = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "CN=Instrument");
  const nonce = generateChallenge();
  const embedded = embedChallenge(MEASUREMENT_XML, nonce);
  const signed = await signCnmlXml(embedded, kp.privateKey, cert);
  assert.equal((await verifyCnmlXml(signed)).signatureValid, true);

  // Swapping the nonce after signing breaks the signature: the
  // challenge is bound to the signed payload.
  const swapped = signed.replace(
    /<cnml:nonce>[0-9a-f]+<\/cnml:nonce>/,
    `<cnml:nonce>${"0".repeat(32)}</cnml:nonce>`,
  );
  assert.equal((await verifyCnmlXml(swapped)).signatureValid, false);
});

// ─── single-use nonce (gap F) ─────────────────────────────────────

test("a nonce is accepted once and rejected on replay", () => {
  const registry = createChallengeRegistry();
  const nonce = generateChallenge();
  const embedded = embedChallenge(MEASUREMENT_XML, nonce, new Date().toISOString());
  const r1 = verifyChallengeResponse(embedded, nonce, { freshness_window_ms: 0 }, Date.now(), registry);
  assert.equal(r1.ok, true, r1.reason);
  const r2 = verifyChallengeResponse(embedded, nonce, { freshness_window_ms: 0 }, Date.now(), registry);
  assert.equal(r2.ok, false);
  assert.match(r2.reason ?? "", /replay/);
});
