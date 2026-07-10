"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames } from "@/i18n/config";
import type { Locale } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Swaps the leading locale segment of the current path, preserving the rest.
 * Query strings are dropped intentionally (kept simple & robust).
 */
export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const swap = (target: Locale) => {
    const segments = pathname.split("/");
    // segments[0] === "" , segments[1] === current locale
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-ink-200 overflow-hidden">
      {locales.map((l) => (
        <Link
          key={l}
          href={swap(l)}
          hrefLang={l}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "px-2.5 py-1.5 text-xs font-semibold transition-colors",
            l === locale
              ? "bg-ink-900 text-white"
              : "bg-white text-ink-600 hover:bg-ink-50",
          )}
        >
          {l === "ar" ? localeNames.ar : "EN"}
        </Link>
      ))}
    </div>
  );
}
