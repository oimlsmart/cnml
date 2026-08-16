/**
 * Tests for multi-dimensional co-signatures (SIGNATIF Phase 2).
 *
 * Round-trip: primary + co-signers, verification via the dimensions
 * check, tamper detection on the shared canonical payload, and
 * verifyArtifact coverage of the person/environment dimensions.
 */

import "../checks/_test-polyfill.ts";

import { test } from "node:test";
import assert from "node:assert/strict";
import { issueSelfSignedCert } from "../index.ts";
import { signCnmlXmlWithCosignatures } from "./cosign.ts";
import { verifyCnmlXml } from "./verify.ts";
import { dimensionsCheck } from "../checks/dimensions.ts";
import { verifyArtifact } from "../checks/index.ts";
import type { CheckContext } from "../checks/types.ts";

const SUBTLE = globalThis.crypto.subtle;

async function freshKeyPair(): Promise<CryptoKeyPair> {
  return await SUBTLE.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
}

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0" xmlns:unitsml="https://unitsml.org/ns/unitsml" schemaVersion="1.0">
  <cnml:administrativeData>
    <cnml:coreData>
      <cnml:identifications>
        <cnml:oimlNumber>R60/2021-NL1</cnml:oimlNumber>
      </cnml:identifications>
    </cnml:coreData>
  </cnml:administrativeData>
</cnml:certificatNumeriqueMetrologieLegale>`;

test("co-signed document carries wrappers for each dimension", async () => {
  const ia = await freshKeyPair();
  const tester = await freshKeyPair();
  const calibration = await freshKeyPair();

  const signed = await signCnmlXmlWithCosignatures(
    SAMPLE_XML,
    { privateKey: ia.privateKey, certPem: await issueSelfSignedCert(ia.publicKey, ia.privateKey, "CN=IA") },
    [
      { dimension: "person", privateKey: tester.privateKey, certPem: await issueSelfSignedCert(tester.publicKey, tester.privateKey, "CN=Tester") },
      { dimension: "environment", privateKey: calibration.privateKey, certPem: await issueSelfSignedCert(calibration.publicKey, calibration.privateKey, "CN=Calibration") },
    ],
  );

  assert.match(signed, /<cnml:coSignature dimension="person">/);
  assert.match(signed, /<cnml:coSignature dimension="environment">/);
  assert.equal((signed.match(/<ds:Signature[ >]/g) ?? []).length, 3);
});

test("co-signatures verify through the dimensions check", async () => {
  const ia = await freshKeyPair();
  const tester = await freshKeyPair();

  const signed = await signCnmlXmlWithCosignatures(
    SAMPLE_XML,
    { privateKey: ia.privateKey, certPem: await issueSelfSignedCert(ia.publicKey, ia.privateKey, "CN=IA") },
    [{ dimension: "person", privateKey: tester.privateKey, certPem: await issueSelfSignedCert(tester.publicKey, tester.privateKey, "CN=Tester") }],
  );

  const ctx: CheckContext = {};
  const result = await dimensionsCheck.run(signed, ctx, []);
  assert.equal(result.status, "pass", result.reason);
  assert.ok(ctx.dimensions);
  assert.equal(ctx.dimensions.length, 1);
  assert.equal(ctx.dimensions[0].dimension, "person");
  assert.equal(ctx.dimensions[0].verified, true);
});

test("dimensions check skips on a plain (single-signature) document", async () => {
  const ctx: CheckContext = {};
  const result = await dimensionsCheck.run(SAMPLE_XML, ctx, []);
  assert.equal(result.status, "skip");
});

test("tampered payload breaks every co-signature", async () => {
  const ia = await freshKeyPair();
  const tester = await freshKeyPair();

  const signed = await signCnmlXmlWithCosignatures(
    SAMPLE_XML,
    { privateKey: ia.privateKey, certPem: await issueSelfSignedCert(ia.publicKey, ia.privateKey, "CN=IA") },
    [{ dimension: "person", privateKey: tester.privateKey, certPem: await issueSelfSignedCert(tester.publicKey, tester.privateKey, "CN=Tester") }],
  );
  const tampered = signed.replace("R60/2021-NL1", "R60/2021-XX");

  const ctx: CheckContext = {};
  const result = await dimensionsCheck.run(tampered, ctx, []);
  assert.equal(result.status, "fail", result.reason);
  assert.match(result.reason ?? "", /person/);
});

test("primary signature still verifies on a co-signed document", async () => {
  const ia = await freshKeyPair();
  const tester = await freshKeyPair();
  const iaCert = await issueSelfSignedCert(ia.publicKey, ia.privateKey, "CN=Test IA");

  const signed = await signCnmlXmlWithCosignatures(
    SAMPLE_XML,
    { privateKey: ia.privateKey, certPem: iaCert },
    [{ dimension: "person", privateKey: tester.privateKey }],
  );

  const result = await verifyCnmlXml(signed);
  assert.equal(result.signatureValid, true, "primary signature must verify");
});

test("verifyArtifact reports dimension coverage from co-signatures", async () => {
  const ia = await freshKeyPair();
  const tester = await freshKeyPair();
  const calibration = await freshKeyPair();

  const signed = await signCnmlXmlWithCosignatures(
    SAMPLE_XML,
    { privateKey: ia.privateKey, certPem: await issueSelfSignedCert(ia.publicKey, ia.privateKey, "CN=IA") },
    [
      { dimension: "person", privateKey: tester.privateKey, certPem: await issueSelfSignedCert(tester.publicKey, tester.privateKey, "CN=Tester") },
      { dimension: "environment", privateKey: calibration.privateKey, certPem: await issueSelfSignedCert(calibration.publicKey, calibration.privateKey, "CN=Calibration") },
    ],
  );

  const outcome = await verifyArtifact(signed, {});
  const dims = outcome.coverage.dimensions.map((d) => `${d.dimension}:${d.verified}`);
  assert.ok(dims.includes("person:true"), dims.join(","));
  assert.ok(dims.includes("environment:true"), dims.join(","));
  assert.ok(dims.includes("data:true"), dims.join(","));

  // A policy requiring the person dimension is satisfiable now.
  const withPerson = await verifyArtifact(signed, {}, {
    acceptance: {
      minimum_label: "C",
      require_transparency: false,
      require_timestamp: false,
      freshness_window_ms: 0,
      required_dimensions: ["person"],
    },
  });
  assert.equal(withPerson.acceptance.accepted, true, withPerson.acceptance.reasons.join("; "));
});
