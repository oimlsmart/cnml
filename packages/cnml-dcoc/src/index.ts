/**
 * @cnml/cnml-dcoc — Digital Certificate of Conformity (D-CoC) for OIML
 *
 * Implements the NoBoMet D-CoC data structure (Documentation NoBoMet V1.2,
 * 2023) as RDF. Source: "The Digital Certificate of Conformity", OIML
 * Bulletin 2025-03 (https://www.oiml.org/en/publications/oiml-bulletin/2025-03/20250305)
 *
 * The D-CoC is grounded in FAIR principles (Findable, Accessible,
 * Interoperable, Reusable) and ISO/IEC 17065 + 17067. Top-level elements:
 *
 *   dcoc:certificationScheme            (1..1)
 *   dcoc:certificationBody              (1..1)   of type dcoc:contact
 *   dcoc:certNo                         (1..1)
 *   dcoc:revision                       (1..1)
 *   dcoc:modifications                  (0..1)
 *   dcoc:manufacturer                   (1..1)   of type dcoc:contact
 *   dcoc:categoryOfInstrument           (1..1)
 *   dcoc:certObjectIDs                  (1..∞)
 *   dcoc:certDate                       (1..1)
 *   dcoc:certificationCriteria          (1..∞)
 *   dcoc:additionallyAppliedDocuments   (0..∞)
 *   dcoc:statementOfConformity          (1..1)
 *   dcoc:validity                       (1..1)
 *   dcoc:responsibles                   (1..∞)   of type dcoc:contact
 *   dcoc:previousCertificates           (0..∞)
 *   dcoc:referenceNos                   (0..∞)
 *   dcoc:languages                      (1..∞)
 *
 * Output: RDF/XML (canonical, W3C spec-compliant).
 */

// ─── D-CoC namespace ────────────────────────────────────────────────────

export const DCOC_NS = "https://oimlsmart.org/ns/dcoc/1.0#";
export const RDF_NS  = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
export const RDFS_NS = "http://www.w3.org/2000/01/rdf-schema#";
export const XSD_NS  = "http://www.w3.org/2001/XMLSchema#";
export const VCARD_NS = "http://www.w3.org/2006/vcard/ns#";
export const DCTERMS_NS = "http://purl.org/dc/terms/";

// ─── D-CoC types (mirror the NoBoMet V1.2 spec) ────────────────────────

export interface DcocContact {
  name:            string;
  address_lines?:  string[];
  postal_code?:    string;
  city?:           string;
  country?:        string;
  contact_person?: string;
  email?:          string;
  phone?:          string;
  website?:        string;
  registration_id?: string;   // GLN, VAT, registration court number, etc.
}

export interface DcocCertificationScheme {
  scheme_id:    string;       // e.g. "OIML-CS"
  scheme_name?: string;       // e.g. "OIML Certificate System"
  module?:      string;       // e.g. "B" (type examination, OIML-CS Scheme B)
}

export interface DcocCertificationCriteria {
  reference:   string;        // e.g. "OIML R60:2000"
  title?:      string;
  edition?:    string;        // e.g. "2000 (E)"
  amendment?:  string | null;
  annexes?:    string[];      // e.g. ["A", "B"]
}

export interface DcocObjectID {
  kind:     "type_designation" | "model" | "variant" | "serial";
  value:    string;
  description?: string;
}

export interface DcocValidity {
  from_date:       string;    // xsd:date (ISO 8601)
  until_date?:     string;    // optional; indefinite if absent
  geographic_scope?: string; // e.g. "OIML member states"
}

export interface DcocModification {
  revision:  string;
  date:      string;
  summary:   string;
}

export interface DcocResponsibility {
  role:      string;          // e.g. "signatory", "reviewer"
  contact:   DcocContact;
}

