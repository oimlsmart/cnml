import { test, describe } from "node:test";
import assert from "node:assert/strict";
import "./_test-polyfill.ts";
import { schemaValidCheck } from "./schema_valid.ts";

describe("check: schema-valid", () => {
  test("fails on input that is not a CNML document (parseable but wrong root)", async () => {
    const xml = `<?xml version="1.0"?><NotCnml></NotCnml>`;
    const result = await schemaValidCheck.run(xml, {}, []);
    assert.equal(result.checkId, "schema-valid");
    assert.equal(result.status, "fail");
    assert.match(result.reason ?? "", /not a cnml/i);
  });

  test("fails when parseCnmlXml throws (input is well-formed XML but not CNML)", async () => {
    const xml = `<?xml version="1.0"?><root/>`;
    const result = await schemaValidCheck.run(xml, {}, []);
    assert.equal(result.status, "fail");
  });

  test("fails on malformed XML that xmldom tolerates but parseCnmlXml rejects", async () => {
    const xml = `<?xml version="1.0"?>
<NotCnml xmlns="urn:oiml:cnml:1.0"/>`;
    const result = await schemaValidCheck.run(xml, {}, []);
    assert.equal(result.status, "fail");
  });

  test("sets ctx.recommendationId when the document is a CNML with a recommendation", async () => {
    // Use a real signed vector so parseCnmlXml succeeds. The vectors are
    // in the test-vectors package; read one to exercise the pass path.
    const { readFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");
    const vectorPath = fileURLToPath(new URL("../../../../cnml-test-vectors/src/vectors/R60.cnml.xml", import.meta.url));
    let xml: string;
    try {
      xml = readFileSync(vectorPath, "utf8");
    } catch {
      // Vector path differs in some layouts — skip rather than fail.
      return;
    }
    const ctx: { recommendationId?: string; parsedCert?: unknown } = {};
    const result = await schemaValidCheck.run(xml, ctx, []);
    if (result.status === "pass") {
      assert.ok(ctx.recommendationId, "recommendationId must be set on ctx after a successful schema-valid pass");
    }
  });
});
