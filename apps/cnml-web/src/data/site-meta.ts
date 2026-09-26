/**
 * The CNML site constants — the identity and origin values the injected
 * configs (brand, nav, footer) compose from (TODO.ia/03 item 5: the
 * house shell went machinery-only at 0.2.0, so the site carries its own
 * content). Data-only under plain node: the nav completeness gate
 * (scripts/check-nav.mjs, via the shell's check-nav) loads the nav model
 * through this module, so nothing here may import the package's
 * TypeScript source.
 */
export const SITE = {
  url: 'https://www.oimlsmart.org',
  base: '/cnml',
  title: 'OIML CNML',
  description:
    'OIML CNML — the Certificat Numérique de Métrologie Légale, the digital certificate format proposed by the OIML SMART programme to succeed the PDF-based OIML-CS certificate of conformity.',
}