export interface DCoC {
  certification_scheme:             DcocCertificationScheme;
  certification_body:               DcocContact;
  cert_no:                          string;
  revision:                         string;
  modifications?:                   DcocModification[];
  manufacturer:                     DcocContact;
  category_of_instrument:           string;
  cert_object_ids:                  DcocObjectID[];
  cert_date:                        string;       // xsd:date
  certification_criteria:           DcocCertificationCriteria[];
  additionally_applied_documents?:  DcocCertificationCriteria[];
  statement_of_conformity:          string;       // free text, often "The instrument type conforms to the requirements of <reference>."
  validity:                         DcocValidity;
  responsibles:                     DcocResponsibility[];
  previous_certificates?:           string[];
  reference_nos?:                   string[];
  languages:                        string[];     // BCP-47, e.g. ["en", "fr"]
}

// ─── OIML cert → D-CoC mapping ─────────────────────────────────────────

import type { Certificate } from "../../cnml-xml/src/index.js";

/**
 * Map an OIML CNML Certificate (core model) to a D-CoC document.
 *
 * Mapping rules follow the NoBoMet D-CoC V1.2 structure as outlined
 * in OIML Bulletin 2025-03, applying the FAIR principles. The CNML
 * `Certificate` carries the same administrative and certified-object
 * information; this function projects it into D-CoC's vocabulary.
 */
export function certToDcoc(cert: Certificate): DCoC {
  const cdata = cert.certificate ?? {};
  const rec   = cert.recommendation!;
  const issuer = cert.issuing_authority!;
  const manu   = (cert.manufacturers ?? [])[0]!;
  const ct     = cert.certified_type!;
  const certNo = cdata.number as string | undefined ?? "(unnumbered)";
  const revision = (cert.revision_history ?? [])[0]?.revision ?? "0";
  const modifications: DcocModification[] = (cert.revision_history ?? [])
    .filter((e) => e.revision !== "0")
    .map((e) => ({ revision: e.revision, date: e.date, summary: e.changes }));

  // Manufacturer + issuer contacts
  const certBody: DcocContact = partyToDcocContact(issuer);
  const manufacturer: DcocContact = partyToDcocContact(manu);

  // Object identifiers: type_designation(s), description
  const objectIds: DcocObjectID[] = (ct.type_designations ?? [])
    .map((td) => ({ kind: "type_designation" as const, value: td }));
  if (ct.module_designation) {
    objectIds.push({ kind: "variant", value: ct.module_designation });
  }
  if (ct.description) {
    objectIds.push({ kind: "model", value: ct.description });
  }

  // Certification criteria: OIML Recommendation
  const criteria: DcocCertificationCriteria = {
    reference:  `OIML ${rec.id}:${rec.edition}`,
    title:      `${ct.category} — Recommendation ${rec.id} Edition ${rec.edition}`,
    edition:    String(rec.edition),
    amendment:  rec.amendment != null ? String(rec.amendment) : null,
    annexes:    rec.accuracy_classes?.map((c) => String(c)),
  };

  // Statement of conformity
  const stmt = `The instrument type "${ct.type_designations.join(", ")}" conforms to the requirements of OIML ${rec.id}:${rec.edition}${rec.amendment != null ? ` (Amendment ${rec.amendment})` : ""}${rec.scheme === "B" ? " under OIML-CS Scheme B" : ""}.`;

  // Validity — OIML-CS certificates are typically indefinite unless withdrawn
  const validity: DcocValidity = {
    from_date:        (cdata.date_issued as string) ?? new Date().toISOString().slice(0, 10),
    geographic_scope: "OIML member states",
  };

  // Responsibles: issuer's person_responsible + applicant's person_responsible
  const responsibles: DcocResponsibility[] = [];
  if (issuer.person_responsible) {
    responsibles.push({
      role: "signatory",
      contact: { ...certBody, contact_person: issuer.person_responsible },
    });
  }
  for (const app of cert.applicants ?? []) {
    if (app.person_responsible) {
      responsibles.push({
        role: "applicant",
        contact: { ...partyToDcocContact(app), contact_person: app.person_responsible },
      });
    }
  }

  return {
    certification_scheme: {
      scheme_id:   `OIML-CS-Scheme-${rec.scheme}`,
      scheme_name: "OIML Certificate System",
      module:      rec.scheme,
    },
    certification_body:   certBody,
    cert_no:              certNo,
    revision,
    modifications:        modifications.length > 0 ? modifications : undefined,
    manufacturer,
    category_of_instrument: ct.category,
    cert_object_ids:      objectIds,
    cert_date:            (cdata.date_issued as string) ?? new Date().toISOString().slice(0, 10),
    certification_criteria: [criteria],
    statement_of_conformity: stmt,
    validity,
    responsibles,
    languages:            ["en"],
  };
}

