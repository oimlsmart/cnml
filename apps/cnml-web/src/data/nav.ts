import { url } from '../lib/url';
import type { NavDropdownConfig } from '../components/NavDropdown.vue';
import type { MobileNavItem } from '../components/MobileNav.vue';

export const aboutDropdown: NavDropdownConfig = {
  id: 'about',
  label: 'About',
  links: [
    { label: 'What is CNML', href: url('/about/what-is-cnml'), desc: 'Concept introduction and scope' },
    { label: 'Why CNML', href: url('/about/why-cnml'), desc: 'The problem CNML solves' },
    { label: 'How it works', href: url('/about/how-it-works'), desc: 'The five-tier hierarchy and verification pipeline' },
    { label: 'Technology', href: url('/about/technology'), desc: 'The standards and cryptographic algorithms' },
    { label: 'Brand and identity', href: url('/about/branding'), desc: 'What the mark communicates' },
    { label: 'Accessibility', href: url('/about/accessibility'), desc: 'WCAG 2.1 conformance statement' },
    { label: 'Privacy', href: url('/about/privacy'), desc: 'What the site collects (nothing)' },
    { label: 'Contact', href: url('/about/contact'), desc: 'How to engage with the OIML SMART programme' },
  ],
};

export const audiencesDropdown: NavDropdownConfig = {
  id: 'audiences',
  label: 'Audiences',
  links: [
    { label: 'Issuing Authorities', href: url('/audiences/issuing-authorities') },
    { label: 'BIML and CIML', href: url('/audiences/biml-ciml') },
    { label: 'Manufacturers', href: url('/audiences/manufacturers') },
    { label: 'Test laboratories', href: url('/audiences/test-laboratories') },
    { label: 'Verifiers', href: url('/audiences/verifiers') },
    { label: 'Developers', href: url('/audiences/developers') },
  ],
};

export const featuresDropdown: NavDropdownConfig = {
  id: 'features',
  label: 'Features',
  links: [
    { label: 'Threshold signing', href: url('/features/threshold-signing') },
    { label: 'Composite signatures', href: url('/features/composite-signatures') },
    { label: 'Scope governance', href: url('/features/scope-governance') },
    { label: 'Transparency', href: url('/features/transparency') },
    { label: 'QR code delivery', href: url('/features/qr-code-delivery') },
    { label: 'SMI interface', href: url('/features/smi-interface') },
  ],
};

export const flatLinks = [
  { href: url('/docs'), label: 'Documentation' },
  { href: url('/search'), label: 'Search' },
  { href: url('/app'), label: 'App' },
];

export const mobileItems: MobileNavItem[] = [
  { type: 'dropdown', label: aboutDropdown.label, config: aboutDropdown },
  { type: 'dropdown', label: audiencesDropdown.label, config: audiencesDropdown },
  { type: 'dropdown', label: featuresDropdown.label, config: featuresDropdown },
  { type: 'link', label: 'Documentation', href: url('/docs') },
  { type: 'link', label: 'Search', href: url('/search') },
  { type: 'link', label: 'App', href: url('/app') },
];

export const navDropdowns = [aboutDropdown, audiencesDropdown, featuresDropdown];

// navItems: convenience grouping of the dropdown structure for callers that
// just need the three dropdowns (About, Audiences, Features) plus flat links.
export const navItems = {
  dropdowns: navDropdowns,
  flatLinks,
  mobileItems,
};
