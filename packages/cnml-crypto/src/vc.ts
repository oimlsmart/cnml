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

/**
 * The status list this credential occupies: the VC-native revocation
 * surface (SIGNATIF §revocation status lists). The CRL remains the
 * native surface for the X.509 chains; a scheme operating both
 * reconciles them through the transparency log.
 */
export interface StatusListBinding {
  /** The status list credential's id (URL). */
  statusListCredential: string;
  /** This credential's slot in the list. */
  statusListIndex: number;
  /** revocation (default) | suspension | message. */
  statusPurpose?: string;
}

export interface VerifiableCredential {
  "@context": string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: Record<string, unknown>;
  proof: VcProof;
  proofSet?: VcProof[];
  /** BitstringStatusListEntry when the scheme operates a status list. */
  credentialStatus?: {
    type: "BitstringStatusListEntry";
    statusListCredential: string;
    statusListIndex: string;
    statusPurpose: string;
  };
  /**
   * What the credential AUTHORIZES, as distinct from what it
   * attests. A type approval attests evaluation; the legal
   * permission to place an instrument on the market comes only
   * from the competent authority of each jurisdiction.
   */
  legalEffect: "none" | "national" | "regional";
  legalEffectNote?: string;
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
  status?: StatusListBinding,
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

  vc.legalEffect = "none";
  vc.legalEffectNote =
    "This credential is type-evaluation evidence under the OIML certification system. " +
    "It confers no legal permission to place the instrument on the market or put it into " +
    "use in any jurisdiction; legal effect comes only from the competent authority of " +
    "that jurisdiction.";

  if (status) {
    vc.credentialStatus = {
      type: "BitstringStatusListEntry",
      statusListCredential: status.statusListCredential,
      statusListIndex: String(status.statusListIndex),
      statusPurpose: status.statusPurpose ?? "revocation",
    };
  }

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
  status?: StatusListBinding,
): VerifiableCredential {
  const vc = certificateToVerifiableCredential(cert, proofFacts, issuerId, status);
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