function partyToDcocContact(p: { name: string; address_lines?: string[]; phone?: string; email?: string; website?: string; oiml_issuer_id?: string }): DcocContact {
  const c: DcocContact = { name: p.name };
  if (p.address_lines) {
    c.address_lines = p.address_lines;
    // try to extract postal code / city / country from last line
    const last = p.address_lines[p.address_lines.length - 1] ?? "";
    const m = last.match(/^(.{1,12}?)\s+([A-ZÀ-ÿ][\wÀ-ÿ-]+(?:\s[A-ZÀ-ÿ][\wÀ-ÿ-]+)*)\s+([A-Z]{2,3})$/);
    if (m) {
      c.postal_code = m[1].trim();
      c.city = m[2].trim();
      c.country = m[3].trim();
    }
  }
  if (p.phone)   c.phone   = p.phone;
  if (p.email)   c.email   = p.email;
  if (p.website) c.website = p.website;
  if (p.oiml_issuer_id) c.registration_id = p.oiml_issuer_id;
  return c;
}

// ─── D-CoC → RDF/XML serialization ─────────────────────────────────────

/**
 * Serialize a D-CoC document to RDF/XML.
 *
 * The root resource is a dcoc:DigitalCertificateOfConformity node with
 * rdf:about set to the certificate's IRI. Predicates use the dcoc: namespace
 * for domain-specific properties; vcard: for contact details; dcterms: for
 * generic metadata (dates, identifiers).
 *
 * The output is well-formed XML suitable for ingest into triple stores
 * (Apache Jena, Stardog, GraphDB, etc.) and references the FAIR-aligned
 * D-CoC vocabulary published at https://oimlsmart.org/ns/dcoc/1.0.
 */
