/**
 * @cnml/cnml-units — Unit symbol resolution for the browser
 *
 * Port of `oiml-cs-certificates/lib/oiml_cert/normalizer.rb`'s unit resolver.
 * Built from the unitsdb gem data at package build time (sync script).
 *
 * Usage:
 *   import { resolveUnitId } from "@cnml/cnml-units";
 *   resolveUnitId("V");        // → "u:volt"
 *   resolveUnitId("VAC");      // → "u:volt" (+ current_type: AC via stripUnitQualifiers)
 *   resolveUnitId("bar(g)");   // → "u:bar" (+ reference: gauge)
 */

import UNITS_JSON from "./unitsdb-units.json" with { type: "json" };
import PREFIXES_JSON from "./unitsdb-prefixes.json" with { type: "json" };
import OVERRIDES_JSON from "./overrides.json" with { type: "json" };

interface SymbolEntry { symbol: string; unit_id: string; }

const UNITS: SymbolEntry[] = UNITS_JSON as SymbolEntry[];
const PREFIXES: SymbolEntry[] = PREFIXES_JSON as SymbolEntry[];
const OVERRIDES: Record<string, string> = OVERRIDES_JSON as Record<string, string>;

// Build lookup maps
const symbolToUnit = new Map<string, string>();
for (const { symbol, unit_id } of UNITS) {
  if (!symbolToUnit.has(symbol)) symbolToUnit.set(symbol, unit_id);
}

const prefixBySymbol = new Map<string, string>();
for (const { symbol, unit_id } of PREFIXES.sort((a, b) => b.symbol.length - a.symbol.length)) {
  if (!prefixBySymbol.has(symbol)) prefixBySymbol.set(symbol, unit_id);
}

export interface ResolvedUnit {
  unit_id: string;
  prefix?: string;
  current_type?: "AC" | "DC" | "AC_DC";
  reference?: "gauge" | "absolute" | "differential";
}

/** Resolve a unit_symbol to a canonical unit_id, stripping qualifiers. */
export function resolveUnit(symbol: string): ResolvedUnit | null {
  if (!symbol) return null;
  const s = symbol.trim();

  // 1. OIML-context overrides (e.g. "t" → u:metric_ton not u:short_ton)
  if (OVERRIDES[s]) return { unit_id: OVERRIDES[s] };

  // 2. Direct unitsdb lookup
  if (symbolToUnit.has(s)) return { unit_id: symbolToUnit.get(s)! };

  // 3. Strip qualifiers
  const stripped = stripQualifiers(s);
  if (stripped.unit_id) return stripped;

  // 4. Try stripped base in overrides
  if (stripped.base && OVERRIDES[stripped.base]) {
    const result: ResolvedUnit = { unit_id: OVERRIDES[stripped.base] };
    if (stripped.current_type) result.current_type = stripped.current_type;
    if (stripped.reference)    result.reference = stripped.reference;
    return result;
  }

  // 5. Try stripped base in unitsdb
  if (stripped.base && symbolToUnit.has(stripped.base)) {
    const result: ResolvedUnit = { unit_id: symbolToUnit.get(stripped.base)! };
    if (stripped.current_type) result.current_type = stripped.current_type;
    if (stripped.reference)    result.reference = stripped.reference;
    return result;
  }

  // 6. Try stripping SI prefix
  const base = stripped.base ?? s;
  for (const [pfxSym, pfxId] of prefixBySymbol) {
    if (pfxSym.length >= base.length) continue;
    if (!base.startsWith(pfxSym)) continue;
    const remainder = base.slice(pfxSym.length);
    if (!remainder || remainder.length > 10) continue;
    if (symbolToUnit.has(remainder) || OVERRIDES[remainder]) {
      const result: ResolvedUnit = {
        unit_id: symbolToUnit.get(remainder) ?? OVERRIDES[remainder],
        prefix: pfxId,
      };
      if (stripped.current_type) result.current_type = stripped.current_type;
      if (stripped.reference)    result.reference = stripped.reference;
      return result;
    }
  }
  return null;
}

export function resolveUnitId(symbol: string): string | null {
  return resolveUnit(symbol)?.unit_id ?? null;
}

function stripQualifiers(symbol: string): Partial<ResolvedUnit> & { base?: string } {
  let s = symbol.replace(/\s+/g, "");

  // bar(g), bar(a), barg, bara, MPa(g), PSI(g) ...
  const pressureMatch = s.match(/^(bar|Pa|kPa|MPa|mbar|psi|PSI)((?:\(g\)|\(a\)|\(d\)|g|a|G|A))?$/i);
  if (pressureMatch) {
    const base = pressureMatch[1];
    const qual = pressureMatch[2]?.toLowerCase().replace(/[()]/g, "");
    const ref = qual ? { g: "gauge", a: "absolute", d: "differential" }[qual] : undefined;
    return { base, reference: ref as ResolvedUnit["reference"] };
  }

  // VAC, VDC, AAC, ADC, V AC, V DC
  const currentMatch = s.match(/^(V|A|W)(AC|DC|ACDC)$/i);
  if (currentMatch) {
    const base = currentMatch[1].toUpperCase();
    const ct = currentMatch[2].toUpperCase().replace("/", "_") as "AC" | "DC" | "AC_DC";
    return { base, current_type: ct };
  }

  return { base: s };
}

/** All known unit_ids (for picker UIs). */
export const ALL_UNIT_IDS: string[] = Array.from(new Set(UNITS.map((u) => u.unit_id))).sort();

/** All known unit_symbols (for fuzzy search). */
export const ALL_UNIT_SYMBOLS: string[] = UNITS.map((u) => u.symbol).sort();
