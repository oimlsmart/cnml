// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL: "http://127.0.0.1:4455",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Astro 7 auto-backgrounds `dev` when it detects an AI agent
    // (via `am-i-vibing`). That makes Playwright's parent-process
    // tracking fail. ASTRO_DEV_BACKGROUND=1 tells Astro we're already
    // in a background-aware context, so it runs in the foreground.
    // `--ignore-lock` prevents stale `.astro/dev.json` (from a
    // SIGKILL'd previous run) from blocking startup.
    // cwd MUST be apps/cnml-web — that's where astro.config.mjs lives.
    command: "ASTRO_DEV_BACKGROUND=1 ./node_modules/.bin/astro dev --port 4455 --host 127.0.0.1 --ignore-lock",
    url: "http://127.0.0.1:4455/",
    reuseExistingServer: true,
    timeout: 60_000,
    cwd: require("path").join(__dirname, "apps/cnml-web"),
    stdout: "pipe",
    stderr: "pipe",
  },
});
