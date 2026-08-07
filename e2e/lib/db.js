/**
 * Shared Playwright IndexedDB wipe helper.
 *
 * Both the keys-page tests and the sign-verify tests need to start with
 * a clean key store. IndexedDB is per-origin, so one wipe covers every
 * database the app created. Cookies are also cleared so session state
 * from a previous test doesn't leak.
 */

export async function wipeIndexedDB(page) {
  await page.context().clearCookies();
  await page.evaluate(async () => {
    const dbs = await indexedDB.databases();
    await Promise.all(
      (dbs || []).map((db) => indexedDB.deleteDatabase(db.name)),
    );
  });
}
