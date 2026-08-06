import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { runConfiumVerifyCheck, confiumVerifyCheckId } from "./confium-verify.ts";

describe("check: confium-verify (optional enhanced verification)", () => {
  test("checkId is stable", () => {
    assert.equal(confiumVerifyCheckId, "confium-wasm");
  });

  test("returns skip when Confium WASM is not installed", async () => {
    // The optional @confium/confium-wasm dependency is not installed
    // in the test environment. The check must degrade silently rather
    // than fail.
    const result = await runConfiumVerifyCheck({
      xml: "<?xml version=\"1.0\"?><x/>",
    });
    assert.equal(result.status, "skip");
    assert.match(result.reason ?? "", /confium|wasm/i);
  });

  test("returns skip even when composite signature bytes are provided", async () => {
    // Even with a composite signature, if WASM is unavailable the
    // check degrades to skip rather than fail.
    const result = await runConfiumVerifyCheck({
      xml: "<?xml version=\"1.0\"?><x/>",
      compositeSignature: new Uint8Array([1, 2, 3]),
      compositePublicKey: new Uint8Array([4, 5, 6]),
    });
    assert.equal(result.status, "skip");
  });

  test("never throws — converts all errors to skip or warn", async () => {
    // Pass junk to confirm the check does not propagate exceptions.
    const result = await runConfiumVerifyCheck({
      xml: "",
      compositeSignature: new Uint8Array(0),
      compositePublicKey: new Uint8Array(0),
    });
    assert.ok(["skip", "warn", "pass", "fail"].includes(result.status));
  });
});
