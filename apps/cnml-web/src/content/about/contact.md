---
title: 'Contact'
lede: 'CNML is developed under the OIML SMART program. Engagement proceeds through OIML institutional channels and the open-source repository.'
coord: 'ABOUT / 05'
---

CNML is a component of the OIML SMART program. The documentation set published at this site is a proposal to OIML, not an adopted specification. Member States and Corresponding Members engage through official OIML channels.

## Engagement channels

The OIML institutional website is the point of contact for member-state engagement. Member States and Corresponding Members seeking to participate in the OIML SMART program, to evaluate CNML for adoption, or to contribute to the technical work should contact OIML through the official channels published at the OIML website. The BIML secretariat coordinates technical engagement with the OIML SMART program.

The GitHub repository is the point of contact for technical contributions. The source code for the CNML implementation, the per-Recommendation schemas, the Ruby CA server, the TypeScript verifier, and the test vectors is published under an open-source license. Pull requests are welcome. Security reports receive priority handling and should be filed through the repository security advisory mechanism rather than through a public issue.

The style guide is the point of reference for written contributions. The OIML SMART writing style guide defines the register, the prohibited patterns, and the content rules for all public-facing text published under the program. Contributors drafting or editing documentation should read the guide before submitting prose.

## Participation in the pilot

The pilot phase proceeds under BIML coordination. BIML issues a test root and a small number of IA intermediates on hardware keys. Sample CNML files are signed for evaluation by Issuing Authorities, test laboratories, and verifiers. The pilot is open to OIML Member States and Corresponding Members that elect to participate through the official OIML channels.

The pilot does not name specific Issuing Authorities, test laboratories, or manufacturers as committed participants. Selection of pilot participants proceeds through the OIML institutional process. The technical criteria for participation are the capacity to operate PKCS#11-compatible hardware, the institutional authority to hold an OIML-CS scope, and the operational readiness to run the signing ceremony.

## Documentation and source

The documentation set at this site covers what CNML is, why it exists, how it works, and how each audience participates. The documentation is a proposal and may change without notice as the proposal evolves. The canonical reference for any technical question is the source code in the GitHub repository, including the per-Recommendation schemas, the check pipeline, and the test vectors that exercise the signing and verification flows.

The test vectors are 22 pre-signed CNML files that exercise the per-Recommendation schema coverage. Any contributor can regenerate the vectors and verify that they round-trip through the signer and the verifier. The vectors are the concrete proof that the implementation behaves as the documentation describes.

## Further reading

- [What is CNML](../about/what-is-cnml) introduces the format.
- [Audiences](../audiences/issuing-authorities) describes how each audience participates.
- The [OIML institutional website](https://www.oiml.org) is the canonical source for OIML governance and member-state engagement.
