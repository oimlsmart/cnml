/**
 * Small display utilities shared across islands.
 */

/** Truncate a SHA-256 fingerprint hex string to its first 24 chars + ellipsis. */
export function fingerprintShort(fp: string): string {
  return fp.slice(0, 24) + "…";
}

/** Format a creation/add timestamp as a localized string. */
export function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleString();
}