export function dcocToRdfXml(dcoc: DCoC, baseIri = "https://certs.oiml.org/"): string {
  const doc = document.implementation.createDocument(null, null, null);
  const rdfEl = doc.createElementNS(RDF_NS, "rdf:RDF");
  rdfEl.setAttribute("xmlns:rdf",     RDF_NS);
  rdfEl.setAttribute("xmlns:rdfs",    RDFS_NS);
  rdfEl.setAttribute("xmlns:xsd",     XSD_NS);
  rdfEl.setAttribute("xmlns:dcoc",    DCOC_NS);
  rdfEl.setAttribute("xmlns:vcard",   VCARD_NS);
  rdfEl.setAttribute("xmlns:dcterms", DCTERMS_NS);
  doc.appendChild(rdfEl);

  // Root: dcoc:DigitalCertificateOfConformity
  const certIri = baseIri + sanitizeIri(dcoc.cert_no) + "/rev" + sanitizeIri(dcoc.revision);
  const root = doc.createElementNS(DCOC_NS, "dcoc:DigitalCertificateOfConformity");
  root.setAttributeNS(RDF_NS, "rdf:about", certIri);
  rdfEl.appendChild(root);

  // Type assertion
  appendTyped(root, "dcoc:certificationScheme", dcoc.certification_scheme.scheme_id);
  appendTyped(root, "dcoc:schemeName",          dcoc.certification_scheme.scheme_name);
  appendTyped(root, "dcoc:schemeModule",        dcoc.certification_scheme.module);
  appendTyped(root, "dcoc:certNo",              dcoc.cert_no);
  appendTyped(root, "dcoc:revision",            dcoc.revision, "xsd:string");

  // modifications
  for (const m of dcoc.modifications ?? []) {
    const modEl = blankNode(doc, "dcoc:modification");
    appendTyped(modEl, "dcoc:revisionNumber", m.revision);
    appendTyped(modEl, "dcoc:date", m.date, "xsd:date");
    appendTyped(modEl, "dcoc:summary", m.summary);
    root.appendChild(modEl);
  }

  // certification_body (1..1)
  root.appendChild(contactNode(doc, "dcoc:certificationBody", dcoc.certification_body));

  // manufacturer (1..1)
  root.appendChild(contactNode(doc, "dcoc:manufacturer", dcoc.manufacturer));

  // categoryOfInstrument (1..1)
  appendTyped(root, "dcoc:categoryOfInstrument", dcoc.category_of_instrument);

  // certObjectIDs (1..∞)
  for (const oid of dcoc.cert_object_ids) {
    const oidEl = blankNode(doc, "dcoc:certObjectID");
    appendTyped(oidEl, "dcoc:objectIDKind",  oid.kind);
    appendTyped(oidEl, "dcoc:objectIDValue", oid.value);
    if (oid.description) appendTyped(oidEl, "dcoc:objectIDDescription", oid.description);
    root.appendChild(oidEl);
  }

  // certDate (1..1)
  appendTyped(root, "dcoc:certDate", dcoc.cert_date, "xsd:date");

  // certificationCriteria (1..∞)
  for (const c of dcoc.certification_criteria) {
    const critEl = blankNode(doc, "dcoc:certificationCriteria");
    appendTyped(critEl, "dcoc:criteriaReference", c.reference);
    appendTyped(critEl, "dcoc:criteriaTitle",     c.title);
    appendTyped(critEl, "dcoc:criteriaEdition",   c.edition);
    if (c.amendment != null) appendTyped(critEl, "dcoc:criteriaAmendment", c.amendment);
    for (const a of c.annexes ?? []) appendTyped(critEl, "dcoc:criteriaAnnex", a);
    root.appendChild(critEl);
  }

  // additionallyAppliedDocuments (0..∞)
  for (const d of dcoc.additionally_applied_documents ?? []) {
    const dEl = blankNode(doc, "dcoc:additionallyAppliedDocument");
    appendTyped(dEl, "dcoc:criteriaReference", d.reference);
    if (d.title)   appendTyped(dEl, "dcoc:criteriaTitle", d.title);
    if (d.edition) appendTyped(dEl, "dcoc:criteriaEdition", d.edition);
    root.appendChild(dEl);
  }

  // statementOfConformity (1..1)
  appendTyped(root, "dcoc:statementOfConformity", dcoc.statement_of_conformity);

  // validity (1..1)
  const valEl = blankNode(doc, "dcoc:validity");
  appendTyped(valEl, "dcoc:validFromDate", dcoc.validity.from_date, "xsd:date");
  if (dcoc.validity.until_date)     appendTyped(valEl, "dcoc:validUntilDate", dcoc.validity.until_date, "xsd:date");
  if (dcoc.validity.geographic_scope) appendTyped(valEl, "dcoc:geographicScope", dcoc.validity.geographic_scope);
  root.appendChild(valEl);

  // responsibles (1..∞)
  for (const r of dcoc.responsibles) {
    const respEl = blankNode(doc, "dcoc:responsible");
    appendTyped(respEl, "dcoc:responsibleRole", r.role);
    respEl.appendChild(contactNode(doc, "dcoc:responsibleContact", r.contact));
    root.appendChild(respEl);
  }

  // previousCertificates (0..∞)
  for (const p of dcoc.previous_certificates ?? []) {
    appendTyped(root, "dcoc:previousCertificate", p);
  }

  // referenceNos (0..∞)
  for (const r of dcoc.reference_nos ?? []) {
    appendTyped(root, "dcoc:referenceNo", r);
  }

  // languages (1..∞)
  for (const lang of dcoc.languages) {
    appendTyped(root, "dcoc:language", lang);
  }

  // Generic FAIR-aligned identifiers via dcterms
  const idEl = blankNode(doc, "dcterms:identifier");
  appendTyped(idEl, "rdf:value", dcoc.cert_no);
  appendTyped(idEl, "dcoc:revision", dcoc.revision);
  root.appendChild(idEl);

  return prettyXml(doc);
}

