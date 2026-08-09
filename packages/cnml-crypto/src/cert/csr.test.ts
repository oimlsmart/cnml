/**
 * Unit tests for cert/csr.ts — buildCsrPem.
 *
 * Verifies PEM format, PKCS#10 structure, DN parsing, and the
 * self-signature (proof of possession).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCsrPem } from "../index.ts";

const SUBTLE = globalThis.crypto.subtle;

async function freshKeyPair(): Promise<CryptoKeyPair> {
  return await SUBTLE.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
}

async function parseCsr(pem: string): Promise<{ csr: any; pki: any }> {
  const pki = await import("pkijs");
  const { fromBER } = await import("asn1js");
  const b64 = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s/g, "");
  const der = Buffer.from(b64, "base64");
  const csr = new pki.CertificationRequest({ schema: fromBER(der).result });
  return { csr, pki };
}

test("buildCsrPem produces a PEM certificate request", async () => {
  const kp = await freshKeyPair();
  const pem = await buildCsrPem(kp.publicKey, kp.privateKey, "O=Test, CN=Test Requester, C=NL");
  assert.match(pem, /^-----BEGIN CERTIFICATE REQUEST-----/m);
  assert.match(pem, /-----END CERTIFICATE REQUEST-----\n?$/);
  const b64 = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s/g, "");
  assert.ok(Buffer.from(b64, "base64").length > 100, "DER too short");
});

test("buildCsrPem produces a v0 PKCS#10 CSR", async () => {
  const kp = await freshKeyPair();
  const pem = await buildCsrPem(kp.publicKey, kp.privateKey, "CN=Test");
  const { csr } = await parseCsr(pem);
  assert.equal(csr.version, 0);
});

test("buildCsrPem embeds the subject DN", async () => {
  const kp = await freshKeyPair();
  const pem = await buildCsrPem(kp.publicKey, kp.privateKey, "O=Acme, OU=R&D, CN=Test Signer, C=US");
  const { csr } = await parseCsr(pem);
  assert.ok(csr.subject.typesAndValues.length >= 4, "not enough DN attributes");
});

test("buildCsrPem CSR signature verifies (proof of possession)", async () => {
  const kp = await freshKeyPair();
  const pem = await buildCsrPem(kp.publicKey, kp.privateKey, "CN=Test, O=Proof");
  const { csr, pki } = await parseCsr(pem);
  // pkcs10.verify checks the self-signature against the embedded public key.
  const ok = await csr.verify();
  assert.ok(ok, "CSR self-signature verification failed");
});

test("buildCsrPem accepts dotted-OID DN keys", async () => {
  const kp = await freshKeyPair();
  const pem = await buildCsrPem(kp.publicKey, kp.privateKey, "2.5.4.3=Dotted CN, CN=Short CN");
  const { csr } = await parseCsr(pem);
  assert.ok(csr.subject.typesAndValues.length >= 2, "dotted OID not parsed");
});
