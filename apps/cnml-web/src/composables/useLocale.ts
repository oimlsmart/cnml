/**
 * i18n locale helper (TODO.cnml/46).
 *
 * Minimal client-side locale switching. Reads the user's locale
 * from localStorage (default "en"), loads the corresponding JSON
 * from src/locales/, and provides a t(key) function.
 *
 * Full routing-based i18n (/fr/, /en/ prefixes) is a follow-up.
 * This baseline proves the infrastructure: the locale files, the
 * switcher, and the t() function are all in place.
 */

import en from "../locales/en.json";
import fr from "../locales/fr.json";

export type Locale = "en" | "fr";

const messages: Record<Locale, Record<string, string>> = {
  en: en as Record<string, string>,
  fr: fr as Record<string, string>,
};

const STORAGE_KEY = "cnml-locale";

export function getStoredLocale(): Locale {
  if (typeof localStorage === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "fr" || stored === "en" ? stored : "en";
}

export function setStoredLocale(locale: Locale): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

export function translate(key: string, locale: Locale = getStoredLocale()): string {
  return messages[locale]?.[key] ?? messages.en?.[key] ?? key;
}
