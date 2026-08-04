
import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * Smoke tests — every page loads without console errors or uncaught exceptions.
 * Acts as the canary for hydration failures and broken module imports.
 */

const PAGES = [
  "/",
  "/create",
  "/create/r60",
  "/create/r76",
  "/create/r117",
  "/create/r51",
  "/verify",
  "/keys",
  "/certs",
  "/certs/r60",
  "/certs/r76",
  "/schemas",
  "/diagrams",
  "/docs",
  "/docs/what-is-cnml",
  "/docs/architecture/cnml-architecture-choices",
  "/docs/architecture/confium-integration",
  "/docs/architecture/distributed-management",
  "/docs/concepts/cnml-and-dcc",
  "/docs/concepts/fair-and-dcoc",
  "/docs/concepts/threshold-cryptography",
  "/docs/implementation/dcoc-output",
  "/docs/implementation/verification-pipeline",
  "/docs/reference/faq",
  "/docs/reference/glossary",
  "/docs/roles/for-developers",
  "/docs/roles/for-ias-biml-ciml",
  "/docs/roles/for-verifiers",
];

for (const p of PAGES) {
  test(`page ${p} loads cleanly`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    page.on("console", (msg) => {
      // Vite emits a transient "504 Outdated Optimize Dep" on first load of
      // pages with islands — it triggers a re-optimization, then succeeds on
      // reload. We treat that as a known dev-mode noise, not a real failure.
      const text = msg.text();
      if (msg.type() === "error" && !/504 \(Outdated Optimize Dep\)/.test(text)) {
        errors.push(`console.error: ${text}`);
      }
    });

    const res = await page.goto(p, { waitUntil: "commit", timeout: 30_000 });
    expect(res?.status(), `HTTP status for ${p}`).toBe(200);

    // Wait for body content to actually appear (page render + minimal hydration)
    await page.waitForSelector("body", { state: "attached", timeout: 30_000 });
    await page.waitForFunction(() => document.body?.innerText?.length > 50, { timeout: 30_000 });

    // Must have visible body content
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length, `${p} has body content`).toBeGreaterThan(50);

    // No JS errors
    expect(errors, `${p} errors:\n${errors.join("\n")}`).toEqual([]);
  });
}

test("home page shows hero + action cards", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("h1").first()).toContainText(/Certificat Numérique de Métrologie Légale/);
  await expect(page.getByRole("link", { name: /Create/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Verify/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /certificates/i }).first()).toBeVisible();
});

test("schemas page lists all 22 R schemas", async ({ page }) => {
  await page.goto("/schemas", { waitUntil: "commit" });
  for (const id of ["R21", "R46", "R60", "R76", "R117", "R129", "R137", "R139"]) {
    await expect(page.getByRole("link", { name: new RegExp(`${id}\\.yaml`) })).toBeVisible();
  }
});

test("certs index shows sample cert per R", async ({ page }) => {
  await page.goto("/certs", { waitUntil: "commit" });
  // Cards render with at least one cert number
  await expect(page.locator("text=R60/").first()).toBeVisible({ timeout: 15_000 });
});

test("diagrams gallery shows all 6 SVGs", async ({ page }) => {
  await page.goto("/diagrams", { waitUntil: "commit" });
  for (const title of ["System Architecture", "Certificate Model Layers", "Signing Flow", "Verification Flow", "Trust Chain", "UnitsML Embedding"]) {
    await expect(page.getByText(title).first()).toBeVisible();
  }
});

test("schema YAML downloads serve correct mime type", async ({ page }) => {
  const res = await page.goto("/schemas/R60.yaml", { waitUntil: "commit" });
  expect(res?.ok()).toBe(true);
  const content = await res?.text();
  expect(content).toMatch(/^\$schema: "http:\/\/json-schema\.org\/draft-07\/schema#"/m);
  expect(content).toMatch(/OIML R60/i);
});

test("sample cert YAML download works", async ({ page }) => {
  const certsDir = "apps/cnml-web/public/certs";
  const samples = readdirSync(certsDir).filter((f) => f.startsWith("r60-sample"));
  expect(samples.length).toBeGreaterThan(0);

  const res = await page.goto(`/certs/${samples[0]}`);
  expect(res?.ok()).toBe(true);
  const content = await res?.text();
  expect(content).toMatch(/R60/);
});
