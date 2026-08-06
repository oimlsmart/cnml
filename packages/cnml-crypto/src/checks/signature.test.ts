import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { signatureCheck } from "./signature.ts";

describe("check: signature", () => {
  test("fails on a CNML-shaped document with no Signature element", async () => {
    const xml = `<?xml version="1.0"?>
<CNML xmlns="urn:oiml:cnml:1.0" recommendationId="R60">
  <Issuer><Name>Test</Name></Issuer>
</CNML>`;
    const result = await signatureCheck.run(xml, {}, []);
    assert.equal(result.checkId, "signature");
    assert.equal(result.status, "fail");
    assert.match(result.reason ?? "", /signature/i);
  });

  test("fails on input that is not XML at all", async () => {
    const xml = `not xml`;
    const result = await signatureCheck.run(xml, {}, []);
    assert.equal(result.status, "fail");
  });

  test("returns a CheckResult with the stable checkId 'signature'", async () => {
    const xml = `<?xml version="1.0"?><CNML xmlns="urn:oiml:cnml:1.0"/>`;
    const result = await signatureCheck.run(xml, {}, []);
    assert.equal(result.checkId, "signature");
    assert.ok(["pass", "fail", "warn", "skip"].includes(result.status));
  });
});
