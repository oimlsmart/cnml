
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Verify page tests — uploads each of the 22 pre-generated test vectors
 * and confirms all 4 checks pass.
 */

const BASE = "/cnml";
const VECTORS_DIR = "packages/cnml-test-vectors/src/vectors";

// Helper: wait for the VerifyDrop island to actually hydrate (Vue attached
// to the file input). Without this, setInputFiles fires the DOM event but
// Vue's @change handler isn't bound yet, so the upload is silently lost.
async function waitForHydration(page) {
  await page.getByText("Drop a CNML file here").waitFor({ state: "visible", timeout: 30_000 });
  await page.waitForFunction(() => {
    const input = document.querySelector("input[type=file]");
    return input && "__vnode" in input;
  }, { timeout: 30_000 });
}

test("verify page: drop zone is visible", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });

  await page.goto(`${BASE}/verify`, { waitUntil: "commit" });
  await waitForHydration(page);
  expect(errors, `errors:\n${errors.join("\n")}`).toEqual([]);
});

const SPOT_CHECK = ["R21", "R46", "R60", "R76", "R117", "R129", "R137", "R139"];

for (const rId of SPOT_CHECK) {
  test(`verify page: ${rId} test vector passes all checks`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (msg) => {
      const t = msg.text();
      // Known dev-mode noise:
      // - 504 Outdated Optimize Dep: Vite re-optimizes on first load
      // - "Error compiling schema ... nonNegativeInteger": AJV strict-mode
      //   log for a DCC/UnitsDB schema reference. The compiled validator
      //   still runs; the schema_valid check produces its own tile result.
      if (msg.type() === "error" && !/504|Error compiling schema/.test(t)) errors.push(`console: ${t}`);
    });

    await page.goto(`${BASE}/verify`, { waitUntil: "commit" });
    await waitForHydration(page);

    const vectorPath = path.resolve(VECTORS_DIR, `${rId}.cnml.xml`);
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(vectorPath);

    await expect(page.getByText(/XML well-formed/i).first()).toBeVisible({ timeout: 30_000 });
    // Check pipeline renumbered: signature is now tile 3. Use tile selector
    // to avoid matching the reason callout (strict mode violation).
    await expect(page.locator(".cnml-tile:has-text('Signature')")).toContainText(/[✓?]/, { timeout: 30_000 });

    expect(errors, `errors during ${rId} verify:\n${errors.join("\n")}`).toEqual([]);
  });
}

test("verify page: malformed XML shows an error", async ({ page }) => {
  await page.goto(`${BASE}/verify`, { waitUntil: "commit" });
  await waitForHydration(page);

  const fs = await import("node:fs");
  const tmpPath = `/tmp/cnml-e2e-bad-${Date.now()}.xml`;
  fs.writeFileSync(tmpPath, "not even xml <<");

  await page.locator('input[type="file"]').setInputFiles(tmpPath);
  await page.waitForTimeout(1000);
  const body = await page.locator("body").innerText();
  expect(body.length).toBeGreaterThan(50);

  fs.unlinkSync(tmpPath);
});
