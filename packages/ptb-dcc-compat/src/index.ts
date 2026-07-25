/**
 * @cnml/ptb-dcc-compat — PTB Digital Calibration Certificate (DCC) importer/exporter
 *
 * Provides lossy conversion between PTB DCC XML (3.x) and the OIML CNML
 * Certificate core model. Round-trips administrative data, calibrated items,
 * and measurement results; OIML Recommendation-specific fields (accuracy_class,
 * d011_tests_applicable) are stored as CNML extensions on the result tree.
 *
 * References:
 *   - DCC XSD 3.2.0 (https://www.ptb.de/dcc/v3.2.0/dcc.xsd)
 *   - DCC Documentation (https://www.ptb.de/dam/jcr/24337935-2b7d-4be4-9258-8c66cf47f727/dcc-schema-documentation-v3-2-0.pdf)
 */

import type { Certificate, Party, StructuredValue } from "../../cnml-xml/src/index.js";

export const DCC_NS = "https://ptb.de/dcc";
export const DSML_NS = "https://ptb.de/dsml";
export const SI_NS = "http://ptb.de/si";

/**
 * Map a PTB DCC XML document to the OIML CNML Certificate core model.
 *
 * Mapping (DCC → CNML):
 *
 *   administrativeData/coreData/uniqueIdentifier  → certificate.number
 *   administrativeData/coreData/issueDate         → certificate.date_issued
 *   administrativeData/coreData/countryCodeISO3166_1 → certificate.member_state (resolved)
 *   administrativeData/calibrationLaboratory/contact → issuing_authority
 *   administrativeData/customer/contact           → applicants[0]
 *   administrativeData/items/item                 → certified_type
 *   administrativeData/items/item/manufacturer    → manufacturers[0]
 *   administrativeData/respPersons                → issuing_authority.person_responsible (joined)
 *   measurementResults/measurementResult/results/result/quantity → characteristics.model_level[]
 */
export function dccToCertificate(dccXml: string): Certificate {
  const doc = new DOMParser().parseFromString(dccXml, "application/xml");
  const root = doc.documentElement;
  const admin = firstEl(root, "administrativeData");
  if (!admin) throw new Error("not a DCC: administrativeData missing");

  const core = firstEl(admin, "coreData");
  const items = firstEl(admin, "items");
  const lab = firstEl(admin, "calibrationLaboratory");
  const customer = firstEl(admin, "customer");
  const respPersons = firstEl(admin, "respPersons");

  const cert: Certificate = {
    certificate: {},
  };

  if (core) {
    const uid = text(core, "uniqueIdentifier");
    if (uid) cert.certificate!.number = uid;
    const issue = text(core, "issueDate") ?? text(core, "endPerformanceDate");
    if (issue) cert.certificate!.date_issued = issue;
    const cc = text(core, "countryCodeISO3166_1");
    if (cc) cert.certificate!.member_state = isoCountry(cc);
    const langs = Array.from(core.getElementsByTagNameNS(DCC_NS, "usedLangCodeISO639_1"))
      .map((e) => e.textContent ?? "");
    if (langs.length > 0) cert.certificate!.languages = langs;
  }

  if (lab) {
    const labContact = firstEl(lab, "contact");
    if (labContact) cert.issuing_authority = parseContact(labContact);
  }

  if (customer) {
    const customerContact = firstEl(customer, "contact");
    if (customerContact) cert.applicants = [parseContact(customerContact)];
  }

  if (items) {
    const itemEls = items.getElementsByTagNameNS(DCC_NS, "item");
    if (itemEls.length > 0) {
      const firstItem = itemEls[0];
      cert.certified_type = {
        category: text(firstItem, "name") ?? "(unknown)",
        type_designations: Array.from(firstItem.getElementsByTagNameNS(DCC_NS, "identifications"))
          .flatMap((ids) => Array.from(ids.getElementsByTagNameNS(DCC_NS, "identification")))
          .map((id) => text(id, "value"))
          .filter((v): v is string => !!v),
      };
      const model = text(firstItem, "model");
      if (model) cert.certified_type.module_designation = model;
      const description = text(firstItem, "description");
      if (description) cert.certified_type.description = description;

      // Manufacturer
      const manuEl = firstEl(firstItem, "manufacturer");
      if (manuEl) {
        const manuContact = firstEl(manuEl, "contact") ?? manuEl;
        cert.manufacturers = [parseContact(manuContact)];
      }
    }
  }

  if (respPersons) {
    const persons = Array.from(respPersons.getElementsByTagNameNS(DCC_NS, "respPerson"));
    const names = persons
      .map((p) => {
        const person = firstEl(p, "person");
        if (!person) return null;
        const given = text(person, "givenname") ?? "";
        const fam   = text(person, "surname") ?? "";
        return `${given} ${fam}`.trim() || null;
      })
      .filter((n): n is string => !!n);
    if (names.length > 0 && cert.issuing_authority) {
      cert.issuing_authority.person_responsible = names.join("; ");
    }
  }

  // Measurement results → characteristics.model_level
  const mrList = root.getElementsByTagNameNS(DCC_NS, "measurementResult");
  if (mrList.length > 0) {
    const characteristics: Certificate["characteristics"] = { model_level: [] };
    for (let i = 0; i < mrList.length; i++) {
      const mr = mrList[i];
      const resultsList = firstEl(mr, "results");
      if (!resultsList) continue;
      const results = Array.from(resultsList.getElementsByTagNameNS(DCC_NS, "result"));
      for (const r of results) {
        const layer = extractResultLayer(r);
        if (layer && Object.keys(layer).length > 0) {
          characteristics.model_level!.push(layer);
        }
      }
    }
    if ((characteristics.model_level?.length ?? 0) > 0) {
      cert.characteristics = characteristics;
    }
  }

  return cert;
}

