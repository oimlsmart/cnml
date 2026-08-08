/**
 * IndexedDB key store.
 *
 * Persists StoredKey records (private key encrypted at rest) in a
 * dedicated IndexedDB database. Object store name `keys` and DB name
 * `cnml-crypto` are part of the on-disk contract — changing them
 * invalidates existing browser data.
 */

import type { StoredKey } from "./types.ts";
import { invalidateKeyId } from "./cache.ts";
import { createIdbStore } from "../shared/idb-store.ts";

const store = createIdbStore<StoredKey>("cnml-crypto", "keys");

export async function storeKey(stored: StoredKey): Promise<void> {
  await store.put(stored);
}

export async function listKeys(): Promise<StoredKey[]> {
  return store.getAll();
}

export async function getKey(id: string): Promise<StoredKey | undefined> {
  return store.get(id);
}

export async function deleteKey(id: string): Promise<void> {
  await store.remove(id);
  invalidateKeyId(id);
}
