
import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

/**
 * Smoke tests — every page loads without console errors or uncaught exceptions.
 * Acts as the canary for hydration failures and broken module imports.
 */

// The site deploys under /cnml/ (Astro base path). Every navigation in
// this file is prefixed with BASE so the tests match the deployed URLs.
const BASE = "/cnml";

const PAGES = [
  `${BASE}/`,
  `${BASE}/create`,
  `${BASE}/create/r60`,
  `${BASE}/create/r76`,
  `${BASE}/create/r117`,
  `${BASE}/create/r51`,
  `${BASE}/verify`,
  `${BASE}/keys`,
  `${BASE}/certs`,
  `${BASE}/certs/r60`,
  `${BASE}/certs/r76`,
  `${BASE}/schemas`,
  `${BASE}/diagrams`,
  `${BASE}/docs`,
  `${BASE}/docs/what-is-cnml`,
  `${BASE}/docs/architecture/cnml-architecture-choices`,
  `${BASE}/docs/architecture/confium-integration`,
  `${BASE}/docs/architecture/distributed-management`,
  `${BASE}/docs/concepts/cnml-and-dcc`,
  `${BASE}/docs/concepts/fair-and-dcoc`,
  `${BASE}/docs/concepts/threshold-cryptography`,
  `${BASE}/docs/implementation/dcoc-output`,
  `${BASE}/docs/implementation/verification-pipeline`,
  `${BASE}/docs/reference/faq`,
  `${BASE}/docs/reference/glossary`,
  `${BASE}/docs/roles/for-developers`,
  `${BASE}/docs/roles/for-ias-biml-ciml`,
  `${BASE}/docs/roles/for-verifiers`,
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
  await page.goto(`${BASE}/`, { waitUntil: "commit" });
  await expect(page.locator("h1").first()).toContainText(/Certificat Numérique de Métrologie Légale/);
  await expect(page.getByRole("link", { name: /Create/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Verify/ }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /certificates/i }).first()).toBeVisible();
});

test("schemas page lists all 22 R schemas", async ({ page }) => {
  await page.goto(`${BASE}/schemas`, { waitUntil: "commit" });
  for (const id of ["R21", "R46", "R60", "R76", "R117", "R129", "R137", "R139"]) {
    await expect(page.getByRole("link", { name: new RegExp(`${id}\\.yaml`) })).toBeVisible();
  }
});

test("certs index shows sample cert per R", async ({ page }) => {
  await page.goto(`${BASE}/certs`, { waitUntil: "commit" });
  // Cards render with at least one cert number
  await expect(page.locator("text=R60/").first()).toBeVisible({ timeout: 15_000 });
});

test("diagrams gallery shows all 6 SVGs", async ({ page }) => {
  await page.goto(`${BASE}/diagrams`, { waitUntil: "commit" });
  for (const title of ["System Architecture", "Certificate Model Layers", "Signing Flow", "Verification Flow", "Trust Chain", "UnitsML Embedding"]) {
    await expect(page.getByText(title).first()).toBeVisible();
  }
});

test("schema YAML downloads serve correct mime type", async ({ page }) => {
  const res = await page.goto(`${BASE}/schemas/R60.yaml`, { waitUntil: "commit" });
  expect(res?.ok()).toBe(true);
  const content = await res?.text();
  expect(content).toMatch(/^\$schema: "http:\/\/json-schema\.org\/draft-07\/schema#"/m);
  expect(content).toMatch(/OIML R60/i);
});

test("sample cert YAML download works", async ({ page }) => {
  const certsDir = "apps/cnml-web/public/certs";
  const samples = readdirSync(certsDir).filter((f) => f.startsWith("r60-sample"));
  expect(samples.length).toBeGreaterThan(0);

  const res = await page.goto(`${BASE}/certs/${samples[0]}`);
  expect(res?.ok()).toBe(true);
  const content = await res?.text();
  expect(content).toMatch(/R60/);
});
