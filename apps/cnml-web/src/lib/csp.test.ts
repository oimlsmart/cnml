import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCsp } from "./csp.ts";

test("both dev and production CSPs allow unsafe-inline for scripts", () => {
  // Astro generates inline scripts for island hydration on static
  // hosting (no nonce support). Both modes must allow 'unsafe-inline'.
  // Production also allows 'unsafe-eval' for AJV schema compilation
  // (new Function) on the verify page.
  const prod = buildCsp({ dev: false });
  const dev = buildCsp({ dev: true });
  const match = (csp: string) => csp.match(/script-src '[^']*'(?: '[^']*')*/);
  assert.equal(match(prod)?.[0], "script-src 'self' 'unsafe-inline' 'unsafe-eval'");
  assert.equal(match(dev)?.[0], "script-src 'self' 'unsafe-inline' 'unsafe-eval'");
});

test("both CSPs omit frame-ancestors (unenforceable via meta)", () => {
  const prod = buildCsp({ dev: false });
  const dev = buildCsp({ dev: true });
  assert.ok(!prod.includes("frame-ancestors"));
  assert.ok(!dev.includes("frame-ancestors"));
});

test("both CSPs set object-src 'none' and base-uri 'self'", () => {
  const prod = buildCsp({ dev: false });
  assert.match(prod, /object-src 'none'/);
  assert.match(prod, /base-uri 'self'/);
});

test("both CSPs restrict connect-src to self + oimlsmart.org", () => {
  const prod = buildCsp({ dev: false });
  assert.match(prod, /connect-src 'self' https:\/\/www\.oimlsmart\.org/);
});
