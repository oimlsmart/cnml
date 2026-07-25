// Node-side polyfills — must be imported before any module that touches DOM.
globalThis.self = globalThis;
globalThis.window = globalThis;
import xmldomPackage from "@xmldom/xmldom";
const { DOMParser, XMLSerializer, DOMImplementation, Element, Node } = xmldomPackage as any;
globalThis.DOMParser = DOMParser;
globalThis.XMLSerializer = XMLSerializer;
globalThis.Element = Element;
globalThis.Node = Node;
globalThis.document = new DOMImplementation().createDocument(null, "html", null);
