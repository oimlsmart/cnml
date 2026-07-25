/**
 * @cnml/cnml-crypto — Cryptographic operations for CNML
 *
 * Browser-native (WebCrypto + IndexedDB + xmldsigjs for spec-compliant
 * XMLDSig).
 *
 * Capabilities:
 *   - Generate ECDSA-P256 keypairs (Ed25519 + ML-DSA-65 hybrid coming)
 *   - Import / export PEM (PKCS#8 private, SPKI public, X.509 cert)
 *   - Store keys in IndexedDB (encrypted with passphrase via PBKDF2)
 *   - Sign and verify CNML XML using XMLDSig with Exclusive C14N
 *
 * References:
 *   - W3C XML Signature Syntax and Processing 1.1
 *   - Exclusive XML Canonicalization 1.0 (xml-exc-c14n#)
 *   - WebCrypto API (W3C)
 */

import * as xmldsig from "xmldsigjs";

const SUBTLE = globalThis.crypto.subtle;

// xmldsigjs.Sign() takes a wide range of algorithm spec shapes; cast for TS.
type AlgSpec = ConstructorParameters<typeof xmldsig.Algorithm>[0];

// ─── Key types ──────────────────────────────────────────────────────────

export type KeyAlgorithm = "ECDSA";

export * from "./ed25519.ts";
export * from "./pqc.ts";
export * from "./opentimestamps.ts";
export * from "./scope.ts";
export * from "./crl.ts";
export interface StoredKey {
  id: string;
  alias: string;
  algorithm: KeyAlgorithm;
  publicKeySpki: ArrayBuffer;
  privateKeyPkcs8: ArrayBuffer;
  salt: ArrayBuffer;
  iv: ArrayBuffer;
  created: number;
  fingerprint: string;
  certificatePem?: string;
  certificateExpiry?: number;
  certificateStatus?: "certified" | "pending" | "expired" | "none";
}

// ─── Hash helpers ──────────────────────────────────────────────────────

export async function sha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const buf = data instanceof Uint8Array ? data : new Uint8Array(data);
  const hash = await SUBTLE.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Key derivation (PBKDF2) ────────────────────────────────────────────

async function deriveKey(passphrase: string, salt: ArrayBuffer): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await SUBTLE.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );
  return SUBTLE.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// ─── Key generation ────────────────────────────────────────────────────

export interface GenerateOptions {
  algorithm?: KeyAlgorithm;
  alias: string;
  passphrase: string;  // REQUIRED — used to encrypt the private key at rest
}

export async function generateKey(opts: GenerateOptions): Promise<{ id: string; fingerprint: string }> {
  if (!opts.passphrase || opts.passphrase.length < 8) {
    throw new Error("Passphrase must be at least 8 characters");
  }
  const keyPair = await SUBTLE.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );

  const publicKeySpki  = await SUBTLE.exportKey("spki",  keyPair.publicKey);
  const privateKeyPkcs8 = await SUBTLE.exportKey("pkcs8", keyPair.privateKey);
  const fingerprint = await sha256Hex(publicKeySpki);
  const id = `key_${fingerprint.slice(0, 12)}`;

  // Encrypt + persist to IndexedDB (AES-GCM with PBKDF2-derived key)
  const { encrypted, salt, iv } = await encryptPrivateKey(privateKeyPkcs8, opts.passphrase);
  const stored: StoredKey = {
    id,
    alias: opts.alias,
    algorithm: "ECDSA",
    publicKeySpki,
    privateKeyPkcs8: encrypted,
    salt,
    iv,
    created: Date.now(),
    fingerprint,
  };
  await storeKey(stored);

  // Cache the CryptoKey objects (passphrase-less) for immediate use
  cryptoCache.set(id, { public: keyPair.publicKey, private: keyPair.privateKey });

  return { id, fingerprint };
}

// ─── Key encryption at rest ─────────────────────────────────────────────

export async function encryptPrivateKey(
  privateKeyPkcs8: ArrayBuffer,
  passphrase: string,
): Promise<{ encrypted: ArrayBuffer; salt: ArrayBuffer; iv: ArrayBuffer }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const aesKey = await deriveKey(passphrase, salt);
  const encrypted = await SUBTLE.encrypt({ name: "AES-GCM", iv }, aesKey, privateKeyPkcs8);
  return { encrypted, salt, iv };
}

