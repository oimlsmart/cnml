/**
 * CNML multi-dimensional co-signatures (SIGNATIF Phase 2).
 *
 * A co-signed CNML document carries one primary ds:Signature plus
 * any number of cnml:coSignature wrappers, each holding its own
 * ds:Signature from an independent signer. Every signature —
 * primary and co — covers the SAME canonical payload: the root
 * element minus all Signature and coSignature nodes, exclusive
 * C14N canonicalized.
 *
 * Mechanism: each Reference uses the standard XPath transform
 *
 *   count(ancestor-or-self::ds:Signature
 *        | ancestor-or-self::cnml:coSignature) = 0
 *
 * followed by exc-c14n. At signing time each signature is computed
 * over a pristine (signature-free) parse of the payload, so the
 * transform is a no-op; at verification time it strips every
 * signature-bearing node, yielding the identical digest input for
 * all signers. The transform is plain W3C XMLDSig (REC-xpath), so
 * third-party verifiers (xmlsec1, xml-security) interoperate.
 */

import * as xmldsig from "xmldsigjs";
import { ensureXmldsigEngine } from "./engine.ts";

export const CNML_NS = "https://oimlsmart.org/schemas/cnml/1.0";
const DS_NS = "http://www.w3.org/2000/09/xmldsig#";

type AlgSpec = ConstructorParameters<typeof xmldsig.Algorithm>[0];

/** Transform chain shared by the primary signature and all co-signatures. */
const PAYLOAD_TRANSFORMS = [
  {
    name: "xpath" as const,
    selector:
      "count(ancestor-or-self::ds:Signature | ancestor-or-self::cnml:coSignature) = 0",
    namespaces: { ds: DS_NS, cnml: CNML_NS },
  },
  "exc-c14n",
];

export interface CosignerSpec {
  /** Trust dimension this signer attests (person, environment, ...). */
  dimension: string;
  privateKey: CryptoKey;
  /** The co-signer's certificate (e.g., the certified tester credential). */
  certPem?: string;
}

function stripPem(pem: string): string {
  return pem
    .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
    .replace(/-----END [A-Z0-9 ]+-----/g, "")
    .replace(/\s+/g, "");
}

/**
 * Sign CNML XML with a primary signer plus independent co-signers.
 *
 * Every signer covers the same canonical payload; each co-signature
 * lands inside <cnml:coSignature dimension="..."> as a sibling of the
 * primary ds:Signature.
 */
export async function signCnmlXmlWithCosignatures(
  xml: string,
  primary: { privateKey: CryptoKey; certPem?: string },
  cosigners: CosignerSpec[],
): Promise<string> {
  ensureXmldsigEngine();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;

  const x509Of = (pem?: string) => (pem ? [stripPem(pem)] : undefined);

  // Primary signature — computed over the pristine payload.
  const primarySigned = new xmldsig.SignedXml(root);
  await primarySigned.Sign(
    { name: "ECDSA", hash: "SHA-256" } as AlgSpec,
    primary.privateKey,
    root,
    {
      id: "cnml-signature",
      x509: x509Of(primary.certPem),
      references: [{ hash: "SHA-256", transforms: PAYLOAD_TRANSFORMS }],
    },
  );
  const primarySig = primarySigned.GetXml();
  if (!primarySig) throw new Error("signing failed: no Signature element produced");
  root.appendChild(doc.importNode(primarySig, true));

  // Co-signatures — each over its own pristine parse so the XPath
  // transform is a no-op at signing time.
  for (const cosigner of cosigners) {
    const pristine = new DOMParser().parseFromString(xml, "application/xml");
    const pristineRoot = pristine.documentElement;
    const signed = new xmldsig.SignedXml(pristineRoot);
    await signed.Sign(
      { name: "ECDSA", hash: "SHA-256" } as AlgSpec,
      cosigner.privateKey,
      pristineRoot,
      {
        id: `cnml-cosig-${cosigner.dimension}`,
        x509: x509Of(cosigner.certPem),
        references: [{ hash: "SHA-256", transforms: PAYLOAD_TRANSFORMS }],
      },
    );
    const sig = signed.GetXml();
    if (!sig) throw new Error(`co-signing failed for dimension ${cosigner.dimension}`);

    const wrapper = doc.createElementNS(CNML_NS, "cnml:coSignature");
    wrapper.setAttribute("dimension", cosigner.dimension);
    wrapper.appendChild(doc.importNode(sig, true));
    root.appendChild(wrapper);
  }

  return new XMLSerializer().serializeToString(doc);
}
