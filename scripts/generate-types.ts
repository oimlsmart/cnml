/**
 * Generate TypeScript types from JSON Schema (draft-07) YAML files.
 *
 * Reads:   ../../oiml-cs-certificates/schema/*.yaml
 * Writes:  packages/cnml-types/src/*.ts
 *
 * Handles:
 *   - $ref resolution (intra-file + cross-file via _core.yaml etc.)
 *   - oneOf / anyOf / allOf
 *   - enum / const
 *   - type arrays (e.g. [string, "null"])
 *   - additionalProperties fallback (for free-form characteristic layers)
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, basename, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(__dirname, "../../oiml-cs-certificates/schema");
const OUT_DIR    = join(__dirname, "../packages/cnml-types/src");

type JsonSchema = {
  $ref?: string;
  type?: string | string[];
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: unknown[];
  const?: unknown;
  pattern?: string;
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  definitions?: Record<string, JsonSchema>;
  additionalProperties?: boolean | JsonSchema;
  minimum?: number;
  maximum?: number;
};

// ─── Schema cache (for cross-file $ref resolution) ────────────────────

const SCHEMA_CACHE: Record<string, JsonSchema> = {};

function loadSchema(filename: string): JsonSchema {
  if (SCHEMA_CACHE[filename]) return SCHEMA_CACHE[filename];
  const path = join(SCHEMA_DIR, filename);
  if (!existsSync(path)) throw new Error(`Schema file not found: ${filename}`);
  const text = readFileSync(path, "utf8");
  const parsed = yaml.parse(text) as JsonSchema;
  SCHEMA_CACHE[filename] = parsed;
  return parsed;
}

// Resolve a $ref like "_core.yaml#/definitions/Party" or "#/definitions/Foo"
function resolveRef(ref: string, currentFile: string): { schema: JsonSchema; fromFile: string } {
  if (ref.startsWith("#")) {
    // local ref
    const me = loadSchema(currentFile);
    const pieces = ref.split("/").slice(1); // drop leading "#"
    let cursor: JsonSchema = me;
    for (const p of pieces) {
      if (!cursor || typeof cursor !== "object") throw new Error(`Bad ref ${ref}`);
      cursor = (cursor as Record<string, JsonSchema>)[p];
    }
    return { schema: cursor, fromFile: currentFile };
  }
  // cross-file ref: file.yaml#/definitions/Foo
  const [file, fragment] = ref.split("#", 2);
  const schema = loadSchema(file);
  if (!fragment) return { schema, fromFile: file };
  const pieces = fragment.split("/").slice(1);
  let cursor: JsonSchema = schema;
  for (const p of pieces) {
    if (!cursor) throw new Error(`Bad ref ${ref}`);
    cursor = (cursor as Record<string, JsonSchema>)[p];
  }
  return { schema: cursor, fromFile: file };
}

// ─── TS type inference ─────────────────────────────────────────────────

function tsType(s: JsonSchema | undefined, currentFile: string): string {
  if (!s) return "unknown";

  if (s.$ref) {
    const resolved = resolveRef(s.$ref, currentFile);
    return tsType(resolved.schema, resolved.fromFile);
  }

  // Union of subschemas
  if (s.oneOf) return "(" + s.oneOf.map((x) => tsType(x, currentFile)).join(" | ") + ")";
  if (s.anyOf) return "(" + s.anyOf.map((x) => tsType(x, currentFile)).join(" | ") + ")";

  // allOf: intersect. If the schemas are just widening props (typical for
  // our StructuredValue + enum narrowing pattern), merge the objects.
  if (s.allOf) {
    const merged = s.allOf.reduce<JsonSchema>((acc, sub) => {
      const r = sub.$ref ? resolveRef(sub.$ref, currentFile).schema : sub;
      return mergeSchemas(acc, r);
    }, {} as JsonSchema);
    return tsType(merged, currentFile);
  }

  if (s.const !== undefined) return JSON.stringify(s.const);
  if (s.enum) return s.enum.map((v) => JSON.stringify(v)).join(" | ");

  const types = Array.isArray(s.type) ? s.type : (s.type ? [s.type] : []);
  const isNullable = types.includes("null");
  const nonNull = types.filter((t) => t !== "null");

  let primary: string;
  if (nonNull.length === 0) {
    // type missing — infer from structure
    if (s.properties) primary = tsObject(s, currentFile);
    else if (s.items) primary = tsType(s.items, currentFile) + "[]";
    else primary = "unknown";
  } else if (nonNull.length === 1) {
    primary = tsSingle(nonNull[0], s, currentFile);
  } else {
    primary = nonNull.map((t) => tsSingle(t, s, currentFile)).join(" | ");
  }

  return isNullable ? `(${primary} | null)` : primary;
}

function tsSingle(t: string, s: JsonSchema, currentFile: string): string {
  switch (t) {
    case "string":  return "string";
    case "integer":
    case "number":  return "number";
    case "boolean": return "boolean";
    case "array":   return s.items ? tsType(s.items, currentFile) + "[]" : "unknown[]";
    case "object":  return tsObject(s, currentFile);
    default:        return "unknown";
  }
}

function tsObject(s: JsonSchema, currentFile: string): string {
  const props = s.properties ?? {};
  const required = new Set(s.required ?? []);
  const lines: string[] = [];

  // Collect properties — if additionalProperties is a schema (not false),
  // emit an index signature for the unknown extras.
  for (const [key, sub] of Object.entries(props)) {
    const opt = required.has(key) ? "" : "?";
    const t = tsType(sub, currentFile);
    if (sub.description) {
      const desc = sub.description.split("\n").map((l) => `   * ${l}`).join("\n");
      lines.push(`  /**\n${desc}\n   */`);
    }
    lines.push(`  ${JSON.stringify(key)}${opt}: ${t};`);
  }

  if (s.additionalProperties && typeof s.additionalProperties === "object") {
    const t = tsType(s.additionalProperties, currentFile);
    lines.push(`  [key: string]: ${t};`);
  }

  return `{\n${lines.join("\n")}\n}`;
}

function mergeSchemas(a: JsonSchema, b: JsonSchema): JsonSchema {
  // Shallow merge: prefer b for narrow fields; merge properties.
  return {
    ...a,
    ...b,
    properties: { ...(a.properties ?? {}), ...(b.properties ?? {}) },
    required:   [...new Set([...(a.required ?? []), ...(b.required ?? [])])],
  };
}

// ─── Per-file emission ────────────────────────────────────────────────

function emitType(s: JsonSchema, name: string, currentFile: string): string {
  if (s.properties) return `export interface ${name} ${tsObject(s, currentFile)}`;
  return `export type ${name} = ${tsType(s, currentFile)};`;
}

function generate(inputFile: string): string {
  const schema = loadSchema(inputFile);
  const out: string[] = [
    `// AUTO-GENERATED from ${inputFile}. Do not edit by hand.`,
    `// Run \`pnpm gen:types\` to regenerate.`,
    ``,
  ];

  if (schema.description) {
    out.push("/**");
    schema.description.split("\n").forEach((l) => out.push(` * ${l}`));
    out.push(" */");
  }

  // Root type
  const rootName = rootTypeName(inputFile);
  out.push(emitType(schema, rootName, inputFile));

  // Definitions
  if (schema.definitions) {
    for (const [defName, def] of Object.entries(schema.definitions)) {
      out.push("");
      if (def.description) {
        out.push("/**");
        def.description.split("\n").forEach((l) => out.push(` * ${l}`));
        out.push(" */");
      }
      out.push(emitType(def, defName, inputFile));
    }
  }

  return out.join("\n") + "\n";
}