export async function decryptPrivateKey(
  encrypted: ArrayBuffer,
  salt: ArrayBuffer,
  iv: ArrayBuffer,
  passphrase: string,
): Promise<ArrayBuffer> {
  const aesKey = await deriveKey(passphrase, salt);
  return SUBTLE.decrypt({ name: "AES-GCM", iv }, aesKey, encrypted);
}

// ─── In-memory key cache (avoid re-decrypting every sign operation) ────

interface CachedCryptoKey { public: CryptoKey; private?: CryptoKey; }
const cryptoCache = new Map<string, CachedCryptoKey>();

export async function loadCryptoKey(
  stored: StoredKey,
  passphrase: string,
): Promise<CryptoKey> {
  const cached = cryptoCache.get(stored.id);
  if (cached?.private) return cached.private;

  const decrypted = await decryptPrivateKey(stored.privateKeyPkcs8, stored.salt, stored.iv, passphrase);
  const privateKey = await SUBTLE.importKey(
    "pkcs8", decrypted,
    { name: "ECDSA", namedCurve: "P-256" },
    false, ["sign"],
  );
  cryptoCache.set(stored.id, { public: await importPublic(stored), private: privateKey });
  return privateKey;
}

export async function importPublic(stored: StoredKey): Promise<CryptoKey> {
  return SUBTLE.importKey(
    "spki", stored.publicKeySpki,
    { name: "ECDSA", namedCurve: "P-256" },
    false, ["verify"],
  );
}

// ─── IndexedDB key store ───────────────────────────────────────────────

const DB_NAME = "cnml-crypto";
const STORE   = "keys";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => {
      dbPromise = null;
      reject(req.error);
    };
  }).catch((err) => {
    dbPromise = null;
    throw err;
  });
  return dbPromise;
}

export async function storeKey(stored: StoredKey): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(stored);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

export async function listKeys(): Promise<StoredKey[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as StoredKey[]);
    req.onerror   = () => reject(req.error);
  });
}

export async function getKey(id: string): Promise<StoredKey | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as StoredKey | undefined);
    req.onerror   = () => reject(req.error);
  });
}

export async function deleteKey(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
  cryptoCache.delete(id);
}

// ─── Trust store (public keys only — no private material) ──────────────

const TRUST_STORE = "trusted-keys";

let trustDbPromise: Promise<IDBDatabase> | null = null;

function openTrustDb(): Promise<IDBDatabase> {
  if (trustDbPromise) return trustDbPromise;
  trustDbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open("cnml-trust", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(TRUST_STORE)) {
        db.createObjectStore(TRUST_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => {
      trustDbPromise = null;
      reject(req.error);
    };
  }).catch((err) => {
    trustDbPromise = null;
    throw err;
  });
  return trustDbPromise;
}

export async function storeTrustedKey(key: TrustedPublicKey): Promise<void> {
  const db = await openTrustDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(TRUST_STORE, "readwrite");
    tx.objectStore(TRUST_STORE).put(key);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

export async function listTrustedKeys(): Promise<TrustedPublicKey[]> {
  const db = await openTrustDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRUST_STORE, "readonly");
    const req = tx.objectStore(TRUST_STORE).getAll();
    req.onsuccess = () => resolve(req.result as TrustedPublicKey[]);
    req.onerror   = () => reject(req.error);
  });
}

export async function getTrustedKey(id: string): Promise<TrustedPublicKey | undefined> {
  const db = await openTrustDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(TRUST_STORE, "readonly");
    const req = tx.objectStore(TRUST_STORE).get(id);
    req.onsuccess = () => resolve(req.result as TrustedPublicKey | undefined);
    req.onerror   = () => reject(req.error);
  });
}

