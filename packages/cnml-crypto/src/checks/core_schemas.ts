/**
 * The core-schema registration, ONE home (the check pipeline's
 * self-sufficiency — the browser VerifyDrop never registered anything,
 * so schema-valid failed every compile there; the smart bridge carried
 * its own copy of this logic).
 *
 * Loads the schema package — the vite/Astro entry (YAML imports) when
 * available, the generated node twin (index.node.mjs, JSON literals)
 * otherwise — and registers CORE + the units-populated UNITS +
 * UNITS_LOCAL + MODULES on the shared ajv instance, once per process.
 */

import { registerSchema } from "@oiml/cnml-xml/validate";

interface SchemasPackage {
  CORE: unknown;
  UNITS: {
    units?: { enum?: string[] };
    definitions?: Record<string, { properties?: Record<string, { enum?: string[]; enum_file?: string }> }>;
  };
  UNITS_LOCAL: unknown;
  MODULES?: Record<string, unknown>;
  RECOMMENDATIONS: Array<{ id: string; title: string; shortTitle: string; category: string; certCount: number; schema: unknown }>;
  getRecommendation(id: string): { id: string; title: string; shortTitle: string; category: string; certCount: number; schema: unknown } | undefined;
}

async function loadSchemasPackage(): Promise<SchemasPackage> {
  try {
    return (await import("@oiml/cnml-schemas")) as unknown as SchemasPackage;
  } catch {
    // Plain node (no YAML loader): the generated JSON twin.
    return (await import("@oiml/cnml-schemas/node")) as unknown as SchemasPackage;
  }
}

/** The per-recommendation schema lookup, environment-agnostic (the
 *  vite entry wins, the generated node twin otherwise). */
export async function getRecommendationSchema(id: string): Promise<{ id: string; schema: unknown } | undefined> {
  const schemas = await loadSchemasPackage();
  return schemas.getRecommendation(id);
}

let registered = false;

/** Register the core schemas on the shared ajv instance (idempotent).
 *  _units.yaml's structured unit definitions declare `enum_file:
 *  _units.yaml` beside an empty enum ("populated at load time from the
 *  top-level units.enum") — the population happens ON A COPY (the
 *  shared module object is never mutated; ajv rejects an empty enum). */
export async function ensureCoreSchemasRegistered(): Promise<void> {
  if (registered) return;
  const schemas = await loadSchemasPackage();
  const unitEnum = schemas.UNITS?.units?.enum;
  let unitsRegistered: unknown = schemas.UNITS;
  if (unitEnum && schemas.UNITS?.definitions) {
    const copy = JSON.parse(JSON.stringify(schemas.UNITS)) as SchemasPackage["UNITS"];
    for (const def of Object.values(copy.definitions ?? {})) {
      for (const prop of Object.values(def.properties ?? {})) {
        if (prop.enum_file === "_units.yaml" && Array.isArray(prop.enum) && prop.enum.length === 0) {
          prop.enum = unitEnum;
        }
      }
    }
    unitsRegistered = copy;
  }
  for (const core of [schemas.CORE, unitsRegistered, schemas.UNITS_LOCAL, ...Object.values(schemas.MODULES ?? {})]) {
    registerSchema(core);
  }
  registered = true;
}
