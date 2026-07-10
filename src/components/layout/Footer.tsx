import Link from "next/link";
import type { Locale } from "@/config/site";
import { site, telLink, whatsappLink } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { getFooterNav } from "@/config/nav";
import { localeHref } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const footerNav = getFooterNav(dict);
  const year = 2025; // static to avoid hydration drift; update annually

  const socials = Object.entries(site.social).filter(([, v]) => v);

  return (
    <footer className="bg-ink-900 text-ink-200">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Logo locale={locale} invert />
            <p className="mt-4 text-sm text-ink-400 max-w-xs leading-relaxed">
              {dict.footer.tagline}
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Icon name="mapPin" size={18} className="text-brand-400 mt-0.5 shrink-0" />
                <span className="text-ink-300">
                  {site.contact.address.line1}, {site.contact.address.city},{" "}
                  {site.contact.address.country}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone" size={18} className="text-brand-400 shrink-0" />
                <a href={telLink()} className="text-ink-300 hover:text-white tabular-nums">
                  {site.contact.phonePrimary}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" size={18} className="text-brand-400 shrink-0" />
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-ink-300 hover:text-white break-all"
                >
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="clock" size={18} className="text-brand-400 shrink-0" />
                <span className="text-ink-300">{site.contact.hours}</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.quickLinks}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerNav.quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={localeHref(locale, l.href)}
                    className="text-ink-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.ourServices}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerNav.services.map((l) => (
                <li key={l.href}>
                  <Link
                    href={localeHref(locale, l.href)}
                    className="text-ink-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.contact}
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe5a] transition-colors"
              >
                {dict.actions.whatsapp}
              </a>
              <Link
                href={localeHref(locale, "/request-a-quote")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-brand-600 transition-colors"
              >
                {dict.actions.getQuote}
              </Link>
              {socials.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {socials.map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-ink-700 text-ink-300 hover:text-white hover:border-ink-500"
                      aria-label={key}
                    >
                      <Icon name="globe" size={16} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-ink-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-500">
          <p>
            © {year} {site.legalName}. {dict.footer.rights}
          </p>
          <div className="flex items-center gap-5">
            <Link href={localeHref(locale, "/privacy-policy")} className="hover:text-ink-200">
              {dict.footer.privacy}
            </Link>
            <Link href={localeHref(locale, "/terms")} className="hover:text-ink-200">
              {dict.footer.terms}
            </Link>
            <Link href={localeHref(locale, "/sitemap")} className="hover:text-ink-200">
              {dict.footer.sitemap}
            </Link>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-ink-600 leading-relaxed">
          {dict.footer.builtNote}
        </p>
      </div>
    </footer>
  );
}