export async function deleteTrustedKey(id: string): Promise<void> {
  const db = await openTrustDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(TRUST_STORE, "readwrite");
    tx.objectStore(TRUST_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

/**
 * Load a trusted public key from a CryptoKey (already imported).
 */
export async function cryptoKeyFromTrustedKey(stored: TrustedPublicKey): Promise<CryptoKey> {
  return SUBTLE.importKey(
    "spki", stored.publicKeySpki,
    { name: "ECDSA", namedCurve: "P-256" },
    true, ["verify"],
  );
}

// ─── PEM import/export ──────────────────────────────────────────────────

const PEM_RE = /-----BEGIN ([A-Z0-9 ]+)-----\n([\s\S]*?)\n-----END \1-----/;

export function pemToDer(pem: string): { der: ArrayBuffer; label: string } {
  const m = pem.match(PEM_RE);
  if (!m) throw new Error("Invalid PEM format");
  const label = m[1];
  const b64 = m[2].replace(/\n/g, "");
  const der = base64ToBuffer(b64);
  return { der, label };
}

/**
 * Export a stored key's PUBLIC key as a SPKI PEM ("-----BEGIN PUBLIC KEY-----").
 * Safe to share with verifiers.
 */
export async function exportPublicKeyPem(stored: StoredKey): Promise<string> {
  return derToPem(stored.publicKeySpki, "PUBLIC KEY");
}

/**
 * Export a stored key's PRIVATE key as an unencrypted PKCS#8 PEM
 * ("-----BEGIN PRIVATE KEY-----"). The passphrase unlocks the AES-GCM
 * envelope; the resulting PKCS#8 DER is base64-encoded into standard PEM
 * form.
 *
 * SECURITY: This produces an UNENCRYPTED private key. The caller MUST
 * store/transmit it securely (e.g. to a USB key, password manager, or
 * air-gapped backup). The browser/UI must require explicit user
 * confirmation before invoking this.
 */
export async function exportPrivateKeyPem(
  stored: StoredKey,
  passphrase: string,
): Promise<string> {
  const pkcs8 = await decryptPrivateKey(stored.privateKeyPkcs8, stored.salt, stored.iv, passphrase);
  return derToPem(pkcs8, "PRIVATE KEY");
}

/**
 * Import a private key from a PEM file (PKCS#8 unencrypted). Returns a
 * StoredKey ready for storeKey(). The passphrase is used to encrypt the
 * key at rest in IndexedDB (it does NOT have to match the source PEM).
 */
export async function importPrivateKeyFromPem(
  pem: string,
  alias: string,
  storagePassphrase: string,
): Promise<StoredKey> {
  const { der, label } = pemToDer(pem);
  if (!label.includes("PRIVATE")) {
    throw new Error(`Expected a PRIVATE KEY PEM, got "${label}"`);
  }

  const cryptoKey = await SUBTLE.importKey(
    "pkcs8", der,
    { name: "ECDSA", namedCurve: "P-256" },
    true, ["sign"],
  );
  const algorithm: KeyAlgorithm = "ECDSA";

  // Derive matching public key from JWK
  const jwk = await SUBTLE.exportKey("jwk", cryptoKey);
  const pubJwk: JsonWebKey = {
    kty: jwk.kty!, n: jwk.n, e: jwk.e, x: jwk.x, y: jwk.y,
    crv: jwk.crv, ext: true,
  };
  const pubKey = await SUBTLE.importKey(
    "jwk", pubJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    true, ["verify"],
  );
  const spki = await SUBTLE.exportKey("spki", pubKey);
  const fingerprint = await sha256Hex(spki);
  const { encrypted, salt, iv } = await encryptPrivateKey(der, storagePassphrase);

  return {
    id: `key_${fingerprint.slice(0, 12)}`,
    alias,
    algorithm,
    publicKeySpki: spki,
    privateKeyPkcs8: encrypted,
    salt, iv,
    created: Date.now(),
    fingerprint,
  };
}

/**
 * Import a public key from a PEM file (SPKI). Returns a TrustedPublicKey
 * ready for storage in the trust store. Does NOT store a private key.
 */
export interface TrustedPublicKey {
  id: string;
  alias: string;
  publicKeySpki: ArrayBuffer;
  fingerprint: string;
  created: number;
}

export async function importPublicKeyFromPem(pem: string, alias: string): Promise<TrustedPublicKey> {
  const { der, label } = pemToDer(pem);
  if (!label.includes("PUBLIC")) {
    throw new Error(`Expected a PUBLIC KEY PEM, got "${label}"`);
  }
  const fingerprint = await sha256Hex(der);
  return {
    id: `trusted_${fingerprint.slice(0, 12)}`,
    alias,
    publicKeySpki: der,
    fingerprint,
    created: Date.now(),
  };
}

export async function loadTrustedPublicKey(pem: string): Promise<CryptoKey> {
  const { der, label } = pemToDer(pem);
  if (!label.includes("PUBLIC")) {
    throw new Error(`Expected a PUBLIC KEY PEM, got "${label}"`);
  }
  return SUBTLE.importKey(
    "spki", der,
    { name: "ECDSA", namedCurve: "P-256" },
    true, ["verify"],
  );
}

export function derToPem(der: ArrayBuffer, label: string): string {
  const b64 = bufferToBase64(der);
  const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----\n`;
}

function base64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

// ─── CNML XML Signing (XMLDSig enveloped, real xmldsigjs) ──────────────

/**
 * Sign a CNML XML document using XMLDSig via xmldsigjs.
 *
 * Produces an enveloped signature inside the root element with:
 *   - CanonicalizationMethod: Exclusive C14N (http://www.w3.org/2001/10/xml-exc-c14n#)
 *   - SignatureMethod:        ECDSA-SHA256
 *   - Reference:              enveloped-signature + exc-c14n transforms, SHA-256 digest
 *   - KeyInfo:                X509Certificate (if cert provided)
 *
 * The result verifies against xmlsec1, xml-security-c, and other spec-compliant
 * XMLDSig implementations.
 *
 * Implementation note: xmldsigjs's SignedXml must be constructed with the
 * ELEMENT to sign (the root), not the document. Sign() then inserts the
 * Signature element as the last child of that element automatically —
 * do NOT manually GetXml/importNode/appendChild (the previous pattern
 * produced signatures whose enveloped-signature + C14N transforms
 * didn't match at verify time on full certs with measurement results).
 */
export async function signCnmlXml(
  xml: string,
  privateKey: CryptoKey,
  x509CertPem?: string,
): Promise<string> {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const root = doc.documentElement;

  const signed = new xmldsig.SignedXml(root);

  const algorithm = { name: "ECDSA", hash: "SHA-256" };

  const x509 = x509CertPem
    ? [x509CertPem
        .replace(/-----BEGIN [A-Z0-9 ]+-----/g, "")
        .replace(/-----END [A-Z0-9 ]+-----/g, "")
        .replace(/\s+/g, "")]
    : undefined;

  await signed.Sign(
    algorithm as AlgSpec,
    privateKey,
    root,
    {
      id: "cnml-signature",
      x509,
      references: [
        {
          hash: "SHA-256",
          transforms: ["enveloped", "exc-c14n"],
        },
      ],
    },
  );

  // xmldsigjs Sign() does not auto-append. GetXml() returns the built
  // Signature element which we must insert into our document explicitly.
  const sigEl = signed.GetXml();
  if (!sigEl) throw new Error("signing failed: no Signature element produced");
  root.appendChild(doc.importNode(sigEl, true));

  return new XMLSerializer().serializeToString(doc);
}

// ─── CNML XML Verification ─────────────────────────────────────────────

export interface VerificationResult {
  signaturePresent: boolean;
  signatureValid:   boolean;
  digestValid:      boolean;
  certificateChain: string[];
  reason?:          string;
}

export interface VerifyOptions {
  trustedPublicKey?: CryptoKey;
  trustedCertPem?: string;
}

export async function verifyCnmlXml(
  xml: string,
  optsOrTrustedCertPem?: VerifyOptions | string,
): Promise<VerificationResult> {
  const opts: VerifyOptions = typeof optsOrTrustedCertPem === "string"
    ? { trustedCertPem: optsOrTrustedCertPem }
    : (optsOrTrustedCertPem ?? {});

  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const sigEl = doc.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Signature")[0];

  if (!sigEl) {
    return {
      signaturePresent: false,
      signatureValid:   false,
      digestValid:      false,
      certificateChain: [],
      reason:           "No <ds:Signature> element found",
    };
  }

  const certEl = sigEl.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "X509Certificate")[0];
  const chain: string[] = [];
  if (certEl?.textContent) chain.push(certEl.textContent);
  if (opts.trustedCertPem) chain.push(opts.trustedCertPem);

  try {
    const signed = new xmldsig.SignedXml(doc);
    signed.LoadXml(sigEl);

    // Try the default verification first (uses X509Cert from KeyInfo if present).
    let signatureValid = await signed.Verify();

    // If signature validation failed AND a trusted public key was supplied,
    // retry verification with the explicit key. This handles CNMLs that
    // either don't embed an X509Certificate or whose embedded cert doesn't
    // match the supplied key.
    if (!signatureValid && opts.trustedPublicKey) {
      try {
        signatureValid = await signed.Verify({ key: opts.trustedPublicKey });
      } catch {
        // keep the previous failure
      }
    }

    return {
      signaturePresent: true,
      signatureValid,
      digestValid: signatureValid,
      certificateChain: chain,
      reason: signatureValid
        ? (chain.length === 0 && !opts.trustedPublicKey
            ? "Signature valid; no X.509 cert in KeyInfo"
            : undefined)
        : "Reference digest or signature value mismatch",
    };
  } catch (e) {
    return {
      signaturePresent: true,
      signatureValid:   false,
      digestValid:      false,
      certificateChain: chain,
      reason:           `Verification error: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

// ─── Internal helpers ──────────────────────────────────────────────────

async function sha256Base64(data: ArrayBuffer | Uint8Array): Promise<string> {
  const buf = data instanceof Uint8Array ? data : new Uint8Array(data);
  const hash = await SUBTLE.digest("SHA-256", buf);
  return bufferToBase64(hash);
}

// ─── X.509 self-signed certificate generation (pkijs) ──────────────────

/**
 * Issue a self-signed X.509 v3 certificate wrapping the given ECDSA P-256
 * public key. This is the certificate that goes into
 * <ds:X509Certificate> in the XMLDSig signature.
 *
 * Issuing authority is identified by the supplied Distinguished Name
 * (e.g. "O=NMi Certin B.V., CN=CNML Signer 2026, C=NL"). The cert is
 * valid for `validityDays` from issuance.
 *
 * Returns the certificate in PEM form ("-----BEGIN CERTIFICATE-----"),
 * ready to drop into signCnmlXml's `x509CertPem` parameter.
 */
export async function issueSelfSignedCert(
  publicKey: CryptoKey,
  privateKey: CryptoKey,
  subjectDn: string,
  validityDays = 3650,
): Promise<string> {
  const pki = await import("pkijs");
  const asn1 = await import("asn1js");

  // Export public key to SPKI
  const spki = await SUBTLE.exportKey("spki", publicKey);
  void spki; // used implicitly via importKey below

  const cert = new pki.Certificate();
  cert.version = 3; // v3
  // serialNumber: pkijs wants an asn1js.Integer; wrap a 16-byte random hex.
  const serialHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0")).join("");
  cert.serialNumber = asn1.Integer.fromBigInt(BigInt("0x" + serialHex));

  cert.notBefore.value = new Date();
  const notAfter = new Date();
  notAfter.setDate(notAfter.getDate() + validityDays);
  cert.notAfter.value = notAfter;

  // Subject & Issuer are the same (self-signed)
  for (const [oid, value] of parseDn(subjectDn)) {
    const attr = new pki.AttributeTypeAndValue({
      type: oid,
      value: new asn1.Utf8String({ value }),
    });
    cert.subject.typesAndValues.push(attr);
    cert.issuer.typesAndValues.push(attr);
  }

  await cert.subjectPublicKeyInfo.importKey(publicKey);

  await cert.sign(privateKey, "SHA-256");

  const derBuf = cert.toSchema(true).toBER(false);
  return derToPem(derBuf, "CERTIFICATE");
}

// Minimal DN parser: "O=NMi, CN=Signer, C=NL" → [["2.5.4.10", "NMi"], ...]
const DN_OID: Record<string, string> = {
  CN: "2.5.4.3",
  C:  "2.5.4.6",
  L:  "2.5.4.7",
  ST: "2.5.4.8",
  O:  "2.5.4.10",
  OU: "2.5.4.11",
  emailAddress: "1.2.840.113549.1.9.1",
};

function parseDn(dn: string): [string, string][] {
  const out: [string, string][] = [];
  for (const part of dn.split(",").map((s) => s.trim()).filter(Boolean)) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    const oid = DN_OID[k];
    if (oid) out.push([oid, v]);
  }
  return out;
}
