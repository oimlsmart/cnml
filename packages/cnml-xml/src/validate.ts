/**
 * JSON Schema validation for CNML certificates.
 *
 * Uses ajv (draft-07 compatible, matching our schema files) to validate
 * a parsed cert object against its per-Recommendation schema.
 *
 * Cross-file $ref resolution (e.g., "_core.yaml#/definitions/...")
 * requires the schemas to be loaded with stable $id values. This module
 * registers all core schemas on first use.
 */

import Ajv from "ajv/dist/2019.js";
// The precompiled validators (the Worker-safe posture, 2026-10-10):
// generated at author time (scripts/gen-validators.mjs), keyed by
// Recommendation id (R60…) — the runtime resolves the schema's $id to
// that key. A hit means NO runtime codegen; the fallback compiles on
// demand (node/dev, or a schema the generator skipped).
import { PRECOMPILED } from "./compiled-validators.ts";
import draft7MetaSchema from "ajv/dist/refs/json-schema-draft-07.json" with { type: "json" };
import type { ValidateFunction } from "ajv";

export interface ValidationError {
  /** JSON Pointer path within the cert object. */
  path: string;
  /** Human-readable description of the violation. */
  message: string;
  /** Schema path (within the JSON Schema doc) where the constraint is. */
  schemaPath: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Cache compiled validators by schema $id. Compilation is expensive;
// we want to do it once per unique schema, not once per validation call.
const VALIDATOR_CACHE = new Map<string, ValidateFunction>();

// The ajv instance — created on first use so we don't pay the import
// cost on pages that don't validate.
let _ajv: Ajv | null = null;

function ajvInstance(): Ajv {
  if (_ajv) return _ajv;
  _ajv = new Ajv({
    allErrors: true,
    verbose: true,
    strict: false,            // our schemas use draft-07 + some extensions
    strictSchema: false,
    allowUnionTypes: true,    // type arrays like ["string", "null"]
  });
  // The 2019-09 dialect does not bundle the draft-07 meta-schema; our
  // schema files declare `$schema: draft-07`, so compile() fails without
  // this registration (and the schema_valid check degrades to
  // "validation unavailable" — never a real pass).
  _ajv.addMetaSchema(draft7MetaSchema);
  return _ajv;
}

/**
 * Validate a parsed CNML certificate against its per-R schema.
 *
 * The schema is expected to be a JS object (e.g., from
 * `getRecommendation("R60").schema`). Cross-file $refs must resolve
 * via the schema's $id (schemas registered via registerSchema()).
 *
 * @param cert Parsed CNML (the object form, not XML)
 * @param schema The full schema document (object form, not YAML)
 * @returns validation result with structured error list
 */
export function validateAgainstSchema(
  cert: unknown,
  schema: unknown,
): ValidationResult {
  const schemaObj = schema as { $id?: string; title?: string };
  const cacheKey = schemaObj?.$id ?? schemaObj?.title ?? JSON.stringify(schema).slice(0, 64);

  // The precompiled map first (its key: the Recommendation id parsed
  // out of the schema's $id — …/schemas/R60.yaml → R60).
  const precompiledKey = /([A-Za-z][A-Za-z0-9]*)\.yaml$/.exec(cacheKey)?.[1]
  let validator = VALIDATOR_CACHE.get(cacheKey)
    ?? (precompiledKey !== undefined ? PRECOMPILED[precompiledKey] : undefined)
  if (!validator) {
    try {
      // Lazy to the last instantiation: even CONSTRUCTING the Ajv (its
      // addMetaSchema) eagerly compiles the meta-schema's own refs with
      // new Function. The fallback branch is the only place it may live.
      const ajv = ajvInstance()
      flushPendingSchemas(ajv)
      validator = ajv.compile(schema as any);
      VALIDATOR_CACHE.set(cacheKey, validator);
    } catch (e) {
      return {
        valid: false,
        errors: [{
          path: "",
          message: `Could not compile schema: ${(e as Error).message}`,
          schemaPath: "",
        }],
      };
    }
  }

  const valid = validator(cert);
  if (valid) return { valid: true, errors: [] };

  const errors = (validator.errors ?? []).map((err: any) => ({
    path: err.instancePath || "(root)",
    message: err.message ?? "validation failed",
    schemaPath: err.schemaPath ?? "",
  }));
  return { valid: false, errors };
}

/**
 * Pre-register a schema so its $id can be referenced from other schemas.
 * Use this to make _core.yaml / _units.yaml definitions available to
 * per-R schemas.
 *
 * @param schema Schema document (with $id set)
 */
// The pending registry (the Worker-safe posture, 2026-10-10): Ajv's
// addSchema EAGERLY COMPILES (new Function) — forbidden in runtimes
// that bar code-from-strings at request time. Schemas register lazily:
// they flush into the Ajv instance only when a validation actually
// needs a runtime compile (the fallback path — a schema the precompiled
// map does not carry). The precompiled path never touches Ajv at all.
const PENDING_SCHEMAS: unknown[] = []
let flushed = false

export function registerSchema(schema: unknown): void {
  PENDING_SCHEMAS.push(schema)
}

function flushPendingSchemas(ajv: Ajv): void {
  if (flushed) return
  flushed = true
  for (const schema of PENDING_SCHEMAS) {
    try { ajv.addSchema(schema as any) } catch { /* already registered */ }
  }
}

/** Clear the validator cache. Used by tests. */
export function clearValidatorCache(): void {
  VALIDATOR_CACHE.clear();
  _ajv = null;
}
