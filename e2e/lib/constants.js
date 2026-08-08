/**
 * Shared constants for e2e tests.
 *
 * The Astro base path is "/cnml/" in production. Every Playwright test
 * navigates under this prefix. Centralizing it here means a base-path
 * change is one edit, not five.
 */

/** The Astro base path (without trailing slash). */
export const BASE = "/cnml";
