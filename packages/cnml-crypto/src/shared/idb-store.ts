/**
 * IndexedDB object-store factory.
 *
 * The private-key store (keys/store.ts) and the trusted-public-key
 * store (trust/store.ts) share the same CRUD boilerplate: open the
 * database, create the object store on upgrade, wrap transactions
 * in promises. This factory concentrates that plumbing so each store
 * is a thin domain wrapper.
 *
 * The on-disk contract (DB name, store name, version) is part of the
 * app's persistence layer — changing it invalidates existing browser
 * data. Callers pass these explicitly so the contract is visible at
 * the call site.
 */

export interface IdbStore<T extends { id: string }> {
  put(record: T): Promise<void>;
  getAll(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  remove(id: string): Promise<void>;
}

export function createIdbStore<T extends { id: string }>(
  dbName: string,
  storeName: string,
  version = 1,
): IdbStore<T> {
  let dbPromise: Promise<IDBDatabase> | null = null;

  function openDb(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(dbName, version);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        dbPromise = null;
        reject(req.error);
      };
    }).catch((err) => {
      dbPromise = null;
      throw err;
    });
    return dbPromise;
  }

  async function put(record: T): Promise<void> {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getAll(): Promise<T[]> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  async function get(id: string): Promise<T | undefined> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const req = tx.objectStore(storeName).get(id);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  }

  async function remove(id: string): Promise<void> {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  return { put, getAll, get, remove };
}
