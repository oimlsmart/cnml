/**
 * Generate signed CNML test vectors — one per Recommendation.
 *
 * Outputs to ./vectors/<rId>.cnml.xml. Each file is a fully signed CNML
 * document with embedded X.509 self-signed cert, suitable for interop
 * testing against xmlsec1, SAML validators, or any spec-compliant
 * XMLDSig consumer.
 *
 * Run: pnpm --filter @cnml/cnml-test-vectors gen
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// MUST come first — sets DOMParser/Element globals for cnml-xml
import "./_node-polyfills.ts";

import yaml from "yaml";
import { signCnmlXml, issueSelfSignedCert } from "../../cnml-crypto/src/index.ts";
import { certToCnmlXml } from "../../cnml-xml/src/index.ts";

const SCHEMA_DIR = new URL("../../cnml-schemas/src/", import.meta.url);
const SAMPLE_DIR = new URL("../../cnml-schemas/src/samples/", import.meta.url);

interface RecommendationMeta {
  id: string;
  title: string;
  category: string;
  schemaPath: string;
}

// Enumerate R schemas directly from disk (avoids requiring Vite's YAML loader)
const RECOMMENDATIONS: RecommendationMeta[] = readdirSync(SCHEMA_DIR)
  .filter((f) => /^R\d+\.yaml$/i.test(f))
  .map((f) => {
    const yamlText = readFileSync(new URL(f, SCHEMA_DIR), "utf8");
    const parsed = yaml.parse(yamlText) as any;
    const idFromTitle = parsed?.title?.match(/R\s*(\d+)/i)?.[1];
    const id = `R${idFromTitle ?? f.replace(/^R?(\d+)\.yaml$/i, "$1")}`;
    return {
      id,
      title:     parsed?.title ?? f,
      category:  parsed?.category ?? "Unknown",
      schemaPath: f,
    };
  })
  .filter((r, i, arr) => arr.findIndex((x) => x.id === r.id) === i)
  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

const OUT_DIR = path.resolve(fileURLToPath(import.meta.url), "../vectors");
mkdirSync(OUT_DIR, { recursive: true });

const SAMPLE_PATHS = readdirSync(SAMPLE_DIR)
  .filter((f) => /\.yaml$/.test(f))
  .map((f) => new URL(f, SAMPLE_DIR));

function loadSample(rId: string): Record<string, unknown> | null {
  for (const p of SAMPLE_PATHS) {
    const fname = path.basename(p.pathname).toLowerCase();
    if (fname.startsWith(rId.toLowerCase())) {
      return yaml.parse(readFileSync(p, "utf8"));
    }
  }
  return null;
}

const keyPair = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" },
  true, ["sign", "verify"],
);

const certPem = await issueSelfSignedCert(
  keyPair.publicKey,
  keyPair.privateKey,
  "O=CNML Test Vectors, CN=CNML Test Signer 2026, C=NL",
);

const manifest: Record<string, { filename: string; cert_no: string; signed_at: string }> = {};

for (const rec of RECOMMENDATIONS) {
  const cert = loadSample(rec.id) ?? {
    certificate: { number: `${rec.id}/TEST-A-XX1-26.0`, date_issued: "2026-07-23" },
    recommendation: { id: rec.id, edition: 2020, scheme: "A" as const },
    issuing_authority: { name: "CNML Test Issuer", person_responsible: "Test Signer" },
    certified_type: { category: rec.title, type_designations: ["TEST-MODEL"] },
  };
  const xml = certToCnmlXml(cert as any);
  const signed = await signCnmlXml(xml, keyPair.privateKey, certPem);

  const filename = `${rec.id}.cnml.xml`;
  writeFileSync(path.join(OUT_DIR, filename), signed);

  manifest[rec.id] = {
    filename,
    cert_no: (cert as any)?.certificate?.number ?? "(unnumbered)",
    signed_at: new Date().toISOString(),
  };

  console.log(`✓ ${rec.id} → ${filename} (${signed.length} bytes)`);
}

const manifestPath = path.join(OUT_DIR, "manifest.json");
writeFileSync(manifestPath, JSON.stringify({
  generated_at: new Date().toISOString(),
  signer_dn:   "O=CNML Test Vectors, CN=CNML Test Signer 2026, C=NL",
  algorithm:   "ECDSA P-256 + SHA-256",
  c14n:        "Exclusive C14N 1.0 (http://www.w3.org/2001/10/xml-exc-c14n#)",
  vectors:     manifest,
}, null, 2));

console.log(`\n✓ Wrote manifest → ${manifestPath}`);
console.log(`✓ ${RECOMMENDATIONS.length} test vectors generated in ${OUT_DIR}`);
