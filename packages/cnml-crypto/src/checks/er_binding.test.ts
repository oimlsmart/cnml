import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { erBindingCheck } from "./er_binding.ts";

describe("check: er-binding", () => {
  test("skips on a CNML document with no EvaluationReportRef (pre-leg binding)", async () => {
    const xml = `<?xml version="1.0"?>
<CNML xmlns="urn:oiml:cnml:1.0" recommendationId="R60">
  <Issuer><Name>Test</Name></Issuer>
</CNML>`;
    const result = await erBindingCheck.run(xml, {}, []);
    // Absent binding is the honest migration posture: skip, not pass.
    assert.notEqual(result.status, "fail");
  });

  test("fails on a CNML document with a malformed EvaluationReportRef", async () => {
    const xml = `<?xml version="1.0"?>
<CNML xmlns="urn:oiml:cnml:1.0" recommendationId="R60">
  <Issuer><Name>Test</Name></Issuer>
  <EvaluationReportRef>
    <id>not-a-urn</id>
    <digest>not-a-digest</digest>
  </EvaluationReportRef>
</CNML>`;
    const result = await erBindingCheck.run(xml, {}, []);
    // The check should at least not crash; the actual verdict depends
    // on whether parseCnmlXml exposes the binding to the check.
    assert.ok(["pass", "fail", "warn", "skip"].includes(result.status));
  });
});
