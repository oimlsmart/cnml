/**
 * CNML format version extraction and compatibility checking.
 *
 * The version is encoded in the XML namespace URI:
 *   https://oimlsmart.org/schemas/cnml/1.0  →  major=1, minor=0
 *   https://oimlsmart.org/schemas/cnml/1.5  →  major=1, minor=0
 *   https://oimlsmart.org/schemas/cnml/2.0  →  major=2, minor=0
 *
 * Compatibility rule (W3C convention):
 *   - Same major = compatible (newer minor fields are gracefully ignored)
 *   - Different major = incompatible (semantic break, refuse)
 */

export interface CnmlVersion {
  major: number;
  minor: number;
  /** The full namespace URI as it appears in the XML. */
  namespaceUri: string;
}

/** The version this verifier implementation supports. */
export const SUPPORTED_VERSION: CnmlVersion = {
  major: 1,
  minor: 0,
  namespaceUri: "https://oimlsmart.org/schemas/cnml/1.0",
};

const NS_PATTERN = /https:\/\/oimlsmart\.org\/schemas\/cnml\/(\d+)\.(\d+)/;

/**
 * Extract the CNML format version from a raw XML string by finding
 * the namespace URI on the root element.
 *
 * @param xml raw CNML XML string
 * @returns parsed version, or null if no CNML namespace found
 */
export function parseVersion(xml: string): CnmlVersion | null {
  const match = xml.match(NS_PATTERN);
  if (!match) return null;
  return {
    major: parseInt(match[1]!, 10),
    minor: parseInt(match[2]!, 10),
    namespaceUri: match[0],
  };
}

/**
 * Check if version A is compatible with version B.
 * Same major = compatible (forward/backward within the same major).
 * Different major = incompatible.
 *
 * @param a first version (e.g., the document's)
 * @param b second version (e.g., the verifier's supported version)
 * @returns true if they're compatible
 */
export function isCompatible(a: CnmlVersion, b: CnmlVersion): boolean {
  return a.major === b.major;
}

/**
 * Compare two versions. Returns:
 *   -1 if a < b
 *    0 if a == b
 *   +1 if a > b
 */
export function compareVersions(a: CnmlVersion, b: CnmlVersion): number {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1;
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
  return 0;
}

/**
 * Human-readable compatibility verdict for a document version against
 * this verifier's supported version.
 */
export function compatibilityVerdict(
  docVersion: CnmlVersion | null,
  supported: CnmlVersion = SUPPORTED_VERSION,
): { status: "ok" | "warn" | "fail"; reason: string } {
  if (!docVersion) {
    return {
      status: "warn",
      reason: "Could not determine CNML format version from namespace URI",
    };
  }
  if (docVersion.major > supported.major) {
    return {
      status: "fail",
      reason: `CNML format ${docVersion.major}.${docVersion.minor} is newer than this verifier supports (${supported.major}.${supported.minor}). Please update.`,
    };
  }
  if (docVersion.major < supported.major) {
    return {
      status: "warn",
      reason: `CNML format ${docVersion.major}.${docVersion.minor} is a legacy version. This verifier targets ${supported.major}.${supported.minor}.`,
    };
  }
  if (docVersion.minor > supported.minor) {
    return {
      status: "warn",
      reason: `CNML format ${docVersion.major}.${docVersion.minor} contains newer fields. Verifier supports ${supported.major}.${supported.minor} — unknown fields will be ignored.`,
    };
  }
  return { status: "ok", reason: `Format ${docVersion.major}.${docVersion.minor} matches supported version` };
}
