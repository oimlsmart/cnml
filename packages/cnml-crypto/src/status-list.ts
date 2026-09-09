/**
 * W3C Bitstring Status List verification (VC-native revocation),
 * supported alongside X.509 CRLs for the VC composition path
 * (SIGNATIF §revocation: the status surface is a deployment
 * decision; status lists are the recognized VC-native form).
 *
 * A credential carries a BitstringStatusListEntry pointing at a
 * status list credential: a bitstring where each bit is the status
 * of one issued credential, expansion-encoded (gzip + base64url),
 * indexed by statusListIndex, with 2 bits per entry in the standard
 * configuration (bit 0 = revocation, bit 1 = suspension).
 *
 * See https://www.w3.org/TR/vc-bitstring-status-list/
 */

import { base64ToBytes } from "./shared/base64.ts";

export interface StatusListEntry {
  /** The status list credential's id. */
  statusListCredential: string;
  /** Which bit of the multi-bit entry this status refers to. */
  statusListIndex: string;
  /** revocation | suspension | message. */
  statusPurpose: string;
}

export interface StatusListCredential {
  /** The bitstring, expansion-encoded (gzip base64url per the spec). */
  encodedList: string;
  issuer?: string;
  validFrom?: string;
  validUntil?: string;
}

export type CredentialStatus =
  | { kind: "revoked" }
  | { kind: "suspended" }
  | { kind: "unset" }
  | { kind: "unknown"; reason: string };

/** Parse a BitstringStatusListEntry off a VC's credentialStatus. */
export function parseStatusListEntry(credentialStatus: unknown): StatusListEntry | null {
  if (typeof credentialStatus !== "object" || credentialStatus === null) return null;
  const cs = credentialStatus as Record<string, unknown>;
  if (cs.type !== "BitstringStatusListEntry") return null;
  const statusListCredential = cs.statusListCredential ?? cs.statusListCredentialId;
  const statusListIndex = cs.statusListIndex;
  if (typeof statusListCredential !== "string" || typeof statusListIndex !== "string") {
    return null;
  }
  return {
    statusListCredential,
    statusListIndex,
    statusPurpose: typeof cs.statusPurpose === "string" ? cs.statusPurpose : "revocation",
  };
}

/**
 * Read one status out of a status list credential.
 *
 * The list is expansion-encoded per the spec: base64url of the gzip
 * of the bitstring, least-significant bit first, 2 bits per index in
 * the standard configuration.
 */
export async function readCredentialStatus(
  entry: StatusListEntry,
  list: StatusListCredential,
  decompress: (bytes: Uint8Array) => Promise<Uint8Array> = defaultDecompress,
): Promise<CredentialStatus> {
  let bits: Uint8Array;
  try {
    // base64url normalization (the spec alphabet; - and _ allowed).
    // Some deployments (and the reference exploration) prefix the
    // multibase base64url marker: "u" before the gzip magic "H4sI".
    let encoded = list.encodedList.replace(/-/g, "+").replace(/_/g, "/");
    if (encoded.startsWith("uH4sI")) encoded = encoded.slice(1);
    const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
    bits = await decompress(base64ToBytes(padded));
  } catch (e) {
    return { kind: "unknown", reason: `cannot decode the status list: ${(e as Error).message}` };
  }

  const idx = Number(entry.statusListIndex);
  if (!Number.isInteger(idx) || idx < 0) {
    return { kind: "unknown", reason: `invalid statusListIndex '${entry.statusListIndex}'` };
  }

  // 2 bits per credential: bit 0 (LSB of the pair) = revocation,
  // bit 1 = suspension.
  const bitOffset = idx * 2;
  const byte = Math.floor(bitOffset / 8);
  const withinByte = bitOffset % 8;
  if (byte >= bits.length) {
    return { kind: "unknown", reason: `index ${idx} outside the list` };
  }
  const revokedBit = (bits[byte] >> withinByte) & 1;
  const suspendedBit = (bits[byte] >> (withinByte + 1)) & 1;

  if (revokedBit === 1) return { kind: "revoked" };
  if (suspendedBit === 1) return { kind: "suspended" };
  return { kind: "unset" };
}

async function defaultDecompress(bytes: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("gzip");
  const stream = new Blob([bytes as unknown as BlobPart]).stream().pipeThrough(ds);
  const buf = await new Response(stream).arrayBuffer();
  return new Uint8Array(buf);
}
