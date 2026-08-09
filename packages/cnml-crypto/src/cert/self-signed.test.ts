/**
 * Unit tests for cert/self-signed.ts — issueSelfSignedCert.
 *
 * These tests exercise the cert generation directly (not through the
 * vector pipeline). They verify PEM format, X.509 v3 structure, DN
 * parsing, validity windows, and cross-check with verifyCertChain.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { issueSelfSignedCert, verifyCertChain } from "../index.ts";

const SUBTLE = globalThis.crypto.subtle;

async function freshKeyPair(): Promise<CryptoKeyPair> {
  return await SUBTLE.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
}

test("issueSelfSignedCert produces a PEM certificate", async () => {
  const kp = await freshKeyPair();
  const pem = await issueSelfSignedCert(
    kp.publicKey,
    kp.privateKey,
    "O=Test Org, CN=Test Signer, C=NL",
  );
  assert.match(pem, /^-----BEGIN CERTIFICATE-----/m);
  assert.match(pem, /-----END CERTIFICATE-----\n?$/);
  const b64 = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s/g, "");
  assert.ok(b64.length > 100, "PEM body too short for a real cert");
  assert.ok(Buffer.from(b64, "base64").length > 100, "DER too short");
});

test("issueSelfSignedCert produces a v3 certificate", async () => {
  const kp = await freshKeyPair();
  const pem = await issueSelfSignedCert(
    kp.publicKey,
    kp.privateKey,
    "CN=Test",
  );
  const { Certificate } = await import("pkijs");
  const { fromBER } = await import("asn1js");
  const b64 = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s/g, "");
  const der = Buffer.from(b64, "base64");
  const cert = new Certificate({ schema: fromBER(der).result });
  assert.equal(cert.version, 3);
});

test("issueSelfSignedCert respects validityDays", async () => {
  const kp = await freshKeyPair();
  const before = new Date();
  const pem = await issueSelfSignedCert(
    kp.publicKey,
    kp.privateKey,
    "CN=Test",
    100,
  );
  const after = new Date();
  const { Certificate } = await import("pkijs");
  const { fromBER } = await import("asn1js");
  const b64 = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s/g, "");
  const der = Buffer.from(b64, "base64");
  const cert = new Certificate({ schema: fromBER(der).result });

  const notBefore = cert.notBefore.value;
  const notAfter = cert.notAfter.value;
  const days = (notAfter.getTime() - notBefore.getTime()) / (1000 * 60 * 60 * 24);
  assert.ok(days >= 99 && days <= 101, `expected ~100 days, got ${days.toFixed(1)}`);
  // Allow a 5-second window for clock differences between the test
  // process and the cert generation (pkijs uses Date.now internally).
  const epsilon = 5000;
  assert.ok(
    Math.abs(notBefore.getTime() - before.getTime()) < epsilon,
    `notBefore ${notBefore.toISOString()} too far from expected ${before.toISOString()}`,
  );
});

test("issueSelfSignedCert parses multi-attribute DN", async () => {
  const kp = await freshKeyPair();
  const pem = await issueSelfSignedCert(
    kp.publicKey,
    kp.privateKey,
    "O=Acme Corp, OU=Engineering, CN=Test Signer, C=US, L=Boston",
  );
  const { Certificate } = await import("pkijs");
  const { fromBER } = await import("asn1js");
  const b64 = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s/g, "");
  const der = Buffer.from(b64, "base64");
  const cert = new Certificate({ schema: fromBER(der).result });
  const subject = cert.subject.typesAndValues;
  assert.ok(subject.length >= 5, `expected >= 5 DN attributes, got ${subject.length}`);
  // Subject == Issuer (self-signed)
  const issuer = cert.issuer.typesAndValues;
  assert.equal(subject.length, issuer.length, "subject and issuer differ (not self-signed)");
});

test("issueSelfSignedCert produces a cert verifiable by verifyCertChain", async () => {
  const kp = await freshKeyPair();
  const pem = await issueSelfSignedCert(
    kp.publicKey,
    kp.privateKey,
    "O=Chain Test, CN=Chain Root, C=NL",
  );
  const result = await verifyCertChain([pem], [pem]);
  assert.equal(result.valid, true);
  assert.equal(result.chainLength, 1);
});

test("issueSelfSignedCert ignores unknown DN keys gracefully", async () => {
  const kp = await freshKeyPair();
  const pem = await issueSelfSignedCert(
    kp.publicKey,
    kp.privateKey,
    "CN=Test, UNKNOWN=ignored, X=y",
  );
  assert.match(pem, /-----BEGIN CERTIFICATE-----/);
});
