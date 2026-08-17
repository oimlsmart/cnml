---
title: OIML, BIML, CIML, and OIML-CS
description: The institutional structure of OIML and how the OIML-CS framework, the DoMC, and the OIML SMART programme relate to CNML.
---

# OIML, BIML, CIML, and OIML-CS

CNML is a component of the OIML SMART programme, and its governance is grounded in the institutional structure of the International Organization of Legal Metrology (OIML). This page provides the institutional context a reader needs before engaging with the cryptographic and operational documentation. It is written for member-state delegates, Issuing Authority staff, and readers new to OIML institutional structure. The documentation set as a whole is a proposal to OIML from the OIML SMART programme, not an adopted specification.

In the CNML architecture, these institutions instantiate the SIGNATIF framework's delegation model: OIML/BIML operates the root trust authority, CIML's member states host the delegated Issuing Authorities, and the OIML-CS Declaration of Mutual Confidence defines the scope each delegation carries.

![OIML institutional architecture](/diagrams/institutional-architecture.svg)

## OIML and its treaty basis

OIML was established by the Convention establishing the World Forum on Legal Metrology, signed in 1955 and revised in 1968. It is an intergovernmental treaty organization with more than sixty member states and a comparable number of corresponding members. The purpose of OIML is to harmonize the regulations and metrological controls applied by member states to measuring instruments subject to legal control, with the aim of removing technical barriers to trade in regulated instruments.

OIML pursues this purpose through the OIML Recommendations, which are international standards specifying the metrological and technical requirements that categories of measuring instruments must satisfy for type approval. The OIML Certificate System (OIML-CS) is the operational framework through which OIML member states and corresponding members recognize type approvals issued under those Recommendations. CNML is the digital certificate format developed under the OIML SMART programme for the system.

## The four institutional bodies

OIML operates through four institutional bodies with distinct roles. The International Conference is the plenary supreme body, composed of all member states and convening every four years. It approves amendments to the Convention and is the final authority on institutional questions. The International Committee of Legal Metrology (CIML) is the steering committee, composed of one delegate per member state and convening annually. CIML sets policy: it decides which Recommendations adopt CNML, which Issuing Authorities are eligible, how scope is allocated among Issuing Authorities, and what threshold and revocation parameters apply. The International Bureau of Legal Metrology (BIML) is the permanent secretariat, staffed by full-time professionals, and is the operational arm that runs the infrastructure and executes the policies CIML sets. The Presidential Council, composed of the CIML President, two Vice-Presidents, and the BIML Director, holds limited authority between CIML sessions to act on urgent matters, with every action subject to ratification or reversal at the next CIML session.

The separation of policy authority (CIML) from operational authority (BIML) is the foundation of the checks and balances that govern CNML. CIML can change rules. BIML executes them. Neither body can move unilaterally on the cryptographic trust anchor without the participation of the other.

## OIML-CS and the Issuing Authorities

The OIML-CS is the framework within which designated Issuing Authorities (IAs) issue OIML type approvals for categories of measuring instruments. An IA is an OIML-recognized national body, typically a national metrology institute or a designated legal-metrology authority. Recognition is granted through the OIML institutional process. Once recognized, an IA may issue OIML-CS certificates for the OIML Recommendations within the scope of its recognition.

CNML binds each IA's certificate to a specific subset of OIML Recommendations through an X.509 v3 scope extension. The scope extension is enforced at verification time. This binding makes the institutional contract between OIML and each IA verifiable by any party. An IA cannot issue a CNML certificate for a Recommendation outside its recognized scope, and a verifier rejects any such certificate without contacting the issuer.

## The Declaration of Mutual Confidence

The Declaration of Mutual Confidence (DoMC) is the agreement that establishes which OIML-CS Issuing Authorities recognize each other's type-evaluation work. The DoMC framework defines the accreditation process for IAs, the mutual-recognition obligations that apply, and the scope allocations that govern which IA may issue for which Recommendations. The DoMC is published on the OIML website and maintained through CIML review.

CNML does not replace the DoMC. It makes the DoMC framework verifiable cryptographically. The scope bound to each IA certificate corresponds to the scope allocated to that IA under the DoMC. The recognition path between IAs, which the DoMC establishes institutionally, is reflected in the certificate chain that CNML verifies cryptographically.

## The OIML SMART programme

The OIML SMART programme is the framework within which CNML and related digital initiatives evolve. CNML was developed under the programme for OIML SMART and the relevant OIML R-Recommendations. The implementation is developed by Ribose, and the threshold-cryptography substrate is provided by Confium.

Through the OIML SMART programme, OIML is committed to facilitating adoption of CNML by every national metrology laboratory, their accredited test laboratories, and the market-surveillance authorities that verify instruments in the field. The programme provides open-source software, public specifications, and reproducible schemas so that any OIML member state or corresponding member can participate without licensing barriers.

## How CNML relates to the institutional hierarchy

CNML sits within the operational layer that BIML administers, under the policy direction of CIML. The BIML Root signing key is held as a threshold secret shared among directors appointed through CIML processes. Each IA operates its own threshold quorum for IA-intermediate signatures, within the scope allocated under the DoMC. Test laboratories and manufacturers hold single-party signing keys derived from IA-issued certificates. The full cryptographic architecture is developed in [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography), and the operational guidance for IA and BIML/CIML staff appears in [For IAs and BIML/CIML](/docs/roles/for-ias-biml-ciml).

## See also

- [Threshold cryptography in CNML](/docs/concepts/threshold-cryptography) develops the threshold-signature architecture that distributes signing authority across the institutional bodies.
- [System architecture](/docs/architecture/system) describes the five-tier certificate hierarchy and the certificate model.
- [For IAs and BIML/CIML](/docs/roles/for-ias-biml-ciml) provides operational guidance for Issuing Authority staff and BIML/CIML participants.
- [CNML and PTB DCC](/docs/concepts/cnml-and-dcc) develops the complementarity with PTB's Digital Calibration Certificate at a different tier of metrology.
