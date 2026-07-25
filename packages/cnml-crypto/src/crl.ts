/**
 * CRL (Certificate Revocation List) parser + revocation check.
 *
 * RFC 5280 §5 structure:
 *
 *   CertificateList ::= SEQUENCE {
 *       tbsCertList          TBSCertList,
 *       signatureAlgorithm   AlgorithmIdentifier,
 *       signatureValue       BIT STRING
 *   }
 *
 *   TBSCertList ::= SEQUENCE {
 *       version            Version OPTIONAL,  -- 0 = v1
 *       signature          AlgorithmIdentifier,
 *       issuer             Name,
 *       thisUpdate         Time,
 *       nextUpdate         Time OPTIONAL,
 *       revokedCertificates SEQUENCE OF SEQUENCE {
 *           userCertificate   CertificateSerialNumber,
 *           revocationDate    Time,
 *           crlEntryExtensions Extensions OPTIONAL
 *       } OPTIONAL,
 *       crlExtensions      [0] EXPLICIT Extensions OPTIONAL
 *   }
 *
 * We use pkijs's CertificateRevocationList which already handles this
 * format correctly. Our wrapper provides a typed interface + a
 * revocation check that returns the matching entry (with reason) or
 * null.
 */

export interface RevocationEntry {
  /** Hex serial number, uppercase, no leading "0x". */
  serial: string;
  revocationDate: Date;
  /** Reason code if present (RFC 5280 §5.3.1). */
  reason?: string;
}

export interface Crl {
  issuer: string;        // RFC 4514 DN string
  lastUpdate: Date;
  nextUpdate: Date | null;
  revoked: RevocationEntry[];
}

/** Parse a DER-encoded CRL into a structured object. */
export async function parseCrl(derBuffer: ArrayBuffer): Promise<Crl> {
  const asn1js = await import("asn1js");
  const pkijs = await import("pkijs");
  const asn1 = asn1js.fromBER(derBuffer);
  const crl = new pkijs.CertificateRevocationList({ schema: asn1 });

  const revoked: RevocationEntry[] = (crl.revokedCertificates ?? []).map((e: any) => ({
    serial: bigIntToHex(e.userCertificate),
    revocationDate: new Date(e.revocationDate.value.valueOf()),
    reason: readReasonCode(e.crlEntryExtensions),
  }));

  return {
    issuer: crl.issuer.typesAndValues
      .map((t: any) => `${t.type}=${t.value.valueBlock.value}`)
      .join(", "),
    lastUpdate: new Date(crl.thisUpdate.value.valueOf()),
    nextUpdate: crl.nextUpdate ? new Date(crl.nextUpdate.value.valueOf()) : null,
    revoked,
  };
}

/** Find a serial in the CRL. Returns the entry if revoked, null otherwise.
 *  Both serials are normalized to uppercase hex without "0x" prefix. */
export function isSerialRevoked(
  serial: string,
  crl: Crl,
): RevocationEntry | null {
  const norm = normalizeSerial(serial);
  for (const entry of crl.revoked) {
    if (normalizeSerial(entry.serial) === norm) return entry;
  }
  return null;
}

/** True if the CRL's nextUpdate has passed (it's stale). Verifiers should
 *  warn but not fail on stale CRLs (offline verifier may have an old cache). */
export function isCrlStale(crl: Crl, now: Date = new Date()): boolean {
  if (!crl.nextUpdate) return false;
  return crl.nextUpdate.getTime() < now.getTime();
}

/** RFC 5280 §5.3.1 reason codes → human-readable strings. */
const REASON_CODES: Record<string, string> = {
  "0": "unspecified",
  "1": "keyCompromise",
  "2": "cACompromise",
  "3": "affiliationChanged",
  "4": "superseded",
  "5": "cessationOfOperation",
  "6": "certificateHold",
  "8": "removeFromCRL",
  "9": "privilegeWithdrawn",
  "10": "aACompromise",
};

// ─── Internal ────────────────────────────────────────────────────────────

function bigIntToHex(value: any): string {
  // pkijs gives the serial as a BigInteger. Convert to uppercase hex.
  const hex = value.toString(16).toUpperCase();
  return hex.length % 2 === 0 ? hex : "0" + hex;
}

function normalizeSerial(s: string): string {
  return s.replace(/^0x/i, "").replace(/[^0-9A-F]/gi, "").toUpperCase();
}

function readReasonCode(extensions: any): string | undefined {
  if (!extensions || !extensions.extensions) return undefined;
  for (const ext of extensions.extensions) {
    if (ext.extnID === "2.5.29.21") {  // id-ce-cRLReasons
      const view = ext.extnValue.valueBlock.valueHexView;
      // Reason code is an ENUMERATED — one byte after ASN.1 framing.
      // We do a minimal decode (tag 0x0a, length, value).
      const bytes = new Uint8Array(view.buffer);
      if (bytes.length >= 3 && bytes[0] === 0x0a) {
        return REASON_CODES[String(bytes[2])] ?? "unspecified";
      }
    }
  }
  return undefined;
}
