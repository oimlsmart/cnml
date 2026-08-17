/**
 * Cross-language test: certificates logged by the Ruby CA confirm as
 * included via the by-hash index + inclusion proof (spec
 * §path-transparency-inclusion).
 */

import "./_test-polyfill.ts";

import { test } from "node:test";
import assert from "node:assert/strict";
import { confirmChainInclusion } from "./cert-inclusion.ts";
import published from "./__fixtures__/published-log.json" with { type: "json" };

/** Mock fetch serving the Ruby-published directory contents. */
function withPublishedLog<T>(fn: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = typeof input === "string" ? input : input.toString();
    const path = url.replace(/^mock/, "").replace(/^\//, "");
    const file = (published.files as Record<string, string>)[path];
    if (file !== undefined) return new Response(file, { status: 200 });
    return new Response("not found", { status: 404 });
  }) as typeof fetch;
  return fn().finally(() => {
    globalThis.fetch = original;
  });
}

test("a logged certificate confirms as included", async () => {
  await withPublishedLog(async () => {
    const results = await confirmChainInclusion(
      [published.cert_pem as string],
      "mock",
      published.head.root as string,
    );
    assert.equal(results[0].status, "included", results[0].reason);
    assert.equal(results[0].sequence, 0);
  });
});

test("an unlogged certificate is not-found via the index", async () => {
  await withPublishedLog(async () => {
    const results = await confirmChainInclusion(
      ["-----BEGIN CERTIFICATE-----\nAAAA\n-----END CERTIFICATE-----\n"],
      "mock",
      published.head.root as string,
    );
    assert.equal(results[0].status, "not-found");
  });
});
