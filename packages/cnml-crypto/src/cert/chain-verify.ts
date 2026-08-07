/**
 * Certificate chain verification (TODO.cnml/86, ADR-0006).
 *
 * Walks an X.509 certificate chain and verifies each link's signature
 * against the next certificate's public key, up to a trusted anchor.
 * Used by SMI's measurement verifier to confirm the instrument's
 * instance certificate is validly chained.
 *
 * This is a lighter API than verifyCnmlXml(): no XML document needed,
 * just the PEM cert chain and the trusted anchors.
 */

import { Certificate as PkiCertificate } from "pkijs";
import * as asn1 from "asn1js";

export interface ChainVerificationResult {
  valid: boolean;
  reason?: string;
  chainLength?: number;
  anchorSerial?: string;
}

/**
 * Verify an X.509 certificate chain.
 *
 * @param certChain PEM-encoded certificates, leaf first (instance → model → IA → root)
 * @param trustedAnchors PEM-encoded root certificates to trust
 * @returns { valid: true } if the chain is complete and every signature verifies
 */
export async function verifyCertChain(
  certChain: string[],
  trustedAnchors: string[],
): Promise<ChainVerificationResult> {
  if (certChain.length === 0) {
    return { valid: false, reason: "empty certificate chain" };
  }

  // Parse all certs.
  const certs: PkiCertificate[] = [];
  for (const pem of certChain) {
    const cert = parsePemCert(pem);
    if (!cert) {
      return { valid: false, reason: "could not parse a certificate in the chain" };
    }
    certs.push(cert);
  }

  // Verify each cert is signed by the next one.
  for (let i = 0; i < certs.length - 1; i++) {
    const subject = certs[i]!;
    const issuer = certs[i + 1]!;
    const ok = await verifyCertSignature(subject, issuer);
    if (!ok) {
      return {
        valid: false,
        reason: `certificate at position ${i} is not signed by position ${i + 1}`,
        chainLength: certs.length,
      };
    }
  }

  // Check validity windows (notBefore / notAfter).
  const now = new Date();
  for (let i = 0; i < certs.length; i++) {
    const cert = certs[i]!;
    if (cert.notBefore.value > now) {
      return { valid: false, reason: `certificate at position ${i} is not yet valid`, chainLength: certs.length };
    }
    if (cert.notAfter.value < now) {
      return { valid: false, reason: `certificate at position ${i} has expired`, chainLength: certs.length };
    }
  }

  // Check the root cert is in the trusted anchor set.
  const rootCert = certs[certs.length - 1]!;
  const rootSerial = rootCert.serialNumber
    ? rootCert.serialToken?.valueBlock?.valueHex
    : undefined;

  for (const anchorPem of trustedAnchors) {
    const anchor = parsePemCert(anchorPem);
    if (!anchor) continue;
    if (certsEqual(rootCert, anchor)) {
      return {
        valid: true,
        chainLength: certs.length,
        anchorSerial: rootSerial?.toString(16),
      };
    }
  }

  return {
    valid: false,
    reason: "root certificate is not in the trusted anchor set",
    chainLength: certs.length,
  };
}

function parsePemCert(pem: string): PkiCertificate | null {
  try {
    const b64 = pem
      .replace(/-----BEGIN CERTIFICATE-----/g, "")
      .replace(/-----END CERTIFICATE-----/g, "")
      .replace(/\s/g, "");
    const der = Buffer.from(b64, "base64");
    const asn1Parse = asn1.fromBER(der);
    return new PkiCertificate({ schema: asn1Parse.result });
  } catch {
    return null;
  }
}

async function verifyCertSignature(subject: PkiCertificate, issuer: PkiCertificate): Promise<boolean> {
  try {
    const result = await subject.verify(issuer);
    return result === true;
  } catch {
    return false;
  }
}

function certsEqual(a: PkiCertificate, b: PkiCertificate): boolean {
  try {
    const aSer = a.toSchema().toBER(false);
    const bSer = b.toSchema().toBER(false);
    if (aSer.byteLength !== bSer.byteLength) return false;
    const aView = new Uint8Array(aSer);
    const bView = new Uint8Array(bSer);
    for (let i = 0; i < aView.length; i++) {
      if (aView[i] !== bView[i]) return false;
    }
    return true;
  } catch {
    return false;
  }
}
