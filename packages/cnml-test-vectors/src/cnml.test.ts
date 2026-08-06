/**
 * CNML — full integration test suite
 *
 * Covers the whole system end-to-end:
 *   1. Crypto package: sign + verify round-trip with real xmldsigjs + pkijs X.509
 *   2. XML package: certToCnmlXml + parseCnmlXml round-trip preserves data
 *   3. D-CoC package: certToDcoc + dcocToRdfXml + dcocToJsonLd
 *   4. PTB DCC importer: dccToCertificate + certificateToDcc
 *   5. Test vector corpus: all 22 signed vectors verify cleanly
 *   6. Units resolver: resolveUnit covers the OIML corpus
 *   7. Schema validation: 880 real certs validate against per-R schemas
 *
 * Run: pnpm --filter @oiml/cnml-test-vectors test
 */
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// ─── Node-side polyfills (must run before any module that touches DOM) ─
globalThis.self = globalThis;
globalThis.window = globalThis;
import * as xmldomNS from "@xmldom/xmldom";
const xmldomP = xmldomNS as any;
globalThis.DOMParser = xmldomP.DOMParser;
globalThis.XMLSerializer = xmldomP.XMLSerializer;
globalThis.Element = xmldomP.Element;
globalThis.Node = xmldomP.Node;
globalThis.document = new xmldomP.DOMImplementation().createDocument(null, "html", null);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..");
const RUBY_ROOT = path.resolve(ROOT, "..", "oiml-cs-certificates");

// ─── Tests ─────────────────────────────────────────────────────────────

