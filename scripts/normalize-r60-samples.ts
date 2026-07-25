/**
 * Normalize the R60 sample certs so they have canonical schema field names:
 *
 *   - accuracy_class (A/B/C/D) — derived from first classification symbol
 *   - classification_symbol (C3, C3MI7.5, etc.) — copied from recommendation.accuracy_classes[0]
 *   - recommendation.accuracy_classes stays (back-compat with the source PDFs)
 *
 * Real OIML-CS PDF certs only include `recommendation.accuracy_classes`,
 * not the major accuracy_class. We project the value forward to populate
 * the form's `accuracy_class` field.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import yaml from "yaml";

const here = path.dirname(fileURLToPath(import.meta.url));
const certsDir = path.resolve(here, "..", "apps", "cnml-web", "public", "certs");

const files = readdirSync(certsDir).filter((f) => /^r60-sample-\d+\.yaml$/.test(f));

for (const f of files.sort()) {
  const filePath = path.join(certsDir, f);
  const text = readFileSync(filePath, "utf8");
  const cert = yaml.parse(text) as any;

  const classificationSymbols: string[] = cert?.recommendation?.accuracy_classes ?? [];
  const first = classificationSymbols[0];

  if (first) {
    // Major accuracy class is the leading letter: "C3" → "C", "D2" → "D"
    const major = first.match(/^[ABCD]/)?.[0];
    if (major) {
      // Ensure characteristics.type_level exists
      cert.characteristics ??= {};
      cert.characteristics.type_level ??= {};
      // Always overwrite to canonical values (idempotent)
      cert.characteristics.type_level.accuracy_class ??= { value: major };
      cert.characteristics.type_level.classification_symbol ??= { value: first };
    }
  }

  writeFileSync(filePath, yaml.stringify(cert) + "\n");
  console.log(`✓ normalized ${f}: accuracy_class=${cert?.characteristics?.type_level?.accuracy_class?.value}, classification_symbol=${cert?.characteristics?.type_level?.classification_symbol?.value}`);
}

console.log(`\nDone. ${files.length} R60 samples normalized.`);
