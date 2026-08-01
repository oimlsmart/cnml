/**
 * SHA-256 hash helpers.
 *
 * Leaf utility — no internal dependencies. Used by key generation
 * (fingerprinting), PEM import (fingerprinting), and the trust
 * anchor module.
 */

const SUBTLE = globalThis.crypto.subtle;

export async function sha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const buf = data instanceof Uint8Array ? data : new Uint8Array(data);
  const hash = await SUBTLE.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
