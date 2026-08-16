export const sections = [
  {
    title: 'Overview',
    docs: [
      { slug: 'what-is-cnml', title: 'What is CNML', desc: 'The digital certificate format for OIML type approvals developed under the OIML SMART programme.' },
      { slug: 'why-cnml', title: 'Why CNML', desc: 'The case for adopting the format, including transparency, minimal operating-cost burden, and OIML facilitation of adoption.' },
    ],
  },
  {
    title: 'Concepts',
    docs: [
      { slug: 'concepts/oiml-institutions', title: 'OIML, BIML, CIML, and OIML-CS', desc: 'The institutional context: OIML, its bodies, the OIML-CS framework, the DoMC, and how CNML relates to the institutional hierarchy.' },
      { slug: 'concepts/threshold-cryptography', title: 'Threshold cryptography in CNML', desc: 'The five-tier hierarchy, the algorithms at each tier, and the asynchronous coordinator model.' },
      { slug: 'concepts/nist-threshold-alignment', title: 'Alignment with NIST threshold cryptography research', desc: 'How CNML adopts techniques surveyed by NIST IR 8214 and the NIST Multi-Party Threshold Schemes project, applied to legal metrology.' },
      { slug: 'concepts/cnml-and-dcc', title: 'CNML and PTB DCC', desc: "How CNML complements PTB's Digital Calibration Certificate, which operates at the calibration tier while CNML operates at the type-approval tier." },
      { slug: 'concepts/fair-and-dcoc', title: 'FAIR principles and D-CoC', desc: 'The FAIR principles applied to legal-metrology certificates, and the D-CoC framework described in the OIML Bulletin.' },
      { slug: 'concepts/bipm-digital-si', title: 'BIPM Digital SI and measurement units in CNML', desc: 'The authority chain from BIPM Digital SI through UnitsDB and UnitsML into CNML XML.' },
    ],
  },
  {
    title: 'Architecture',
    docs: [
      { slug: 'architecture/system', title: 'System architecture', desc: "The canonical description of CNML's system architecture: the five-tier hierarchy, the certificate model layers, and the data flow." },
      { slug: 'architecture/cnml-vs-typical-pki', title: 'CNML and typical PKI compared', desc: 'A neutral technical comparison of CNML PKI and web TLS PKI, framed as optimizations for different problem domains.' },
      { slug: 'architecture/cnml-architecture-choices', title: 'CNML architecture choices', desc: 'CNML described on its own terms: air-gapped CA, scope governance, threshold signing, transparency log, hardware key tiers, post-quantum readiness.' },
      { slug: 'architecture/distributed-management', title: 'Distributed management', desc: 'How threshold cryptography distributes signing authority across geographies, directors, and officers.' },
      { slug: 'architecture/redundancy', title: 'Redundancy and continuity', desc: 'How the system continues to operate when directors, officers, hardware keys, or facilities are lost.' },
      { slug: 'architecture/transparency', title: 'Transparency and audit', desc: 'The Merkle transparency log, gossip monitoring, OpenTimestamps anchoring, and hash-chained audit log.' },
      { slug: 'architecture/hardware-tiers', title: 'Hardware key tiers', desc: 'The three-tier hardware model: enterprise HSM at the root, personal hardware tokens at the IA, browser IndexedDB at the signer.' },
      { slug: 'architecture/confium-integration', title: 'Confium integration', desc: 'How the Ruby CA server and the TypeScript verifier invoke the Confium Rust threshold-cryptography framework.' },
    ],
  },
  {
    title: 'Implementation',
    docs: [
      { slug: 'implementation/schema-driven-design', title: 'Schema-driven design', desc: 'The principle that the schema is the specification, the per-Recommendation YAML model, and the open/closed extension patterns.' },
      { slug: 'implementation/verification-pipeline', title: 'Verification pipeline', desc: 'The multi-check pipeline, the Check registry pattern, and the scope check that binds the OIML-CS framework to the verifier.' },
      { slug: 'implementation/dcoc-output', title: 'D-CoC output and FAIR interchange', desc: 'The implementation of D-CoC output, RDF/XML and JSON-LD serialization, and triple-store ingestion.' },
      { slug: 'implementation/internationalization', title: 'Internationalization', desc: 'The xml:lang per-element language model, per-Recommendation language coverage, and the planned language tiers.' },
    ],
  },
  {
    title: 'Guides',
    docs: [
      { slug: 'guides/getting-started', title: 'Getting started', desc: 'Install the packages, run the web app, and try the certificate operations.' },
      { slug: 'guides/signing-a-certificate', title: 'Signing a certificate', desc: 'Key generation, certificate creation, XMLDSig signing, and composite signatures.' },
      { slug: 'guides/verifying-a-certificate', title: 'Verifying a certificate', desc: 'The seven-check pipeline, how to run it, and how to add new checks.' },
      { slug: 'guides/qr-code-delivery', title: 'QR code delivery', desc: 'How instance certificates are delivered via QR codes and the passport endpoint.' },
      { slug: 'guides/smi-integration', title: 'SMI integration', desc: 'How CNML connects to the SMART Measuring Instrument ecosystem via the twin GraphQL interface.' },
      { slug: 'guides/internationalization', title: 'Internationalization', desc: 'The xml:lang model, locale switching, and the planned language tiers.' },
    ],
  },
  {
    title: 'Roles',
    docs: [
      { slug: 'roles/for-ias-biml-ciml', title: 'For IAs and BIML/CIML', desc: 'The operational guide for IA officers and BIML/CIML staff: certificate creation, threshold signing, scope governance, ceremony participation.' },
      { slug: 'roles/for-verifiers', title: 'For verifiers', desc: 'The verification flow, offline trust-anchor distribution, CRL refresh, and library integration.' },
      { slug: 'roles/for-developers', title: 'For developers', desc: 'Repository layout, build and test commands, contribution workflow, and code quality rules.' },
    ],
  },
  {
    title: 'Reference',
    docs: [
      { slug: 'reference/glossary', title: 'Glossary', desc: 'Alphabetical terminology reference for non-experts.' },
      { slug: 'reference/faq', title: 'FAQ', desc: 'Audience-grouped questions and answers, with cross-references to the canonical docs.' },
      { slug: 'reference/standards-index', title: 'Standards index', desc: 'A table of every standard CNML references, with role and link.' },
    ],
  },
  {
    title: 'Specifications',
    docs: [
      { slug: 'specifications/signatif-profile', title: 'CNML profile of SIGNATIF', desc: 'The conformance claims, hierarchy mapping, scope dimensions, and gap analysis of CNML as a domain profile of the SIGNATIF trust infrastructure framework.' },
      { slug: 'specifications/signatif-conformance-plan', title: 'SIGNATIF conformance plan', desc: 'The phased implementation plan for full SIGNATIF framework conformance: coverage reports, co-signatures, transparency upgrades, and the closure of every declared gap.' },
      { slug: 'specifications/cnml-format-spec', title: 'CNML format specification', desc: 'The namespace, document structure, per-Recommendation schema model, and instance certificate format.' },
      { slug: 'specifications/xmldsig-profile', title: 'XMLDSig profile', desc: 'The canonicalization, signature method, reference transforms, and KeyInfo conventions for CNML signatures.' },
      { slug: 'specifications/scope-extension-oid', title: 'Scope extension OID', desc: 'The X.509 v3 extension that binds an Issuing Authority to its OIML-CS scope, and the four-layer enforcement model.' },
      { slug: 'specifications/deployment-manifest', title: 'Deployment manifest', desc: 'The confium.toml format: tier hierarchy, quorum definitions, transparency log endpoints, and validation rules.' },
    ],
  },
];
