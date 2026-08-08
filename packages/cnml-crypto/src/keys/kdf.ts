/**
 * PBKDF2 key derivation.
 *
 * Derives an AES-GCM key from a passphrase + salt. Used by
 * key encryption at rest (keys/encryption.ts).
 */

import { SUBTLE } from "../shared/crypto.ts";

export async function deriveKey(passphrase: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await SUBTLE.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  return SUBTLE.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
