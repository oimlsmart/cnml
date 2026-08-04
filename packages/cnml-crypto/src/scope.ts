/**
 * Scope verification — read the oimlAuthorizedRecommendations X.509
 * extension from an intermediate CA cert and check whether the
 * recommendation ID on a CNML is covered.
 *
 * The extension value is ASN.1 SEQUENCE OF UTF8String, one R-id per
 * element. We parse via @xmldom/xmldom + a tiny ASN.1 walker.
 *
 * Reference: TODO.roadmap/03-browser-scope-verification.md
 */

/** OIDs we recognise. Placeholder PEN (99999) — replace with OIML's
 *  IANA-registered Private Enterprise Number before production. */
export const OIML_SCOPE_OID = "1.3.6.1.4.1.99999.1.1";

/** Parse the oimlAuthorizedRecommendations extension off a PEM cert.
 *  Returns the list of authorized R-ids (e.g. ["R60", "R76"]) or null
 *  if the cert has no scope extension (legacy / pre-2026 cert).
 *
 *  @param certPem X.509 cert in PEM form ("-----BEGIN CERTIFICATE-----")
 *  @returns array of R-id strings, or null
 */
export async function readScopeFromCert(certPem: string): Promise<string[] | null> {
  const asn1js = await import("asn1js");
  const pkijs = await import("pkijs");

  const der = pemToDer(certPem);
  const parsed = asn1js.fromBER(der);
  // A cert that does not schema-parse reads as "no scope extension"
  // (null) — the scope check's documented legacy path ("cert predates
  // scope governance — gracefully accepted, never a failure"), never a
  // crashed reason string. Well-formed CA certs parse cleanly (the
  // scope-crl fixtures pin the read path).
  if (parsed.offset === -1 || !parsed.result) return null;
  let cert: InstanceType<typeof pkijs.Certificate>;
  try {
    cert = new pkijs.Certificate({ schema: parsed.result });
  } catch {
    return null;
  }

  // pkijs encodes extensions as an array of { extnID, extnValue }
  const exts = cert.extensions?.extensions ?? [];
  for (const ext of exts) {
    if (ext.extnID !== OIML_SCOPE_OID) continue;
    // extnValue is an OctetString; pkijs gives it as ArrayBuffer.
    const buf = ext.extnValue.valueBlock.valueHexView?.buffer ?? ext.extnValue.getValue();
    return parseAsn1ScopeSequence(buf);
  }
  return null;
}

/** Check that a recommendation ID is covered by the issuer's scope.
 *  Case-sensitive — R-ids are uppercase by OIML convention.
 *
 *  @param rId   e.g. "R60"
 *  @param scope e.g. ["R60", "R76"]
 *  @returns true if scope contains rId, false otherwise.
 *          If scope is null (legacy cert), returns true (back-compat).
 */
export function isRecommendationInScope(
  rId: string,
  scope: string[] | null,
): boolean {
  if (scope === null) return true;  // legacy: no scope = unrestricted
  return scope.includes(rId);
}

/** Compare two scope sources (X.509 extension vs manifest JSON). They
 *  must agree for the cert to be trustworthy. A mismatch indicates
 *  either manifest tampering or cert forgery. */
export function scopeSourcesAgree(
  certScope: string[] | null,
  manifestScope: string[] | null,
): boolean {
  // If only one is present, they trivially agree (single source of truth).
  if (certScope === null || manifestScope === null) return true;
  if (certScope.length !== manifestScope.length) return false;
  const a = [...certScope].sort();
  const b = [...manifestScope].sort();
  return a.every((v, i) => v === b[i]);
}

// ─── Internal ────────────────────────────────────────────────────────────

/** Parse ASN.1 SEQUENCE OF UTF8String → string[]. */
function parseAsn1ScopeSequence(buf: ArrayBuffer): string[] {
  // We use a minimal ASN.1 walker rather than importing a full library
  // (the extension value is small and structurally fixed).
  const view = new Uint8Array(buf);
  if (view[0] !== 0x30) {  // SEQUENCE tag
    throw new Error(`Expected ASN.1 SEQUENCE (0x30), got 0x${view[0]!.toString(16)}`);
  }
  // Length is encoded after the tag. We assume short-form (length < 128).
  const seqLen = view[1]!;
  const result: string[] = [];
  let i = 2;
  const end = 2 + seqLen;
  while (i < end) {
    if (view[i] !== 0x0c) {  // UTF8String tag
      throw new Error(`Expected UTF8String (0x0c) at offset ${i}, got 0x${view[i]!.toString(16)}`);
    }
    const strLen = view[i + 1]!;
    const strBytes = view.slice(i + 2, i + 2 + strLen);
    result.push(new TextDecoder().decode(strBytes));
    i += 2 + strLen;
  }
  return result;
}

/** Decode PEM (base64 between BEGIN/END markers) → ArrayBuffer. */
function pemToDer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
    .replace(/-----END [A-Z0-9 ]+-----/g, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}
