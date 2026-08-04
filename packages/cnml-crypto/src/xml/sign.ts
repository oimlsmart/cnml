/**
 * CNML XML signing (XMLDSig enveloped, Exclusive C14N).
 *
 * Produces an enveloped signature inside the root element with:
 *   - CanonicalizationMethod: Exclusive C14N (http://www.w3.org/2001/10/xml-exc-c14n#)
 *   - SignatureMethod:        ECDSA-SHA256
 *   - Reference:              enveloped-signature + exc-c14n transforms, SHA-256 digest
 *   - KeyInfo:                X509Certificate (if cert provided)
 *
 * The result verifies against xmlsec1, xml-security-c, and other spec-compliant
 * XMLDSig implementations.
 *
 * Implementation note: xmldsigjs's SignedXml must be constructed with the
 * ELEMENT to sign (the root), not the document. Sign() then inserts the
 * Signature element as the last child of that element automatically —
 * do NOT manually GetXml/importNode/appendChild (the previous pattern
 * produced signatures whose enveloped-signature + C14N transforms
 * didn't match at verify time on full certs with measurement results).
 */

import * as xmldsig from "xmldsigjs";
import { ensureXmldsigEngine } from "./engine.ts";

// xmldsigjs.Sign() takes a wide range of algorithm spec shapes; cast for TS.
type AlgSpec = ConstructorParameters<typeof xmldsig.Algorithm>[0];

export async function signCnmlXml(
  xml: string,
  privateKey: CryptoKey,
  x509CertPem?: string | string[],
): Promise<string> {
  ensureXmldsigEngine();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;

  const signed = new xmldsig.SignedXml(root);

  const algorithm = { name: "ECDSA", hash: "SHA-256" };

  // The KeyInfo chain: a single cert or the full path
  // (officer cert + intermediates + root) — the verifier resolves
  // without a trust store.
  const pems = Array.isArray(x509CertPem) ? x509CertPem : x509CertPem ? [x509CertPem] : [];
  const x509 = pems.length
    ? pems.map(p =>
        p
          .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
          .replace(/-----END [A-Z0-9 ]+-----/g, "")
          .replace(/\s+/g, ""),
      )
    : undefined;

  await signed.Sign(
    algorithm as AlgSpec,
    privateKey,
    root,
    {
      id: "cnml-signature",
      x509,
      references: [
        {
          hash: "SHA-256",
          transforms: ["enveloped", "exc-c14n"],
        },
      ],
    },
  );

  // xmldsigjs Sign() does not auto-append. GetXml() returns the built
  // Signature element which we must insert into our document explicitly.
  const sigEl = signed.GetXml();
  if (!sigEl) throw new Error("signing failed: no Signature element produced");
  root.appendChild(doc.importNode(sigEl, true));

  return new XMLSerializer().serializeToString(doc);
}
