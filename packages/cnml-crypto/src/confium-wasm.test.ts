/**
 * Smoke tests for confium-wasm.ts. Uses Node's built-in test runner
 * (the rest of the repo doesn't have a JS test framework configured yet;
 * this file establishes the pattern).
 *
 * Run: `node --experimental-strip-types --test packages/cnml-crypto/src/confium-wasm.test.ts`
 */

import { test } from "node:test";
import assert from "node:assert/strict";

// Import the module under test. We use the relative path because the
// workspace hasn't published an exports map that maps the test entry.
import {
  loadConfiumWasm,
  unloadConfiumWasm,
  isConfiumWasmLoaded,
  detectWasmSupport,
  MIN_WASM_VERSION,
  ConfiumWasmUnavailableError,
} from "./confium-wasm.ts";

test("MIN_WASM_VERSION is the documented minimum", () => {
  assert.equal(MIN_WASM_VERSION, "0.3.0");
});

test("unloadConfiumWasm clears the cache", async () => {
  // Try load (will likely reject since @confium/confium-wasm isn't installed)
  try { await loadConfiumWasm(); } catch { /* expected */ }
  unloadConfiumWasm();
  assert.equal(isConfiumWasmLoaded(), false);
});

test("isConfiumWasmLoaded reflects cache state", () => {
  unloadConfiumWasm();
  assert.equal(isConfiumWasmLoaded(), false);
});

test("detectWasmSupport returns supported:true in Node with WebAssembly + crypto", () => {
  const result = detectWasmSupport();
  assert.equal(result.supported, true);
  assert.equal(result.reason, undefined);
});

test("loadConfiumWasm rejects with ConfiumWasmUnavailableError when package missing", async () => {
  unloadConfiumWasm();
  await assert.rejects(
    () => loadConfiumWasm(),
    (err: unknown) => {
      assert.ok(err instanceof ConfiumWasmUnavailableError);
      // In Node without the package installed, expect package-missing.
      // If the package IS installed, this test is N/A; skip via assert.ok.
      const e = err as ConfiumWasmUnavailableError;
      assert.ok(
        e.reason === "package-missing" || e.reason === "version-mismatch",
        `unexpected reason: ${e.reason}`,
      );
      return true;
    },
  );
});

test("loadConfiumWasm memoizes the promise (does not re-load)", async () => {
  unloadConfiumWasm();
  assert.equal(isConfiumWasmLoaded(), false);
  // Kick off load; immediately check cache state.
  const p1 = loadConfiumWasm().catch(() => null);
  assert.equal(isConfiumWasmLoaded(), true);   // promise cached synchronously
  const p2 = loadConfiumWasm().catch(() => null);
  // Both should resolve to the same outcome (cached).
  const [r1, r2] = await Promise.all([p1, p2]);
  assert.equal(r1, r2);
  unloadConfiumWasm();
  assert.equal(isConfiumWasmLoaded(), false);
});

test("ConfiumWasmUnavailableError carries structured reason + details", () => {
  const err = new ConfiumWasmUnavailableError("wasm-not-supported", "WebAssembly undefined");
  assert.equal(err.name, "ConfiumWasmUnavailableError");
  assert.equal(err.reason, "wasm-not-supported");
  assert.equal(err.details, "WebAssembly undefined");
  assert.match(err.message, /WebAssembly/);
});
