import type { Locale } from "@/config/site";

/**
 * Bilingual content primitives. Every piece of page copy in src/content/* is
 * stored as `{ en, ar }` so the Arabic route never falls back to English.
 */
export type L = { readonly en: string; readonly ar: string };
export type LL = { readonly en: readonly string[]; readonly ar: readonly string[] };

/** Pick the string for a locale. */
export function t(value: L, locale: Locale): string {
  return value[locale];
}

/** Pick the list for a locale. */
export function tl(value: LL, locale: Locale): readonly string[] {
  return value[locale];
}
