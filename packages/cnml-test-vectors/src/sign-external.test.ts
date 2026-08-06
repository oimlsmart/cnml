/**
 * Specs for signCnmlXmlExternal (TODO.ops/14 tail) — the two-phase
 * XMLDSig assembly: the SignedInfo is built and canonicalized HERE,
 * the signature produced ELSEWHERE (a threshold quorum, an HSM, any
 * key that never exists locally). The signer receives the canonical
 * SignedInfo bytes and returns the raw r‖s ECDSA signature; the
 * assembly inserts it as SignatureValue. The result verifies through
 * the same xmldsigjs path as a locally-signed document.
 *
 * Run: pnpm --filter @oiml/cnml-test-vectors test
 */
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

globalThis.self = globalThis;
globalThis.window = globalThis;
import * as xmldomNS from "@xmldom/xmldom";
const xmldomP = xmldomNS as any;
globalThis.DOMParser = xmldomP.DOMParser;
globalThis.XMLSerializer = xmldomP.XMLSerializer;
globalThis.Element = xmldomP.Element;
globalThis.Node = xmldomP.Node;
globalThis.document = new xmldomP.DOMImplementation().createDocument(null, "html", null);

// Dynamic imports AFTER the polyfills: xmldsigjs registers its (and
// pkijs's) WebCrypto engine at module load when `self` exists — a
// static import here would load it before the polyfill block runs and
// every pkijs call would fail with "Unable to create WebCrypto object".
let certToCnmlXml: typeof import("../../cnml-xml/src/index.ts").certToCnmlXml;
let signCnmlXmlExternal: typeof import("../../cnml-crypto/src/xml/sign-external.ts").signCnmlXmlExternal;
let signCnmlXml: typeof import("../../cnml-crypto/src/xml/sign.ts").signCnmlXml;
let verifyCnmlXml: typeof import("../../cnml-crypto/src/xml/verify.ts").verifyCnmlXml;
let issueSelfSignedCert: typeof import("../../cnml-crypto/src/index.ts").issueSelfSignedCert;

let SAMPLE: string;

before(async () => {
  ({ certToCnmlXml } = await import("../../cnml-xml/src/index.ts"));
  ({ signCnmlXmlExternal } = await import("../../cnml-crypto/src/xml/sign-external.ts"));
  ({ signCnmlXml } = await import("../../cnml-crypto/src/xml/sign.ts"));
  ({ verifyCnmlXml } = await import("../../cnml-crypto/src/xml/verify.ts"));
  ({ issueSelfSignedCert } = await import("../../cnml-crypto/src/index.ts"));
  SAMPLE = certToCnmlXml({
    certificate: { number: "R60/2021-A-XX1-26.01" },
    recommendation: { id: "R60", edition: 2021, scheme: "A" },
  });
});

async function localGroupKey() {
  return crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
}

/** The "quorum" for these tests: a local WebCrypto key standing in for
 *  the group key — it records the canonical bytes it was asked to sign. */
function externalSignerFor(privateKey: CryptoKey, captured: { bytes?: Uint8Array }) {
  return async (canonicalSignedInfo: Uint8Array): Promise<Uint8Array> => {
    captured.bytes = canonicalSignedInfo;
    const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privateKey, canonicalSignedInfo as BufferSource);
    return new Uint8Array(sig);
  };
}

