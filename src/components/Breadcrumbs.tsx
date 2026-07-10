import Link from "next/link";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { localeHref } from "@/lib/utils";
import { Icon } from "@/components/Icon";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Accessible breadcrumbs + matching BreadcrumbList JSON-LD.
 */
export function Breadcrumbs({
  locale,
  homeLabel,
  items,
}: {
  locale: Locale;
  homeLabel: string;
  items: Crumb[];
}) {
  const all: Crumb[] = [{ label: homeLabel, href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href
        ? { item: `${site.url}${localeHref(locale, c.href)}` }
        : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-500">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link
                  href={localeHref(locale, c.href)}
                  className="hover:text-brand-700 transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-ink-800 font-medium" aria-current="page">
                  {c.label}
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
