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

// xmldsigjs's XPath transform (used by co-signature references) calls
// document.evaluate + self.XPathResult. @xmldom/xmldom has no evaluate;
// bridge it to the xpath package so Node tests exercise the same code
// path as the browser.
const xpath = (await import("xpath")).default as {
  evaluate: (
    expression: string,
    contextNode: Node,
    nsResolver: unknown,
    type: number,
    result: unknown,
  ) => { booleanValue?: boolean };
  XPathResult: { ANY_TYPE: number; BOOLEAN_TYPE: number };
};
(globalThis as Record<string, unknown>).XPathResult = xpath.XPathResult;
const probe = new xmldom.DOMParser().parseFromString("<r/>", "application/xml");
const docProto = Object.getPrototypeOf(probe) as {
  evaluate?: unknown;
};
docProto.evaluate = function (
  expression: string,
  contextNode: Node,
  nsResolver: unknown,
  type: number,
  result: unknown,
) {
  // The xpath package expects the resolver object form (it calls
  // resolver.lookupNamespaceURI directly).
  const resolver = nsResolver && typeof nsResolver === "object"
    ? nsResolver
    : { lookupNamespaceURI: () => null };
  // xmldsigjs always evaluates boolean(...) and reads booleanValue; the
  // xpath package does not infer the boolean result type from ANY_TYPE.
  const forced = type === xpath.XPathResult.ANY_TYPE
    ? xpath.XPathResult.BOOLEAN_TYPE
    : type;
  return xpath.evaluate(expression, contextNode, resolver, forced, result);
};
