import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { xmlWellFormedCheck } from "./xml_well_formed.ts";

describe("check: xml-well-formed", () => {
  test("passes on a minimal valid XML document", async () => {
    const xml = `<?xml version="1.0"?><root><child/></root>`;
    const result = await xmlWellFormedCheck.run(xml, {}, []);
    assert.equal(result.checkId, "xml-well-formed");
    assert.equal(result.status, "pass");
  });

  test("fails on a truncated document (missing closing tag)", async () => {
    const xml = `<?xml version="1.0"?><root><child></root>`;
    const result = await xmlWellFormedCheck.run(xml, {}, []);
    assert.equal(result.status, "fail");
    assert.match(result.reason ?? "", /parse error|expected|tag/i);
  });

  test("fails on garbage that is not XML at all", async () => {
    const xml = `this is not xml`;
    const result = await xmlWellFormedCheck.run(xml, {}, []);
    assert.equal(result.status, "fail");
  });

  test("passes on a CNML-shaped document with namespaces", async () => {
    const xml = `<?xml version="1.0"?>
<CNML xmlns="urn:oiml:cnml:1.0" recommendationId="R60">
  <Issuer><Name>Test</Name></Issuer>
</CNML>`;
    const result = await xmlWellFormedCheck.run(xml, {}, []);
    assert.equal(result.status, "pass");
  });
});
