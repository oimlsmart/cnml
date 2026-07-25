import type { Check } from "./types.ts";

/** Check 1: XML well-formedness. Parses the XML via DOMParser; any
 *  parse error fails this check. */
export const xmlWellFormedCheck: Check = {
  id: "xml-well-formed",
  label: "1. XML well-formed",
  run: async (xml) => {
    try {
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const parseErr = doc.getElementsByTagName("parsererror")[0];
      if (parseErr) {
        return {
          checkId: "xml-well-formed",
          status: "fail",
          reason: `XML parse error: ${parseErr.textContent ?? "unknown"}`,
        };
      }
      return { checkId: "xml-well-formed", status: "pass" };
    } catch (e) {
      return {
        checkId: "xml-well-formed",
        status: "fail",
        reason: `Could not parse XML: ${(e as Error).message}`,
      };
    }
  },
};
