/**
 * Build the glossary term registry from the source markdown.
 *
 * Reads `content/docs/reference/glossary.md`, parses the
 * `**Term.** Description` entries, and writes
 * `src/data/glossary-terms.json`.
 *
 * Run as part of `pnpm gen` so the registry stays in sync with the
 * glossary source.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

// `import.meta.dirname` is the directory of the current module's
// file. Stable across dev and build (the script runs from source).
const here = import.meta.dirname;
const ROOT = join(here, "..");
const GLOSSARY_MD = join(ROOT, "apps/cnml-web/src/content/docs/reference/glossary.md");
const OUTPUT = join(ROOT, "apps/cnml-web/src/data/glossary-terms.json");

interface Entry {
  term: string;
  anchor: string;
  aliases: string[];
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function main() {
  if (!existsSync(GLOSSARY_MD)) {
    console.error(`Glossary source not found: ${GLOSSARY_MD}`);
    process.exit(1);
  }
  const md = readFileSync(GLOSSARY_MD, "utf8");
  const lines = md.split("\n");
  const entries: Entry[] = [];
  let inBody = false;
  for (const line of lines) {
    if (line.startsWith("# ")) {
      inBody = true;
      continue;
    }
    if (!inBody) continue;
    const m = line.match(/^\*\*([^*]+?)\.\*\*\s+(.*)$/);
    if (!m) continue;
    const term = m[1]!.trim();
    // Acronyms of 4+ characters get alias treatment — common usage
    // pluralizes them ("CRLs", "HSMs") and the linker already
    // handles that via the optional trailing "s". Aliases here are
    // for genuinely different forms (e.g., "PKCS#11" might alias
    // "PKCS11"). The current glossary does not need aliases; the
    // field exists for future extension.
    entries.push({ term, anchor: slugify(term), aliases: [] });
  }
  const json = JSON.stringify(entries, null, 2) + "\n";
  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, json);
  console.log(`OK — wrote ${entries.length} glossary entries to ${OUTPUT}`);
}

main();
