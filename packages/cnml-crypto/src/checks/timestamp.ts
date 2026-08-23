import type { Check, CheckResult } from "./types.ts";
import { extractTimestampFromXml, verifyTimestampProof } from "../opentimestamps.ts";

/** The relay's verify answer (the instance's /api/cnml/timestamp/verify
 *  route): the calendar-facing legs (the pending proof's upgrade query,
 *  the attested proof's block-time resolution) run server-side so the
 *  browser never cross-posts to third-party calendars. */
interface OtsRelayAnswer {
  status: "attested" | "pending";
  calendars?: string[];
  blockHeight?: number;
  /** The Bitcoin block time (ISO), resolved by the relay best-effort. */
  attestedAt?: string;
  /** The matured detached proof (base64) when the relay found the
   *  calendar's upgrade — the caller persists it (the lazy upgrade). */
  upgradedProof?: string;
  note?: string;
}

/** Check 8: the OpenTimestamps time attestation. REQUIRED in CNML: a
 *  signed document carries its proof inside the signature container.
 *
 *  The verdicts:
 *    - attested proof          → pass (block height + time + calendar named);
 *    - pending proof           → pending (the attestation is in flight —
 *                                not a pass, not a fail; the calendars named;
 *                                the relay's upgrade query may mature it on
 *                                the spot, then the upgraded proof rides in
 *                                details.upgradedProof for the caller to
 *                                persist);
 *    - no proof, required      → fail (the mandate stated);
 *    - no proof, legacy        → skip, the legacy mark (a record signed
 *                                before the mandate; the verifier declared
 *                                the posture via ctx.timestampPosture);
 *    - proof commits elsewhere → fail (the document changed after
 *                                attestation, or the proof was transplanted). */
export const timestampCheck: Check = {
  id: "timestamp",
  label: "8. Blockchain timestamp",
  continueOnFail: true,
  run: async (xml, ctx, prior): Promise<CheckResult> => {
    const extracted = extractTimestampFromXml(xml);
    if (!extracted) {
      // The signature already failed upstream: the attestation leg is
      // moot on a document that does not verify — skip, don't pile on.
      if (prior.some((r) => r.checkId === "signature" && r.status === "fail")) {
        return {
          checkId: "timestamp",
          status: "skip",
          reason: "No <cnml:otsProof>, and the signature already failed — the attestation leg is moot",
        };
      }
      if (ctx.timestampPosture === "legacy") {
        return {
          checkId: "timestamp",
          status: "skip",
          reason:
            "No <cnml:otsProof> — legacy record, signed before time attestation became mandatory in CNML; re-sign to attest the signing time",
        };
      }
      return {
        checkId: "timestamp",
        status: "fail",
        reason:
          "No <cnml:otsProof> in CNML — time attestation is required: the document was signed without attestation, or the proof was stripped",
      };
    }
    ctx.hasTimestamp = true;

    const verdict = await verifyTimestampProof(xml, extracted.proof);
    if (verdict.status === "invalid") {
      return {
        checkId: "timestamp",
        status: "fail",
        reason: `The embedded OTS proof does not parse: ${verdict.reason ?? "malformed"}`,
      };
    }
    if (verdict.status === "digest-mismatch") {
      return {
        checkId: "timestamp",
        status: "fail",
        reason: `The OTS proof commits to ${verdict.committedDigestHex ?? "another digest"} — not to this document; the document changed after attestation, or the proof was transplanted`,
      };
    }

    // The relay legs: the pending proof's upgrade query, and the
    // attested proof's block-time resolution. Both honest degradations:
    // unreachable relay ⇒ the local verdict stands. The digest sent is
    // the proof's own committed digest (verified above to be this
    // document's stripped form).
    const relay = async (): Promise<OtsRelayAnswer | null> => {
      if (!ctx.otsVerifyUrl || !verdict.committedDigestHex) return null;
      try {
        const res = await (ctx.fetchImpl ?? fetch)(ctx.otsVerifyUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ digest: verdict.committedDigestHex, proof: extracted.proof }),
        });
        if (!res.ok) return null;
        return (await res.json()) as OtsRelayAnswer;
      } catch {
        return null;
      }
    };

    if (verdict.status === "attested") {
      const answer = await relay();
      const height = answer?.blockHeight ?? verdict.blockHeight;
      const time = answer?.attestedAt ? `, block time ${answer.attestedAt}` : "";
      const via = answer?.calendars?.length ? ` via ${answer.calendars.join(", ")}` : "";
      const note = answer?.note ? ` (${answer.note})` : "";
      return {
        checkId: "timestamp",
        status: "pass",
        reason: `Anchored to Bitcoin block ${height ?? "?"}${time}${via}${note}`,
      };
    }

    // pending locally: the relay may find the calendar's upgrade now.
    const answer = await relay();
    if (answer?.status === "attested" && answer.upgradedProof) {
      const height = answer.blockHeight;
      const time = answer.attestedAt ? `, block time ${answer.attestedAt}` : "";
      const via = answer.calendars?.length ? ` via ${answer.calendars.join(", ")}` : "";
      return {
        checkId: "timestamp",
        status: "pass",
        reason: `Anchored to Bitcoin block ${height ?? "?"}${time}${via} (the pending proof matured at verify time)`,
        details: { upgradedProof: answer.upgradedProof },
      };
    }
    const calendars = (answer?.calendars?.length ? answer.calendars : verdict.calendars).join(", ");
    const relayNote = ctx.otsVerifyUrl && answer === null
      ? "; the timestamp relay could not be reached — the upgrade check retries on a later read"
      : "";
    return {
      checkId: "timestamp",
      status: "pending",
      reason: `Timestamp attestation in flight — submitted to ${calendars || "the calendar"}; the proof upgrades once the calendar anchors its aggregation into a Bitcoin block (minutes to hours)${relayNote}`,
    };
  },
};
