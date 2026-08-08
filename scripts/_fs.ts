/**
 * Shared filesystem utilities for build scripts.
 *
 * The `_` prefix marks shared script modules (same convention as
 * _gzip.ts). These are imported by scripts/ and test files that
 * walk the build output.
 */

import { readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

/**
 * Recursively walk a directory tree and return every file whose
 * extension matches `ext` (including the dot, e.g. ".html").
 * Returns an empty array if the directory does not exist.
 */
export function walkDir(dir: string, ext: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walkDir(p, ext, out);
    else if (extname(p) === ext) out.push(p);
  }
  return out;
}
