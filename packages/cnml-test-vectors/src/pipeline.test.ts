/**
 * Every signed vector passes schema-valid + signature through the full
 * pipeline (the corpus gate — the VerifyDrop path's own integrity).
 *
 * Run: pnpm --filter @cnml/cnml-test-vectors test
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

globalThis.self = globalThis;
globalThis.window = globalThis;
import * as xmldomNS from "@xmldom/xmldom";
const xmldomP = xmldomNS as any;
globalThis.DOMParser = xmldomP.DOMParser;
globalThis.XMLSerializer = xmldomP.XMLSerializer;
globalThis.Element = xmldomP.Element;
globalThis.Node = xmldomP.Node;
globalThis.document = new xmldomP.DOMImplementation().createDocument(null, "html", null);

describe("the full pipeline against a signed vector (the VerifyDrop path)", () => {
  const files = readdirSync(new URL("./vectors", import.meta.url)).filter((f) => f.endsWith(".cnml.xml"));
  for (const f of files) {
    test(`${f}: schema-valid + signature pass without consumer-side registration`, async () => {
      const { runChecks } = await import("../../cnml-crypto/src/checks/index.ts");
      const xml = readFileSync(new URL(`./vectors/${f}`, import.meta.url), "utf8");
      const results = await runChecks(xml, {});
      const schemaCheck = results.find((r) => r.checkId === "schema-valid");
      assert.equal(schemaCheck?.status, "pass", schemaCheck?.reason);
      const sigCheck = results.find((r) => r.checkId === "signature");
      assert.equal(sigCheck?.status, "pass", sigCheck?.reason);
    });
  }
});
