/**
 * @cnml/cnml-xml — CNML XML serialization (TypeScript, browser-native)
 *
 * Converts a cert object (matching the JSON Schema / YAML data shape)
 * into a CNML (Certificat Numérique de Métrologie Légale) XML document
 * and back. Uses the browser-native DOMParser / XMLSerializer — no deps.
 *
 * CNML XML namespaces:
 *   cnml:    https://oimlsmart.org/schemas/cnml/1.0
 *   unitsml: https://unitsml.org/ns/unitsml
 *   ds:      http://www.w3.org/2000/09/xmldsig#
 */

export const CNML_NS    = "https://oimlsmart.org/schemas/cnml/1.0";
export const UNITSML_NS = "https://unitsml.org/ns/unitsml";
export const DSIG_NS    = "http://www.w3.org/2000/09/xmldsig#";
export const SCHEMA_VERSION = "1.0";

// ─── Types (loose — for ergonomics; cast through unknown when needed) ─────

export interface StructuredValue {
  value?: unknown;
  unit_id?: string;
  unit_symbol?: string;
  footnote_markers?: string[];
  tolerance?: number;
  tolerance_type?: "absolute" | "relative";
  _qualifier?: string;
  current_type?: "AC" | "DC" | "AC_DC";
  _unit_kind?: string;
  _note?: string;
}

export interface Certificate {
  certificate?: Record<string, unknown>;
  issuing_authority?: Party;
  applicants?: Party[];
  manufacturers?: Party[];
  certified_type?: CertifiedType;
  characteristics?: Characteristics;
  recommendation?: Recommendation;
  test_reports?: TestReport[];
  revision_history?: RevisionEntry[];
  model_family?: unknown;
  components?: unknown[];
  footnotes?: Footnote[];
}

export interface Party {
  name: string;
  address_lines?: string[];
  person_responsible?: string;
  person_title?: string;
  phone?: string;
  email?: string;
  website?: string;
  oiml_issuer_id?: string;
}

export interface CertifiedType {
  category: string;
  type_designations: string[];
  module_designation?: string;
  description?: string;
}

export interface Recommendation {
  id: string;
  edition: number | string;
  amendment?: number | string | null;
  scheme: "A" | "B";
  accuracy_classes?: (string | number)[];
}

export interface Characteristics {
  type_level?: Record<string, StructuredValue>;
  model_level?: unknown[];
  config_level?: unknown[];
}

export interface TestReport {
  id: string;
  date?: string;
  pages?: number;
  role?: string;
}

export interface RevisionEntry {
  revision: string;
  date: string;
  changes: string;
}

export interface Footnote {
  marker: string;
  text: string;
}

// ─── Serializer ──────────────────────────────────────────────────────────

export function certToCnmlXml(cert: Certificate, pretty = true): string {
  const doc = document.implementation.createDocument(null, null, null);
  const root = doc.createElementNS(CNML_NS, "cnml:certificatNumeriqueMetrologieLegale");
  // Only declare the prefixes not implied by createElementNS
  root.setAttribute("xmlns:unitsml", UNITSML_NS);
  root.setAttribute("xmlns:ds",      DSIG_NS);
  root.setAttribute("schemaVersion", SCHEMA_VERSION);
  doc.appendChild(root);

  root.appendChild(buildAdministrativeData(doc, cert));
  root.appendChild(buildMeasurementResults(doc, cert));

  const serialized = new XMLSerializer().serializeToString(doc);
  if (!pretty) return serialized;
  return prettyPrintXml(serialized);
}

function el(doc: Document, name: string, text?: unknown): Element {
  const e = doc.createElementNS(CNML_NS, `cnml:${name}`);
  if (text !== undefined && text !== null) e.textContent = String(text);
  return e;
}

function unitsmlUnits(doc: Document, unitId: string): Element {
  const e = doc.createElementNS(UNITSML_NS, "unitsml:units");
  e.setAttribute("unitsml:id", unitId);
  return e;
}