// ─── D-CoC → JSON-LD (alternative RDF serialization) ───────────────────

/**
 * JSON-LD context for D-CoC.
 * Per the OIML Bulletin article: "machine-readable vocabularies" (FAIR: I).
 */
export const DCOC_JSONLD_CONTEXT = {
  dcoc:     DCOC_NS,
  rdf:      RDF_NS,
  rdfs:     RDFS_NS,
  xsd:      XSD_NS,
  vcard:    VCARD_NS,
  dcterms:  DCTERMS_NS,
  name:             "vcard:fn",
  address_lines:    "vcard:hasAddress",
  postal_code:      "vcard:postal-code",
  city:             "vcard:locality",
  country:          "vcard:country-name",
  contact_person:   "vcard:hasMember",
  email:            "vcard:hasEmail",
  phone:            "vcard:hasTelephone",
  website:          "vcard:hasURL",
  registration_id:  "dcoc:registrationID",
  certification_scheme:    "dcoc:certificationScheme",
  scheme_id:               { "@id": "dcoc:schemeID",          "@type": "xsd:string" },
  scheme_name:             "dcoc:schemeName",
  module:                  "dcoc:module",
  certification_body:      "dcoc:certificationBody",
  cert_no:                 { "@id": "dcoc:certNo",             "@type": "xsd:string" },
  revision:                { "@id": "dcoc:revision",           "@type": "xsd:string" },
  modifications:           "dcoc:modifications",
  summary:                 "dcoc:summary",
  date:                    { "@id": "dcoc:date",               "@type": "xsd:date" },
  manufacturer:            "dcoc:manufacturer",
  category_of_instrument:  "dcoc:categoryOfInstrument",
  cert_object_ids:         "dcoc:certObjectIDs",
  kind:                    "dcoc:objectIDKind",
  value:                   "dcoc:objectIDValue",
  description:             "dcoc:objectIDDescription",
  cert_date:               { "@id": "dcoc:certDate",           "@type": "xsd:date" },
  certification_criteria:  "dcoc:certificationCriteria",
  reference:               "dcoc:criteriaReference",
  title:                   "dcoc:criteriaTitle",
  edition:                 "dcoc:criteriaEdition",
  amendment:               "dcoc:criteriaAmendment",
  annexes:                 "dcoc:criteriaAnnex",
  additionally_applied_documents: "dcoc:additionallyAppliedDocuments",
  statement_of_conformity:       "dcoc:statementOfConformity",
  validity:                "dcoc:validity",
  from_date:               { "@id": "dcoc:validFromDate",      "@type": "xsd:date" },
  until_date:              { "@id": "dcoc:validUntilDate",     "@type": "xsd:date" },
  geographic_scope:        "dcoc:geographicScope",
  responsibles:            "dcoc:responsibles",
  role:                    "dcoc:responsibleRole",
  contact:                 "dcoc:responsibleContact",
  previous_certificates:   "dcoc:previousCertificates",
  reference_nos:           "dcoc:referenceNos",
  languages:               "dcoc:languages",
};

/**
 * Serialize D-CoC to JSON-LD with the standard context embedded.
 * Use this for systems that prefer JSON over XML (SPAs, REST APIs).
 */
export function dcocToJsonLd(dcoc: DCoC, baseIri = "https://certs.oiml.org/"): string {
  const iri = baseIri + sanitizeIri(dcoc.cert_no) + "/rev" + sanitizeIri(dcoc.revision);
  return JSON.stringify({
    "@context": DCOC_JSONLD_CONTEXT,
    "@id":       iri,
    "@type":     "dcoc:DigitalCertificateOfConformity",
    certification_scheme:    dcoc.certification_scheme,
    certification_body:      dcoc.certification_body,
    cert_no:                 dcoc.cert_no,
    revision:                dcoc.revision,
    modifications:           dcoc.modifications,
    manufacturer:            dcoc.manufacturer,
    category_of_instrument:  dcoc.category_of_instrument,
    cert_object_ids:         dcoc.cert_object_ids,
    cert_date:               dcoc.cert_date,
    certification_criteria:  dcoc.certification_criteria,
    additionally_applied_documents: dcoc.additionally_applied_documents,
    statement_of_conformity: dcoc.statement_of_conformity,
    validity:                dcoc.validity,
    responsibles:            dcoc.responsibles,
    previous_certificates:   dcoc.previous_certificates,
    reference_nos:           dcoc.reference_nos,
    languages:               dcoc.languages,
  }, null, 2);
}