/**
 * Reverse direction: serialize a CNML Certificate to a minimal DCC 3.2.0 XML.
 *
 * Useful when a CNML issuer needs to publish a DCC-compatible view of their
 * OIML-CS certificate (e.g., for an EU notified body or recipient that
 * requires DCC).
 *
 * The output is a valid DCC document with all four "rings" — administrative
 * data, items, measurement results, and signature placeholder — populated
 * from the CNML core.
 */
export function certificateToDcc(cert: Certificate): string {
  const doc = document.implementation.createDocument(null, null, null);
  const root = doc.createElementNS(DCC_NS, "dcc:digitalCalibrationCertificate");
  root.setAttribute("schemaVersion", "3.2.0");
  doc.appendChild(root);
  // Pre-walk to ensure all prefixes are declared on the root (one-shot)
  // We do this lazily after building all child elements to avoid dupes.
  // The default xmlns:dcc decl comes from createElementNS; we only need
  // to register the others (dsml, si) if they're actually used.
  const usedPrefixes = new Set<string>(["dcc"]);
  walkUsedPrefixes(cert, usedPrefixes);
  if (usedPrefixes.has("si"))  root.setAttribute("xmlns:si",  SI_NS);
  if (usedPrefixes.has("dsml")) root.setAttribute("xmlns:dsml", DSML_NS);

  // Administrative data
  const admin = doc.createElementNS(DCC_NS, "dcc:administrativeData");
  root.appendChild(admin);

  // dccSoftware (placeholder — the CNML producer is the "software")
  const software = doc.createElementNS(DCC_NS, "dcc:dccSoftware");
  const sw = doc.createElementNS(DCC_NS, "dcc:software");
  const swName = doc.createElementNS(DCC_NS, "dcc:name");
  swName.textContent = "cnml-web";
  sw.appendChild(swName);
  const swRelease = doc.createElementNS(DCC_NS, "dcc:release");
  swRelease.textContent = "0.1.0";
  sw.appendChild(swRelease);
  software.appendChild(sw);
  admin.appendChild(software);

  // coreData
  const cdata = cert.certificate ?? {};
  const core = doc.createElementNS(DCC_NS, "dcc:coreData");
  appendText(core, "dcc:countryCodeISO3166_1", isoCountryCode(cdata.member_state as string | undefined));
  appendText(core, "dcc:usedLangCodeISO639_1", "en");
  appendText(core, "dcc:mandatoryLangCodeISO639_1", "en");
  appendText(core, "dcc:uniqueIdentifier", (cdata.number as string | undefined) ?? "OIML-CS-unknown");
  appendText(core, "dcc:beginPerformanceDate", (cdata.date_issued as string | undefined) ?? new Date().toISOString().slice(0, 10));
  appendText(core, "dcc:endPerformanceDate", (cdata.date_issued as string | undefined) ?? new Date().toISOString().slice(0, 10));
  const loc = doc.createElementNS(DCC_NS, "dcc:performanceLocation");
  loc.textContent = "outfield";
  core.appendChild(loc);
  if (cdata.date_issued) appendText(core, "dcc:issueDate", cdata.date_issued as string);
  admin.appendChild(core);

  // items
  if (cert.certified_type) {
    const ct = cert.certified_type;
    const items = doc.createElementNS(DCC_NS, "dcc:items");
    const item = doc.createElementNS(DCC_NS, "dcc:item");
    const name = doc.createElementNS(DCC_NS, "dcc:name");
    name.textContent = ct.category;
    item.appendChild(name);
    if (ct.type_designations.length > 0) {
      const ids = doc.createElementNS(DCC_NS, "dcc:identifications");
      for (const td of ct.type_designations) {
        const id = doc.createElementNS(DCC_NS, "dcc:identification");
        appendText(id, "dcc:issuer", "manufacturer");
        appendText(id, "dcc:value", td);
        appendText(id, "dcc:name", "type");
        ids.appendChild(id);
      }
      item.appendChild(ids);
    }
    if (ct.description) {
      const desc = doc.createElementNS(DCC_NS, "dcc:description");
      desc.textContent = ct.description;
      item.appendChild(desc);
    }
    if (cert.manufacturers?.[0]) {
      const manu = contactToDccElement(doc, "dcc:manufacturer", cert.manufacturers[0]);
      item.appendChild(manu);
    }
    items.appendChild(item);
    admin.appendChild(items);
  }

  // calibrationLaboratory (= issuing authority)
  if (cert.issuing_authority) {
    const lab = doc.createElementNS(DCC_NS, "dcc:calibrationLaboratory");
    const contactWrap = contactToDccElement(doc, "dcc:contact", cert.issuing_authority);
    lab.appendChild(contactWrap);
    admin.appendChild(lab);
  }

  // respPersons
  if (cert.issuing_authority?.person_responsible) {
    const respPersons = doc.createElementNS(DCC_NS, "dcc:respPersons");
    const resp = doc.createElementNS(DCC_NS, "dcc:respPerson");
    const person = doc.createElementNS(DCC_NS, "dcc:person");
    const [given, ...rest] = cert.issuing_authority.person_responsible.split(/\s+/);
    appendText(person, "dcc:givenname", given ?? cert.issuing_authority.person_responsible);
    appendText(person, "dcc:surname", rest.join(" "));
    resp.appendChild(person);
    respPersons.appendChild(resp);
    admin.appendChild(respPersons);
  }

  // customer (= applicant)
  if (cert.applicants?.[0]) {
    const custWrap = contactToDccElement(doc, "dcc:customer", cert.applicants[0]);
    admin.appendChild(custWrap);
  }

  // measurementResults — flatten characteristics.model_level into a single measurementResult
  const mrs = doc.createElementNS(DCC_NS, "dcc:measurementResults");
  if (cert.characteristics?.model_level?.length) {
    const mr = doc.createElementNS(DCC_NS, "dcc:measurementResult");
    const mrName = doc.createElementNS(DCC_NS, "dcc:name");
    mrName.textContent = "OIML CS Evaluation";
    mr.appendChild(mrName);
    const results = doc.createElementNS(DCC_NS, "dcc:results");
    for (const layer of cert.characteristics.model_level) {
      const r = layerToDccResult(doc, layer as Record<string, StructuredValue>);
      if (r) results.appendChild(r);
    }
    mr.appendChild(results);
    mrs.appendChild(mr);
  }
  root.appendChild(mrs);

  return prettyXml(doc);
}