function buildAdministrativeData(doc: Document, cert: Certificate): Element {
  const admin = el(doc, "administrativeData");

  // cnmlSoftware
  const sw = el(doc, "cnmlSoftware");
  sw.setAttribute("language", "en");
  sw.appendChild(el(doc, "name", "cnml-web"));
  sw.appendChild(el(doc, "version", "0.1.0"));
  admin.appendChild(sw);

  // coreData
  const cdata = cert.certificate || {};
  const rec   = cert.recommendation || { id: "", edition: 0, scheme: "A" };
  const core = el(doc, "coreData");
  if (typeof cdata.member_state === "string") core.setAttribute("memberState", cdata.member_state);

  const ids = el(doc, "identifications");
  if (cdata.number)         ids.appendChild(el(doc, "oimlNumber",   cdata.number));
  if (cdata.project_number) ids.appendChild(el(doc, "projectNumber", cdata.project_number));
  core.appendChild(ids);

  const recEl = el(doc, "recommendation");
  recEl.setAttribute("ref", String(rec.id));
  recEl.setAttribute("edition", String(rec.edition));
  if (rec.amendment != null) recEl.setAttribute("amendment", String(rec.amendment));
  core.appendChild(recEl);

  if (rec.scheme) core.appendChild(el(doc, "scheme", rec.scheme));

  if (rec.accuracy_classes && rec.accuracy_classes.length > 0) {
    const ac = el(doc, "accuracyClasses");
    for (const c of rec.accuracy_classes) ac.appendChild(el(doc, "class", c));
    core.appendChild(ac);
  }
  if (cdata.date_issued)    core.appendChild(el(doc, "dateOfIssue",   cdata.date_issued));
  if (cdata.page_total)     core.appendChild(el(doc, "pageTotal",     cdata.page_total));
  if (cdata.oiml_issuer_id) core.appendChild(el(doc, "oimlIssuerId",  cdata.oiml_issuer_id));
  admin.appendChild(core);

  // Parties
  if (cert.issuing_authority) admin.appendChild(buildParty(doc, "issuingAuthority", cert.issuing_authority));
  if (cert.applicants)        admin.appendChild(buildPartyList(doc, "applicants",    cert.applicants));
  if (cert.manufacturers)     admin.appendChild(buildPartyList(doc, "manufacturers", cert.manufacturers));
  if (cert.certified_type)    admin.appendChild(buildCertifiedType(doc, cert.certified_type));
  if (cert.revision_history?.length)   admin.appendChild(buildRevisionHistory(doc, cert.revision_history));
  if (cert.test_reports?.length)       admin.appendChild(buildTestReports(doc, cert.test_reports));
  if (cert.footnotes?.length)          admin.appendChild(buildFootnotes(doc, cert.footnotes));

  return admin;
}

function buildParty(doc: Document, name: string, party: Party): Element {
  const node = el(doc, name);
  if (party.name) node.appendChild(el(doc, "name", party.name));
  if (party.address_lines?.length) {
    const addr = el(doc, "addressLines");
    for (const line of party.address_lines) addr.appendChild(el(doc, "line", line));
    node.appendChild(addr);
  }
  const fields: [string, string][] = [
    ["person_responsible", "personResponsible"],
    ["person_title",       "personTitle"],
    ["phone",              "phone"],
    ["email",              "email"],
    ["website",            "website"],
    ["oiml_issuer_id",     "oimlIssuerId"],
  ];
  for (const [k, xmlName] of fields) {
    const v = party[k as keyof Party];
    if (v != null) node.appendChild(el(doc, xmlName, v));
  }
  return node;
}

function buildPartyList(doc: Document, name: string, list: Party[]): Element {
  const node = el(doc, name);
  for (const p of list) node.appendChild(buildParty(doc, "party", p));
  return node;
}

function buildCertifiedType(doc: Document, ct: CertifiedType): Element {
  const node = el(doc, "certifiedType");
  if (ct.category) node.appendChild(el(doc, "category", ct.category));
  if (ct.type_designations?.length) {
    const tds = el(doc, "typeDesignations");
    for (const t of ct.type_designations) tds.appendChild(el(doc, "designation", t));
    node.appendChild(tds);
  }
  if (ct.module_designation) node.appendChild(el(doc, "moduleDesignation", ct.module_designation));
  if (ct.description)        node.appendChild(el(doc, "description",       ct.description));
  return node;
}

function buildRevisionHistory(doc: Document, rh: RevisionEntry[]): Element {
  const node = el(doc, "revisionHistory");
  for (const e of rh) {
    const rev = el(doc, "revision");
    rev.appendChild(el(doc, "revisionNumber", e.revision));
    rev.appendChild(el(doc, "date",           e.date));
    rev.appendChild(el(doc, "changes",        e.changes));
    node.appendChild(rev);
  }
  return node;
}