function rootTypeName(filename: string): string {
  const base = basename(filename, extname(filename));
  if (base === "_core")          return "CoreCertificate";
  if (base === "_units")         return "Units";
  if (base === "_units_local")   return "UnitsLocal";
  if (base.startsWith("_modules/")) return "Module" + basename(base).replace(/[-_](.)/g, (_, c) => c.toUpperCase());
  if (/^R\d+$/.test(base))       return "Cert_" + base;
  return base.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

function outputFile(inputFile: string): string {
  const base = basename(inputFile, extname(inputFile));
  const name = base.startsWith("_modules/") ? "module_" + basename(base) : base;
  return join(OUT_DIR, name.toLowerCase().replace(/^_/, "") + ".ts");
}

// ─── Main ─────────────────────────────────────────────────────────────

console.log("Generating TypeScript types from YAML schemas...");
console.log(`Source: ${SCHEMA_DIR}`);
console.log(`Output: ${OUT_DIR}`);
console.log("");

mkdirSync(OUT_DIR, { recursive: true });

const files = [
  "_core.yaml",
  "_units.yaml",
  "_units_local.yaml",
  "_modules/d011_environmental.yaml",
  ...readdirSync(SCHEMA_DIR).filter((f) => /^R\d+\.yaml$/.test(f)),
];

for (const f of files) {
  try {
    const out = generate(f);
    const outPath = outputFile(f);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, out);
    console.log(`  ✓ ${f} → ${basename(outPath)}`);
  } catch (e) {
    console.warn(`  ✗ ${f}: ${(e as Error).message}`);
  }
}

// Barrel index
const barrel = [
  `// AUTO-GENERATED barrel export.`,
  ``,
  `export * from "./core";`,
  `export * from "./units";`,
  `export * from "./unitslocal";`,
  `export * from "./module_d011_environmental";`,
  ``,
  `// Per-Recommendation exports`,
  ...files
    .filter((f) => /^R\d+\.yaml$/.test(f))
    .map((f) => `export * from "./${f.toLowerCase().replace(/\.yaml$/, "")}";`),
  ``,
].join("\n");
writeFileSync(join(OUT_DIR, "index.ts"), barrel);
console.log("\n✓ Type generation complete");
console.log(`  ${files.length} schemas processed`);
