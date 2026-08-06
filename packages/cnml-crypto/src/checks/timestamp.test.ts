import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { timestampCheck } from "./timestamp.ts";
import type { CheckResult } from "./types.ts";

describe("check: timestamp", () => {
  test("short-circuits when signature failed", async () => {
    const xml = `<?xml version="1.0"?><CNML xmlns="urn:oiml:cnml:1.0"/>`;
    const prior: CheckResult[] = [
      { checkId: "xml-well-formed", status: "pass" },
      { checkId: "schema-valid", status: "pass" },
      { checkId: "signature", status: "fail", reason: "no signature" },
    ];
    const result = await timestampCheck.run(xml, {}, prior);
    assert.equal(result.status, "skip");
  });

  test("warns or skips on a CNML document with no OpenTimestamps proof", async () => {
    const xml = `<?xml version="1.0"?>
<CNML xmlns="urn:oiml:cnml:1.0" recommendationId="R60">
  <Issuer><Name>Test</Name></Issuer>
</CNML>`;
    const prior: CheckResult[] = [
      { checkId: "xml-well-formed", status: "pass" },
      { checkId: "schema-valid", status: "pass" },
      { checkId: "signature", status: "pass" },
    ];
    const result = await timestampCheck.run(xml, {}, prior);
    // No OTS proof present — the check must not fail (OTS is optional).
    assert.notEqual(result.status, "fail");
  });
});
