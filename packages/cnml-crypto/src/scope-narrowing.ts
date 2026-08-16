/**
 * Formal scope narrowing + scope conditions (SIGNATIF Phase 6).
 *
 * The narrowing invariant: a delegation may only narrow. Across every
 * scope dimension, the child's scope must be a subset of the parent's:
 *
 *   wildcard ⊇ set ⊇ single
 *
 * Scope conditions are executable predicates evaluated at verification
 * time against the artifact's content ("the measurement's temperature
 * was within the approved range"). Conditions are monotonic: a child's
 * condition set must be a superset of the parent's.
 */

export const CNML_NS = "https://oimlsmart.org/schemas/cnml/1.0";

export type ScopeValue = string | string[] | "*";

export interface ScopeCondition {
  id: string;
  expression: string;
}

export interface Scope {
  recommendation?: ScopeValue;
  model?: ScopeValue;
  serial?: ScopeValue;
  tester?: ScopeValue;
  conditions?: ScopeCondition[];
}

function covers(parent: ScopeValue, child: ScopeValue): boolean {
  if (parent === "*") return true;
  if (child === "*") return false;
  if (typeof parent === "string") return parent === child;
  if (typeof child === "string") return parent.includes(child);
  return child.every((v) => parent.includes(v));
}

/** Spec §scope-narrowing step 1: a singleton set {x} is equivalent
 *  to the single value x and is normalized before comparison. */
function normalize(value: ScopeValue | undefined): ScopeValue | undefined {
  if (Array.isArray(value) && value.length === 1) return value[0];
  return value;
}

/**
 * The narrowing invariant: `child` narrows (or equals) `parent` on
 * every declared dimension, and carries every condition the parent
 * imposed (monotonicity).
 */
export function narrowed(parent: Scope, child: Scope): boolean {
  const dims = new Set([...Object.keys(parent), ...Object.keys(child)] as (keyof Scope)[]);
  for (const dim of dims) {
    if (dim === "conditions") continue;
    const p = normalize(parent[dim]);
    const c = normalize(child[dim]);
    if (p === undefined && c === undefined) continue;
    if (p === undefined) continue; // parent unconstrained: anything narrows it
    if (c === undefined) return false; // parent constrained, child widened to nothing
    if (!covers(p, c)) return false;
  }
  const pc = parent.conditions ?? [];
  const cc = child.conditions ?? [];
  return pc.every((cond) => cc.some((c) => c.id === cond.id));
}

// ─── Scope condition language ────────────────────────────────────
//
// expression := comparison ("AND" comparison)*
// comparison := path op literal
// path       := identifier ("." identifier)*
// op         := ">=" | "<=" | ">" | "<" | "=" | "!="
// literal    := number | quoted-string | path (value lookup)

type Token =
  | { kind: "ident"; value: string }
  | { kind: "number"; value: number }
  | { kind: "string"; value: string }
  | { kind: "op"; value: string }
  | { kind: "and"; value: "AND" };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (ch === '"' || ch === "'") {
      const end = src.indexOf(ch, i + 1);
      if (end === -1) throw new Error("unterminated string literal");
      tokens.push({ kind: "string", value: src.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === "-" && /[0-9]/.test(src[i + 1] ?? ""))) {
      const m = /^-?[0-9]+(\.[0-9]+)?/.exec(src.slice(i));
      if (!m) throw new Error("malformed number");
      tokens.push({ kind: "number", value: parseFloat(m[0]) });
      i += m[0].length;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (two === ">=" || two === "<=" || two === "!=") {
      tokens.push({ kind: "op", value: two });
      i += 2;
      continue;
    }
    if (ch === ">" || ch === "<" || ch === "=") {
      tokens.push({ kind: "op", value: ch });
      i += 1;
      continue;
    }
    const word = /^[A-Za-z_][A-Za-z0-9_-]*/.exec(src.slice(i));
    if (word) {
      if (word[0] === "AND") tokens.push({ kind: "and", value: "AND" });
      else tokens.push({ kind: "ident", value: word[0] });
      i += word[0].length;
      continue;
    }
    if (ch === ".") {
      const word = /^[A-Za-z_][A-Za-z0-9_-]*/.exec(src.slice(i + 1));
      if (!word) throw new Error("dangling '.' in path");
      // fold into the previous ident as a dotted path
      const prev = tokens[tokens.length - 1];
      if (!prev || prev.kind !== "ident") throw new Error("dangling '.' in path");
      prev.value = `${prev.value}.${word[0]}`;
      i += 1 + word[0].length;
      continue;
    }
    throw new Error(`unexpected character '${ch}'`);
  }
  return tokens;
}

