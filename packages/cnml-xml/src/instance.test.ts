// Minimal DOM polyfill for node:test — just enough for the XML
// serializer to run without a browser. The full browser DOM is
// exercised by the e2e suite (04-sign-verify).
if (typeof globalThis.document === "undefined") {
  const { DOMParser, XMLSerializer, DOMImplementation } = await import("@xmldom/xmldom");
  globalThis.document = {
    implementation: new DOMImplementation(),
    createElementNS: (ns, qname) => new DOMImplementation().createDocument(ns, qname, null).documentElement,
  } as unknown as Document;
  globalThis.DOMParser = DOMParser as unknown as typeof DOMParser;
  globalThis.XMLSerializer = XMLSerializer as unknown as typeof XMLSerializer;
}

const { test } = await import("node:test");
const assert = (await import("node:assert/strict")).default;
const { instanceCertToXml } = await import("./index.ts");

test("instanceCertToXml produces a well-formed instanceCertificate element", () => {
  const xml = instanceCertToXml({
    manufacturer: "Acme Weighing Systems",
    model: "LC-500",
    serialNumber: "SN-001",
    firmwareHash: "sha256:abcdef0123456789",
    manufacturingDate: "2026-08-08",
  });

  assert.match(xml, /tier="5"/);
  assert.match(xml, /schemaVersion="1\.0"/);
  assert.match(xml, /Acme Weighing Systems/);
  assert.match(xml, /LC-500/);
  assert.match(xml, /SN-001/);
  assert.match(xml, /algorithm="SHA-256"/);
  assert.match(xml, /2026-08-08/);
  assert.match(xml, /issuedAt/);
});

test("instanceCertToXml omits firmwareHash when not provided", () => {
  const xml = instanceCertToXml({
    manufacturer: "Test",
    model: "M1",
    serialNumber: "S1",
    manufacturingDate: "2026-01-01",
  });

  assert.ok(!xml.includes("firmwareHash"));
});

test("instanceCertToXml escapes special XML characters", () => {
  const xml = instanceCertToXml({
    manufacturer: "A & B < Co>",
    model: "M1",
    serialNumber: "S&N",
    manufacturingDate: "2026-01-01",
  });

  assert.match(xml, /A &amp; B &lt; Co&gt;/);
  assert.match(xml, /S&amp;N/);
});
