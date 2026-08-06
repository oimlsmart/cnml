/**
 * Node-side DOM polyfills required by check modules that use
 * xmldsigjs / pkijs / DOMParser.
 *
 * Import this file at the top of any test that exercises the check
 * pipeline. The polyfill must run before the check module imports.
 */

globalThis.self = globalThis;
globalThis.window = globalThis;
import xmldomPackage from "@xmldom/xmldom";
const xmldom = xmldomPackage as {
  DOMParser: typeof DOMParser;
  XMLSerializer: typeof XMLSerializer;
  DOMImplementation: { new (): { createDocument: (ns: string | null, qn: string, doctype: unknown) => Document } };
  Element: typeof Element;
  Node: typeof Node;
};
globalThis.DOMParser = xmldom.DOMParser;
globalThis.XMLSerializer = xmldom.XMLSerializer;
globalThis.Element = xmldom.Element;
globalThis.Node = xmldom.Node;
globalThis.document = new xmldom.DOMImplementation().createDocument(null, "html", null);