function buildTestReports(doc: Document, trs: TestReport[]): Element {
  const node = el(doc, "testReports");
  for (const t of trs) {
    const tr = el(doc, "testReport");
    if (t.id)    tr.appendChild(el(doc, "id",    t.id));
    if (t.date)  tr.appendChild(el(doc, "date",  t.date));
    if (t.pages) tr.appendChild(el(doc, "pages", t.pages));
    if (t.role)  tr.appendChild(el(doc, "role",  t.role));
    node.appendChild(tr);
  }
  return node;
}

function buildFootnotes(doc: Document, fns: Footnote[]): Element {
  const node = el(doc, "footnotes");
  for (const f of fns) {
    const fn = el(doc, "footnote");
    fn.appendChild(el(doc, "marker", f.marker));
    fn.appendChild(el(doc, "text",   f.text));
    node.appendChild(fn);
  }
  return node;
}

function buildMeasurementResults(doc: Document, cert: Certificate): Element {
  const node = el(doc, "measurementResults");
  const ch = cert.characteristics;
  if (!ch) return node;

  if (ch.type_level) {
    for (const [name, sv] of Object.entries(ch.type_level)) {
      node.appendChild(buildCharacteristic(doc, name, sv, "type_level"));
    }
  }
  if (Array.isArray(ch.model_level)) {
    for (const entry of ch.model_level as Array<{ attribute: string; values?: Array<{ model?: string; value?: unknown; footnote_markers?: string[] }> }>) {
      for (const v of entry.values || []) {
        const c = buildCharacteristic(doc, entry.attribute, v as StructuredValue, "model_level");
        if (v.model) c.setAttribute("model", v.model);
        node.appendChild(c);
      }
    }
  }
  if (Array.isArray(ch.config_level)) {
    for (const entry of ch.config_level as Array<{ attribute: string; values?: Array<{ condition?: string; value?: unknown }> }>) {
      for (const v of entry.values || []) {
        const c = buildCharacteristic(doc, entry.attribute, v as StructuredValue, "config_level");
        if (v.condition) c.setAttribute("condition", v.condition);
        node.appendChild(c);
      }
    }
  }
  return node;
}

function buildCharacteristic(doc: Document, name: string, sv: StructuredValue, layer: string): Element {
  const node = el(doc, "characteristic");
  node.setAttribute("name",  name);
  node.setAttribute("layer", layer);

  if (sv.value !== undefined) {
    const v = buildValue(doc, sv);
    node.appendChild(v);
  }
  if (sv.footnote_markers?.length) {
    const fn = el(doc, "footnoteMarkers");
    for (const m of sv.footnote_markers) fn.appendChild(el(doc, "marker", m));
    node.appendChild(fn);
  }
  if (sv._note) node.appendChild(el(doc, "note", sv._note));
  return node;
}

function buildValue(doc: Document, sv: StructuredValue): Element {
  const v = el(doc, "value");
  const val = sv.value;

  if (val && typeof val === "object" && !Array.isArray(val) && ("min" in val || "max" in val)) {
    const rng = val as { min?: unknown; max?: unknown };
    const range = el(doc, "range");
    range.appendChild(buildBound(doc, "min", rng.min));
    range.appendChild(buildBound(doc, "max", rng.max));
    if (sv.unit_id) range.appendChild(unitsmlUnits(doc, sv.unit_id));
    v.appendChild(range);
  } else if (Array.isArray(val)) {
    const list = el(doc, "list");
    for (const item of val) {
      const li = el(doc, "item");
      li.appendChild(scalarInner(doc, item));
      list.appendChild(li);
    }
    v.appendChild(list);
  } else {
    const scalar = el(doc, "scalar");
    scalar.appendChild(scalarInner(doc, val));
    if (sv.unit_id) scalar.appendChild(unitsmlUnits(doc, sv.unit_id));
    if (sv._qualifier) scalar.appendChild(el(doc, "qualifier", sv._qualifier));
    v.appendChild(scalar);
  }
  return v;
}

function buildBound(doc: Document, name: string, val: unknown): Element {
  const node = el(doc, name);
  if (val == null || val === "" || val === "N/A") {
    node.appendChild(el(doc, "na"));
  } else {
    node.appendChild(scalarInner(doc, val));
  }
  return node;
}

function scalarInner(doc: Document, val: unknown): Element {
  if (typeof val === "number")      return el(doc, "number", val);
  if (typeof val === "boolean")     return el(doc, "boolean", val);
  return el(doc, "text", val ?? "N/A");
}

// ─── Parser ──────────────────────────────────────────────────────────────

