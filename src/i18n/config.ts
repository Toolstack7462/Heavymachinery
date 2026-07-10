import { site, type Locale } from "@/config/site";

export const locales = site.locales;
export const defaultLocale = site.defaultLocale;

export type { Locale };

/** Text direction per locale. */
export function dir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Human-readable locale names (in their own language). */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