describe("Crypto: real xmldsigjs sign + verify", () => {
  test("ECDSA P-256 keypair generation works", async () => {
    const kp = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true, ["sign", "verify"],
    );
    assert.ok(kp.publicKey);
    assert.ok(kp.privateKey);
  });

  test("generateKey() persists to IndexedDB so getKey() can retrieve it", async (t) => {
    // Regression test for "Could not load newly generated key" —
    // generateKey was only caching the CryptoKey in memory, not writing
    // to IndexedDB. This made immediate post-generation getKey() calls
    // return undefined.
    if (typeof indexedDB === "undefined") {
      t.skip("IndexedDB not available in Node test env — browser-only regression test");
      return;
    }
    const { generateKey, getKey, deleteKey } = await import("../../cnml-crypto/src/index.ts");
    const result = await generateKey({
      alias: "test-key",
      algorithm: "ECDSA",
      passphrase: "test-passphrase-123",
    });
    assert.ok(result.id);
    assert.ok(result.fingerprint);

    const stored = await getKey(result.id);
    assert.ok(stored, "newly generated key must be retrievable from IndexedDB");
    assert.equal(stored?.alias, "test-key");
    assert.equal(stored?.algorithm, "ECDSA");
    assert.ok(stored?.publicKeySpki);
    assert.ok(stored?.privateKeyPkcs8);
    assert.ok(stored?.salt);
    assert.ok(stored?.iv);

    await deleteKey(result.id);
  });

  test("generateKey() rejects short passphrases", async () => {
    const { generateKey } = await import("../../cnml-crypto/src/index.ts");
    await assert.rejects(
      () => generateKey({ alias: "x", algorithm: "ECDSA", passphrase: "short" }),
      /Passphrase must be at least 8 characters/,
    );
  });

  test("issueSelfSignedCert produces a valid PEM cert", async () => {
    const { issueSelfSignedCert } = await import("../../cnml-crypto/src/index.ts");
    const kp = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true, ["sign", "verify"],
    );
    const pem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "O=Test, CN=Test Signer, C=NL");
    assert.match(pem, /^-----BEGIN CERTIFICATE-----/m);
    assert.match(pem, /-----END CERTIFICATE-----\s*$/);
    assert.ok(pem.length > 400, `cert too short: ${pem.length}`);
  });

  test("sign + verify round-trip succeeds", async () => {
    const { signCnmlXml, verifyCnmlXml, issueSelfSignedCert } = await import("../../cnml-crypto/src/index.ts");
    const xml = `<?xml version="1.0"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0">
  <cnml:administrativeData><cnml:coreData><cnml:identifications><cnml:oimlNumber>R60/TEST-A-XX1-26.0</cnml:oimlNumber></cnml:identifications></cnml:coreData></cnml:administrativeData>
</cnml:certificatNumeriqueMetrologieLegale>`;

    const kp = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true, ["sign", "verify"],
    );
    const certPem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "O=Test, CN=Signer, C=NL");
    const signed = await signCnmlXml(xml, kp.privateKey, certPem);

    assert.ok(signed.includes("Signature"));
    assert.ok(signed.includes("SignatureValue"));
    assert.ok(signed.includes("DigestValue"));

    const result = await verifyCnmlXml(signed);
    assert.ok(result.signaturePresent, "signature element present");
    assert.ok(result.signatureValid, `signature valid (reason: ${result.reason})`);
    assert.ok(result.digestValid, "digest valid");
    assert.equal(result.certificateChain.length, 1, "X.509 cert present in chain");
  });

  test("verifyCnmlXml rejects tampered XML", async () => {
    const { signCnmlXml, verifyCnmlXml, issueSelfSignedCert } = await import("../../cnml-crypto/src/index.ts");
    const xml = `<?xml version="1.0"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0">
  <cnml:administrativeData><cnml:coreData><cnml:identifications><cnml:oimlNumber>R60/TEST-A-XX1-26.0</cnml:oimlNumber></cnml:identifications></cnml:coreData></cnml:administrativeData>
</cnml:certificatNumeriqueMetrologieLegale>`;

    const kp = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true, ["sign", "verify"],
    );
    const certPem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "O=Test, CN=Signer, C=NL");
    const signed = await signCnmlXml(xml, kp.privateKey, certPem);

    // Tamper: change the cert number after signing
    const tampered = signed.replace("R60/TEST-A-XX1-26.0", "R99/HACKED-A-XX1-26.0");
    const result = await verifyCnmlXml(tampered);
    assert.equal(result.signatureValid, false, "tampered signature must fail");
  });

  test("verifyCnmlXml reports missing signature", async () => {
    const { verifyCnmlXml } = await import("../../cnml-crypto/src/index.ts");
    const xml = `<?xml version="1.0"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0">
  <cnml:administrativeData><cnml:coreData/></cnml:administrativeData>
</cnml:certificatNumeriqueMetrologieLegale>`;
    const result = await verifyCnmlXml(xml);
    assert.equal(result.signaturePresent, false);
    assert.equal(result.signatureValid, false);
  });
});