// ─── Parser ────────────────────────────────────────────────────────────

function textOf(parent: Element | null, name: string): string | undefined {
  if (!parent) return undefined;
  const els = parent.getElementsByTagNameNS(CNML_NS, name);
  return els[0]?.textContent ?? undefined;
}

function byTag(parent: Element | null, name: string): Element | null {
  if (!parent) return null;
  const els = parent.getElementsByTagNameNS(CNML_NS, name);
  return els[0] ?? null;
}

function byTagAll(parent: Element | null, name: string): Element[] {
  if (!parent) return [];
  return Array.from(parent.getElementsByTagNameNS(CNML_NS, name));
}

export function parseCnmlXml(xml: string): Certificate {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  // parsererror detection — use getElementsByTagName for compatibility with
  // both browser DOM and xmldom (querySelector isn't always available)
  const parseErr = doc.getElementsByTagName("parsererror")[0] ??
    doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "parsererror")[0];
  if (parseErr) throw new Error(`Malformed XML: ${parseErr.textContent}`);
  const root = doc.documentElement;
  if (!root || root.localName !== "certificatNumeriqueMetrologieLegale") {
    throw new Error(`Not a CNML document (root: ${root?.localName ?? "(none)"})`);
  }

  const admin = byTag(root, "administrativeData");
  const core  = byTag(admin, "coreData");
  const rec   = byTag(core, "recommendation");

  return {
    certificate: core ? {
      number:         textOf(byTag(core, "identifications"), "oimlNumber"),
      project_number: textOf(byTag(core, "identifications"), "projectNumber"),
      member_state:   core.getAttribute("memberState") ?? undefined,
      date_issued:    textOf(core, "dateOfIssue"),
      page_total:     numOrUndef(textOf(core, "pageTotal")),
      oiml_issuer_id: textOf(core, "oimlIssuerId"),
      recommendation: rec ? {
        id:               rec.getAttribute("ref") ?? "",
        edition:          numOrUndef(rec.getAttribute("edition")) ?? 0,
        amendment:        rec.getAttribute("amendment") ?? undefined,
        scheme:           (textOf(core, "scheme") as "A" | "B") ?? "A",
        accuracy_classes: byTagAll(byTag(core, "accuracyClasses"), "class").map((e) => e.textContent ?? ""),
      } : undefined,
    } : undefined,
    issuing_authority: parseParty(byTag(admin, "issuingAuthority")),
    applicants:        byTagAll(byTag(admin, "applicants"), "party").map(parseParty).filter((p): p is Party => p !== undefined),
    manufacturers:     byTagAll(byTag(admin, "manufacturers"), "party").map(parseParty).filter((p): p is Party => p !== undefined),
    certified_type:    parseCertifiedType(byTag(admin, "certifiedType")),
    characteristics:   parseMeasurementResults(byTag(root, "measurementResults")),
    revision_history:  byTagAll(byTag(admin, "revisionHistory"), "revision").map(parseRevision),
    test_reports:      byTagAll(byTag(admin, "testReports"), "testReport").map(parseTestReport),
    footnotes:         byTagAll(byTag(admin, "footnotes"), "footnote").map(parseFootnote),
  };
}

function parseParty(node: Element | null): Party | undefined {
  if (!node) return undefined;
  const addr = byTag(node, "addressLines");
  return {
    name:               textOf(node, "name"),
    address_lines:      addr ? byTagAll(addr, "line").map((e) => e.textContent ?? "") : undefined,
    person_responsible: textOf(node, "personResponsible"),
    person_title:       textOf(node, "personTitle"),
    phone:              textOf(node, "phone"),
    email:              textOf(node, "email"),
    website:            textOf(node, "website"),
    oiml_issuer_id:     textOf(node, "oimlIssuerId"),
  };
}

function parseCertifiedType(node: Element | null): CertifiedType | undefined {
  if (!node) return undefined;
  const tds = byTag(node, "typeDesignations");
  return {
    category:           textOf(node, "category"),
    type_designations:  tds ? byTagAll(tds, "designation").map((e) => e.textContent ?? "") : [],
    module_designation: textOf(node, "moduleDesignation"),
    description:        textOf(node, "description"),
  };
}

