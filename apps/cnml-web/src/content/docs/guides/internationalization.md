---
title: Internationalization
coord: GUIDE / 06
---

# Internationalization

This guide covers CNML's internationalization (i18n) model: per-element
language tagging, locale switching, and the planned language tiers.

## Per-element language model

CNML XML uses `xml:lang` on individual elements. This follows the W3C
convention and allows mixed-language documents:

```xml
<cnml:name xml:lang="en">Non-automatic weighing instruments</cnml:name>
<cnml:name xml:lang="fr">Instruments de pesage non automatiques</cnml:name>
```

The per-Recommendation schemas declare which fields are language-tagged.
A field like `cnml:name` may appear multiple times with different
`xml:lang` values.

## Locale switching

The web app provides a locale switcher (EN / FR) in the header. The
locale is stored in `localStorage` and applied via the `useLocale`
composable:

```typescript
import { translate, getStoredLocale, setStoredLocale } from "../composables/useLocale";

setStoredLocale("fr");
const label = translate("nav.about");
```

Locale files live at `src/locales/en.json` and `src/locales/fr.json`.
Adding a locale requires one JSON file and one entry in the `Locale`
type.

## Planned language tiers

The initial language coverage targets the OIML official languages
(English and French). The i18n infrastructure is in place for
additional languages. When a new OIML member state joins a pilot,
their language can be added without code changes.

Full routing-based i18n (URL prefixes like `/fr/`, `/en/`) is a
follow-up. The current baseline uses client-side locale switching,
which is sufficient for the proposal stage.

## Schema-level i18n

The per-Recommendation JSON Schemas declare `xml:lang` on
`description` fields. The schema-driven form renders labels in the
schema's declared language. When the schema carries multiple
language variants, the form can present a language selector.
