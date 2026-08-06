import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { transparencyCheck } from "./transparency.ts";

describe("check: transparency", () => {
  test("warns (not fails) on a CNML document with no transparency proof", async () => {
    const xml = `<?xml version="1.0"?>
<CNML xmlns="urn:oiml:cnml:1.0" recommendationId="R60">
  <Issuer><Name>Test</Name></Issuer>
</CNML>`;
    const result = await transparencyCheck.run(xml, {}, []);
    // Transparency is a warning, not a hard failure — pre-deployment
    // certificates lack proofs and that is the migration posture.
    assert.notEqual(result.status, "fail");
  });

  test("returns a CheckResult with the stable checkId 'transparency'", async () => {
    const xml = `<?xml version="1.0"?><CNML xmlns="urn:oiml:cnml:1.0"/>`;
    const result = await transparencyCheck.run(xml, {}, []);
    assert.equal(result.checkId, "transparency");
  });
});
