/**
 * Style guide linter — entry point.
 *
 * Scans every markdown file under apps/cnml-web/src/content/ for
 * prohibited patterns from the OIML SMART writing style guide.
 *
 * The rule set lives in styleguide-lint-rules.ts. Adding a rule is
 * one entry there; this file never changes when rules change.
 *
 * Run: pnpm lint:style
 * Exit: 0 on clean, 1 on any violation, 2 on configuration error.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { RULES, styleguideLint } from "./styleguide-lint-rules.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = join(here, "..");
const CONTENT_ROOT = join(REPO_ROOT, "apps", "cnml-web", "src", "content");

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith(".md")) out.push(full);
  }
  return out;
}

function existsSafe(p: string): boolean {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function main(): number {
  if (!existsSafe(CONTENT_ROOT)) {
    console.error(`Content root not found: ${CONTENT_ROOT}`);
    return 2;
  }
  const files = walk(CONTENT_ROOT).sort();
  const findings = files.flatMap((abs) => {
    const rel = relative(CONTENT_ROOT, abs);
    const text = readFileSync(abs, "utf8");
    return styleguideLint(text, rel, RULES);
  });

  if (findings.length === 0) {
    console.log(`OK — ${files.length} markdown files scanned, no style-guide violations.`);
    return 0;
  }
  console.error(`${findings.length} style-guide violation(s) found:\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}:${f.column}  ${f.rule}`);
    console.error(`    "${f.snippet}"`);
    console.error(`    ${f.why}\n`);
  }
  return 1;
}

process.exit(main());
