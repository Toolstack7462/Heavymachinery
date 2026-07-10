import type { Locale } from "@/config/site";
import { en, type Dictionary } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

/** Synchronous dictionary lookup (dictionaries are static TS objects). */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

export type { Dictionary };
