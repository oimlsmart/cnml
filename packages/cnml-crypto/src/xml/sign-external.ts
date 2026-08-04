/**
 * CNML XML signing with an EXTERNAL signer — the
 * two-phase XMLDSig assembly for keys that never exist locally: a
 * threshold quorum (the group key never assembles), an HSM, a PKCS#11
 * token. Phase 1 happens HERE: the SignedInfo is built and canonicalized
 * (inclusive C14N, mirroring the local path's emitted shape). Phase 2
 * happens ELSEWHERE: the signer receives the canonical SignedInfo bytes
 * and returns the raw r‖s ECDSA-P256 signature, which this module
 * inserts as SignatureValue.
 *
 * The emitted document is one shape with xml/sign.ts's locally-signed
 * output: same Signature Id, same CanonicalizationMethod
 * (REC-xml-c14n-20010315), same reference transforms (enveloped +
 * exc-c14n), same 64-byte SignatureValue — so the standard verify path
 * (xml/verify.ts) treats both identically, and the signature check's
 * trust semantics (the embedded X.509 chain IS the identity) apply
 * unchanged. For the quorum path the chain is the GROUP certificate —
 * no self-issued placeholder; the caller supplies it.
 *
 * Self-consistency note: the reference digest is computed over the root
 * BEFORE the Signature element is appended (the enveloped transform's
 * starting state), and the SignedInfo is canonicalized AFTER appending
 * (inclusive C14N folds in the root's in-scope namespaces — the same
 * document context the verifier re-canonicalizes in).
 */

import * as xmldsig from "xmldsigjs";
import { ensureXmldsigEngine } from "./engine.ts";

const DSIG_NS = "http://www.w3.org/2000/09/xmldsig#";
const C14N_INCLUSIVE = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
const C14N_EXC = "http://www.w3.org/2001/10/xml-exc-c14n#";
const ECDSA_SHA256 = "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256";
const ENVELOPED = "http://www.w3.org/2000/09/xmldsig#enveloped-signature";
const SHA256 = "http://www.w3.org/2001/04/xmlenc#sha256";

/** The external signing oracle: receives the canonical SignedInfo
 *  bytes, returns the raw r‖s ECDSA-P256 signature (64 bytes). */
export type ExternalSigner = (canonicalSignedInfo: Uint8Array) => Promise<Uint8Array>;

export async function signCnmlXmlExternal(
  xml: string,
  signer: ExternalSigner,
  x509CertPem?: string | string[],
): Promise<string> {
  ensureXmldsigEngine();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;

  const el = (name: string, text?: string): Element => {
    const e = doc.createElementNS(DSIG_NS, `ds:${name}`);
    if (text !== undefined) e.textContent = text;
    return e;
  };

  // ① The reference digest over the root BEFORE the Signature exists —
  //    the enveloped transform's starting state (exc-c14n, SHA-256).
  const canonicalRoot = new xmldsig.XmlCanonicalizer(false, true).Canonicalize(root);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalRoot));

  // ② Build the Signature subtree (the local path's emitted shape).
  const sig = el("Signature");
  sig.setAttribute("Id", "cnml-signature");
  const signedInfo = el("SignedInfo");
  const c14nMethod = el("CanonicalizationMethod");
  c14nMethod.setAttribute("Algorithm", C14N_INCLUSIVE);
  const sigMethod = el("SignatureMethod");
  sigMethod.setAttribute("Algorithm", ECDSA_SHA256);
  const reference = el("Reference");
  const transforms = el("Transforms");
  const t1 = el("Transform");
  t1.setAttribute("Algorithm", ENVELOPED);
  const t2 = el("Transform");
  t2.setAttribute("Algorithm", C14N_EXC);
  transforms.appendChild(t1);
  transforms.appendChild(t2);
  const digestMethod = el("DigestMethod");
  digestMethod.setAttribute("Algorithm", SHA256);
  reference.appendChild(transforms);
  reference.appendChild(digestMethod);
  reference.appendChild(el("DigestValue", base64Encode(new Uint8Array(digest))));
  signedInfo.appendChild(c14nMethod);
  signedInfo.appendChild(sigMethod);
  signedInfo.appendChild(reference);
  sig.appendChild(signedInfo);

  // ③ Append BEFORE canonicalizing. The SignedInfo's canonical form is
  //    computed EXACTLY as xmldsigjs's TransformSignedInfo does at both
  //    sign and verify time: the element is cloned and the ROOT's
  //    declared namespaces (xmlns:ds, xmlns:unitsml, …) are injected as
  //    literal attributes (its CopyNamespaces step), then inclusive C14N
  //    canonicalizes the detached clone. Canonicalizing the in-document
  //    element instead drops the unused-but-in-scope unitsml namespace
  //    and produces bytes the verifier will NOT reproduce — the one
  //    trap in the two-phase assembly. The injected attributes go into
  //    the canonical form ONLY; the emitted document keeps the bare
  //    SignedInfo (the verifier re-injects).
  root.appendChild(sig);
  const clone = signedInfo.cloneNode(true) as Element;
  for (const attr of Array.from(root.attributes)) {
    if ((attr.name === "xmlns" || attr.name.startsWith("xmlns:")) && !clone.hasAttribute(attr.name)) {
      clone.setAttribute(attr.name, attr.value);
    }
  }
  const canonicalSignedInfo = new xmldsig.XmlCanonicalizer(false, false).Canonicalize(clone);

  // ④ The signature happens ELSEWHERE (the quorum, the HSM).
  const signature = await signer(new TextEncoder().encode(canonicalSignedInfo));
  if (!(signature instanceof Uint8Array) || signature.length === 0) {
    throw new Error(`the external signer returned no signature (got ${signature === null ? "null" : typeof signature})`);
  }
  sig.appendChild(el("SignatureValue", base64Encode(signature)));

  // ⑤ The KeyInfo chain (the quorum's GROUP certificate path — the
  //    verifier resolves without a trust store).
  const pems = Array.isArray(x509CertPem) ? x509CertPem : x509CertPem ? [x509CertPem] : [];
  if (pems.length) {
    const keyInfo = el("KeyInfo");
    const x509Data = el("X509Data");
    for (const p of pems) {
      const stripped = p
        .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
        .replace(/-----END [A-Z0-9 ]+-----/g, "")
        .replace(/\s+/g, "");
      x509Data.appendChild(el("X509Certificate", stripped));
    }
    keyInfo.appendChild(x509Data);
    sig.appendChild(keyInfo);
  }

  return new XMLSerializer().serializeToString(doc);
}

function base64Encode(data: Uint8Array): string {
  let bin = "";
  for (const b of data) bin += String.fromCharCode(b);
  return btoa(bin);
}
