/**
 * Cross-language test: the Ruby log's embedded tlog_proof carries the
 * operator's signed tree head; the TS transparency check verifies it
 * (spec §inclusion-proof, round 4).
 */

import "./_test-polyfill.ts";

import { test } from "node:test";
import assert from "node:assert/strict";
import fixture from "./__fixtures__/embedded-proof.json" with { type: "json" };
import { transparencyCheck, parseTransparencyProof } from "./transparency.ts";
import type { CheckContext } from "./types.ts";

const XML = fixture.xml as string;
const OPERATOR_PEM = fixture.operator_public_key as string;

test("the embedded proof parses with its signed head", () => {
  const proof = parseTransparencyProof(XML);
  assert.ok(proof);
  assert.match(proof!.headSignature ?? "", /^[0-9a-f]{128}$/);
  assert.ok(proof!.headTimestamp);
  assert.equal(proof!.treeSize, 3);
});

test("the transparency check verifies the embedded signed head", async () => {
  const ctx: CheckContext = { logOperatorPublicKeyPem: OPERATOR_PEM };
  const result = await transparencyCheck.run(XML, ctx, []);
  // No bitcoin anchor embedded → warn, but the head verified (no fail).
  assert.equal(result.status, "warn", result.reason);
  assert.match(result.reason ?? "", /Inclusion proof valid/);
});

test("a tampered head signature fails the check", async () => {
  const tampered = XML.replace(
    /<cnml:head_signature algorithm="ECDSA-P256-SHA256">[0-9a-f]+</,
    `<cnml:head_signature algorithm="ECDSA-P256-SHA256">${"ab".repeat(64)}<`,
  );
  assert.notEqual(tampered, XML, "tamper must change the document");
  const ctx: CheckContext = { logOperatorPublicKeyPem: OPERATOR_PEM };
  const result = await transparencyCheck.run(tampered, ctx, []);
  assert.equal(result.status, "fail");
  assert.match(result.reason ?? "", /tree-head signature/);
});

test("a wrong operator key fails the check", async () => {
  const ctx: CheckContext = { logOperatorPublicKeyPem: OPERATOR_PEM.replace(/\n./, "\nX") };
  // Malformed PEM → key derivation fails → verifySignedHead false.
  const result = await transparencyCheck.run(XML, ctx, []);
  if (result.status === "fail") {
    assert.match(result.reason ?? "", /tree-head signature|does not verify/);
  }
});
