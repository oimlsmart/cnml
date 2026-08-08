/**
 * SHA-256 hash helpers.
 *
 * Leaf utility — uses the shared hex encoder. Used by key generation
 * (fingerprinting), PEM import (fingerprinting), and the trust anchor
 * module.
 */

import { toHex } from "./shared/hex.ts";

const SUBTLE = globalThis.crypto.subtle;

export async function sha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const buf = data instanceof Uint8Array ? data : new Uint8Array(data);
  const hash = await SUBTLE.digest("SHA-256", buf);
  return toHex(new Uint8Array(hash));
}
