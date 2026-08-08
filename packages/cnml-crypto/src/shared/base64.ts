/**
 * Base64 encoding/decoding utilities for byte arrays.
 *
 * Used across the crypto package: OTS proofs, scope extensions,
 * PQ keys, transparency proofs, CRL distribution points, composite
 * signatures. The atob/btoa + String.fromCharCode pattern was
 * repeated in 7+ modules; this file is the single source.
 */

/** Encode a byte array as a base64 string (no line breaks). */
export function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin);
}

/** Decode a base64 string to a byte array. */
export function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
