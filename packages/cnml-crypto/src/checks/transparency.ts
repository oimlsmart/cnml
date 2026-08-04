/**
 * Check 7: Transparency log entry.
 *
 * Verifies that the CNML certificate is anchored in a public, append-only
 * Merkle transparency log operated by BIML (or a designated log operator).
 * Mirrors RFC 6962 Certificate Transparency semantics: every issued cert
 * MUST appear in the public log so covert issuance is detectable.
 *
 * Two-layer proof:
 *   1. Merkle inclusion proof — cert hash → trusted log root
 *   2. OTS anchor — log root → Bitcoin block
 *
 * Both must verify. A cert whose log root isn't anchored to Bitcoin
 * fails (could be a fabricated log view).
 */

import type { Check, CheckContext, CheckResult } from "./types.ts";

/** SHA-256 over (0x01 || data) — leaf domain separator per RFC 6962. */
async function hashLeaf(data: Uint8Array): Promise<Uint8Array> {
  const buf = new Uint8Array(1 + data.length);
  buf[0] = 0x01;
  buf.set(data, 1);
  return sha256(buf);
}

/** SHA-256 over (0x02 || left || right) — internal node domain separator. */
async function hashInternal(left: Uint8Array, right: Uint8Array): Promise<Uint8Array> {
  const buf = new Uint8Array(1 + left.length + right.length);
  buf[0] = 0x02;
  buf.set(left, 1);
  buf.set(right, 1 + left.length);
  return sha256(buf);
}

/** SHA-256 of bytes, returned as Uint8Array. Accepts Uint8Array over any buffer kind. */
export async function sha256(data: Uint8Array): Promise<Uint8Array> {
  // Copy into a fresh ArrayBuffer-backed view to satisfy strict BufferSource typing
  // across environments where the input may be backed by SharedArrayBuffer.
  const copy = new Uint8Array(data.length);
  copy.set(data);
  const digest = await crypto.subtle.digest("SHA-256", copy.buffer);
  return new Uint8Array(digest);
}

/** Hex string → Uint8Array. */
function fromHex(hex: string): Uint8Array {
  const clean = hex.trim().replace(/\s+/g, "");
  if (clean.length % 2 !== 0) throw new Error("odd-length hex");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}

/** Uint8Array → lowercase hex. */
function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

/** Decode base64 (handles both standard and url-safe alphabets). */
function fromBase64(s: string): Uint8Array {
  const normalized = s.trim().replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** One step in a Merkle inclusion proof. */
interface ProofStep {
  /** Sibling hash. */
  sibling: Uint8Array;
  /** "left" if sibling sits to the LEFT of the current hash, "right" otherwise. */
  side: "left" | "right";
}

/** Parsed transparency proof. */
export interface TransparencyProof {
  /** Log operator (e.g., "BIML"). */
  logOperator: string;
  /** Sequence number of the leaf in the log. */
  sequence: number;
  /** The leaf hash being proven (SHA-256 of the cert hash per RFC 6962). */
  leafHash: Uint8Array;
  /** Inclusion proof steps from leaf up to (but not including) the root. */
  inclusionProof: ProofStep[];
  /** The log tree root the proof resolves to. */
  logRoot: Uint8Array;
  /** Tree size at the time of inclusion. */
  treeSize?: number;
  /** Embedded OTS proof for the log root (optional). */
  otsProof?: Uint8Array;
  /** Bitcoin block height the log root is anchored to (optional). */
  bitcoinHeight?: number;
}

/**
 * Verify a Merkle inclusion proof per RFC 6962.
 *
 * Walks the proof from leaf to root, combining sibling hashes per the
 * side bit. Returns true if the computed root matches `expectedRoot`.
 */
export async function verifyInclusion(
  leafHash: Uint8Array,
  proof: ProofStep[],
  expectedRoot: Uint8Array,
): Promise<boolean> {
  let current = leafHash;
  for (const step of proof) {
    current = step.side === "left"
      ? await hashInternal(step.sibling, current)
      : await hashInternal(current, step.sibling);
  }
  if (current.length !== expectedRoot.length) return false;
  let match = 0;
  for (let i = 0; i < current.length; i++) {
    match |= current[i] ^ expectedRoot[i];
  }
  return match === 0;
}

/** Parse the <cnml:tlog_proof> element from a CNML XML string. */
export function parseTransparencyProof(xml: string): TransparencyProof | null {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  // parsererror detection — getElementsByTagName, the same compatibility
  // pattern as parseCnmlXml (querySelector isn't always available —
  // e.g. @xmldom outside a browser).
  const err = doc.getElementsByTagName("parsererror")[0]
    ?? doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "parsererror")[0];
  if (err) return null;

  const proofEl = doc.getElementsByTagName("cnml:tlog_proof")[0]
    ?? doc.getElementsByTagNameNS("*", "tlog_proof")[0];
  if (!proofEl) return null;

  const logOperator = textOf(proofEl, "cnml:log_operator") ?? "unknown";
  const sequenceText = textOf(proofEl, "cnml:sequence");
  const leafHashHex = textOf(proofEl, "cnml:leaf_hash");
  const rootHex = textOf(proofEl, "cnml:log_root");
  const treeSizeText = textOf(proofEl, "cnml:tree_size");
  const otsB64 = textOf(proofEl, "cnml:ots_proof");
  const btcHeightText = textOf(proofEl, "cnml:bitcoin_height");

  if (!leafHashHex || !rootHex) return null;

  const inclusionEl = proofEl.getElementsByTagName("cnml:inclusion_proof")[0]
    ?? proofEl.getElementsByTagNameNS("*", "inclusion_proof")[0];

  const inclusionProof: ProofStep[] = [];
  if (inclusionEl) {
    const stepEls = inclusionEl.getElementsByTagName("cnml:step").length
      ? Array.from(inclusionEl.getElementsByTagName("cnml:step"))
      : Array.from(inclusionEl.getElementsByTagNameNS("*", "step"));
    for (const step of stepEls) {
      const siblingHex = textOf(step, "cnml:sibling");
      const side = textOf(step, "cnml:side");
      if (!siblingHex || side !== "left" && side !== "right") continue;
      inclusionProof.push({
        sibling: fromHex(siblingHex),
        side,
      });
    }
  }

  return {
    logOperator,
    sequence: sequenceText ? parseInt(sequenceText, 10) : 0,
    leafHash: fromHex(leafHashHex),
    inclusionProof,
    logRoot: fromHex(rootHex),
    treeSize: treeSizeText ? parseInt(treeSizeText, 10) : undefined,
    otsProof: otsB64 ? fromBase64(otsB64) : undefined,
    bitcoinHeight: btcHeightText ? parseInt(btcHeightText, 10) : undefined,
  };
}

