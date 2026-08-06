/**
 * Tiny gzip helper — uses the system `gzip` command so we measure
 * what a browser with Content-Encoding: gzip actually receives.
 * The zopfli-quality constant from zlib would also work but gzip
 * matches the deployed CDN behaviour more closely.
 */

import { execSync } from "node:child_process";

export function gzipSize(buf: Buffer): number {
  // -c writes to stdout; -9 is the highest standard gzip level.
  // The browser does not negotiate gzip -9 specifically, but the
  // ratio is close enough for budget purposes.
  const result = execSync("gzip -c -9", { input: buf, maxBuffer: 50 * 1024 * 1024 });
  return result.length;
}
