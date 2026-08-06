---
title: 'Brand and identity'
lede: 'The CNML mark is a stack of nested rectangles forming a receding tunnel. Each rectangle is a certificate; the tunnel is the chain of confidence that runs from the OIML Root to the individual instrument.'
coord: 'ABOUT / 08'
---

The visual identity of CNML carries the same meaning as the format itself. The mark is composed of multiple nested rectangles, each one slightly smaller than the last, arranged in depth so that the eye reads a receding tunnel. The wordmark CNML sits at the center, anchored by the structure that surrounds it. This is not decoration. Every element corresponds to a property of the format.

CNML is a proposal for OIML from the OIML SMART programme. The visual identity is part of how the proposal communicates its purpose to the audiences who will adopt, issue, and verify certificates under the scheme.

## The certificate shape

Each rectangle in the mark is the silhouette of a certificate. The shape is rectangular because a certificate, in any medium, is a structured document with edges: a defined issuer, a defined subject, a defined scope, a defined validity window, a defined signature. CNML inherits this shape from the OIML-CS certificate of conformity, from the calibration certificate, and from the type approval document. The rectangle is the universal silhouette of an instrument-conformity document.

The mark stacks the rectangles because the system stacks certificates. The five-tier hierarchy that CNML implements, from the OIML Root CA down through Issuing Authority intermediates, manufacturer model certificates, and per-device instance certificates, is a literal stack of signatures. Every tier is a rectangle in the chain. Every rectangle is a verification event the holder can recompute.

## The tunnel

The rectangles nest concentrically, each one inside the last. The visual effect is a tunnel that recedes to a vanishing point. The tunnel is the chain of trust: a verifier enters at the instrument with the instance certificate, walks inward to the manufacturer model certificate, then to the Issuing Authority intermediate, then to the OIML Root, then to the OIML SMART programme itself. Every step is a verification. The path is the same regardless of which certificate the verifier starts from.

The depth conveys that the chain is long. Legal-metrology instruments have service lifetimes measured in decades; the certificate that authorizes an instrument in 2026 may still be in force in 2046. The depth of the tunnel is the depth of the trust horizon. The mark reminds the viewer that a single certificate is not the answer; the chain is.

## Continued confidence

The receding rectangles do not collapse into nothing. They converge on the wordmark. The viewer's eye follows the tunnel inward and arrives at CNML. The composition communicates that confidence accumulates rather than diminishes: each tier of the hierarchy adds verification, not weakness. The OIML Root is at the back of the tunnel, furthest from the viewer, but its presence is what anchors every rectangle in front of it.

This is the opposite of a single-key public-key infrastructure, where the entire system's trust rests on one certificate authority. In CNML, the trust is layered. Each layer can be revoked without invalidating the others. The tunnel stays open even when one rectangle is removed.

## Validation of conformance

The mark is rendered in the brand teal of the OIML SMART programme, against the paper background that the design system uses for all published materials. The color choice is not symbolic; it is consistency. The teal identifies the programme; the paper background identifies the published-document register. The combination signals that the CNML document is a publication, not a piece of software. The verifier is software; the certificate is a document.

The rectangles are drawn with hairline strokes, not bold lines. Hairlines are the visual register of engineering drawings: calibration certificates, schematics, technical diagrams. The mark borrows the visual register of metrology itself. The reader recognizes the mark as belonging to the same family as the documents an instrument carries in its enclosure.

## The wordmark

The CNML wordmark sits at the center of the tunnel. The acronym expands to Certificat Numerique de Metrologie Legale. The French form is canonical: the OIML is headquartered in Paris, the BIML operates in French and English, and the legal-metrology community writes in both languages. The wordmark uses the IBM Plex typeface family, the same family the rest of the site uses, so the mark belongs to the visual system rather than competing with it.

The wordmark is centered rather than left-aligned because the tunnel's vanishing point is the natural anchor. A left-aligned wordmark would argue that the mark is a sequence; a centered wordmark argues that it is a destination. CNML is the destination that the tunnel of certificates converges on.

## What the mark does not show

The mark does not show a globe, a network, a handshake, or a shield. These are the conventional symbols of international organizations, networks of trust, agreements, and security. CNML uses none of them because none of them is what CNML is.

CNML is not an international organization; it is a format used by one. CNML is not a network; the verification path is local. CNML is not an agreement; agreements are between parties and CNML is between certificates. CNML is not security; security is a property of cryptography, and CNML is a document format that uses cryptography. The mark's restraint, the absence of the conventional symbols, communicates what CNML is not.

## The dark-mode variant

The mark is rendered in two forms: a light-mode variant for the paper background, and a dark-mode variant for the ink background. Both variants preserve the same composition. The brand teal inverts to a lighter shade against the dark background so that the hairline rectangles remain visible. The wordmark stays the same. The meaning stays the same.

The dark-mode variant exists because the design system supports both registers. The user's preference is honored on every page load. The mark does not change identity when the theme changes; it changes appearance. The certificate's meaning does not change either.

## See also

- [What is CNML](what-is-cnml) introduces the format.
- [How it works](how-it-works) describes the five-tier hierarchy the mark represents.
- [Technology](technology) lists the standards and cryptographic algorithms.
- [The OIML SMART programme](https://www.oimlsmart.org/) is the parent visual system.
