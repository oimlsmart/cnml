// Polyfill self BEFORE importing xmldsigjs so it auto-registers WebCrypto.
globalThis.self = globalThis;
globalThis.window = globalThis;

import { DOMParser, XMLSerializer, DOMImplementation } from "@xmldom/xmldom";
globalThis.DOMParser = DOMParser;
globalThis.XMLSerializer = XMLSerializer;
globalThis.document = new DOMImplementation().createDocument(null, "html", null);

import { readFileSync } from "node:fs";
import yaml from "yaml";

import { certToDcoc, dcocToRdfXml, dcocToJsonLd } from "../packages/cnml-dcoc/src/index.ts";

const certYaml = readFileSync(new URL("../packages/cnml-schemas/src/samples/r60-sample.yaml", import.meta.url), "utf8");
const cert = yaml.parse(certYaml);

const dcoc = certToDcoc(cert);
console.log("D-CoC cert_no:", dcoc.cert_no);
console.log("D-CoC manufacturer:", dcoc.manufacturer.name);
console.log("D-CoC object_ids:", JSON.stringify(dcoc.cert_object_ids));
console.log("D-CoC statement:", dcoc.statement_of_conformity);

const rdf = dcocToRdfXml(dcoc);
console.log("--- RDF/XML (first 60 lines) ---");
console.log(rdf.split("\n").slice(0, 60).join("\n"));

const jsonld = dcocToJsonLd(dcoc);
console.log("--- JSON-LD (first 30 lines) ---");
console.log(jsonld.split("\n").slice(0, 30).join("\n"));

console.log("OK — D-CoC + RDF works");
