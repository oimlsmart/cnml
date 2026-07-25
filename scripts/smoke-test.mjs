// Polyfill self BEFORE importing xmldsigjs so it auto-registers WebCrypto.
globalThis.self = globalThis;
globalThis.window = globalThis;
// crypto is read-only on Node 24 — but globalThis.crypto already works in node

// Polyfill DOMParser/XMLSerializer for Node
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
globalThis.DOMParser = DOMParser;
globalThis.XMLSerializer = XMLSerializer;

// Import after polyfills are in place
const { signCnmlXml, verifyCnmlXml, issueSelfSignedCert } = await import("../packages/cnml-crypto/src/index.ts");

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<cnml:certificatNumeriqueMetrologieLegale xmlns:cnml="https://oimlsmart.org/schemas/cnml/1.0">
  <cnml:administrativeData>
    <cnml:coreData><cnml:identifications><cnml:oimlNumber>R60/2021-A-NL1-26.12</cnml:oimlNumber></cnml:identifications></cnml:coreData>
  </cnml:administrativeData>
</cnml:certificatNumeriqueMetrologieLegale>`;

const kp = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-256" },
  true, ["sign", "verify"]
);

const certPem = await issueSelfSignedCert(kp.publicKey, kp.privateKey, "O=Test Issuer, CN=Test Signer, C=NL");
console.log("Cert generated (length):", certPem.length);

const signedXml = await signCnmlXml(sampleXml, kp.privateKey, certPem);
console.log("Signed XML length:", signedXml.length);
console.log("Has Signature element:", signedXml.includes("Signature"));
console.log("Has X509Certificate:", signedXml.includes("X509Certificate"));
console.log("Has SignatureValue:", signedXml.includes("SignatureValue"));
console.log("Has DigestValue:", signedXml.includes("DigestValue"));

const result = await verifyCnmlXml(signedXml);
console.log("Verify result:", JSON.stringify(result, null, 2));

if (!result.signatureValid) {
  console.error("FAILED: signature not valid");
  process.exit(1);
}
console.log("OK — sign+verify round trip with real xmldsigjs succeeded");