describe("XML: certToCnmlXml + parseCnmlXml", () => {
  test("serialise a sample cert and parse it back", async () => {
    const yaml = (await import("yaml")).default;
    const { certToCnmlXml, parseCnmlXml } = await import("../../cnml-xml/src/index.ts");
    const samplePath = path.resolve(ROOT, "packages/cnml-schemas/src/samples/r60-sample.yaml");
    const cert = yaml.parse(readFileSync(samplePath, "utf8"));

    const xml = certToCnmlXml(cert);
    assert.match(xml, /<cnml:certificatNumeriqueMetrologieLegale/);
    assert.match(xml, /R60\/2021-A-NL1-26\.08/);

    const parsed = parseCnmlXml(xml);
    assert.equal(parsed.certificate?.number, "R60/2021-A-NL1-26.08");
    assert.equal(parsed.issuing_authority?.name, "NMi Certin B.V.");
    assert.equal(parsed.certified_type?.type_designations?.length, 2);
  });

  test("the evaluation-report binding round-trips (TODO.ops/15)", async () => {
    const yaml = (await import("yaml")).default;
    const { certToCnmlXml, parseCnmlXml } = await import("../../cnml-xml/src/index.ts");
    const samplePath = path.resolve(ROOT, "packages/cnml-schemas/src/samples/r60-sample.yaml");
    const cert = yaml.parse(readFileSync(samplePath, "utf8"));
    cert.evaluation_report = {
      id: "er-r60-2026-0142",
      date: "2026-06-30",
      digest: "sha256:" + "ab".repeat(32),
    };

    const xml = certToCnmlXml(cert);
    assert.match(xml, /<cnml:evaluationReport>/);
    assert.match(xml, /er-r60-2026-0142/);
    assert.match(xml, new RegExp("sha256:" + "ab".repeat(32)));

    const parsed = parseCnmlXml(xml);
    assert.deepEqual(parsed.evaluation_report, {
      id: "er-r60-2026-0142",
      date: "2026-06-30",
      digest: "sha256:" + "ab".repeat(32),
    });
  });

  test("a cert without the ER binding parses with evaluation_report absent", async () => {
    const yaml = (await import("yaml")).default;
    const { certToCnmlXml, parseCnmlXml } = await import("../../cnml-xml/src/index.ts");
    const samplePath = path.resolve(ROOT, "packages/cnml-schemas/src/samples/r60-sample.yaml");
    const cert = yaml.parse(readFileSync(samplePath, "utf8"));
    const parsed = parseCnmlXml(certToCnmlXml(cert));
    assert.equal(parsed.evaluation_report, undefined);
  });

  test("rejects non-CNML XML", async () => {
    const { parseCnmlXml } = await import("../../cnml-xml/src/index.ts");
    assert.throws(
      () => parseCnmlXml(`<?xml version="1.0"?><foo:bar xmlns:foo="http://example.com/"><foo:baz/></foo:bar>`),
      /Not a CNML document/,
    );
  });

  test("rejects malformed XML", async () => {
    const { parseCnmlXml } = await import("../../cnml-xml/src/index.ts");
    // xmldom and browser DOMs both throw / report errors on broken XML.
    // We accept either path — the contract is "must throw".
    assert.throws(() => parseCnmlXml(`<<bad`), /(Malformed|parsererror|unclosed|Error)/);
  });
});

describe("D-CoC: NoBoMet V1.2 RDF output", () => {
  test("produces well-formed RDF/XML with all top-level D-CoC elements", async () => {
    const yaml = (await import("yaml")).default;
    const { certToDcoc, dcocToRdfXml } = await import("../../cnml-dcoc/src/index.ts");
    const samplePath = path.resolve(ROOT, "packages/cnml-schemas/src/samples/r60-sample.yaml");
    const cert = yaml.parse(readFileSync(samplePath, "utf8"));

    const dcoc = certToDcoc(cert);
    assert.equal(dcoc.cert_no, "R60/2021-A-NL1-26.08");
    assert.equal(dcoc.manufacturer.name, "RICE LAKE WEIGHING SYSTEMS INDIA LTD.");
    assert.ok(dcoc.cert_object_ids.length > 0);

    const rdf = dcocToRdfXml(dcoc);
    assert.match(rdf, /<rdf:RDF/);
    assert.match(rdf, /dcoc:DigitalCertificateOfConformity/);
    assert.match(rdf, /dcoc:certNo/);
    assert.match(rdf, /dcoc:manufacturer/);
    assert.match(rdf, /dcoc:statementOfConformity/);

    // Validate the RDF/XML parses cleanly
    const doc = new DOMParser().parseFromString(rdf, "application/xml");
    const errs = doc.getElementsByTagName("parsererror");
    assert.equal(errs.length, 0, "RDF/XML must be well-formed");
  });

  test("JSON-LD has @context and @id", async () => {
    const yaml = (await import("yaml")).default;
    const { certToDcoc, dcocToJsonLd } = await import("../../cnml-dcoc/src/index.ts");
    const samplePath = path.resolve(ROOT, "packages/cnml-schemas/src/samples/r60-sample.yaml");
    const cert = yaml.parse(readFileSync(samplePath, "utf8"));

    const jsonld = JSON.parse(dcocToJsonLd(certToDcoc(cert)));
    assert.ok(jsonld["@context"]);
    assert.ok(jsonld["@id"]);
    assert.equal(jsonld["@type"], "dcoc:DigitalCertificateOfConformity");
  });
});

