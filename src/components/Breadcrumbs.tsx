import Link from "next/link";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { localeHref } from "@/lib/utils";
import { Icon } from "@/components/Icon";

export interface Crumb {
  label: string;
  href?: string;
}

/** Accessible breadcrumbs + matching BreadcrumbList JSON-LD. */
export function Breadcrumbs({
  locale,
  homeLabel,
  label,
  items,
}: {
  locale: Locale;
  homeLabel: string;
  /** Localized accessible name for the nav landmark. */
  label: string;
  items: Crumb[];
}) {
  const all: Crumb[] = [{ label: homeLabel, href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      ...(crumb.href
        ? { item: `${site.url}${localeHref(locale, crumb.href)}` }
        : {}),
    })),
  };

  return (
    <nav aria-label={label} className="text-sm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ink-600, not ink-500: breadcrumbs sit on the muted band where
          ink-500 drops to ~4.4:1. */}
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-600">
        {all.map((crumb, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {crumb.href && !last ? (
                // py-3/-my-3 grows the tap target to 44px without growing the
                // row: hit area and visual size are allowed to differ.
                <Link
                  href={localeHref(locale, crumb.href)}
                  className="-mx-2 -my-3 inline-flex min-w-[44px] items-center justify-center px-2 py-3 transition-colors hover:text-brand-700"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-ink-800" aria-current="page">
                  {crumb.label}
                </span>
              )}
              {!last && (
                <Icon
                  name="chevronRight"
                  size={14}
                  className="opacity-50 rtl:rotate-180"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
