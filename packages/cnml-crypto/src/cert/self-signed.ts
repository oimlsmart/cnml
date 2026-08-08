/**
 * Self-signed X.509 v3 certificate generation (pkijs + asn1js).
 *
 * Wraps an ECDSA-P256 public key in an X.509 certificate suitable
 * for embedding in <ds:X509Certificate> of an XMLDSig signature.
 * Used by the browser signer to produce a cert even when the user
 * has no CA-issued certificate yet.
 */

import { derToPem } from "../pem.ts";

import { SUBTLE } from "../shared/crypto.ts";

/**
 * Issue a self-signed X.509 v3 certificate wrapping the given ECDSA P-256
 * public key. This is the certificate that goes into
 * <ds:X509Certificate> in the XMLDSig signature.
 *
 * Issuing authority is identified by the supplied Distinguished Name
 * (e.g. "O=NMi Certin B.V., CN=CNML Signer 2026, C=NL"). The cert is
 * valid for `validityDays` from issuance.
 *
 * Returns the certificate in PEM form ("-----BEGIN CERTIFICATE-----"),
 * ready to drop into signCnmlXml's `x509CertPem` parameter.
 */
export async function issueSelfSignedCert(
  publicKey: CryptoKey,
  privateKey: CryptoKey,
  subjectDn: string,
  validityDays = 3650,
): Promise<string> {
  // pkijs reads its engine from the shared registry ensureXmldsigEngine
  // populates — register it HERE so the cert path is self-sufficient
  // (previously order-dependent: it only worked after an xml/ call had
  // run first; idempotent, so the overlap costs nothing).
  const { ensureXmldsigEngine } = await import("../xml/engine.ts");
  ensureXmldsigEngine();
  const pki = await import("pkijs");
  const asn1 = await import("asn1js");

  const cert = new pki.Certificate();
  cert.version = 3; // v3
  const serialHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
  cert.serialNumber = asn1.Integer.fromBigInt(BigInt("0x" + serialHex));

  cert.notBefore.value = new Date();
  const notAfter = new Date();
  notAfter.setDate(notAfter.getDate() + validityDays);
  cert.notAfter.value = notAfter;

  for (const [oid, value] of parseDn(subjectDn)) {
    const attr = new pki.AttributeTypeAndValue({
      type: oid,
      // countryName requires PrintableString (X.509 Name); everything
      // else rides Utf8String (the strict-schema decode's rule — a
      // Utf8String C breaks pkijs's own Certificate parser).
      value: oid === "2.5.4.6"
        ? new asn1.PrintableString({ value })
        : new asn1.Utf8String({ value }),
    });
    cert.subject.typesAndValues.push(attr);
    cert.issuer.typesAndValues.push(attr);
  }

  await cert.subjectPublicKeyInfo.importKey(publicKey);

  await cert.sign(privateKey, "SHA-256");

  const derBuf = cert.toSchema(true).toBER(false);
  return derToPem(derBuf, "CERTIFICATE");
}

// Minimal DN parser: "O=NMi, CN=Signer, C=NL" → [["2.5.4.10", "NMi"], ...]
const DN_OID: Record<string, string> = {
  CN: "2.5.4.3",
  C:  "2.5.4.6",
  L:  "2.5.4.7",
  ST: "2.5.4.8",
  O:  "2.5.4.10",
  OU: "2.5.4.11",
  emailAddress: "1.2.840.113549.1.9.1",
};

function parseDn(dn: string): [string, string][] {
  const out: [string, string][] = [];
  for (const part of dn.split(",").map((s) => s.trim()).filter(Boolean)) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    const oid = DN_OID[k];
    if (oid) out.push([oid, v]);
  }
  return out;
}
