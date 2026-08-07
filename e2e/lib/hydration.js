/**
 * Shared Playwright hydration helper for Astro + Vue islands.
 *
 * Astro islands hydrate asynchronously. A Playwright test that clicks a
 * button before the island hydrates will silently miss the Vue handler
 * and time out. Each test needs to wait for the SPECIFIC island it will
 * interact with — checking "any button" gives a false signal because the
 * nav dropdowns hydrate via a different island than the one under test.
 *
 * The `__vnode` property is set by Vue when it attaches to a DOM node.
 * Its presence confirms the element's event handlers are bound.
 */

/** Wait for a specific island to hydrate by its button text. */
export async function waitForIslandButton(page, buttonText) {
  await page.waitForFunction(
    (pattern) => {
      const re = new RegExp(pattern.source, pattern.flags);
      const btns = Array.from(document.querySelectorAll("button"));
      const target = btns.find((b) => re.test(b.textContent ?? ""));
      return target && "__vnode" in target;
    },
    { source: buttonText.source, flags: buttonText.flags },
    { timeout: 30_000 },
  );
}

/** Wait for a specific island to hydrate by a CSS selector for any element. */
export async function waitForIslandElement(page, selector) {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      return el && "__vnode" in el;
    },
    selector,
    { timeout: 30_000 },
  );
}
