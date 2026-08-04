/**
 * Specs for the er-binding check (TODO.ops/15) — the certificate's
 * cryptographic binding to its Evaluation Report.
 *
 * Postures:
 *   binding present + well-formed  → pass (the digest is named)
 *   binding present + malformed    → fail (a broken binding is a defect,
 *                                      never a skip)
 *   binding absent                 → skip (pre-leg certificate — the
 *                                      honest migration posture)
 *
 * Run: pnpm --filter @cnml/cnml-test-vectors test
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Node-side DOM polyfill (the check parses XML when ctx.parsedCert is
// absent — the standalone path).
globalThis.self = globalThis;
globalThis.window = globalThis;
import * as xmldomNS from "@xmldom/xmldom";
const xmldomP = xmldomNS as any;
globalThis.DOMParser = xmldomP.DOMParser;
globalThis.XMLSerializer = xmldomP.XMLSerializer;
globalThis.Element = xmldomP.Element;
globalThis.Node = xmldomP.Node;
globalThis.document = new xmldomP.DOMImplementation().createDocument(null, "html", null);

import { erBindingCheck } from "../../cnml-crypto/src/checks/er_binding.ts";
import { certToCnmlXml } from "../../cnml-xml/src/index.ts";

const DIGEST = "sha256:" + "cd".repeat(32);

function certWithEr(er?: unknown): string {
  return certToCnmlXml({
    certificate: { number: "R60/2021-A-XX1-26.01" },
    recommendation: { id: "R60", edition: 2021, scheme: "A" },
    ...(er !== undefined ? { evaluation_report: er as never } : {}),
  });
}

describe("er-binding check (TODO.ops/15)", () => {
  test("a well-formed binding passes and names the digest", async () => {
    const xml = certWithEr({ id: "er-1", date: "2026-06-30", digest: DIGEST });
    const r = await erBindingCheck.run(xml, {}, []);
    assert.equal(r.status, "pass");
    assert.match(r.reason ?? "", /er-1/);
    assert.match(r.reason ?? "", new RegExp(DIGEST));
  });

  test("a malformed digest fails — a broken binding is a defect", async () => {
    const xml = certWithEr({ id: "er-1", digest: "md5:deadbeef" });
    const r = await erBindingCheck.run(xml, {}, []);
    assert.equal(r.status, "fail");
    assert.match(r.reason ?? "", /digest/);
  });

  test("a binding without an id fails", async () => {
    const xml = certWithEr({ digest: DIGEST });
    const r = await erBindingCheck.run(xml, {}, []);
    assert.equal(r.status, "fail");
  });

  test("an absent binding skips with the honest pre-leg note", async () => {
    const xml = certWithEr();
    const r = await erBindingCheck.run(xml, {}, []);
    assert.equal(r.status, "skip");
    assert.match(r.reason ?? "", /no ER binding|pre-leg/i);
  });

  test("reads ctx.parsedCert when the pipeline already parsed (no re-parse)", async () => {
    const r = await erBindingCheck.run("<not-xml/>", {
      parsedCert: { evaluation_report: { id: "er-ctx", digest: DIGEST } },
    }, []);
    assert.equal(r.status, "pass");
    assert.match(r.reason ?? "", /er-ctx/);
  });
});