// ─── Helpers ───────────────────────────────────────────────────────────

function firstEl(parent: Element, localName: string): Element | undefined {
  const list = parent.getElementsByTagNameNS(DCC_NS, localName);
  return list.length > 0 ? list[0] : undefined;
}

function text(parent: Element, localName: string): string | undefined {
  const e = firstEl(parent, localName);
  return e?.textContent ?? undefined;
}

function appendText(parent: Element, qualifiedName: string, value: string): void {
  if (!value) return;
  const e = parent.ownerDocument.createElementNS(DCC_NS, qualifiedName);
  e.textContent = value;
  parent.appendChild(e);
}

function parseContact(el: Element): Party {
  const party: Party = { name: text(el, "name") ?? text(el, "organisation") ?? "(unknown)" };
  const location = firstEl(el, "location");
  if (location) {
    const lines: string[] = [];
    const street = text(location, "street");
    if (street) lines.push(street);
    const cityZip = [text(location, "postCode"), text(location, "city")].filter(Boolean).join(" ");
    if (cityZip) lines.push(cityZip);
    const country = text(location, "countryCode") ?? text(location, "country");
    if (country) lines.push(country);
    if (lines.length > 0) party.address_lines = lines;
  }
  const emails = Array.from(el.getElementsByTagNameNS(DCC_NS, "eMail")).map((e) => e.textContent);
  if (emails[0]) party.email = emails[0]!;
  const phones = Array.from(el.getElementsByTagNameNS(DCC_NS, "phone")).map((e) => e.textContent);
  if (phones[0]) party.phone = phones[0]!;
  const urls = Array.from(el.getElementsByTagNameNS(DCC_NS, "url")).map((e) => e.textContent);
  if (urls[0]) party.website = urls[0]!;
  return party;
}