function parseMeasurementResults(node: Element | null): Characteristics | undefined {
  if (!node) return undefined;
  const ch: Characteristics = { type_level: {}, model_level: [], config_level: [] };
  for (const c of Array.from(node.getElementsByTagNameNS(CNML_NS, "characteristic"))) {
    const layer = c.getAttribute("layer") ?? "type_level";
    const name  = c.getAttribute("name")  ?? "";
    const value = parseValue(c.getElementsByTagNameNS(CNML_NS, "value")[0]);
    if (layer === "type_level")      ch.type_level![name] = value;
    else if (layer === "model_level")  (ch.model_level as unknown[]).push({ attribute: name, model: c.getAttribute("model") ?? undefined, value });
    else if (layer === "config_level") (ch.config_level as unknown[]).push({ attribute: name, condition: c.getAttribute("condition") ?? undefined, value });
  }
  return ch;
}

function parseValue(node: Element | null): StructuredValue {
  if (!node) return {};
  const result: StructuredValue = {};
  const range = node.getElementsByTagNameNS(CNML_NS, "range")[0];
  const scalar = node.getElementsByTagNameNS(CNML_NS, "scalar")[0];
  const list = node.getElementsByTagNameNS(CNML_NS, "list")[0];

  if (range) {
    const min = range.getElementsByTagNameNS(CNML_NS, "min")[0];
    const max = range.getElementsByTagNameNS(CNML_NS, "max")[0];
    result.value = { min: parseBound(min), max: parseBound(max) };
    const units = range.getElementsByTagNameNS(UNITSML_NS, "units")[0];
    if (units) result.unit_id = units.getAttribute("unitsml:id") ?? undefined;
  } else if (list) {
    const items = Array.from(list.getElementsByTagNameNS(CNML_NS, "item"));
    result.value = items.map((i) => parseScalarInner(i));
  } else if (scalar) {
    result.value = parseScalarInner(scalar);
    const units = scalar.getElementsByTagNameNS(UNITSML_NS, "units")[0];
    if (units) result.unit_id = units.getAttribute("unitsml:id") ?? undefined;
    const q = scalar.getElementsByTagNameNS(CNML_NS, "qualifier")[0];
    if (q) result._qualifier = q.textContent ?? undefined;
  }
  const markers = Array.from(node.getElementsByTagNameNS(CNML_NS, "footnoteMarkers")[0]?.getElementsByTagNameNS(CNML_NS, "marker") ?? [])
    .map((m) => m.textContent ?? "");
  if (markers.length) result.footnote_markers = markers;
  return result;
}

function parseBound(node: Element | null): unknown {
  if (!node) return "N/A";
  const na = node.getElementsByTagNameNS(CNML_NS, "na")[0];
  if (na) return "N/A";
  return parseScalarInner(node);
}

function parseScalarInner(node: Element): unknown {
  const num = node.getElementsByTagNameNS(CNML_NS, "number")[0];
  if (num) return num.textContent?.includes(".") ? parseFloat(num.textContent) : parseInt(num.textContent ?? "0", 10);
  const bool = node.getElementsByTagNameNS(CNML_NS, "boolean")[0];
  if (bool) return bool.textContent === "true";
  const text = node.getElementsByTagNameNS(CNML_NS, "text")[0];
  return text?.textContent ?? null;
}

function parseRevision(node: Element): RevisionEntry {
  return {
    revision: textOf(node, "revisionNumber") ?? "",
    date:     textOf(node, "date") ?? "",
    changes:  textOf(node, "changes") ?? "",
  };
}

function parseTestReport(node: Element): TestReport {
  return {
    id:    textOf(node, "id")    ?? "",
    date:  textOf(node, "date"),
    pages: numOrUndef(textOf(node, "pages")),
    role:  textOf(node, "role"),
  };
}

function parseFootnote(node: Element): Footnote {
  return {
    marker: textOf(node, "marker") ?? "",
    text:   textOf(node, "text")   ?? "",
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function numOrUndef(s: string | undefined | null): number | undefined {
  if (s == null || s === "") return undefined;
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
}

/** Simple pretty-printer — adds newlines/indentation to serialized XML. */
function prettyPrintXml(xml: string): string {
  // Insert newlines between adjacent tags, then indent by depth.
  const withNewlines = xml.replace(/>(<)(?!\/)/g, ">\n$1");
  const lines = withNewlines.split("\n");
  let depth = 0;
  const INDENT = "  ";
  return lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("</")) depth = Math.max(0, depth - 1);
    const out = INDENT.repeat(depth) + trimmed;
    if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>") && !trimmed.includes("</")) {
      depth += 1;
    }
    return out;
  }).join("\n");
}
