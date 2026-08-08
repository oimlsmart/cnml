/**
 * Hex encoding/decoding utilities for byte arrays.
 *
 * Used across the crypto package: hash fingerprints, transparency
 * proofs, CRL serial numbers. The pattern
 * `Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("")`
 * was repeated in four modules; this file is the single source.
 */

/** Encode a byte array as a lowercase hex string. */
export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Decode a hex string to a byte array. Throws on odd-length input. */
export function fromHex(hex: string): Uint8Array {
  const clean = hex.trim().replace(/\s+/g, "");
  if (clean.length % 2 !== 0) throw new Error("odd-length hex");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}
