/**
 * IndexedDB trust store.
 *
 * Stores TrustedPublicKey records — public keys only, no private
 * material. Used to verify signatures against a known set of
 * trusted signers (e.g., IA certificate pinned by the verifier).
 *
 * Object store name `trusted-keys` and DB name `cnml-trust` are
 * part of the on-disk contract — changing them invalidates existing
 * browser data.
 */

import { createIdbStore } from "../shared/idb-store.ts";

export interface TrustedPublicKey {
  id: string;
  alias: string;
  publicKeySpki: ArrayBuffer;
  fingerprint: string;
  created: number;
}

import { SUBTLE } from "../shared/crypto.ts";

const store = createIdbStore<TrustedPublicKey>("cnml-trust", "trusted-keys");

export async function storeTrustedKey(key: TrustedPublicKey): Promise<void> {
  await store.put(key);
}

export async function listTrustedKeys(): Promise<TrustedPublicKey[]> {
  return store.getAll();
}

export async function getTrustedKey(id: string): Promise<TrustedPublicKey | undefined> {
  return store.get(id);
}

export async function deleteTrustedKey(id: string): Promise<void> {
  await store.remove(id);
}

/**
 * Load a trusted public key from a CryptoKey (already imported).
 */
export async function cryptoKeyFromTrustedKey(stored: TrustedPublicKey): Promise<CryptoKey> {
  return SUBTLE.importKey(
    "spki", stored.publicKeySpki,
    { name: "ECDSA", namedCurve: "P-256" },
    true, ["verify"],
  );
}
