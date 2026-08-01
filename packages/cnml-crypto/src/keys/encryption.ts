/**
 * Private-key encryption at rest.
 *
 * Wraps PKCS#8 private key bytes in an AES-256-GCM envelope
 * derived from a user passphrase via PBKDF2 (keys/kdf.ts).
 * The salt and IV are returned alongside the ciphertext and
 * must be stored together.
 */

import { deriveKey } from "./kdf.ts";

const SUBTLE = globalThis.crypto.subtle;

export async function encryptPrivateKey(
  privateKeyPkcs8: ArrayBuffer,
  passphrase: string,
): Promise<{ encrypted: ArrayBuffer; salt: ArrayBuffer; iv: ArrayBuffer }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const aesKey = await deriveKey(passphrase, salt);
  const encrypted = await SUBTLE.encrypt({ name: "AES-GCM", iv }, aesKey, privateKeyPkcs8);
  return { encrypted, salt, iv };
}

export async function decryptPrivateKey(
  encrypted: ArrayBuffer,
  salt: ArrayBuffer,
  iv: ArrayBuffer,
  passphrase: string,
): Promise<ArrayBuffer> {
  const aesKey = await deriveKey(passphrase, salt);
  return SUBTLE.decrypt({ name: "AES-GCM", iv }, aesKey, encrypted);
}