/** Read the text content of a child element with the given tag name. */
function textOf(parent: Element, tagName: string): string | null {
  const el = parent.getElementsByTagName(tagName)[0]
    ?? parent.getElementsByTagNameNS("*", tagName.split(":")[1] ?? tagName)[0];
  return el?.textContent?.trim() ?? null;
}

/** Check 7: transparency log entry exists with valid inclusion proof. */
export const transparencyCheck: Check = {
  id: "transparency",
  label: "8. Transparency log entry",
  continueOnFail: true,
  run: async (xml, ctx): Promise<CheckResult> => {
    const proof = parseTransparencyProof(xml);
    if (!proof) {
      return {
        checkId: "transparency",
        status: "warn",
        reason: "No <cnml:tlog_proof> embedded — cert may predate logging or predate proof embedding",
      };
    }

    ctx.hasTransparencyProof = true;

    if (proof.inclusionProof.length === 0) {
      return {
        checkId: "transparency",
        status: "fail",
        reason: `Transparency proof present but has no inclusion steps (log operator: ${proof.logOperator})`,
      };
    }

    // Compute the leaf hash from the cert content (the entire CNML XML,
    // canonicalized) and compare to the proof's leafHash. This binds the
    // proof to the CNML bytes being verified.
    const certHash = await sha256(new TextEncoder().encode(xml));
    const expectedLeaf = await hashLeaf(certHash);

    const leafMatches = constantTimeEqual(expectedLeaf, proof.leafHash);
    if (!leafMatches) {
      return {
        checkId: "transparency",
        status: "fail",
        reason: `Leaf hash mismatch — proof is for a different CNML than the one being verified`,
      };
    }

    const rootOk = await verifyInclusion(proof.leafHash, proof.inclusionProof, proof.logRoot);
    if (!rootOk) {
      return {
        checkId: "transparency",
        status: "fail",
        reason: "Merkle inclusion proof does not resolve to the claimed log root",
      };
    }

    const anchored = !!proof.bitcoinHeight;
    const anchorText = anchored
      ? `, anchored to Bitcoin block ${proof.bitcoinHeight}`
      : " (no Bitcoin anchor embedded — log root trust is indirect)";

    return {
      checkId: "transparency",
      status: anchored ? "pass" : "warn",
      reason: `Inclusion proof valid (seq #${proof.sequence}, log operator: ${proof.logOperator}${anchorText})`,
      details: {
        logOperator: proof.logOperator,
        sequence: proof.sequence,
        treeSize: proof.treeSize,
        bitcoinHeight: proof.bitcoinHeight,
        logRoot: toHex(proof.logRoot),
      },
    };
  },
};

/** Constant-time byte comparison. */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
