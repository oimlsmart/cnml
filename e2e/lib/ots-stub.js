/**
 * The OTS stub calendar for e2e (the declared test posture — the same
 * doctrine as the smart platform's relay stub): time attestation is
 * REQUIRED in CNML, so the sign flow always stamps; the suite never
 * depends on a live calendar. This intercepts the calendar protocol's
 * POST <calendar>/digest and answers a syntactically valid PENDING
 * timestamp naming the reserved-TLD stub origin (ots-stub.test) — a
 * test attestation, clearly marked, never anchored.
 *
 * The wire bytes (the OTS Timestamp serialization, one leaf): the
 * 0x00 attestation marker, the PendingAttestation tag, then the
 * payload as varbytes(varbytes(uri)). Built by hand in plain JS — the
 * suite's specs are plain node, no TS imports.
 */

const PENDING_TAG = [0x83, 0xdf, 0xe3, 0x0d, 0x2e, 0xf9, 0x0c, 0x8e];

/** The stub calendar's URI (the pending attestation names it). */
export const OTS_STUB_URI = "https://ots-stub.test/calendar";

/** Install the interception on a browser context (or page): every
 *  calendar's /digest answers the pending timestamp over the posted
 *  digest; /timestamp/<hex> answers 404 (never anchored — the upgrade
 *  posture stays "in flight"). */
export async function stubOtsCalendars(target) {
  await target.route("**/digest", (route) => {
    const uri = new TextEncoder().encode(OTS_STUB_URI);
    const payload = [uri.length, ...uri];
    const body = [0x00, ...PENDING_TAG, payload.length, ...payload];
    route.fulfill({
      status: 200,
      contentType: "application/vnd.opentimestamps.v1",
      body: Buffer.from(body),
    });
  });
  await target.route("**/timestamp/*", (route) =>
    route.fulfill({ status: 404, body: "not yet anchored (the stub never anchors)" }),
  );
}