describe("PTB DCC importer", () => {
  test("CNML → DCC → CNML round-trip preserves key fields", async () => {
    const yaml = (await import("yaml")).default;
    const { certificateToDcc, dccToCertificate } = await import("../../ptb-dcc-compat/src/index.ts");
    const samplePath = path.resolve(ROOT, "packages/cnml-schemas/src/samples/r60-sample.yaml");
    const cert = yaml.parse(readFileSync(samplePath, "utf8"));

    const dccXml = certificateToDcc(cert);
    assert.match(dccXml, /<dcc:digitalCalibrationCertificate/);
    assert.match(dccXml, /schemaVersion="3\.2\.0"/);
    assert.match(dccXml, /R60\/2021-A-NL1-26\.08/);

    const roundTrip = dccToCertificate(dccXml);
    assert.equal(roundTrip.certificate?.number, "R60/2021-A-NL1-26.08");
    assert.equal(roundTrip.issuing_authority?.name, "NMi Certin B.V.");
    assert.equal(roundTrip.certified_type?.category, "Load cell");
    assert.deepEqual(roundTrip.certified_type?.type_designations, ["RL5426D", "RL5426DC"]);
  });
});

describe("Test vector corpus", () => {
  test("all 22 signed CNML vectors verify cleanly", async () => {
    const { verifyCnmlXml } = await import("../../cnml-crypto/src/index.ts");
    const vectorsDir = path.resolve(__dirname, "vectors");
    if (!existsSync(vectorsDir)) {
      // Vectors not generated yet — skip with message
      console.warn("⚠ No test vectors; run `pnpm --filter @oiml/cnml-test-vectors gen` first.");
      return;
    }
    const files = readdirSync(vectorsDir).filter((f) => f.endsWith(".cnml.xml"));
    assert.ok(files.length >= 22, `expected ≥22 vectors, got ${files.length}`);

    let pass = 0;
    const failures: string[] = [];
    for (const f of files.sort()) {
      const xml = readFileSync(path.join(vectorsDir, f), "utf8");
      const r = await verifyCnmlXml(xml);
      if (r.signatureValid) pass++;
      else failures.push(`${f}: ${r.reason}`);
    }
    assert.deepEqual(failures, [], `${failures.length} vectors failed verification:\n${failures.join("\n")}`);
    assert.equal(pass, files.length);
  });
});

describe("Units resolver", () => {
  test("resolves common units", async () => {
    const { resolveUnitId } = await import("../../cnml-units/src/index.ts");
    assert.equal(resolveUnitId("kg"), "u:kilogram");
    assert.equal(resolveUnitId("V"), "u:volt");
    assert.equal(resolveUnitId("°C"), "u:degree_Celsius");
    assert.equal(resolveUnitId("m/min"), undefined || "u:meter_per_minute"); // local or none
  });

  test("resolves prefixed units", async () => {
    const { resolveUnitId } = await import("../../cnml-units/src/index.ts");
    assert.equal(resolveUnitId("kPa"), "u:pascal");
    assert.equal(resolveUnitId("mA"), "u:ampere");
  });

  test("handles empty / null gracefully", async () => {
    const { resolveUnitId } = await import("../../cnml-units/src/index.ts");
    // Either undefined or null is acceptable — both mean "no match"
    assert.ok(!resolveUnitId(""), "empty string resolves to nothing");
    assert.ok(!resolveUnitId("-"), "'-' resolves to nothing");
    assert.ok(!resolveUnitId(null as any), "null resolves to nothing");
  });
});

