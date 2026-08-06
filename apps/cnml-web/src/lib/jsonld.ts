/**
 * Schema.org JSON-LD builders (TODO.cnml/34).
 *
 * Each function returns a JSON-LD object for a content type. The
 * objects are serialized to JSON in Base.astro and emitted as
 * <script type="application/ld+json"> blocks.
 *
 * Adding a new content type is one function. Base.astro picks the
 * right builder from the `kind` prop.
 */

interface Organization {
  name: string;
  url: string;
  logo?: string;
}

interface JsonLdInput {
  /** Canonical URL of the page (computed in Base.astro). */
  canonical: string;
  /** Page title (the prose H1, not the browser <title>). */
  title: string;
  /** Page description (one-sentence summary). */
  description: string;
  /** Path under public/ for the OG image (used as schema.org image). */
  imageUrl?: string;
  /** The publisher (OIML SMART). */
  publisher?: Organization;
}

const DEFAULT_PUBLISHER: Organization = {
  name: "OIML SMART",
  url: "https://www.oimlsmart.org/",
  logo: "https://www.oimlsmart.org/cnml/img/oiml-logo.svg",
};

const ORG_CONTEXT = "https://schema.org";

function publisherObject(org?: Organization) {
  const o = org ?? DEFAULT_PUBLISHER;
  return {
    "@type": "Organization",
    name: o.name,
    url: o.url,
    ...(o.logo ? { logo: { "@type": "ImageObject", url: o.logo } } : {}),
  };
}

export function organizationHomeLd(input: JsonLdInput) {
  return {
    "@context": ORG_CONTEXT,
    "@type": "Organization",
    name: "CNML",
    alternateName: "Certificat Numérique de Métrologie Légale",
    url: input.canonical,
    description: input.description,
    parentOrganization: publisherObject(input.publisher),
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
  };
}

export function techArticleLd(input: JsonLdInput & {
  section: string;
  tags?: string[];
  publishedTime?: string;
  modifiedTime?: string;
}) {
  return {
    "@context": ORG_CONTEXT,
    "@type": "TechArticle",
    headline: input.title,
    description: input.description,
    articleSection: input.section,
    ...(input.publishedTime ? { datePublished: input.publishedTime } : {}),
    ...(input.modifiedTime ? { dateModified: input.modifiedTime } : {}),
    keywords: input.tags?.join(", "),
    author: publisherObject(input.publisher),
    publisher: publisherObject(input.publisher),
    mainEntityOfPage: { "@type": "WebPage", "@id": input.canonical },
    about: "CNML — Certificat Numérique de Métrologie Légale",
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
  };
}

export function articleLd(input: JsonLdInput & {
  section: string;
  tags?: string[];
}) {
  return {
    "@context": ORG_CONTEXT,
    "@type": "Article",
    headline: input.title,
    description: input.description,
    articleSection: input.section,
    keywords: input.tags?.join(", "),
    author: publisherObject(input.publisher),
    publisher: publisherObject(input.publisher),
    mainEntityOfPage: { "@type": "WebPage", "@id": input.canonical },
    about: "CNML — Certificat Numérique de Métrologie Légale",
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
  };
}

export function aboutPageLd(input: JsonLdInput) {
  return {
    "@context": ORG_CONTEXT,
    "@type": "AboutPage",
    name: input.title,
    description: input.description,
    url: input.canonical,
    isPartOf: {
      "@type": "WebSite",
      name: "CNML",
      url: "https://www.oimlsmart.org/cnml/",
    },
    ...(input.imageUrl ? { image: input.imageUrl } : {}),
  };
}

export function faqPageLd(input: JsonLdInput & {
  faqs: Array<{ question: string; answer: string }>;
}) {
  return {
    "@context": ORG_CONTEXT,
    "@type": "FAQPage",
    name: input.title,
    description: input.description,
    url: input.canonical,
    mainEntity: input.faqs.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer },
    })),
  };
}

/**
 * Pick the right builder for a page based on its URL path and the
 * optional `article` prop already used for Open Graph metadata.
 */
export function jsonLdForPage(args: {
  path: string;
  title: string;
  description: string;
  imageUrl?: string;
  article?: { section: string; tags?: string[]; publishedTime?: string; modifiedTime?: string };
}): unknown {
  const canonical = `https://www.oimlsmart.org/cnml${args.path === "/" ? "/" : args.path}`;
  const base: JsonLdInput = {
    canonical,
    title: args.title,
    description: args.description,
    imageUrl: args.imageUrl,
  };
  // Home page: organization.
  if (args.path === "/") return organizationHomeLd(base);
  // Docs: tech article.
  if (args.path.startsWith("/docs/") || args.path === "/docs") {
    return techArticleLd({ ...base, section: args.article?.section ?? "Documentation", tags: args.article?.tags });
  }
  // About pages: AboutPage.
  if (args.path.startsWith("/about/")) return aboutPageLd(base);
  // Audiences and features: Article.
  if (args.path.startsWith("/audiences/") || args.path.startsWith("/features/")) {
    return articleLd({
      ...base,
      section: args.article?.section ?? (args.path.startsWith("/audiences/") ? "Audiences" : "Features"),
      tags: args.article?.tags,
    });
  }
  // Anything else: fall back to a basic WebPage.
  return {
    "@context": ORG_CONTEXT,
    "@type": "WebPage",
    name: args.title,
    description: args.description,
    url: canonical,
  };
}