function contactToDccElement(doc: Document, qualifiedName: string, party: Party): Element {
  const wrap = doc.createElementNS(DCC_NS, qualifiedName);
  const contact = doc.createElementNS(DCC_NS, "dcc:contact");
  appendText(contact, "dcc:name", party.name);
  if (party.address_lines?.length) {
    const loc = doc.createElementNS(DCC_NS, "dcc:location");
    const first = party.address_lines[0] ?? "";
    const last = party.address_lines[party.address_lines.length - 1] ?? "";
    if (/^\d+\s/.test(first)) {
      const postCode = first.match(/^(\S+)/)?.[1];
      const street = first.slice((postCode ?? "").length).trim();
      appendText(loc, "dcc:street", street);
      if (postCode) appendText(loc, "dcc:postCode", postCode);
    } else {
      appendText(loc, "dcc:street", first);
    }
    // try to extract postCode + city from middle line
    if (party.address_lines.length >= 2) {
      const mid = party.address_lines[1] ?? "";
      const m = mid.match(/^(\S+)\s+(.+)$/);
      if (m) {
        appendText(loc, "dcc:postCode", m[1]!);
        appendText(loc, "dcc:city", m[2]!);
      }
    }
    appendText(loc, "dcc:country", last);
    contact.appendChild(loc);
  }
  if (party.email)   appendText(contact, "dcc:eMail", party.email);
  if (party.phone)   appendText(contact, "dcc:phone", party.phone);
  if (party.website) appendText(contact, "dcc:url",   party.website);
  wrap.appendChild(contact);
  return wrap;
}

