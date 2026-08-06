/**
 * Table-of-contents extraction (TODO.cnml/42).
 *
 * Walks a markdown body, finds every `## ` (and `### `) heading,
 * and returns a `{ level, text, slug }[]` list. The slug matches
 * GitHub's heading-anchor convention: lowercase, spaces to hyphens,
 * strip punctuation except hyphens.
 *
 * The output drives the on-this-page nav on docs pages. Pages with
 * fewer than 2 entries skip the TOC.
 */

export interface TocEntry {
  level: number;
  text: string;
  slug: string;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractToc(markdown: string): TocEntry[] {
  const lines = markdown.split("\n");
  const out: TocEntry[] = [];
  let inFence = false;
  for (const line of lines) {
    // Toggle fenced-code-block state. A heading inside a code fence
    // is not a real heading.
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const hashes = m[1]!;
    const text = m[2]!;
    out.push({
      level: hashes.length,
      text,
      slug: slugifyHeading(text),
    });
  }
  return out;
}