interface Comparison {
  path: string;
  op: string;
  operand: { kind: "number"; value: number } | { kind: "string"; value: string } | { kind: "path"; value: string };
}

/** Parse an expression into its conjunction of comparisons. */
export function parseScopeExpression(expression: string): Comparison[] {
  const tokens = tokenize(expression);
  const comparisons: Comparison[] = [];
  let i = 0;
  const expect = () => {
    if (i >= tokens.length) throw new Error("expression ended unexpectedly");
    return tokens[i++];
  };
  while (i < tokens.length) {
    if (comparisons.length > 0) {
      const t = expect();
      if (t.kind !== "and") throw new Error("comparisons must be joined by AND");
    }
    const lhs = expect();
    if (lhs.kind !== "ident") throw new Error("expected a path");
    const op = expect();
    if (op.kind !== "op") throw new Error("expected a comparison operator");
    const rhs = expect();
    const operand =
      rhs.kind === "number" || rhs.kind === "string"
        ? { kind: rhs.kind as "number" | "string", value: rhs.value }
        : { kind: "path" as const, value: rhs.value };
    comparisons.push({ path: lhs.value, op: op.value, operand });
  }
  if (comparisons.length === 0) throw new Error("empty expression");
  return comparisons;
}

function lookup(values: Record<string, unknown>, path: string): unknown {
  // Flat keys first (the form conditionValuesFromXml produces), then
  // nested objects (values supplied as structured records).
  if (path in values) return values[path];
  let current: unknown = values;
  for (const part of path.split(".")) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function compare(left: number | string, op: string, right: number | string): boolean {
  switch (op) {
    case "=": return left === right;
    case "!=": return left !== right;
    case ">": return left > right;
    case "<": return left < right;
    case ">=": return left >= right;
    case "<=": return left <= right;
    default: throw new Error(`unknown operator ${op}`);
  }
}

/**
 * Evaluate a scope condition against a flat or nested value record.
 * Throws on malformed expressions; a referenced-but-unknown value
 * makes the condition fail (never silently pass).
 */
export function evaluateScopeExpression(
  expression: string,
  values: Record<string, unknown>,
): boolean {
  return parseScopeExpression(expression).every((c) => {
    const left = lookup(values, c.path);
    if (left === undefined || left === null) return false;
    const right =
      c.operand.kind === "path" ? lookup(values, c.operand.value) : c.operand.value;
    if (right === undefined || right === null) return false;
    if (typeof left !== typeof right) return false;
    if (typeof left !== "number" && typeof left !== "string") return false;
    return compare(left, c.op, right as number | string);
  });
}

// ─── XML surface ─────────────────────────────────────────────────

/** Extract <cnml:scopeCondition id="...">expr</cnml:scopeCondition> entries. */
export function extractScopeConditions(xml: string): ScopeCondition[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const els = Array.from(doc.getElementsByTagNameNS(CNML_NS, "scopeCondition"));
  return els
    .map((el) => ({ id: el.getAttribute("id") ?? "", expression: el.textContent?.trim() ?? "" }))
    .filter((c) => c.id && c.expression);
}

/**
 * Extract the observable values from a CNML document for condition
 * evaluation: measurement fields under measurement.* and certificate
 * fields under certificate.*. Numbers stay numbers.
 */
export function conditionValuesFromXml(xml: string): Record<string, unknown> {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const values: Record<string, unknown> = {};
  for (const el of Array.from(doc.getElementsByTagNameNS(CNML_NS, "signedMeasurement"))) {
    for (const child of Array.from(el.children)) {
      const local = child.localName;
      const text = child.textContent?.trim();
      if (!local || text === undefined) continue;
      const num = /^-?[0-9]+(\.[0-9]+)?$/.exec(text);
      values[`measurement.${local}`] = num ? parseFloat(text) : text;
    }
  }
  for (const key of ["oimlNumber", "instrumentModel", "serialNumber"]) {
    const el = doc.getElementsByTagNameNS(CNML_NS, key)[0];
    if (el?.textContent?.trim()) values[`certificate.${key}`] = el.textContent.trim();
  }
  return values;
}
