globalThis.self = globalThis;
globalThis.window = globalThis;
import { DOMParser, XMLSerializer, DOMImplementation } from "@xmldom/xmldom";
globalThis.DOMParser = DOMParser;
globalThis.XMLSerializer = XMLSerializer;
globalThis.document = new DOMImplementation().createDocument(null, "html", null);

import { dccToCertificate, certificateToDcc } from "../packages/ptb-dcc-compat/src/index.ts";
import { readFileSync } from "node:fs";
import yaml from "yaml";

// 1. Build a CNML cert from sample, export to DCC, import back
const cert = yaml.parse(readFileSync("./packages/cnml-schemas/src/samples/r60-sample.yaml", "utf8"));
const dccXml = certificateToDcc(cert);
console.log("--- Generated DCC (first 30 lines) ---");
console.log(dccXml.split("\n").slice(0, 30).join("\n"));

// 2. Round-trip back to CNML
const rt = dccToCertificate(dccXml);
console.log("\n--- Round-trip back to CNML ---");
console.log("Number:", rt.certificate?.number);
console.log("Issuing authority:", rt.issuing_authority?.name);
console.log("Category:", rt.certified_type?.category);
console.log("Type designations:", rt.certified_type?.type_designations);
console.log("Manufacturer:", rt.manufacturers?.[0]?.name);
console.log("Applicant:", rt.applicants?.[0]?.name);

if (!rt.certificate?.number || !rt.issuing_authority?.name) {
  console.error("FAILED: round-trip lost critical data");
  process.exit(1);
}
console.log("\nOK — DCC import/export round-trip works");
