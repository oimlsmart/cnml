/**
 * Tests for state binding + revocation propagation (SIGNATIF Phase 4).
 */

import "./_test-polyfill.ts";

import { test } from "node:test";
import assert from "node:assert/strict";
import { embedStateBinding, extractStateBindings } from "../xml/state-binding.ts";
import { buildStateIndex, propagate, isBoundToRevoked } from "../revocation.ts";
import { crlCheck } from "./crl.ts";
import { signCnmlXml } from "../xml/sign.ts";
import { verifyCnmlXml } from "../xml/verify.ts";
import { issueSelfSignedCert } from "../index.ts";
import { sha256Hex } from "../hash.ts";
import type { CheckContext } from "./types.ts";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0" schemaVersion="1.0">
  <cnml:administrativeData><cnml:oimlNumber>R60/2021-NL1</cnml:oimlNumber></cnml:administrativeData>
</cnml:certificatNumeriqueMetrologieLegale>`;

const CALIBRATION_STATE = "calibration report #42, scale interval 0.1 kg, 2026-08-01";

test("embed + extract round-trip", async () => {
  const bound = await embedStateBinding(SAMPLE_XML, [
    { type: "calibration", data: CALIBRATION_STATE },
    { type: "evaluation", data: "evaluation report ER-2026-113" },
  ]);
  const states = extractStateBindings(bound);
  assert.equal(states.length, 2);
  assert.equal(states[0].type, "calibration");
  assert.match(states[0].hash, /^sha256:[0-9a-f]{64}$/);
  assert.equal(states[0].hash, `sha256:${await sha256Hex(new TextEncoder().encode(CALIBRATION_STATE))}`);
});

test("no stateBinding element yields no bound states", () => {
  assert.equal(extractStateBindings(SAMPLE_XML).length, 0);
});

test("revocation propagation flags bound artifacts", () => {
  const index = buildStateIndex([
    { sequence: 0, bindings: ["sha256:aa", "sha256:bb"] },
    { sequence: 1, bindings: ["sha256:cc"] },
    { sequence: 2, bindings: ["sha256:bb", "sha256:dd"] },
  ]);
  const hits = propagate(["sha256:bb"], index);
  assert.deepEqual(hits.map((h) => h.sequence).sort(), [0, 2]);
  assert.equal(hits[0].matched, "sha256:bb");
});

test("propagation tolerates prefix and case differences", () => {
  const index = buildStateIndex([{ sequence: 5, bindings: ["sha256:ABCD"] }]);
  const hits = propagate(["abcd"], index);
  assert.equal(hits.length, 1);
});

test("isBoundToRevoked finds the matching state", () => {
  const bindings = [{ hash: "sha256:11" }, { hash: "sha256:22" }];
  const r = isBoundToRevoked(bindings, ["sha256:22"]);
  assert.equal(r.bound, true);
  assert.equal(r.matched, "sha256:22");
  assert.equal(isBoundToRevoked(bindings, ["sha256:33"]).bound, false);
});

test("check 5 fails on bound-to-revoked", async () => {
  const bound = await embedStateBinding(SAMPLE_XML, [
    { type: "calibration", data: CALIBRATION_STATE },
  ]);
  const states = extractStateBindings(bound);
  const ctx: CheckContext = { revokedStateHashes: [states[0].hash] };
  const result = await crlCheck.run(bound, ctx, []);
  assert.equal(result.status, "fail");
  assert.match(result.reason ?? "", /calibration/);
});

test("check 5 unaffected when no revoked hash matches", async () => {
  const bound = await embedStateBinding(SAMPLE_XML, [
    { type: "calibration", data: CALIBRATION_STATE },
  ]);
  const ctx: CheckContext = { revokedStateHashes: ["sha256:" + "0".repeat(64)] };
  const result = await crlCheck.run(bound, ctx, []);
  // Falls through to the CRL leg, which skips (no cert, no DP).
  assert.equal(result.status, "skip");
});

test("state binding is covered by the signature (tamper detection)", async () => {
  const kp = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
  const cert = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "CN=IA");
  const bound = await embedStateBinding(SAMPLE_XML, [
    { type: "calibration", data: CALIBRATION_STATE },
  ]);
  const signed = await signCnmlXml(bound, kp.privateKey, cert);
  assert.equal((await verifyCnmlXml(signed)).signatureValid, true);

  // Flipping the bound hash breaks the signature: the binding is
  // inside the canonical payload.
  const tampered = signed.replace(/hash="sha256:[0-9a-f]{8}/, 'hash="sha256:deadbeef');
  assert.equal((await verifyCnmlXml(tampered)).signatureValid, false);
});