describe("signCnmlXmlExternal (TODO.ops/14 tail)", () => {
  test("an externally-signed document verifies through the standard path", async () => {
    const kp = await localGroupKey();
    // The real contract (spec §4): the group certificate embeds in
    // KeyInfo — the chain IS the identity. (The explicit trustedPublicKey
    // fallback is untestable here: xmldsigjs's Verify({key}) throws on
    // ECDSA keys — 'namedCurve' missing from its EcKeyImportParams — for
    // locally-signed documents too; a pre-existing upstream quirk, never
    // exercised in practice because every CNML document embeds its chain.)
    const pem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "O=OIML SMART, CN=Quorum group key, C=XX");
    const captured: { bytes?: Uint8Array } = {};
    const signed = await signCnmlXmlExternal(SAMPLE, externalSignerFor(kp.privateKey, captured), pem);
    const result = await verifyCnmlXml(signed);
    assert.equal(result.signaturePresent, true);
    assert.equal(result.signatureValid, true, result.reason);
  });

  test("the signer receives the canonical SignedInfo (the documented shape)", async () => {
    const kp = await localGroupKey();
    const captured: { bytes?: Uint8Array } = {};
    await signCnmlXmlExternal(SAMPLE, externalSignerFor(kp.privateKey, captured));
    assert.ok(captured.bytes, "the signer was called");
    const text = new TextDecoder().decode(captured.bytes);
    // Inclusive C14N of the SignedInfo element (mirrors the local path's
    // emitted CanonicalizationMethod), with the enveloped + exc-c14n
    // reference transforms and the ecdsa-sha256 signature method.
    assert.match(text, /^<ds:SignedInfo[ >]/);
    assert.match(text, /CanonicalizationMethod Algorithm="http:\/\/www\.w3\.org\/TR\/2001\/REC-xml-c14n-20010315"/);
    assert.match(text, /SignatureMethod Algorithm="http:\/\/www\.w3\.org\/2001\/04\/xmldsig-more#ecdsa-sha256"/);
    assert.match(text, /Transform Algorithm="http:\/\/www\.w3\.org\/2000\/09\/xmldsig#enveloped-signature"/);
    assert.match(text, /Transform Algorithm="http:\/\/www\.w3\.org\/2001\/10\/xml-exc-c14n#"/);
    assert.match(text, /<\/ds:SignedInfo>$/);
  });

  test("the SignatureValue is the raw 64-byte r‖s, base64 — the document mirrors the local shape", async () => {
    const kp = await localGroupKey();
    const signed = await signCnmlXmlExternal(SAMPLE, externalSignerFor(kp.privateKey, {}));
    const m = /<ds:SignatureValue>([^<]+)<\/ds:SignatureValue>/.exec(signed);
    assert.ok(m?.[1], "SignatureValue present");
    assert.equal(Buffer.from(m[1], "base64").length, 64);
    assert.match(signed, /<ds:Signature Id="cnml-signature">/);
  });

  test("the KeyInfo chain embeds and the document verifies against it", async () => {
    const kp = await localGroupKey();
    const pem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "O=OIML SMART, CN=Quorum group key, C=XX");
    const signed = await signCnmlXmlExternal(SAMPLE, externalSignerFor(kp.privateKey, {}), pem);
    assert.match(signed, /<ds:X509Certificate>/);
    const result = await verifyCnmlXml(signed);
    assert.equal(result.signatureValid, true, result.reason);
  });

  test("a tamper after external signing fails verification", async () => {
    const kp = await localGroupKey();
    const pem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "O=OIML SMART, CN=Quorum group key, C=XX");
    const signed = await signCnmlXmlExternal(SAMPLE, externalSignerFor(kp.privateKey, {}), pem);
    const tampered = signed.replace("R60/2021-A-XX1-26.01", "R60/2021-A-XX1-99.99");
    const result = await verifyCnmlXml(tampered);
    assert.equal(result.signatureValid, false);
  });

  test("locally-signed and externally-signed documents both verify (one shape)", async () => {
    const kp = await localGroupKey();
    const pem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "O=OIML SMART, CN=One shape, C=XX");
    const local = await signCnmlXml(SAMPLE, kp.privateKey, pem);
    const external = await signCnmlXmlExternal(SAMPLE, externalSignerFor(kp.privateKey, {}), pem);
    for (const doc of [local, external]) {
      const result = await verifyCnmlXml(doc);
      assert.equal(result.signatureValid, true, result.reason);
    }
  });
});
