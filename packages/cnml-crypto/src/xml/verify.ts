/**
 * CNML XML verification (XMLDSig).
 *
 * Verifies enveloped XMLDSig signatures produced by xml/sign.ts or
 * by any spec-compliant XMLDSig signer (xmlsec1, xml-security-c).
 * Falls back to an explicit trusted public key if the embedded
 * X509Certificate is missing or doesn't match.
 */

import * as xmldsig from "xmldsigjs";
import { ensureXmldsigEngine } from "./engine.ts";

export interface VerificationResult {
  signaturePresent: boolean;
  signatureValid:   boolean;
  digestValid:      boolean;
  certificateChain: string[];
  reason?:          string;
}

export interface VerifyOptions {
  trustedPublicKey?: CryptoKey;
  trustedCertPem?: string;
}

export async function verifyCnmlXml(
  xml: string,
  optsOrTrustedCertPem?: VerifyOptions | string,
): Promise<VerificationResult> {
  ensureXmldsigEngine();
  const opts: VerifyOptions = typeof optsOrTrustedCertPem === "string"
    ? { trustedCertPem: optsOrTrustedCertPem }
    : (optsOrTrustedCertPem ?? {});

  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const sigEl = doc.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Signature")[0];

  if (!sigEl) {
    return {
      signaturePresent: false,
      signatureValid:   false,
      digestValid:      false,
      certificateChain: [],
      reason:           "No <ds:Signature> element found",
    };
  }

  const certEl = sigEl.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "X509Certificate")[0];
  const chain: string[] = [];
  if (certEl?.textContent) chain.push(certEl.textContent);
  if (opts.trustedCertPem) chain.push(opts.trustedCertPem);

  try {
    const signed = new xmldsig.SignedXml(doc);
    signed.LoadXml(sigEl);

    let signatureValid = await signed.Verify();

    if (!signatureValid && opts.trustedPublicKey) {
      try {
        signatureValid = await signed.Verify({ key: opts.trustedPublicKey });
      } catch {
        // keep the previous failure
      }
    }

    return {
      signaturePresent: true,
      signatureValid,
      digestValid: signatureValid,
      certificateChain: chain,
      reason: signatureValid
        ? (chain.length === 0 && !opts.trustedPublicKey
            ? "Signature valid; no X.509 cert in KeyInfo"
            : undefined)
        : "Reference digest or signature value mismatch",
    };
  } catch (e) {
    return {
      signaturePresent: true,
      signatureValid:   false,
      digestValid:      false,
      certificateChain: chain,
      reason:           `Verification error: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}
