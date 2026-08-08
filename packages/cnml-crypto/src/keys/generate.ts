/**
 * ECDSA-P256 keypair generation.
 *
 * Produces a StoredKey with the private key encrypted at rest
 * (keys/encryption.ts) and persisted to IndexedDB (keys/store.ts).
 * The decrypted CryptoKey pair is handed to keys/cache.ts so the
 * first sign operation does not need to re-decrypt.
 */

import type { GenerateOptions, StoredKey } from "./types.ts";
import { sha256Hex } from "../hash.ts";
import { encryptPrivateKey } from "./encryption.ts";
import { storeKey } from "./store.ts";
import { setGeneratedKeyPair } from "./cache.ts";

import { SUBTLE } from "../shared/crypto.ts";

export async function generateKey(opts: GenerateOptions): Promise<{ id: string; fingerprint: string }> {
  if (!opts.passphrase || opts.passphrase.length < 8) {
    throw new Error("Passphrase must be at least 8 characters");
  }
  const keyPair = await SUBTLE.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );

  const publicKeySpki  = await SUBTLE.exportKey("spki",  keyPair.publicKey);
  const privateKeyPkcs8 = await SUBTLE.exportKey("pkcs8", keyPair.privateKey);
  const fingerprint = await sha256Hex(publicKeySpki);
  const id = `key_${fingerprint.slice(0, 12)}`;

  const { encrypted, salt, iv } = await encryptPrivateKey(privateKeyPkcs8, opts.passphrase);
  const stored: StoredKey = {
    id,
    alias: opts.alias,
    algorithm: "ECDSA",
    publicKeySpki,
    privateKeyPkcs8: encrypted,
    salt,
    iv,
    created: Date.now(),
    fingerprint,
  };
  await storeKey(stored);

  setGeneratedKeyPair(id, { public: keyPair.publicKey, private: keyPair.privateKey });

  return { id, fingerprint };
}
