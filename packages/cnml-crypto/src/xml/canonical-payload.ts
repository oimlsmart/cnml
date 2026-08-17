/**
 * Canonical payload computation (XML-native, never string surgery).
 *
 * The canonical payload is the document minus every signature-bearing
 * element (ds:Signature, cnml:coSignature, cnml:tlog_proof),
 * canonicalized with Exclusive C14N — the same byte form every
 * signature covers. Its SHA-256 is the transparency log entry (the
 * leaf), so a verifier recomputes the leaf from any formatting of
 * the same document. Mirrors the Ruby CanonicalPayload module;
 * cross-language agreement is pinned by the embedded-proof fixture.
 */

import * as xmldsig from "xmldsigjs";
import { ensureXmldsigEngine } from "./engine.ts";
import { sha256 } from "../checks/transparency.ts";
import { CNML_NS } from "./cosign.ts";

const DS_NS = "http://www.w3.org/2000/09/xmldsig#";

function stripSignatures(root: Element): void {
  for (const el of Array.from(root.getElementsByTagNameNS(DS_NS, "Signature"))) {
    el.parentNode?.removeChild(el);
  }
  for (const el of Array.from(root.getElementsByTagNameNS(CNML_NS, "coSignature"))) {
    el.parentNode?.removeChild(el);
  }
  for (const el of Array.from(root.getElementsByTagNameNS(CNML_NS, "tlog_proof"))) {
    el.parentNode?.removeChild(el);
  }
}

/** The exclusive-C14N canonical payload bytes of the document. */
export function canonicalPayload(xml: string): Uint8Array {
  ensureXmldsigEngine();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const err = doc.getElementsByTagName("parsererror")[0]
    ?? doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "parsererror")[0];
  if (err || !doc.documentElement) throw new Error("not well-formed XML");

  stripSignatures(doc.documentElement);

  const transform = new xmldsig.XmlDsigExcC14NTransform();
  transform.LoadInnerXml(doc.documentElement);
  const out = transform.GetOutput();
  return typeof out === "string"
    ? new TextEncoder().encode(out)
    : new Uint8Array(out);
}

/** SHA-256 of the canonical payload (the transparency leaf entry). */
export async function canonicalPayloadHash(xml: string): Promise<Uint8Array> {
  return sha256(canonicalPayload(xml));
}
