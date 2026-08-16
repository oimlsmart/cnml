/**
 * Tests for Verifiable Credential emission (SIGNATIF Annex G, gap I).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  certificateToVerifiableCredential,
  instanceToVerifiableCredential,
  type CnmlCertificateView,
} from "./vc.ts";

const CERT: CnmlCertificateView = {
  certificate: { number: "R60/2021-NL1", date_issued: "2026-01-15", recommendation: { id: "R60", edition: "2021" } },
  issuing_authority: { name: "Example IA" },
  manufacturers: [{ name: "Example Instruments" }],
  certified_type: { type_designations: ["LC-500"] },
};

const FACTS = {
  signerFingerprint: "abcd1234",
  coSignatures: [{ dimension: "person", fingerprint: "ef567890" }],
  payloadDigest: "0".repeat(64),
};

test("type approval certificate emits a VC with CNML context", () => {
  const vc = certificateToVerifiableCredential(CERT, FACTS, "did:web:ia.example.org");
  assert.deepEqual(vc["@context"][0], "https://www.w3.org/ns/credentials/v2");
  assert.ok(vc.type.includes("CNMLTypeApproval"));
  assert.equal(vc.issuer, "did:web:ia.example.org");
  assert.equal(vc.credentialSubject.recommendation, "R60");
  assert.equal(vc.credentialSubject.oimlCertificateNumber, "R60/2021-NL1");
  assert.equal(vc.proof.type, "CNMLXMLDSig2026");
});

test("co-signatures land in the proof set with their dimensions", () => {
  const vc = certificateToVerifiableCredential(CERT, FACTS, "did:web:ia.example.org");
  assert.equal(vc.proofSet?.length, 2);
  const person = vc.proofSet?.find((p) => p.dimension === "person");
  assert.ok(person);
  assert.equal(person.verificationMethod, "cnml:signer:ef567890");
});

test("no co-signatures means no proof set", () => {
  const vc = certificateToVerifiableCredential(CERT, { ...FACTS, coSignatures: [] }, "did:web:x");
  assert.equal(vc.proofSet, undefined);
});

test("instance certificate emits an instrument-instance VC", () => {
  const cert: CnmlCertificateView = {
    ...CERT,
    instrument: { model: "LC-500", serial_number: "SN-0042", firmware_hash: "beef" },
  };
  const vc = instanceToVerifiableCredential(cert, FACTS, "did:web:mfg.example.org");
  assert.ok(vc.type.includes("CNMLInstanceCertificate"));
  assert.equal(vc.credentialSubject.serialNumber, "SN-0042");
  assert.equal(vc.credentialSubject.firmwareHash, "beef");
});
