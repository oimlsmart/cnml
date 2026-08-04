
import { test, expect } from "@playwright/test";

/**
 * Key management tests — full lifecycle: generate, list, download public,
 * delete. IndexedDB is shared per origin so we wipe it before each test.
 */

async function wipeIndexedDB(page) {
  await page.context().clearCookies();
  await page.evaluate(async () => {
    const dbs = await indexedDB.databases();
    await Promise.all((dbs || []).map((db) => indexedDB.deleteDatabase(db.name)));
  });
}

async function waitForHydration(page) {
  await page.waitForFunction(() => {
    const btn = document.querySelector("button");
    return btn && "__vnode" in btn;
  }, { timeout: 30_000 });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  await wipeIndexedDB(page);
});

test("keys page: empty state shows generate CTA", async ({ page }) => {
  await page.goto("/keys", { waitUntil: "commit" });
  await waitForHydration(page);
  await expect(page.getByText(/No signing keys yet/i)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("button", { name: /Generate keypair/ })).toBeVisible();
});

test("keys page: generate creates a key in IndexedDB", async ({ page }) => {
  await page.goto("/keys", { waitUntil: "commit" });
  await waitForHydration(page);

  await page.getByRole("button", { name: /Generate keypair/ }).click();
  await page.locator('input[placeholder="My authority signing key"]').fill("E2E Test Key");
  await page.locator('input[type="password"]').first().fill("test-passphrase-123");
  await page.getByRole("button", { name: /Generate ECDSA P-256/ }).click();

  await expect(page.getByText(/E2E Test Key/)).toBeVisible({ timeout: 30_000 });

  const keyCount = await page.evaluate(async () => {
    const dbs = await indexedDB.databases();
    return dbs?.find((d) => d.name === "cnml-crypto") ? 1 : 0;
  });
  expect(keyCount).toBe(1);
});

test("keys page: passphrase validation rejects short input", async ({ page }) => {
  await page.goto("/keys", { waitUntil: "commit" });
  await waitForHydration(page);

  await page.getByRole("button", { name: /Generate keypair/ }).click();
  await page.locator('input[placeholder="My authority signing key"]').fill("X");
  await page.locator('input[type="password"]').first().fill("short");
  await page.getByRole("button", { name: /Generate ECDSA P-256/ }).click();
  await expect(page.getByText(/Passphrase must be at least 8 characters/i)).toBeVisible({ timeout: 5_000 });
});

test("keys page: download public key works", async ({ page }) => {
  await page.goto("/keys", { waitUntil: "commit" });
  await waitForHydration(page);

  await page.getByRole("button", { name: /Generate keypair/ }).click();
  await page.locator('input[placeholder="My authority signing key"]').fill("Downloadable");
  await page.locator('input[type="password"]').first().fill("test-passphrase-123");
  await page.getByRole("button", { name: /Generate ECDSA P-256/ }).click();
  await expect(page.getByText(/Downloadable/)).toBeVisible({ timeout: 30_000 });

  const downloadPromise = page.waitForEvent("download", { timeout: 10_000 });
  await page.getByRole("button", { name: /Public/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pub\.pem$/);

  const stream = await download.createReadStream();
  let contents = "";
  for await (const chunk of stream) contents += chunk.toString();
  expect(contents).toMatch(/^-----BEGIN PUBLIC KEY-----/m);
  expect(contents).toMatch(/-----END PUBLIC KEY-----/);
});

test("keys page: delete removes the key", async ({ page }) => {
  await page.goto("/keys", { waitUntil: "commit" });
  await waitForHydration(page);

  await page.getByRole("button", { name: /Generate keypair/ }).click();
  await page.locator('input[placeholder="My authority signing key"]').fill("To Delete");
  await page.locator('input[type="password"]').first().fill("test-passphrase-123");
  await page.getByRole("button", { name: /Generate ECDSA P-256/ }).click();
  await expect(page.getByText(/To Delete/)).toBeVisible({ timeout: 30_000 });

  page.on("dialog", (d) => d.accept());
  await page.getByRole("button", { name: /Delete/ }).click();

  await expect(page.getByText(/No signing keys yet/i)).toBeVisible({ timeout: 10_000 });
});
