/**
 * Import trusted public keys from PEM.
 *
 * Public-key-only path: produces TrustedPublicKey records (no
 * private material) for the trust store, or returns a verify-only
 * CryptoKey for one-shot verification.
 */

import type { TrustedPublicKey } from "./store.ts";
import { sha256Hex } from "../hash.ts";
import { pemToDer } from "../pem.ts";

const SUBTLE = globalThis.crypto.subtle;

/**
 * Import a public key from a PEM file (SPKI). Returns a TrustedPublicKey
 * ready for storage in the trust store. Does NOT store a private key.
 */
export async function importPublicKeyFromPem(pem: string, alias: string): Promise<TrustedPublicKey> {
  const { der, label } = pemToDer(pem);
  if (!label.includes("PUBLIC")) {
    throw new Error(`Expected a PUBLIC KEY PEM, got "${label}"`);
  }
  const fingerprint = await sha256Hex(der);
  return {
    id: `trusted_${fingerprint.slice(0, 12)}`,
    alias,
    publicKeySpki: der,
    fingerprint,
    created: Date.now(),
  };
}

export async function loadTrustedPublicKey(pem: string): Promise<CryptoKey> {
  const { der, label } = pemToDer(pem);
  if (!label.includes("PUBLIC")) {
    throw new Error(`Expected a PUBLIC KEY PEM, got "${label}"`);
  }
  return SUBTLE.importKey(
    "spki", der,
    { name: "ECDSA", namedCurve: "P-256" },
    true, ["verify"],
  );
}
