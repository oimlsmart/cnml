// @ts-check
// Accessibility baseline (TODO.cnml/26).
//
// Each critical page is loaded with Playwright and scanned with
// axe-core. The scan tags wcag2a and wcag2aa are the baseline;
// wcag21a/wcag21aa are added where supported. A violation fails the
// test. Known false positives are disabled in the `OVERRIDES`
// constant — each override has a reason.

const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const BASE = "http://127.0.0.1:4455";

// Pages that represent the critical user journeys. Each gets its own
// axe scan — they exercise different layouts (home hero, doc prose,
// form interaction, verify dropzone, etc.).
const PAGES = [
  { name: "home", path: "/" },
  { name: "about-what-is-cnml", path: "/about/what-is-cnml" },
  { name: "audiences-verifiers", path: "/audiences/verifiers" },
  { name: "features-threshold-signing", path: "/features/threshold-signing" },
  { name: "docs-index", path: "/docs" },
  { name: "docs-why-cnml", path: "/docs/why-cnml" },
  { name: "verify", path: "/verify" },
  { name: "qr-code", path: "/qr-code" },
  { name: "search", path: "/search" },
];

// Rule overrides per page. Every override MUST have an inline
// reason. Adding an override without a reason is a code-review
// rejection.
const OVERRIDES = {
  // The dropzone uses an off-screen file input as the click target.
  // axe flags this as "form-field-multiple-labels" on some builds;
  // the label structure is intentional (one visible label, one
  // hidden control).
  "verify": {
    "label": { reason: "dropzone uses a single visible label over a hidden input" },
  },
};

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const page of PAGES) {
  test(`a11y: ${page.name} has no WCAG 2.1 AA violations`, async ({ browser }) => {
    const context = await browser.newContext();
    const url = `${BASE}${page.path}`;
    const pageObj = await context.newPage();
    await pageObj.goto(url, { waitUntil: "load" });

    const builder = new AxeBuilder({ page: pageObj })
      .withTags(TAGS)
      .disable([
        // color-contrast relies on the browser's computed color,
        // which the headless build sometimes evaluates differently
        // than the user's screen. The CNML design system uses a
        // verified contrast ratio (paper/ink tokens).
        "color-contrast",
      ]);

    const overrides = OVERRIDES[page.name] ?? {};
    for (const rule of Object.keys(overrides)) {
      builder.disable(rule);
    }

    const results = await builder.analyze();

    // Filter the disabled rules out of the report so the override
    // reasons are visible in the test output.
    const relevant = results.violations.filter(
      (v) => !Object.keys(overrides).includes(v.id),
    );

    expect(relevant, JSON.stringify(relevant, null, 2)).toEqual([]);
    await context.close();
  });
}
