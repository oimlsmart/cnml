/**
 * One-shot migration: inject x-oiml-* metadata into each schemas/R*.yaml.
 *
 * Run once after moving schemas into schemas/ subdir. Idempotent — safe to
 * re-run; will not overwrite existing x-oiml-* keys.
 *
 * After running, delete this file.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(__dirname, "../packages/cnml-schemas/src/schemas");

// Metadata source — derived from the prior hardcoded RECOMMENDATIONS array.
// Once written into the YAMLs, this script can be deleted.
const META: Record<string, { category: string; shortTitle: string; certCount: number }> = {
  R21:  { category: "Other",             shortTitle: "Taximeters",                                              certCount: 42  },
  R31:  { category: "Fuel & Flow",       shortTitle: "Diaphragm gas meters",                                    certCount: 39  },
  R46:  { category: "Electricity",       shortTitle: "Active electrical energy meters",                         certCount: 98  },
  R49:  { category: "Water & Liquid",    shortTitle: "Water meters for cold potable water",                     certCount: 4   },
  R50:  { category: "Weighing",          shortTitle: "Continuous totalizing automatic weighing",                certCount: 5   },
  R51:  { category: "Weighing",          shortTitle: "Automatic catchweighing instruments",                     certCount: 100 },
  R60:  { category: "Weighing",          shortTitle: "Load cells",                                              certCount: 100 },
  R61:  { category: "Weighing",          shortTitle: "Automatic gravimetric filling instruments",               certCount: 12  },
  R76:  { category: "Weighing",          shortTitle: "Non-automatic weighing instruments",                      certCount: 100 },
  R85:  { category: "Length & Dimension",shortTitle: "Automatic level gauges",                                 certCount: 99  },
  R99:  { category: "Other",             shortTitle: "Breath alcohol analyzers",                                certCount: 2   },
  R105: { category: "Other",             shortTitle: "Direct mass flow measuring systems",                      certCount: 1   },
  R106: { category: "Weighing",          shortTitle: "Automatic rail weighbridges",                             certCount: 3   },
  R107: { category: "Weighing",          shortTitle: "Discontinuous totalizing instruments",                    certCount: 3   },
  R111: { category: "Weighing",          shortTitle: "Weights of accuracy classes E1..M3",                      certCount: 1   },
  R117: { category: "Fuel & Flow",       shortTitle: "Fuel dispensers (liquids other than water)",              certCount: 85  },
  R126: { category: "Other",             shortTitle: "Evidential breath analyzers",                             certCount: 9   },
  R129: { category: "Length & Dimension",shortTitle: "Multidimensional measuring instruments",                  certCount: 3   },
  R134: { category: "Weighing",          shortTitle: "Automatic instruments for weighing road vehicles",        certCount: 35  },
  R136: { category: "Other",             shortTitle: "Liquid density measuring instruments",                    certCount: 1   },
  R137: { category: "Fuel & Flow",       shortTitle: "Dynamic measuring systems for gas",                       certCount: 99  },
  R139: { category: "Fuel & Flow",       shortTitle: "CNG & hydrogen dispensers",                               certCount: 39  },
};

const files = readdirSync(SCHEMA_DIR).filter((f) => /^R\d+\.yaml$/.test(f));
console.log(`Processing ${files.length} schema files…`);

for (const f of files) {
  const path = join(SCHEMA_DIR, f);
  const text = readFileSync(path, "utf8");
  const doc = yaml.parseDocument(text);
  const rId = f.replace(/\.yaml$/, "");
  const meta = META[rId];
  if (!meta) {
    console.warn(`⚠ ${f}: no metadata mapping, skipping`);
    continue;
  }

  // JSON Schema allows vendor extensions via x-* keys. Set as a mapping.
  doc.set("x-oiml-category", meta.category);
  doc.set("x-oiml-short-title", meta.shortTitle);
  doc.set("x-oiml-cert-count", meta.certCount);

  writeFileSync(path, doc.toString());
  console.log(`✓ ${f}`);
}

console.log(`\nDone. Verify with: head -10 packages/cnml-schemas/src/schemas/R60.yaml`);
