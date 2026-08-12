import type { Locale } from "@/config/site";
import { site, mailtoLink, mapLink } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { Icon } from "@/components/Icon";

/**
 * Contact details panel.
 *
 * Rows render only where the company profile actually supplies a value. No
 * telephone, WhatsApp or opening-hours row exists, because no such detail was
 * provided — an empty or invented row would be worse than its absence.
 */
export function ContactInfo({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const address = `${site.contact.address.city}, ${site.contact.address.country}`;
  const addressAr = locale === "ar" ? "ينبع البحر، المملكة العربية السعودية" : address;

  const rows = [
    {
      icon: "mapPin",
      label: dict.footer.address,
      value: addressAr,
      href: mapLink(),
      external: true,
    },
    {
      icon: "mail",
      label: dict.footer.email,
      value: site.contact.email,
      href: mailtoLink(site.positioning),
      external: false,
    },
    {
      icon: "globe",
      label: dict.footer.website,
      value: "www.jowain.net",
      href: site.url,
      external: true,
    },
  ];

  return (
    <div className="rounded-2xl border border-ink-150 bg-surface-muted p-6">
      <ul className="space-y-5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-ink-150">
              <Icon name={row.icon} size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {row.label}
              </p>
              {/* 44px row on touch; the value keeps its visual size. */}
              <a
                href={row.href}
                target={row.external ? "_blank" : undefined}
                rel={row.external ? "noopener noreferrer" : undefined}
                className="-my-2 flex min-h-[44px] items-center break-words py-2 font-medium text-ink-900 transition-colors hover:text-brand-700 lg:my-0 lg:min-h-0 lg:py-0"
              >
                {row.value}
              </a>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-ink-150 pt-5 text-sm leading-relaxed text-muted-foreground">
        {dict.labels.operatorsNote}
      </p>
    </div>
  );
}
