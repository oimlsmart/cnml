/**
 * The CNML nav model — the ordered items the house shell's header, the
 * mobile overlay, and the footer's Explore column render (one model,
 * injected through the layout's `nav` prop, TODO.ia/03 item 5). The
 * shell went machinery-only at 0.2.0: the model moved into this
 * repository, shaped to the package's NavModel contract
 * (@oimlsmart/site-shell/config). The file is data-only: the
 * active-path predicates ship with the package's config contract,
 * never from here.
 *
 * The model is the site's own information architecture, and the menus
 * are labels only (TODO.public mandate 3): the per-item descriptions
 * the retired vendored header carried are gone from the menus — the
 * pages themselves carry the exposition:
 *
 *   1. About      — the proposal, the mechanism, the standards.
 *   2. Audiences  — the per-role guides.
 *   3. Features   — the cryptographic and delivery capabilities.
 *   4. Documentation / Search — the docs cone and its index.
 *
 * The product CTA is the App page: the site is a working surface (the
 * create / sign / verify tools), and the one thing a first-time visitor
 * needs is the entry into them. Cross-site navigation is deliberately
 * absent from the top nav — it lives in the footer (the Programme
 * column and the hosts registry).
 *
 * Hrefs stay root-relative against the site's base; `origin`
 * absolutizes them at render, so the chrome's links resolve from any
 * host (ADR-0003).
 */
import type { NavDropdownConfig, NavModel } from '@oimlsmart/site-shell/config'
import { SITE } from './site-meta.ts'

// The relative import above carries an explicit .ts extension on
// purpose (the only such import in src/data): the nav completeness
// gate (scripts/check-nav.mjs, via the shell's check-nav) loads this
// file under plain node's type stripping, which resolves relative
// specifiers literally — the extensionless house style would 404 it.
// The same constraint keeps this module data-only: the active-path
// predicates stay in the package (@oimlsmart/site-shell/config), and
// importing them here would drag the package's TypeScript source into
// a plain-node load, which node refuses to strip under node_modules.

/** The proposal, the mechanism, and the standards it builds on. */
export const ABOUT_DROPDOWN: NavDropdownConfig = {
  id: 'about',
  label: 'About',
  variant: 'default',
  links: [
    { label: 'What is CNML', href: `${SITE.base}/about/what-is-cnml` },
    { label: 'Why CNML', href: `${SITE.base}/about/why-cnml` },
    { label: 'How it works', href: `${SITE.base}/about/how-it-works` },
    { label: 'Technology', href: `${SITE.base}/about/technology` },
    { label: 'Brand and identity', href: `${SITE.base}/about/branding` },
    { label: 'Accessibility', href: `${SITE.base}/about/accessibility` },
    { label: 'Privacy', href: `${SITE.base}/about/privacy` },
    { label: 'Contact', href: `${SITE.base}/about/contact` },
  ],
}

/** The per-role guides. */
export const AUDIENCES_DROPDOWN: NavDropdownConfig = {
  id: 'audiences',
  label: 'Audiences',
  variant: 'default',
  links: [
    { label: 'Issuing Authorities', href: `${SITE.base}/audiences/issuing-authorities` },
    { label: 'BIML and CIML', href: `${SITE.base}/audiences/biml-ciml` },
    { label: 'Manufacturers', href: `${SITE.base}/audiences/manufacturers` },
    { label: 'Test laboratories', href: `${SITE.base}/audiences/test-laboratories` },
    { label: 'Verifiers', href: `${SITE.base}/audiences/verifiers` },
    { label: 'Developers', href: `${SITE.base}/audiences/developers` },
  ],
}

/** The cryptographic and delivery capabilities. */
export const FEATURES_DROPDOWN: NavDropdownConfig = {
  id: 'features',
  label: 'Features',
  variant: 'default',
  links: [
    { label: 'Threshold signing', href: `${SITE.base}/features/threshold-signing` },
    { label: 'Composite signatures', href: `${SITE.base}/features/composite-signatures` },
    { label: 'Scope governance', href: `${SITE.base}/features/scope-governance` },
    { label: 'Transparency', href: `${SITE.base}/features/transparency` },
    { label: 'QR code delivery', href: `${SITE.base}/features/qr-code-delivery` },
    { label: 'SMI interface', href: `${SITE.base}/features/smi-interface` },
  ],
}

export const NAV_MODEL: NavModel = {
  // Front-door absolute at render (ADR-0003): the chrome's links
  // resolve from any origin.
  origin: SITE.url,
  items: [
    { type: 'dropdown', config: ABOUT_DROPDOWN },
    { type: 'dropdown', config: AUDIENCES_DROPDOWN },
    { type: 'dropdown', config: FEATURES_DROPDOWN },
    { type: 'link', label: 'Documentation', href: `${SITE.base}/docs`, matchPrefix: `${SITE.base}/docs` },
    { type: 'link', label: 'Search', href: `${SITE.base}/search`, matchPrefix: `${SITE.base}/search` },
  ],
  productCta: { label: 'App', href: `${SITE.base}/app` },
}
