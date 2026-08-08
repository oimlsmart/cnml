/**
 * OpenTimestamps integration — free blockchain-backed timestamping.
 *
 * No TSA server needed. The Bitcoin blockchain is the immutable timestamp
 * authority. Submit a hash → get a Merkle proof → verify it later.
 *
 * API: https://opentimestamps.org/api/v1/timestamp/
 * - POST /stamp  → submit hash, get .ots proof
 * - POST /verify → submit hash + proof, get Bitcoin block timestamp
 */

import { bytesToBase64, base64ToBytes } from "./shared/base64.ts";

const OTS_STAMP_URL  = "https://opentimestamps.org/api/v1/timestamp/stamp";
const OTS_VERIFY_URL = "https://opentimestamps.org/api/v1/timestamp/verify";

/**
 * Submit a CNML's SHA-256 hash to OpenTimestamps.
 * Returns a base64-encoded .ots proof (typically ~1 KB).
 *
 * The proof anchors the hash in a Bitcoin block within 1-2 hours.
 * Until anchored, verification returns "pending".
 */
export async function timestampCnml(xml: string): Promise<string> {
  const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(xml));
  const hashHex = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const res = await fetch(OTS_STAMP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: hashHex,
  });

  if (!res.ok) {
    throw new Error(`OpenTimestamps stamp failed: ${res.status} ${res.statusText}`);
  }

  const proofBuf = await res.arrayBuffer();
  return bytesToBase64(new Uint8Array(proofBuf));
}

/**
 * Verify an OpenTimestamps proof against the Bitcoin blockchain.
 *
 * Returns the block timestamp (Date) if the proof is anchored,
 * or null if still pending (try again in 1-2 hours).
 */
export async function verifyTimestamp(
  xml: string,
  otsProofBase64: string,
): Promise<{ timestamp: Date | null; blockHeight: number | null; status: string }> {
  const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(xml));
  const proofBytes = base64ToBytes(otsProofBase64);

  const formData = new FormData();
  formData.append("file", new Blob([hashBuf]), "hash");
  formData.append("proof", new Blob([proofBytes]), "proof.ots");

  const res = await fetch(OTS_VERIFY_URL, { method: "POST", body: formData });

  if (!res.ok) {
    return { timestamp: null, blockHeight: null, status: "verification_failed" };
  }

  const result = await res.json();

  if (result.timestamp) {
    return {
      timestamp: new Date(result.timestamp * 1000),
      blockHeight: result.height ?? null,
      status: "anchored",
    };
  }

  return { timestamp: null, blockHeight: null, status: "pending" };
}

/**
 * Embed an OTS proof in a CNML XML string.
 * Inserts <cnml:timestamp> after the closing </ds:Signature>.
 */
export function embedTimestampInXml(xml: string, otsProofBase64: string): string {
  const tsElement = `<cnml:timestamp><cnml:otsProof encoding="base64">${otsProofBase64}</cnml:otsProof><cnml:timestampService>OpenTimestamps (Bitcoin)</cnml:timestampService></cnml:timestamp>`;

  // Insert before the closing root tag
  const closeTag = xml.lastIndexOf("</cnml:certificatNumeriqueMetrologieLegale>");
  if (closeTag < 0) return xml + tsElement;
  return xml.slice(0, closeTag) + tsElement + xml.slice(closeTag);
}

/**
 * Extract an OTS proof from a CNML XML string, if present.
 */
export function extractTimestampFromXml(xml: string): { proof: string; service: string } | null {
  const match = xml.match(/<cnml:otsProof[^>]*>([^<]+)<\/cnml:otsProof>/);
  if (!match) return null;
  const serviceMatch = xml.match(/<cnml:timestampService>([^<]+)<\/cnml:timestampService>/);
  return {
    proof: match[1]!,
    service: serviceMatch?.[1] ?? "unknown",
  };
}
