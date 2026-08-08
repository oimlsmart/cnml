import type { Check, CheckResult } from "./types.ts";
import { isSerialRevoked, isCrlStale, parseCrl, type Crl } from "../crl.ts";
import { toHex } from "../shared/hex.ts";

/** Check 5: CRL revocation status.
 *
 * The signing cert (the KeyInfo's first, fed through ctx.trustedCerts
 * by the signature check) names its CRL distribution point as an X.509
 * extension; the check fetches the current CRL there and looks up the
 * cert's serial. Honest postures, never silent:
 *   no CRL DP on the cert  → skip (leg-1/self-signed certs carry none)
 *   CRL fetch fails        → warn (distinct from revoked — a network
 *                            posture, never a verdict)
 *   serial in the CRL      → fail (revoked, with the date + reason)
 *   CRL past nextUpdate    → warn (stale — refresh recommended)
 *   serial absent          → pass
 * `ctx.crlUrl` overrides the DP (tests, an explicit distribution
 * point for deployments whose cert predates the extension). */
export const crlCheck: Check = {
  id: "crl",
  label: "5. Not revoked",
  continueOnFail: true,
  run: async (_xml, ctx): Promise<CheckResult> => {
    const certPem = ctx.trustedCerts?.[0];
    if (!certPem) {
      return {
        checkId: "crl",
        status: "skip",
        reason: "No issuer cert in CNML <ds:KeyInfo> — no CRL to check against",
      };
    }

    let serial: string;
    let crlUrl: string | null = ctx.crlUrl ?? null;
    try {
      const parsed = await readCrlFieldsFromCert(certPem);
      serial = parsed.serial;
      crlUrl = crlUrl ?? parsed.crlUrl;
    } catch (e) {
      return {
        checkId: "crl",
        status: "warn",
        reason: `could not read the issuer cert's CRL fields: ${(e as Error).message}`,
      };
    }

    if (!crlUrl) {
      return {
        checkId: "crl",
        status: "skip",
        reason: "the issuer cert names no CRL distribution point (leg-1/self-signed) — revocation is not yet asserted for this chain",
      };
    }

    let crlDer: ArrayBuffer;
    try {
      const res = await fetch(crlUrl);
      if (!res.ok) {
        return {
          checkId: "crl",
          status: "warn",
          reason: `the CRL at ${crlUrl} answered ${res.status} — revocation state unverified (never a verdict)`,
        };
      }
      crlDer = await res.arrayBuffer();
    } catch (e) {
      return {
        checkId: "crl",
        status: "warn",
        reason: `the CRL at ${crlUrl} is unreachable: ${(e as Error).message} — revocation state unverified`,
      };
    }

    let crl: Crl;
    try {
      crl = await parseCrl(crlDer);
    } catch (e) {
      return {
        checkId: "crl",
        status: "warn",
        reason: `the CRL at ${crlUrl} does not parse: ${(e as Error).message}`,
      };
    }

    const revoked = isSerialRevoked(serial, crl);
    if (revoked) {
      return {
        checkId: "crl",
        status: "fail",
        reason: `certificate revoked on ${revoked.revocationDate.toISOString()} (${revoked.reason ?? "unspecified"})`,
      };
    }
    if (isCrlStale(crl)) {
      return {
        checkId: "crl",
        status: "warn",
        reason: "CRL is past its nextUpdate — refresh recommended",
      };
    }
    return { checkId: "crl", status: "pass" };
  },
};

/** The serial + CRL distribution point off a PEM cert (pkijs). The
 *  serial is the uppercase-hex form isSerialRevoked expects (padded to
 *  even length — bigIntToHex's own discipline). */
export async function readCrlFieldsFromCert(certPem: string): Promise<{ serial: string; crlUrl: string | null }> {
  const asn1js = await import("asn1js");
  const pkijs = await import("pkijs");
  const b64 = certPem.replace(/-----[A-Z ]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;
  const parsed = asn1js.fromBER(der);
  if (parsed.offset === -1 || !parsed.result) {
    throw new Error(`the issuer cert is not a well-formed X.509 (DER parse failed at byte ${-parsed.offset})`);
  }
  const cert = new pkijs.Certificate({ schema: parsed.result });

  const serialBytes: Uint8Array | undefined = cert.serialNumber.valueBlock.valueHexView;
  const rawBytes = serialBytes && serialBytes.length > 1 && serialBytes[0] === 0 ? serialBytes.slice(1) : serialBytes ?? new Uint8Array();
  const raw = toHex(rawBytes).toUpperCase();
  const serial = raw.length % 2 === 0 ? raw : "0" + raw;

  let crlUrl: string | null = null;
  for (const ext of cert.extensions?.extensions ?? []) {
    if (ext.extnID !== "2.5.29.31") continue; // cRLDistributionPoints
    // The extension value contains URIs; read them out of the raw
    // bytes (the DP form the CA's factory writes: "URI:<url>").
    const text = new TextDecoder().decode(ext.extnValue.valueBlock.valueHexView ?? new Uint8Array());
    const match = /URI:([^\s,]+)/.exec(text) ?? /(https?:\/\/[^\s,]+)/.exec(text);
    if (match) crlUrl = match[1]!;
  }
  return { serial, crlUrl };
}
