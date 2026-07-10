import type { Locale } from "@/config/site";
import { site, telLink, whatsappLink } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { Icon } from "@/components/Icon";

/** Reusable contact details panel (used on Contact & Quote pages). */
export function ContactInfo({ dict }: { locale?: Locale; dict: Dictionary }) {
  const rows = [
    {
      icon: "mapPin",
      label: dict.footer.address,
      value: `${site.contact.address.line1}, ${site.contact.address.city}, ${site.contact.address.country}`,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.contact.address.mapQuery)}`,
    },
    {
      icon: "phone",
      label: dict.footer.phone,
      value: site.contact.phonePrimary,
      href: telLink(),
    },
    {
      icon: "phone",
      label: dict.footer.phone,
      value: site.contact.phoneSecondary,
      href: `tel:${site.contact.phoneSecondary.replace(/\s/g, "")}`,
    },
    {
      icon: "mail",
      label: dict.footer.email,
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
    {
      icon: "clock",
      label: dict.footer.hours,
      value: site.contact.hours,
    },
  ];

  return (
    <div className="rounded-2xl border border-ink-100 bg-surface-muted p-6">
      <ul className="space-y-5">
        {rows.map((r, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-ink-100">
              <Icon name={r.icon} size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {r.label}
              </p>
              {r.href ? (
                <a
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-0.5 block font-medium text-ink-900 hover:text-brand-700 break-words"
                >
                  {r.value}
                </a>
              ) : (
                <p className="mt-0.5 font-medium text-ink-900">{r.value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 font-semibold text-white hover:bg-[#1ebe5a] transition-colors"
      >
        <Icon name="phone" size={18} />
        {dict.actions.whatsapp}
      </a>
    </div>
  );
}
