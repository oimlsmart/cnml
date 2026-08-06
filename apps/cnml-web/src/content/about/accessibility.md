---
title: 'Accessibility statement'
lede: 'The CNML web application targets WCAG 2.1 AA. This statement documents the conformance status and the assessment method.'
coord: 'ABOUT / 06'
---

The OIML SMART programme is committed to making the CNML web application accessible to all users, including those who rely on assistive technology. This statement documents the conformance status of the site at `https://www.oimlsmart.org/cnml/` against the Web Content Accessibility Guidelines (WCAG) 2.1 at conformance level AA.

CNML is a proposal for OIML from the OIML SMART programme. The accessibility posture described here is part of the proposal and is subject to revision as the proposal evolves.

## Conformance status

The site is **fully conformant** with WCAG 2.1 AA at the time of the last audit. Fully conformant means that the audit found no violations at the A or AA level on any of the critical pages.

The audit runs automatically on every pull request. A regression at the A or AA level fails the continuous-integration build before it reaches production.

## Last audit

The most recent automated audit ran on the build dated August 2026. The audit covers the critical pages: home, about pages, audience pages, feature pages, documentation index, documentation detail pages, the verify page, the QR code generation page, and the search page.

## Compatibility with assistive technology

The site is tested with the Playwright browser engine. The audit uses axe-core, the de facto standard for automated WCAG conformance checking.

The site has not yet been tested with screen readers (NVDA, VoiceOver, JAWS). Manual screen-reader testing is planned for the production-ready milestone. Until then, the automated audit is the conformance gate.

## Feedback

Accessibility issues are reported through the standard GitHub issue channel:

1. Open an issue at `https://github.com/oimlsmart/cnml/issues`.
2. Use the **Bug report** template.
3. Tag the issue with the **accessibility** label.

If the issue is sensitive or you prefer a private channel, use the GitHub Security Advisory mechanism described in the security policy. Accessibility issues that affect user data or privacy are treated as security issues.

## Technical specifications

The site relies on the following technologies:

- HTML5 with semantic landmarks (header, nav, main, footer)
- CSS with CSS variables for theming (no inline styles, no `!important` outside scoped reduced-motion overrides)
- JavaScript for the interactive islands (verify, QR generation, key management)
- Web Crypto API for the in-browser cryptographic operations
- Service Worker for offline verify (optional, registered only on the verify page)

The site works without JavaScript for reading the documentation. The interactive islands (verify, QR generation, key management) require JavaScript.

## Assessment methods

The assessment combines:

- **Automated scanning.** The axe-core Playwright integration scans every critical page on every pull request. The scan uses the `wcag2a`, `wcag2aa`, `wcag21a`, and `wcag21aa` tags. Color-contrast is excluded from the automated scan because the design system's color tokens are pre-verified for contrast; the exclusion is documented in the test file.
- **Manual review.** Every UI change is reviewed by a maintainer before merge. The reviewer checks keyboard navigation, focus order, and the visible focus indicator.
- **Visual regression baseline.** Playwright screenshots at desktop and mobile widths lock the visual layout. An unintended visual regression fails CI.

## Limitations and alternatives

Wherever a part of the site cannot be made fully accessible, the limitation is documented in the relevant page's content. As of the current audit, no such limitations have been identified. If you find one, please report it through the channel above.

## Approval

This accessibility statement is approved by the OIML SMART programme and is reviewed at least once per calendar quarter, or whenever a significant UI change lands.

## See also

- [Contact](contact) describes the engagement channels for the OIML SMART programme.
- [Privacy](privacy) documents what the site collects and processes.
- The WCAG 2.1 quick reference is at `https://www.w3.org/WAI/WCAG21/quickref/`.
