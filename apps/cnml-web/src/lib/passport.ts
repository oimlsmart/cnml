/**
 * Shared passport document model (TODO.cnml/25).
 *
 * The HTML passport page and the JSON-LD endpoint both render the
 * same underlying document. Centralizing the shape here keeps the
 * two representations in sync — a single source of truth for the
 * passport contract.
 *
 * In the static build the only identifier served is the demo
 * instance. Production deployments replace `passportDocumentFor`
 * with a lookup against the transparency log + instance cert store.
 */

export interface PassportDevice {
  manufacturer: string | null;
  model: string | null;
  serial: string | null;
}

export interface PassportChainEntry {
  tier: number;
  role: "instance" | "model" | "ia" | "biml-root";
  fingerprint: string | null;
}

export interface PassportDocument {
  "@context": "https://www.oimlsmart.org/cnml/passport/v1";
  "@type": "MetrologicalCertificatePassport";
  certificateId: string;
  device: PassportDevice;
  chain: PassportChainEntry[];
  status: "valid" | "revoked" | "expired";
  statusCheckedAt: string;
  verify: string;
}

export const PASSPORT_CONTEXT = "https://www.oimlsmart.org/cnml/passport/v1";
export const PASSPORT_TYPE = "MetrologicalCertificatePassport";

export function passportVerifyUrl(certId: string): string {
  return `https://www.oimlsmart.org/cnml/verify?cert=${encodeURIComponent(certId)}`;
}

export function passportDocumentFor(certId: string, statusCheckedAt: string): PassportDocument {
  return {
    "@context": PASSPORT_CONTEXT,
    "@type": PASSPORT_TYPE,
    certificateId: certId,
    device: {
      manufacturer: null,
      model: null,
      serial: null,
    },
    chain: [
      { tier: 5, role: "instance", fingerprint: null },
      { tier: 4, role: "model", fingerprint: null },
      { tier: 3, role: "ia", fingerprint: null },
      { tier: 1, role: "biml-root", fingerprint: null },
    ],
    status: "valid",
    statusCheckedAt,
    verify: passportVerifyUrl(certId),
  };
}
