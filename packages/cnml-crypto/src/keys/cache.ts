/**
 * In-memory CryptoKey cache.
 *
 * Single source of truth for decrypted CryptoKey objects. All three
 * mutations — generate, load, delete — go through this module so the
 * cache stays coherent. Avoids re-running PBKDF2 + AES-GCM on every
 * sign operation.
 */

import type { StoredKey } from "./types.ts";
import { decryptPrivateKey } from "./encryption.ts";

const SUBTLE = globalThis.crypto.subtle;

interface CachedCryptoKey { public: CryptoKey; private?: CryptoKey; }

const cryptoCache = new Map<string, CachedCryptoKey>();

export async function loadCryptoKey(
  stored: StoredKey,
  passphrase: string,
): Promise<CryptoKey> {
  const cached = cryptoCache.get(stored.id);
  if (cached?.private) return cached.private;

  const decrypted = await decryptPrivateKey(stored.privateKeyPkcs8, stored.salt, stored.iv, passphrase);
  const privateKey = await SUBTLE.importKey(
    "pkcs8", decrypted,
    { name: "ECDSA", namedCurve: "P-256" },
    false, ["sign"],
  );
  cryptoCache.set(stored.id, { public: await importPublic(stored), private: privateKey });
  return privateKey;
}

export async function importPublic(stored: StoredKey): Promise<CryptoKey> {
  return SUBTLE.importKey(
    "spki", stored.publicKeySpki,
    { name: "ECDSA", namedCurve: "P-256" },
    // Extractable: a PUBLIC key carries no secrecy (the SPKI bytes sit
    // unencrypted in the store already) — and the self-signed-cert
    // flow (issueSelfSignedCert) must export it for KeyInfo.
    true, ["verify"],
  );
}

/**
 * Insert a freshly-generated keypair into the cache so the first
 * sign operation does not need to re-decrypt. Called by generateKey.
 */
export function setGeneratedKeyPair(id: string, pair: { public: CryptoKey; private: CryptoKey }): void {
  cryptoCache.set(id, { public: pair.public, private: pair.private });
}

/**
 * Drop a key from the cache. Called when a key is deleted from
 * the store to ensure stale CryptoKey objects are not retained.
 */
export function invalidateKeyId(id: string): void {
  cryptoCache.delete(id);
}
