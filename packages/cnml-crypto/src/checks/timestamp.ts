import type { Check, CheckResult } from "./types.ts";
import { extractTimestampFromXml, verifyTimestamp } from "../opentimestamps.ts";

/** Check 6: OpenTimestamps proof. If the CNML carries an embedded OTS
 *  proof, verify it against the Bitcoin chain. If absent, return "skip"
 *  (timestamps are optional — many CNMLs won't have them). */
export const timestampCheck: Check = {
  id: "timestamp",
  label: "8. Blockchain timestamp",
  continueOnFail: true,
  run: async (xml, ctx): Promise<CheckResult> => {
    const extracted = extractTimestampFromXml(xml);
    if (!extracted) {
      return {
        checkId: "timestamp",
        status: "skip",
        reason: "No <cnml:otsProof> in CNML — timestamp optional",
      };
    }
    ctx.hasTimestamp = true;
    try {
      const result = await verifyTimestamp(xml, extracted.proof);
      if (result.status === "anchored" && result.timestamp) {
        return {
          checkId: "timestamp",
          status: "pass",
          reason: `Anchored to Bitcoin block ${result.blockHeight ?? "?"} (~${result.timestamp.toISOString().slice(0, 10)})`,
        };
      }
      if (result.status === "pending") {
        return {
          checkId: "timestamp",
          status: "warn",
          reason: "Timestamp submitted but not yet anchored (try in 1-2 hours)",
        };
      }
      return {
        checkId: "timestamp",
        status: "warn",
        reason: "Timestamp verification failed (proof may be invalid)",
      };
    } catch (e) {
      return {
        checkId: "timestamp",
        status: "warn",
        reason: `Could not verify timestamp: ${(e as Error).message}`,
      };
    }
  },
};
