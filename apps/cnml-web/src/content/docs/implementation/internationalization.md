---
title: Internationalization
description: CNML supports xml:lang attributes per element, per-Recommendation language coverage, and a tiered rollout of OIML working languages.
---

# Internationalization

CNML is designed for the international OIML community from the outset. The format carries language tags on individual elements, the schema set defines per-Recommendation language coverage, and the web application is built to accommodate the OIML working languages. This document describes the internationalization model, the current language coverage, and the planned language tiers.

## The xml:lang attribute

CNML uses the `xml:lang` attribute, defined by XML 1.0 and refined by RFC 4646 (BCP 47), to declare the natural language of an element's text content. The attribute may appear on any element that carries human-readable text, including party names, addresses, footnotes, and free-text descriptions. The value is a language tag such as `en` for English, `fr` for French, `de` for German, `es` for Spanish, `zh` for Chinese, or `ru` for Russian.

A CNML certificate may carry the same text in multiple languages by repeating the element with different `xml:lang` values. For example, an issuing authority's name may appear once in English (`xml:lang="en"`) and once in French (`xml:lang="fr"`), and a verifier renders the form that matches the reader's language preference. The schema layer does not constrain the number of language variants an element may carry, but each variant must use a distinct language tag.

Elements that carry structured data rather than human-readable text (numerical values, unit identifiers, codes from controlled vocabularies, dates, and identifiers) do not carry `xml:lang`. The attribute applies only to elements whose content is meant to be read by a person.

## Per-Recommendation language coverage

Each OIML Recommendation schema declares the language coverage of the fields that are specific to that Recommendation. The shared CORE schema and the shared modules (D 11 environmental classes, power-supply codes, software-identification fields) carry language-neutral controlled vocabularies that reference OIML Recommendation text by clause number. The per-Recommendation fields that carry free text (classification-symbol descriptions, accuracy-class notes, manufacturer-specific remarks) are the fields where `xml:lang` applies.

The schema generator produces type definitions that include an optional `xml:lang` attribute on every free-text field. The form component renders a language selector for each free-text field, allowing the signer to enter the text in one or more languages. The XML serializer emits the `xml:lang` attribute on every element that has a language tag set.

## OIML working languages

The OIML working languages are English, French, and the additional languages that OIML Member States use in their national metrology practice. CNML's internationalization model accommodates the full set of OIML working languages, with a tiered rollout plan that reflects translation capacity and demand.

## Planned language tiers

CNML's language support rolls out in three tiers.

**Tier 1: English.** The initial implementation provides full coverage in English. All schema labels, form widgets, verifier messages, error descriptions, and documentation pages are authored in English. The twenty-two per-Recommendation schemas carry English controlled-vocabulary labels. The test vectors and the corpus of real certificate instances are processed and normalized in English. This tier covers the working language of the OIML-CS certificate system as currently operated and the primary language of international OIML correspondence.

**Tier 2: French.** French is an official language of OIML alongside English. The second tier adds French translations for the schema labels, the form widgets, the verifier messages, and the documentation pages. The per-Recommendation schemas gain French controlled-vocabulary labels, produced in coordination with BIML and the French-speaking OIML Member States. Certificates may carry French `xml:lang` variants of all free-text fields.

**Tier 3: Additional OIML working languages.** The third tier adds support for German, Spanish, Chinese, Russian, and the other languages that OIML Member States use in national metrology practice. The scope of tier 3 language support is determined by Member State demand and by the availability of controlled-vocabulary translations for each Recommendation. A Member State that needs a specific language for its national deployment can contribute the controlled-vocabulary translations, and the schema set gains that language as a supported option.

The tier structure reflects the practical constraint that controlled-vocabulary translation is a substantial undertaking. The D 11 environmental classes, the R 60 accuracy classes, and the R 117 accuracy-encoding scheme each carry dozens of terms that require precise translation in coordination with the relevant OIML Recommendation secretariat. The tier structure ensures that each language is added when its translation set is complete and reviewed, rather than shipping partial translations that could mislead verifiers.

## Unit and quantity internationalization

CNML references measurement units through UnitsML, anchored to the BIPM Digital SI for authoritative definitions. The unit identifiers are language-neutral (the symbol for kilogram is `kg` in every language). The unit names rendered in the web application may be localized, but the underlying unit reference is always the canonical UnitsML identifier. This design ensures that a verifier in any language reads the same numerical value with the same unit dimension, even when the display name of the unit differs.

## Web application localization

The web application uses the standard browser locale to select the display language for its user interface. The schema labels, form-widget labels, verifier messages, and documentation pages are served from a localization table keyed by language tag. When a translation is not yet available for the reader's preferred language, the application falls back to English. The fallback is visible to the reader (an untranslated label appears in English rather than being silently omitted), so that the reader can report gaps to the OIML SMART programme.

## Proposal status

CNML is a proposal for OIML from the OIML SMART programme. The internationalization model described here is a draft architecture. The language tiers, the per-Recommendation coverage, and the localization-table structure are subject to revision as the proposal evolves and as OIML Member States contribute translations.

## See also

- [System architecture](/docs/architecture/system) describes the certificate model that carries the `xml:lang` attributes.
- [For developers](/docs/roles/for-developers) covers the contribution workflow for schema translations and localization-table additions.
