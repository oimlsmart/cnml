import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { crlCheck } from "./crl.ts";
import type { CheckResult } from "./types.ts";

describe("check: crl", () => {
  test("short-circuits when signature failed", async () => {
    const xml = `<?xml version="1.0"?><CNML xmlns="urn:oiml:cnml:1.0"/>`;
    const prior: CheckResult[] = [
      { checkId: "xml-well-formed", status: "pass" },
      { checkId: "schema-valid", status: "pass" },
      { checkId: "signature", status: "fail", reason: "no signature" },
    ];
    const result = await crlCheck.run(xml, {}, prior);
    assert.equal(result.status, "skip");
  });

  test("skips when no CRL URL is configured and no DP is in the cert", async () => {
    const xml = `<?xml version="1.0"?>
<CNML xmlns="urn:oiml:cnml:1.0" recommendationId="R60">
  <Issuer><Name>Test</Name></Issuer>
</CNML>`;
    const prior: CheckResult[] = [
      { checkId: "xml-well-formed", status: "pass" },
      { checkId: "schema-valid", status: "pass" },
      { checkId: "signature", status: "pass" },
    ];
    const result = await crlCheck.run(xml, {}, prior);
    // No CRL distribution point reachable — the check should not fail
    // a document for network reasons. It either skips or warns.
    assert.notEqual(result.status, "fail");
  });
});
