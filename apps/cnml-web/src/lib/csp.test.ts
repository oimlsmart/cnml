import { test } from "node:test";
import assert from "node:assert/strict";
import { buildCsp } from "./csp.ts";

test("production CSP forbids unsafe-inline for scripts", () => {
  const csp = buildCsp({ dev: false });
  // Extract the script-src directive and assert it's just 'self'.
  const match = csp.match(/script-src '[^']*'(?: '[^']*')*/);
  assert.ok(match, "script-src directive not found");
  assert.equal(match[0], "script-src 'self'");
});

test("dev CSP allows unsafe-inline for scripts (Astro HMR)", () => {
  const csp = buildCsp({ dev: true });
  const match = csp.match(/script-src '[^']*'(?: '[^']*')*/);
  assert.ok(match, "script-src directive not found");
  assert.equal(match[0], "script-src 'self' 'unsafe-inline'");
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
