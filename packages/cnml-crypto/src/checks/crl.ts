import type { Check, CheckResult } from "./types.ts";
import { isSerialRevoked, isCrlStale, type Crl } from "../crl.ts";

/** Check 5: CRL revocation status. Currently a stub — full impl needs
 *  the CDN client (TODO 04) to fetch the issuer's CRL. Once fetched,
 *  check whether the cert's serial appears in the revoked list.
 *
 *  Today: returns "skip" with a note that CRL checking is pending.
 *  Tomorrow: fetches via cdn.fetchCrl(issuerFingerprint), parses,
 *  checks. */
export const crlCheck: Check = {
  id: "crl",
  label: "5. Not revoked",
  continueOnFail: true,
  run: async (_xml, ctx): Promise<CheckResult> => {
    if (!ctx.trustedCerts?.length) {
      return {
        checkId: "crl",
        status: "skip",
        reason: "No issuer cert — cannot determine CRL endpoint",
      };
    }
    // TODO: once TODO 04 (CDN client) lands, fetch the CRL via:
    //   const crl = await cdn.fetchCrl(issuerFingerprint);
    //   const parsed = await parseCrl(crl);
    //   const revoked = isSerialRevoked(certSerial, parsed);
    //   if (revoked) return { checkId: "crl", status: "fail", reason: ... };
    //   if (isCrlStale(parsed)) return { checkId: "crl", status: "warn", reason: ... };
    return {
      checkId: "crl",
      status: "skip",
      reason: "CRL fetch not yet wired (TODO 04 CDN client pending)",
    };
  },
};

// Exported for tests that want to exercise the CRL check with a stub.
export async function checkRevocation(
  certSerial: string,
  crl: Crl,
): Promise<CheckResult> {
  const revoked = isSerialRevoked(certSerial, crl);
  if (revoked) {
    return {
      checkId: "crl",
      status: "fail",
      reason: `Certificate revoked on ${revoked.revocationDate.toISOString()} (${revoked.reason ?? "unspecified"})`,
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
}
