/**
 * PEM import/export for signing keys.
 *
 * Export produces shareable public-key PEM (safe) or unencrypted
 * private-key PEM (requires passphrase — caller must handle
 * carefully). Import accepts unencrypted PKCS#8 private-key PEM
 * or SPKI public-key PEM and produces a StoredKey / TrustedPublicKey.
 */

import type { StoredKey } from "./types.ts";
import { sha256Hex } from "../hash.ts";
import { derToPem, pemToDer } from "../pem.ts";
import { encryptPrivateKey, decryptPrivateKey } from "./encryption.ts";

import { SUBTLE } from "../shared/crypto.ts";

/**
 * Export a stored key's PUBLIC key as a SPKI PEM ("-----BEGIN PUBLIC KEY-----").
 * Safe to share with verifiers.
 */
export async function exportPublicKeyPem(stored: StoredKey): Promise<string> {
  return derToPem(stored.publicKeySpki, "PUBLIC KEY");
}

/**
 * Export a stored key's PRIVATE key as an unencrypted PKCS#8 PEM
 * ("-----BEGIN PRIVATE KEY-----"). The passphrase unlocks the AES-GCM
 * envelope; the resulting PKCS#8 DER is base64-encoded into standard PEM
 * form.
 *
 * SECURITY: This produces an UNENCRYPTED private key. The caller MUST
 * store/transmit it securely (e.g. to a USB key, password manager, or
 * air-gapped backup). The browser/UI must require explicit user
 * confirmation before invoking this.
 */
export async function exportPrivateKeyPem(
  stored: StoredKey,
  passphrase: string,
): Promise<string> {
  const pkcs8 = await decryptPrivateKey(stored.privateKeyPkcs8, stored.salt, stored.iv, passphrase);
  return derToPem(pkcs8, "PRIVATE KEY");
}

/**
 * Import a private key from a PEM file (PKCS#8 unencrypted). Returns a
 * StoredKey ready for storeKey(). The passphrase is used to encrypt the
 * key at rest in IndexedDB (it does NOT have to match the source PEM).
 */
export async function importPrivateKeyFromPem(
  pem: string,
  alias: string,
  storagePassphrase: string,
): Promise<StoredKey> {
  const { der, label } = pemToDer(pem);
  if (!label.includes("PRIVATE")) {
    throw new Error(`Expected a PRIVATE KEY PEM, got "${label}"`);
  }

  const cryptoKey = await SUBTLE.importKey(
    "pkcs8", der,
    { name: "ECDSA", namedCurve: "P-256" },
    true, ["sign"],
  );

  const jwk = await SUBTLE.exportKey("jwk", cryptoKey);
  const pubJwk: JsonWebKey = {
    kty: jwk.kty!, n: jwk.n, e: jwk.e, x: jwk.x, y: jwk.y,
    crv: jwk.crv, ext: true,
  };
  const pubKey = await SUBTLE.importKey(
    "jwk", pubJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    true, ["verify"],
  );
  const spki = await SUBTLE.exportKey("spki", pubKey);
  const fingerprint = await sha256Hex(spki);
  const { encrypted, salt, iv } = await encryptPrivateKey(der, storagePassphrase);

  return {
    id: `key_${fingerprint.slice(0, 12)}`,
    alias,
    algorithm: "ECDSA",
    publicKeySpki: spki,
    privateKeyPkcs8: encrypted,
    salt, iv,
    created: Date.now(),
    fingerprint,
  };
}
