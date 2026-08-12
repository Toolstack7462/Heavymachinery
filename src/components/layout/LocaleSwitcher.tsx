"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/config";
import type { Locale } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { en } from "@/i18n/dictionaries/en";
import { ar } from "@/i18n/dictionaries/ar";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  en: en.meta.localeShort,
  ar: ar.meta.localeLabel,
};

/**
 * Swaps the leading locale segment of the current path, keeping the rest.
 * Each option carries `hrefLang` and its name in its own language.
 */
export function LocaleSwitcher({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();

  const swap = (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target; // segments[0] is "", segments[1] is the locale
    return segments.join("/") || `/${target}`;
  };

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-lg border border-ink-200"
      role="group"
      aria-label={dict.meta.localeLabel}
    >
      {locales.map((option) => (
        <Link
          key={option}
          href={swap(option)}
          hrefLang={option}
          lang={option}
          aria-current={option === locale ? "true" : undefined}
          // 44px minimum height: this is a primary control in the mobile
          // header, not a desktop afterthought.
          className={cn(
            "inline-flex min-h-[44px] min-w-[2.75rem] items-center justify-center px-2.5 text-xs font-semibold transition-colors",
            option === locale
              ? "bg-ink-900 text-white"
              : "bg-white text-ink-600 hover:bg-ink-50 hover:text-ink-900",
          )}
        >
          {labels[option]}
        </Link>
      ))}
    </div>
  );
}
