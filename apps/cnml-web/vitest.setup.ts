/**
 * Vitest setup (TODO 35).
 *
 * Wires `fake-indexeddb` so islands that touch IndexedDB (KeyManager,
 * VerifyDrop) can mount under happy-dom without a real browser.
 */

import "fake-indexeddb/auto";
