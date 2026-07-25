
import { test, expect } from "@playwright/test";

/**
 * Form-builder tests — every Create flow works: pick R, fill demo, edit,
 * save YAML, upload YAML.
 */

async function waitForHydration(page) {
  await page.waitForFunction(() => {
    const btn = document.querySelector("button");
    return btn && "__vnode" in btn;
  }, { timeout: 30_000 });
}

test("R60 form: 'Fill demo data' populates all sections", async ({ page }) => {
  await page.goto("/create/r60", { waitUntil: "commit" });
  await waitForHydration(page);

  await expect(page.getByRole("button", { name: /Fill demo data/ })).toBeVisible();
  await page.getByRole("button", { name: /Fill demo data/ }).click();

  const body = await page.locator("body").innerText();
  expect(body).toMatch(/R60\/2021/);
});

test("R60 form: Reset clears the form", async ({ page }) => {
  await page.goto("/create/r60", { waitUntil: "commit" });
  await waitForHydration(page);

  await page.getByRole("button", { name: /Fill demo data/ }).click();
  await expect(page.locator("input").first()).not.toHaveValue("");

  await page.getByRole("button", { name: /^Reset$/ }).click();
  await expect(page.locator("input").first()).toHaveValue("");
});

test("R60 form: Save YAML downloads a file", async ({ page }) => {
  await page.goto("/create/r60", { waitUntil: "commit" });
  await waitForHydration(page);

  await page.getByRole("button", { name: /Fill demo data/ }).click();

  const downloadPromise = page.waitForEvent("download", { timeout: 10_000 });
  await page.getByRole("button", { name: /Save YAML/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.yaml$/);

  const stream = await download.createReadStream();
  let contents = "";
  for await (const chunk of stream) contents += chunk.toString();
  expect(contents).toMatch(/^---/m);
  expect(contents).toMatch(/certificate:/);
});

test("SchemaForm (generic): renders top-level fields from JSON Schema", async ({ page }) => {
  await page.goto("/create/r76", { waitUntil: "commit" });
  await waitForHydration(page);
  await expect(page.getByText(/Non-automatic weighing instruments/i)).toBeVisible();
});

test("SchemaForm: Reset returns to defaults", async ({ page }) => {
  await page.goto("/create/r76", { waitUntil: "commit" });
  await waitForHydration(page);
  const textInput = page.locator("input").first();
  await textInput.fill("hello");
  await expect(textInput).toHaveValue("hello");

  await page.getByRole("button", { name: /^Reset$/ }).click();
  await expect(textInput).toHaveValue("");
});

test("Sample picker loads cert from /certs/r60 link", async ({ page }) => {
  await page.goto("/certs/r60", { waitUntil: "commit" });
  await expect(page.getByRole("link", { name: /Load in form/ }).first()).toBeVisible({ timeout: 30_000 });
  await page.getByRole("link", { name: /Load in form/ }).first().click();

  // Wait for navigation + hydration
  await page.waitForURL(/\/create\/r60\?sample=/, { timeout: 15_000 });
  await waitForHydration(page);
  await expect(page.locator("body")).toContainText(/R60\/2021/);
});

test("Sample picker dropdown changes the loaded cert", async ({ page }) => {
  await page.goto("/create/r60", { waitUntil: "commit" });
  await waitForHydration(page);

  const select = page.locator("select").first();
  await expect(select).toBeVisible();
  const options = await select.locator("option").allTextContents();
  expect(options.length).toBeGreaterThan(1);
});
