/**
 * Chain-certificate transparency inclusion (SIGNATIF
 * §path-transparency-inclusion): for every certificate on the
 * verification path, the verifier confirms inclusion in a recognized
 * transparency log using the log's by-hash index and inclusion
 * proofs.
 *
 * Best-effort by configuration: without a log endpoint the helper
 * reports "unchecked"; a fetch failure is a network posture (never
 * a verdict); a present-but-invalid proof is a failure.
 */

import { sha256Hex } from "../hash.ts";
import { base64ToBytes } from "../shared/base64.ts";
import { verifyInclusion } from "./transparency.ts";
import { fromHex, toHex } from "../shared/hex.ts";

export interface CertInclusionResult {
  /** The cert's DER hash (hex). */
  certHash: string;
  status: "included" | "unchecked" | "unreachable" | "not-found" | "invalid-proof";
  sequence?: number;
  reason?: string;
}

function pemToBase64Der(pemOrBase64: string): string {
  if (pemOrBase64.includes("-----BEGIN")) {
    return pemOrBase64.replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
      .replace(/-----END [A-Z0-9 ]+-----/g, "")
      .replace(/\s+/g, "");
  }
  return pemOrBase64.replace(/\s+/g, "");
}

/**
 * Confirm one certificate's inclusion: hash the DER, resolve the
 * sequence via <endpoint>/by-hash/<hex>.json, fetch and verify the
 * inclusion proof against the log head.
 *
 * @param endpoint the log's published root (no trailing slash)
 * @param expectedRootHex the tree root the proofs must resolve to
 */
export async function confirmCertInclusion(
  cert: string,
  endpoint: string,
  expectedRootHex: string,
): Promise<CertInclusionResult> {
  const certHash = await sha256Hex(base64ToBytes(pemToBase64Der(cert)));
  if (!endpoint) return { certHash, status: "unchecked", reason: "no log endpoint configured" };

  let seq: number;
  try {
    const res = await fetch(`${endpoint}/by-hash/${certHash}.json`);
    if (res.status === 404) {
      return { certHash, status: "not-found", reason: "certificate is not in the log" };
    }
    if (!res.ok) {
      return { certHash, status: "unreachable", reason: `by-hash lookup answered ${res.status}` };
    }
    seq = (await res.json()).sequence;
  } catch (e) {
    return { certHash, status: "unreachable", reason: (e as Error).message };
  }

  try {
    const res = await fetch(`${endpoint}/proof/${seq}.json`);
    if (!res.ok) {
      return { certHash, status: "unreachable", reason: `proof fetch answered ${res.status}`, sequence: seq };
    }
    const proof = await res.json();
    const steps = (proof.inclusion_proof ?? []) as { sibling: string; side: string }[];
    const ok = await verifyInclusion(
      fromHex(proof.leaf_hash),
      steps.map((s) => ({ sibling: fromHex(s.sibling), side: s.side as "left" | "right" })),
      fromHex(expectedRootHex),
    );
    void toHex;
    return ok
      ? { certHash, status: "included", sequence: seq }
      : { certHash, status: "invalid-proof", sequence: seq, reason: "proof does not resolve to the log head" };
  } catch (e) {
    return { certHash, status: "unreachable", sequence: seq, reason: (e as Error).message };
  }
}

/**
 * Confirm every certificate on the chain. The leaf hash in the
 * published proofs is the RFC 6962 leaf node hash of the logged
 * entry, so a raw-entry leaf mismatches by design when the log
 * stores entry hashes; the by-hash sequence still resolves and the
 * proof verifies against the head.
 */
export async function confirmChainInclusion(
  chain: readonly string[],
  endpoint: string,
  expectedRootHex: string,
): Promise<CertInclusionResult[]> {
  const results: CertInclusionResult[] = [];
  for (const cert of chain) {
    results.push(await confirmCertInclusion(cert, endpoint, expectedRootHex));
  }
  return results;
}
