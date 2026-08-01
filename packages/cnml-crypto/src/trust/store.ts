/**
 * IndexedDB trust store.
 *
 * Stores TrustedPublicKey records — public keys only, no private
 * material. Used to verify signatures against a known set of
 * trusted signers (e.g., IA certificates pinned by the verifier).
 *
 * Object store name `trusted-keys` and DB name `cnml-trust` are
 * part of the on-disk contract — changing them invalidates existing
 * browser data.
 */

export interface TrustedPublicKey {
  id: string;
  alias: string;
  publicKeySpki: ArrayBuffer;
  fingerprint: string;
  created: number;
}

const TRUST_STORE = "trusted-keys";

let trustDbPromise: Promise<IDBDatabase> | null = null;

const SUBTLE = globalThis.crypto.subtle;

function openTrustDb(): Promise<IDBDatabase> {
  if (trustDbPromise) return trustDbPromise;
  trustDbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open("cnml-trust", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(TRUST_STORE)) {
        db.createObjectStore(TRUST_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => {
      trustDbPromise = null;
      reject(req.error);
    };
  }).catch((err) => {
    trustDbPromise = null;
    throw err;
  });
  return trustDbPromise;
}

export async function storeTrustedKey(key: TrustedPublicKey): Promise<void> {
  const db = await openTrustDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(TRUST_STORE, "readwrite");
    tx.objectStore(TRUST_STORE).put(key);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

export async function listTrustedKeys(): Promise<TrustedPublicKey[]> {
  const db = await openTrustDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRUST_STORE, "readonly");
    const req = tx.objectStore(TRUST_STORE).getAll();
    req.onsuccess = () => resolve(req.result as TrustedPublicKey[]);
    req.onerror   = () => reject(req.error);
  });
}

export async function getTrustedKey(id: string): Promise<TrustedPublicKey | undefined> {
  const db = await openTrustDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRUST_STORE, "readonly");
    const req = tx.objectStore(TRUST_STORE).get(id);
    req.onsuccess = () => resolve(req.result as TrustedPublicKey | undefined);
    req.onerror   = () => reject(req.error);
  });
}

export async function deleteTrustedKey(id: string): Promise<void> {
  const db = await openTrustDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(TRUST_STORE, "readwrite");
    tx.objectStore(TRUST_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
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
