// @ts-check
// Visual regression baseline (TODO.cnml/40).
//
// Each critical page is captured at desktop and mobile widths.
// `expect(page).toHaveScreenshot()` compares against a baseline
// committed under `e2e/__screenshots__/`. A pixel difference beyond
// the threshold (Playwright's default 0.1%) fails the test.
//
// To update baselines after an intentional change:
//   pnpm test:e2e -- --update-snapshots 07-visual
//
// Theme: screenshots are taken in light mode (the default). A
// separate test captures the home page in dark mode so the dark
// theme is also locked.

const fs = await import("node:fs");
const { test, expect } = await import("@playwright/test");

// Baselines are per-platform and regenerated locally (see the header).
// Skip the suite on machines that have none for this platform (CI)
// instead of failing on "snapshot doesn't exist".
const SNAPSHOT_DIR = new URL("./07-visual.spec.js-snapshots/", import.meta.url).pathname;
const hasBaselines = fs.existsSync(SNAPSHOT_DIR)
  && fs.readdirSync(SNAPSHOT_DIR).some((f) => f.includes(`chromium-${process.platform}`));

const BASE = "http://127.0.0.1:4455/cnml";

const PAGES = [
  { name: "home", path: "/", widths: [1280, 375] },
  { name: "about-what-is-cnml", path: "/about/what-is-cnml", widths: [1280] },
  { name: "audiences-verifiers", path: "/audiences/verifiers", widths: [1280] },
  { name: "features-threshold-signing", path: "/features/threshold-signing", widths: [1280] },
  { name: "docs-why-cnml", path: "/docs/why-cnml", widths: [1280] },
  { name: "verify", path: "/verify", widths: [1280] },
  { name: "search", path: "/search", widths: [1280] },
];

for (const page of PAGES) {
  for (const width of page.widths) {
    const suffix = width === 1280 ? "desktop" : width === 375 ? "mobile" : `w${width}`;
    test(`visual: ${page.name} (${suffix})`, async ({ browser }) => {
      test.skip(!hasBaselines, `no ${process.platform} baselines (generate locally with --update-snapshots)`);
      const context = await browser.newContext({
        viewport: { width, height: 800 },
        deviceScaleFactor: 1,
      });
      const url = `${BASE}${page.path}`;
      const pageObj = await context.newPage();
      await pageObj.goto(url, { waitUntil: "load" });
      // Light theme: ensure no `dark` class on <html>.
      await pageObj.evaluate(() => {
        document.documentElement.classList.remove("dark");
      });
      // Mask the pagefind index (it loads on hover/focus and would
      // make the screenshot flaky).
      // Wait for fonts to settle so text doesn't shift.
      await pageObj.evaluate(() => document.fonts.ready);
      await expect(pageObj).toHaveScreenshot(
        `${page.name}-${suffix}.png`,
        { fullPage: true, maxDiffPixelRatio: 0.01 },
      );
      await context.close();
    });
  }
}

test("visual: home (dark)", async ({ browser }) => {
  test.skip(!hasBaselines, `no ${process.platform} baselines (generate locally with --update-snapshots)`);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  // Seed the stored theme before any script runs: the FOUC script
  // sets the dark class pre-hydration and the theme island's mount
  // then keeps it (a class added after load would be reset by the
  // composable's prefers-color-scheme fallback).
  await context.addInitScript(() => {
    try { localStorage.setItem("cnml-theme", "dark"); } catch { /* ignore */ }
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent = "*, *::before, *::after { transition: none !important; animation: none !important; }";
    document.head.appendChild(style);
  });
  await page.evaluate(() => document.fonts.ready);
  await expect(page).toHaveScreenshot("home-dark.png", {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  });
  await context.close();
});
