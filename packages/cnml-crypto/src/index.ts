/**
 * @oimlsmart/cnml-crypto — Cryptographic operations for CNML
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
 *
 * Implementation lives in MECE-cohesive modules (hash, pem, keys/*,
 * trust/*, xml/*, cert/*). This file is a barrel — it re-exports the
 * public API without holding any logic.
 */

// Leaf utilities
export * from "./hash.ts";
export * from "./pem.ts";

// Key management
export type { KeyAlgorithm, StoredKey, GenerateOptions } from "./keys/types.ts";
export { encryptPrivateKey, decryptPrivateKey } from "./keys/encryption.ts";
export { loadCryptoKey, importPublic } from "./keys/cache.ts";
export { generateKey } from "./keys/generate.ts";
export { storeKey, listKeys, getKey, deleteKey } from "./keys/store.ts";
export {
  exportPublicKeyPem,
  exportPrivateKeyPem,
  importPrivateKeyFromPem,
} from "./keys/import-export.ts";

// Composite signatures (Ed25519 with ML-DSA-65)
export type {
  CompositeKeyMaterial,
  CompositeSignature,
  CompositeVerification,
} from "./keys/composite.ts";
export {
  generateCompositeKeyMaterial,
  compositeSign,
  compositeVerify,
  encodeCompositeSignature,
  decodeCompositeSignature,
  encodeCompositePublicKeys,
  decodeCompositePublicKeys,
} from "./keys/composite.ts";

// Trust store (public keys only — no private material)
export type { TrustedPublicKey } from "./trust/store.ts";
export {
  storeTrustedKey,
  listTrustedKeys,
  getTrustedKey,
  deleteTrustedKey,
  cryptoKeyFromTrustedKey,
} from "./trust/store.ts";
export { importPublicKeyFromPem, loadTrustedPublicKey } from "./trust/import.ts";

// XML signing / verification
export { signCnmlXml } from "./xml/sign.ts";
export { signCnmlXmlExternal } from "./xml/sign-external.ts";
export type { ExternalSigner } from "./xml/sign-external.ts";
export type { VerificationResult, VerifyOptions } from "./xml/verify.ts";
export { verifyCnmlXml } from "./xml/verify.ts";
export { signCnmlXmlWithCosignatures } from "./xml/cosign.ts";
export type { CosignerSpec } from "./xml/cosign.ts";
export { embedStateBinding, extractStateBindings, bareHash } from "./xml/state-binding.ts";
export type { BoundState, StateInput } from "./xml/state-binding.ts";
export { buildStateIndex, propagate, isBoundToRevoked } from "./revocation.ts";
export type { StateIndexEntry, StateIndex, PropagationHit } from "./revocation.ts";
export { generateChallenge, embedChallenge, verifyChallengeResponse, readChallengeResponse, createChallengeRegistry } from "./challenge.ts";
export type { ChallengePolicy, ChallengeResult, ChallengeRegistry } from "./challenge.ts";
export { certificateToVerifiableCredential, instanceToVerifiableCredential } from "./vc.ts";
export type { VerifiableCredential, VcProof, CnmlCertificateView, CnmlProofFacts } from "./vc.ts";
export { registryString, verifyAlgorithmRegistry } from "./algorithms.ts";
export type { AlgorithmRegistry, RegistryVerification } from "./algorithms.ts";
export { findAllPaths, anchorBundle, rootDiversity, strongestPathFor } from "./trust-graph.ts";
export type {
  SignatureChainLink,
  TrustAnchor,
  TrustAnchorBundle,
  TrustedArtifact,
} from "./trust-graph.ts";

// X.509 self-signed certificate generation
export { issueSelfSignedCert } from "./cert/self-signed.ts";
export { verifyCertChain } from "./cert/chain-verify.ts";
export type { ChainVerificationResult } from "./cert/chain-verify.ts";
export { buildCsrPem } from "./cert/csr.ts";

// Existing sibling modules (unchanged)
export * from "./ed25519.ts";
export * from "./pqc.ts";
export * from "./opentimestamps.ts";
export * from "./scope.ts";
export * from "./crl.ts";