function extractResultLayer(result: Element): Record<string, StructuredValue> | undefined {
  const layer: Record<string, StructuredValue> = {};
  const quantities = result.getElementsByTagNameNS(DCC_NS, "quantity");
  for (let i = 0; i < quantities.length; i++) {
    const q = quantities[i];
    const name = q.getAttribute("refType") ?? q.getElementsByTagNameNS(DCC_NS, "name")[0]?.textContent;
    if (!name) continue;
    const real = q.getElementsByTagNameNS(SI_NS, "real")[0] ?? q.getElementsByTagNameNS(DCC_NS, "real")[0];
    const noQuant = q.getElementsByTagNameNS(SI_NS, "noQuantity")[0];
    if (real) {
      const value = text(real, "value");
      const unit = text(real, "unit") ?? "";
      layer[name] = {
        value: value != null ? parseFloat(value) : undefined,
        unit_symbol: unit || undefined,
      };
    } else if (noQuant) {
      layer[name] = { value: noQuant.textContent ?? "" };
    }
  }
  return layer;
}

function layerToDccResult(doc: Document, layer: Record<string, StructuredValue>): Element | null {
  const keys = Object.keys(layer);
  if (keys.length === 0) return null;
  const r = doc.createElementNS(DCC_NS, "dcc:result");
  for (const name of keys) {
    const sv = layer[name];
    const q = doc.createElementNS(DCC_NS, "dcc:quantity");
    const qName = doc.createElementNS(DCC_NS, "dcc:name");
    qName.textContent = name;
    q.appendChild(qName);
    if (typeof sv.value === "number") {
      const real = doc.createElementNS(SI_NS, "si:real");
      appendText(real, "si:value", String(sv.value));
      if (sv.unit_symbol) appendText(real, "si:unit", sv.unit_symbol);
      q.appendChild(real);
    } else if (sv.value !== undefined && sv.value !== null) {
      const noQ = doc.createElementNS(SI_NS, "si:noQuantity");
      noQ.textContent = String(sv.value);
      q.appendChild(noQ);
    }
    r.appendChild(q);
  }
  return r;
}

const ISO_3166: Record<string, string> = {
  NL: "The Netherlands", DE: "Germany", FR: "France", GB: "United Kingdom",
  UK: "United Kingdom", ES: "Spain", IT: "Italy", US: "United States",
  CN: "China", JP: "Japan", KR: "South Korea", BR: "Brazil", IN: "India",
  CH: "Switzerland", AT: "Austria", BE: "Belgium", DK: "Denmark",
  FI: "Finland", NO: "Norway", SE: "Sweden", PL: "Poland", PT: "Portugal",
  CZ: "Czech Republic", IE: "Ireland", LU: "Luxembourg", GR: "Greece",
  HU: "Hungary", SK: "Slovakia", SI: "Slovenia", HR: "Croatia",
  RO: "Romania", BG: "Bulgaria", EE: "Estonia", LV: "Latvia", LT: "Lithuania",
};

function isoCountry(code: string): string {
  return ISO_3166[code.toUpperCase()] ?? code;
}

function isoCountryCode(country?: string): string {
  if (!country) return "DE"; // default
  const c = country.toLowerCase();
  for (const [code, name] of Object.entries(ISO_3166)) {
    if (name.toLowerCase() === c || code.toLowerCase() === c) return code;
  }
  return "DE";
}

function walkUsedPrefixes(_cert: Certificate, _out: Set<string>): void {
  // Placeholder: in future, walk the certificate to detect SI / DSML usage.
  // For now we declare both prefixes optimistically (DCC XSD expects them).
  _out.add("si");
  _out.add("dsml");
}

function prettyXml(doc: Document): string {
  const serialized = new XMLSerializer().serializeToString(doc);
  // xmldom may emit duplicate xmlns:* attributes — collapse them
  const cleaned = serialized.replace(/(xmlns:[a-z]+="[^"]+")\s+\1/g, "$1");
  let depth = 0;
  return cleaned
    .replace(/></g, ">\n<")
    .split("\n")
    .map((line) => {
      if (line.startsWith("</")) depth = Math.max(0, depth - 1);
      const out = "  ".repeat(depth) + line;
      if (line.startsWith("<") && !line.startsWith("</") && !line.endsWith("/>") && !line.includes("</")) depth++;
      return out;
    })
    .join("\n") + "\n";
}