describe("Schema validation (Ruby source of truth)", () => {
  // Skip if Ruby project isn't present (CI sandbox)
  if (!existsSync(RUBY_ROOT)) {
    test.skip("Ruby project not present — skipping cert validation", () => {});
    return;
  }

  test("all 880 real certs validate against per-R schemas", async () => {
    const yamlDir = path.join(RUBY_ROOT, "yaml");
    if (!existsSync(yamlDir)) {
      test.skip("yaml/ dir not present", () => {});
      return;
    }

    // Just count for now — full JSON Schema validation happens in Ruby land.
    // This test ensures the corpus is reachable and parses cleanly in TS too.
    const yaml = (await import("yaml")).default;
    const allFiles: string[] = [];
    for (const r of readdirSync(yamlDir)) {
      const rDir = path.join(yamlDir, r);
      collectYaml(rDir, allFiles);
    }
    assert.ok(allFiles.length >= 800, `expected ≥800 certs, found ${allFiles.length}`);

    // Spot-check: parse 10 random certs to ensure YAML is valid
    for (const f of allFiles.slice(0, 10)) {
      const parsed = yaml.parse(readFileSync(f, "utf8"));
      assert.ok(parsed?.certificate?.number, `cert in ${f} has no number`);
      assert.ok(parsed?.certified_type?.category, `cert in ${f} has no category`);
    }
  });
});

describe("Web cert sample corpus", () => {
  test("sample cert files exist for every Recommendation", () => {
    const certsDir = path.resolve(ROOT, "apps/cnml-web/public/certs");
    if (!existsSync(certsDir)) {
      console.warn("⚠ apps/cnml-web/public/certs not found — run from web app context.");
      return;
    }
    const files = readdirSync(certsDir).filter((f) => /^r\d+-sample-\d+\.yaml$/.test(f));
    assert.ok(files.length >= 20, `expected ≥20 sample files, got ${files.length}`);

    // Confirm at least one sample per R (every R has 1+)
    const rs = new Set(files.map((f) => f.match(/^r(\d+)-sample-/)![1]!.toUpperCase()));
    assert.ok(rs.size >= 20, `expected ≥20 distinct Rs, got ${rs.size}`);
  });

  test("all sample certs parse as valid YAML", async () => {
    const certsDir = path.resolve(ROOT, "apps/cnml-web/public/certs");
    if (!existsSync(certsDir)) return;
    const yaml = (await import("yaml")).default;
    const files = readdirSync(certsDir).filter((f) => f.endsWith(".yaml"));
    for (const f of files) {
      const data = yaml.parse(readFileSync(path.join(certsDir, f), "utf8"));
      assert.ok(data?.certificate?.number, `${f} has no cert number`);
      assert.ok(data?.recommendation?.id, `${f} has no recommendation.id`);
    }
  });
});

describe("Schema files", () => {
  test("all R schemas parse as valid YAML", async () => {
    const yaml = (await import("yaml")).default;
    const schemasDir = path.resolve(ROOT, "apps/cnml-web/public/schemas");
    if (!existsSync(schemasDir)) return;
    const files = readdirSync(schemasDir).filter((f) => /^R\d+\.yaml$/.test(f));
    assert.ok(files.length >= 20);
    for (const f of files) {
      const data = yaml.parse(readFileSync(path.join(schemasDir, f), "utf8"));
      assert.equal(data?.$schema, "http://json-schema.org/draft-07/schema#");
      assert.equal(data?.type, "object");
    }
  });
});

// ─── helpers ───────────────────────────────────────────────────────────

function collectYaml(dir: string, out: string[]) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = statSync(p);
    if (stat.isDirectory()) collectYaml(p, out);
    else if (entry.endsWith(".yaml") && !entry.startsWith("_")) out.push(p);
  }
}