// ─── RDF/XML builder helpers (browser-native) ──────────────────────────

const NS_BY_PREFIX: Record<string, string> = {
  dcoc:    DCOC_NS,
  vcard:   VCARD_NS,
  rdf:     RDF_NS,
  rdfs:    RDFS_NS,
  xsd:     XSD_NS,
  dcterms: DCTERMS_NS,
};

function nsFor(predicate: string): string {
  const prefix = predicate.split(":")[0];
  return NS_BY_PREFIX[prefix] ?? DCOC_NS;
}

function appendTyped(parent: Element, predicate: string, value: unknown, datatype?: string): void {
  if (value === undefined || value === null || value === "") return;
  const ns = nsFor(predicate);
  const e = parent.ownerDocument.createElementNS(ns, predicate);
  e.textContent = String(value);
  if (datatype) e.setAttributeNS(RDF_NS, "rdf:datatype", datatype);
  parent.appendChild(e);
}

function blankNode(doc: Document, predicate: string): Element {
  const ns = nsFor(predicate);
  const wrapper = doc.createElementNS(ns, predicate);
  wrapper.setAttributeNS(RDF_NS, "rdf:parseType", "Resource");
  return wrapper;
}

function contactNode(doc: Document, predicate: string, c: DcocContact): Element {
  const wrapper = doc.createElementNS(DCOC_NS, predicate);
  wrapper.setAttributeNS(RDF_NS, "rdf:parseType", "Resource");
  appendTyped(wrapper, "vcard:fn",            c.name);
  for (const line of c.address_lines ?? [])    appendTyped(wrapper, "vcard:extended-address", line);
  if (c.postal_code)    appendTyped(wrapper, "vcard:postal-code",   c.postal_code);
  if (c.city)           appendTyped(wrapper, "vcard:locality",      c.city);
  if (c.country)        appendTyped(wrapper, "vcard:country-name",  c.country);
  if (c.contact_person) appendTyped(wrapper, "vcard:hasMember",     c.contact_person);
  if (c.email)          appendTyped(wrapper, "vcard:hasEmail",      c.email);
  if (c.phone)          appendTyped(wrapper, "vcard:hasTelephone",  c.phone);
  if (c.website)        appendTyped(wrapper, "vcard:hasURL",        c.website);
  if (c.registration_id) appendTyped(wrapper, "dcoc:registrationID", c.registration_id);
  return wrapper;
}

function sanitizeIri(s: string): string {
  return encodeURIComponent(s.replace(/[^A-Za-z0-9._-]/g, "-"));
}

function prettyXml(doc: Document): string {
  const serialized = new XMLSerializer().serializeToString(doc);
  // Remove redundant xmlns:* attributes that match the parent's declaration
  // (xmldom's serializer over-emits them).
  const seenRoot = serialized.indexOf("<");
  const rootEnd = serialized.indexOf(">", seenRoot) + 1;
  const rootOpen = serialized.slice(0, rootEnd);
  const body = serialized.slice(rootEnd);
  const nsPattern = / xmlns:([a-z]+)="([^"]+)"/gi;
  const declared: Record<string, string> = {};
  const cleanedRoot = rootOpen.replace(nsPattern, (_, pfx: string, uri: string) => {
    if (declared[pfx] === uri) return "";
    declared[pfx] = uri;
    return ` xmlns:${pfx}="${uri}"`;
  });
  const cleanedBody = body.replace(nsPattern, (_, pfx: string, uri: string) => {
    if (declared[pfx] === uri) return "";
    declared[pfx] = uri;
    return ` xmlns:${pfx}="${uri}"`;
  });

  // indent two spaces per nesting level
  let depth = 0;
  return (cleanedRoot + cleanedBody)
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
