globalThis.self = globalThis;
globalThis.window = globalThis;
import { DOMParser, DOMImplementation, XMLSerializer } from "@xmldom/xmldom";
globalThis.DOMParser = DOMParser;
globalThis.XMLSerializer = XMLSerializer;
globalThis.document = new DOMImplementation().createDocument(null, "html", null);

import { readFileSync } from "node:fs";
import yaml from "yaml";
import {certToDcoc, dcocToRdfXml} from "../packages/cnml-dcoc/src/index.ts";

const cert = yaml.parse(readFileSync("./packages/cnml-schemas/src/samples/r60-sample.yaml", "utf8"));
const dcoc = certToDcoc(cert);
const rdf = dcocToRdfXml(dcoc);

// Re-parse to confirm well-formed
const doc = new DOMParser().parseFromString(rdf, "application/xml");
const errs = doc.getElementsByTagName("parsererror");
if (errs.length > 0) {
  console.error("FAILED: XML parse error:", errs[0].textContent);
  process.exit(1);
}

// Count predicates in each namespace
const types = {};
const rdfRoot = doc.documentElement;
const allDescendants = (el, arr) => {
  for (let i = 0; i < el.childNodes.length; i++) {
    const c = el.childNodes[i];
    if (c.nodeType !== 1) continue;
    const localName = c.localName || c.nodeName.split(":").pop();
    types[localName] = (types[localName] || 0) + 1;
    allDescendants(c, arr);
  }
};
allDescendants(rdfRoot, []);
console.log("Predicate counts:", JSON.stringify(types, null, 2));
console.log("OK: D-CoC RDF/XML parses cleanly");
