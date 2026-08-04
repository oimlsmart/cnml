/**
 * PKCS#10 Certification Request generation (pkijs + asn1js) — ECDSA P-256.
 *
 * The bridge's enrollment input (TODO.ops/12): the officer's key asks
 * the CA for a certificate; the CA verifies the CSR's self-signature
 * (proof of possession) and issues. Same idiom as self-signed.ts.
 */

import { derToPem } from "../pem.ts";

const SUBTLE = globalThis.crypto.subtle;

/** Build a PKCS#10 CSR (PEM) for an ECDSA P-256 pair. The subject DN
 *  uses the "O=…, CN=…, C=…" form (order-insensitive). */
export async function buildCsrPem(
  publicKey: CryptoKey,
  privateKey: CryptoKey,
  subjectDn: string,
): Promise<string> {
  const pki = await import("pkijs");
  const asn1 = await import("asn1js");

  const csr = new pki.CertificationRequest();
  csr.version = 0;
  for (const [oid, value] of parseDn(subjectDn)) {
    csr.subject.typesAndValues.push(
      new pki.AttributeTypeAndValue({
        type: oid,
        // countryName requires PrintableString (X.509 Name) — a
        // Utf8String C breaks the strict-schema decode.
        value: oid === "2.5.4.6"
          ? new asn1.PrintableString({ value })
          : new asn1.Utf8String({ value }),
      }),
    );
  }
  await csr.subjectPublicKeyInfo.importKey(publicKey);
  await csr.sign(privateKey, "SHA-256");

  const derBuf = csr.toSchema(true).toBER(false);
  return derToPem(derBuf, "CERTIFICATE REQUEST");
}

/** Parse "O=Org, CN=Name, C=NL" into [oid, value] pairs (the same
 *  tolerant form self-signed.ts accepts). */
function parseDn(dn: string): Array<[string, string]> {
  const OID_BY_SHORT: Record<string, string> = {
    C: "2.5.4.6",
    ST: "2.5.4.8",
    L: "2.5.4.7",
    O: "2.5.4.10",
    OU: "2.5.4.11",
    CN: "2.5.4.3",
  };
  const out: Array<[string, string]> = [];
  for (const part of dn.split(",")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    const oid = OID_BY_SHORT[key] ?? (key.match(/^\d+(\.\d+)*$/) ? key : null);
    if (oid && value) out.push([oid, value]);
  }
  return out;
}
