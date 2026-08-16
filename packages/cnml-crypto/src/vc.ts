/**
 * Verifiable Credential emission (SIGNATIF Annex G).
 *
 * Expresses a CNML certificate as a W3C Verifiable Credential: the
 * CNML payload becomes the credential subject, the CNML signature
 * becomes the proof, and each dimensional co-signature becomes an
 * entry in the proof set carrying its trust dimension.
 */

export interface VcProof {
  type: string;
  proofPurpose: string;
  verificationMethod: string;
  /** The trust dimension this proof attests (co-signatures). */
  dimension?: string;
}

export interface VerifiableCredential {
  "@context": string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: Record<string, unknown>;
  proof: VcProof;
  proofSet?: VcProof[];
}

/** The CNML view shape produced by parseCnmlXml (duck-typed here so
 *  the emitter does not depend on the cnml-xml package). */
export interface CnmlCertificateView {
  certificate?: {
    number?: string;
    date_issued?: string;
    recommendation?: { id?: string; edition?: string };
  };
  issuing_authority?: { name?: string; oiml_issuer_id?: string };
  applicants?: { name?: string }[];
  manufacturers?: { name?: string }[];
  certified_type?: { type_designations?: string[] };
  instrument?: { model?: string; serial_number?: string; firmware_hash?: string };
}

/** The proof facts the coverage report established for the artifact. */
export interface CnmlProofFacts {
  /** Fingerprint of the primary signer's cert (hex). */
  signerFingerprint: string;
  /** Verified co-signatures: dimension + signer fingerprint. */
  coSignatures: { dimension: string; fingerprint: string }[];
  /** The artifact's canonical payload digest (sha256 hex). */
  payloadDigest: string;
}

/**
 * Emit a type-approval certificate as a Verifiable Credential.
 * The CNML proof is referenced, not re-encoded: the VC's proof points
 * at the signature in the CNML XML, which remains the canonical form.
 */
export function certificateToVerifiableCredential(
  cert: CnmlCertificateView,
  proofFacts: CnmlProofFacts,
  issuerId: string,
): VerifiableCredential {
  const subject: Record<string, unknown> = {
    type: "MeasuringInstrumentType",
    recommendation: cert.certificate?.recommendation?.id,
    recommendationEdition: cert.certificate?.recommendation?.edition,
    oimlCertificateNumber: cert.certificate?.number,
    manufacturer: cert.manufacturers?.[0]?.name ?? cert.applicants?.[0]?.name,
    typeDesignations: cert.certified_type?.type_designations ?? [],
  };

  const primaryProof: VcProof = {
    type: "CNMLXMLDSig2026",
    proofPurpose: "assertionMethod",
    verificationMethod: `cnml:signer:${proofFacts.signerFingerprint}`,
  };

  const vc: VerifiableCredential = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.oimlsmart.org/schemas/cnml/1.0",
    ],
    type: ["VerifiableCredential", "CNMLTypeApproval"],
    issuer: issuerId,
    issuanceDate: cert.certificate?.date_issued ?? "",
    credentialSubject: Object.fromEntries(
      Object.entries(subject).filter(([, v]) => v !== undefined && v !== null),
    ),
    proof: primaryProof,
  };

  if (proofFacts.coSignatures.length > 0) {
    vc.proofSet = [
      primaryProof,
      ...proofFacts.coSignatures.map((c): VcProof => ({
        type: "CNMLCoSignature2026",
        proofPurpose: "assertionMethod",
        verificationMethod: `cnml:signer:${c.fingerprint}`,
        dimension: c.dimension,
      })),
    ];
  }

  return vc;
}

/**
 * Emit an instance certificate as a Verifiable Credential about one
 * instrument: serial number, firmware hash, and model chain.
 */
export function instanceToVerifiableCredential(
  cert: CnmlCertificateView,
  proofFacts: CnmlProofFacts,
  issuerId: string,
): VerifiableCredential {
  const vc = certificateToVerifiableCredential(cert, proofFacts, issuerId);
  vc.type = ["VerifiableCredential", "CNMLInstanceCertificate"];
  vc.credentialSubject = {
    type: "MeasuringInstrumentInstance",
    serialNumber: cert.instrument?.serial_number,
    firmwareHash: cert.instrument?.firmware_hash,
    model: cert.instrument?.model,
    oimlCertificateNumber: cert.certificate?.number,
  };
  return vc;
}
