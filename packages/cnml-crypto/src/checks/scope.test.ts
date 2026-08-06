import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { scopeCheck } from "./scope.ts";
import type { CheckResult } from "./types.ts";

describe("check: scope", () => {
  test("short-circuits when signature failed", async () => {
    const xml = `<?xml version="1.0"?><CNML xmlns="urn:oiml:cnml:1.0"/>`;
    const prior: CheckResult[] = [
      { checkId: "xml-well-formed", status: "pass" },
      { checkId: "schema-valid", status: "pass" },
      { checkId: "signature", status: "fail", reason: "no signature" },
    ];
    const result = await scopeCheck.run(xml, {}, prior);
    assert.equal(result.status, "skip");
  });

  test("skips when no issuerScope is set in context (no scope to check against)", async () => {
    const xml = `<?xml version="1.0"?><CNML xmlns="urn:oiml:cnml:1.0"/>`;
    const prior: CheckResult[] = [
      { checkId: "xml-well-formed", status: "pass" },
      { checkId: "schema-valid", status: "pass" },
      { checkId: "signature", status: "pass" },
    ];
    const result = await scopeCheck.run(xml, {}, prior);
    // Without issuerScope, the check has nothing to enforce; it should
    // skip rather than fail.
    assert.notEqual(result.status, "fail");
  });
});
