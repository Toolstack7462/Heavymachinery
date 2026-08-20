import Link from "next/link";
import type { Locale } from "@/config/site";
import { site, mailtoLink, mapLink } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { getFooterNav } from "@/config/nav";
import { localeHref } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/Button";

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const footerNav = getFooterNav(dict, locale);
  /** Static so the server and client render identically. Review annually. */
  const year = 2026;
  const socials = Object.entries(site.social).filter(([, url]) => url);
  const address =
    locale === "ar"
      ? "ينبع البحر، المملكة العربية السعودية"
      : `${site.contact.address.city}, ${site.contact.address.country}`;

  return (
    <footer className="bg-ink-900 text-ink-200">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-3">
            <Logo locale={locale} invert size={44} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-400">
              {dict.footer.tagline}
            </p>
            <ul className="mt-6 text-sm lg:space-y-3">
              <li className="flex items-start gap-3">
                <Icon
                  name="mapPin"
                  size={18}
                  className="mt-3 shrink-0 text-accent-300 lg:mt-0.5"
                />
                <a
                  href={mapLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center text-ink-300 transition-colors hover:text-white lg:min-h-0"
                >
                  {address}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon
                  name="mail"
                  size={18}
                  className="mt-3 shrink-0 text-accent-300 lg:mt-0.5"
                />
                <a
                  href={mailtoLink(site.positioning)}
                  className="flex min-h-[44px] items-center break-all text-ink-300 transition-colors hover:text-white lg:min-h-0"
                >
                  {site.contact.email}
                </a>
              </li>
              {site.contact.phones.map((phone) => (
                <li key={phone.e164} className="flex items-start gap-3">
                  <Icon
                    name="phone"
                    size={18}
                    className="mt-3 shrink-0 text-accent-300 lg:mt-0.5"
                  />
                  <a
                    href={`tel:${phone.e164}`}
                    dir="ltr"
                    className="flex min-h-[44px] items-center text-ink-300 tabular-nums transition-colors hover:text-white lg:min-h-0"
                  >
                    {phone.display}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Icon
                  name="globe"
                  size={18}
                  className="mt-3 shrink-0 text-accent-300 lg:mt-0.5"
                />
                <span className="flex min-h-[44px] items-center text-ink-300 lg:min-h-0">
                  {site.contact.website}
                </span>
              </li>
            </ul>
            <Button
              href={localeHref(locale, "/request-a-quote")}
              size="sm"
              className="mt-6"
              iconEnd="arrowRight"
            >
              {dict.actions.request}
            </Button>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-ink-300 transition-colors hover:border-ink-500 hover:text-white"
                    aria-label={key}
                  >
                    <Icon name="globe" size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterColumn
            title={dict.footer.quickLinks}
            links={footerNav.company}
            locale={locale}
          />
          <FooterColumn
            title={dict.footer.equipment}
            links={footerNav.equipment}
            locale={locale}
          />
          <FooterColumn
            title={dict.nav.services}
            links={footerNav.services}
            locale={locale}
          />
        </div>

        {/* Bottom bar */}
        {/* ink-400 not ink-500: ink-500 on ink-900 measures 3.4:1 and fails AA. */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-ink-800 pt-6 text-xs text-ink-400 md:flex-row md:items-center">
          {/* legalName already ends in a full stop — no extra punctuation. */}
          <p>
            © {year} {site.legalName} {dict.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-5">
            {[
              { label: dict.footer.privacy, href: "/privacy-policy" },
              { label: dict.footer.terms, href: "/terms" },
              { label: dict.footer.sitemap, href: "/sitemap" },
            ].map((link) => (
              <Link
                key={link.href}
                href={localeHref(locale, link.href)}
                // -mx-1/px-1 widens the shortest label ("Sitemap", 42px) past
                // the 44px minimum without spacing the row differently.
                className="-mx-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-1 transition-colors hover:text-ink-200 md:min-h-0"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  locale,
}: {
  title: string;
  links: { label: string; href: string }[];
  locale: Locale;
}) {
  return (
    <div className="lg:col-span-3">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h2>
      {/*
        Comfortable 44px rows on touch, tight rows from lg up where the input
        is a mouse. Dense footer link lists are the most commonly missed touch
        target on a marketing site.
      */}
      <ul className="mt-3 text-sm lg:mt-4 lg:space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={localeHref(locale, link.href)}
              className="flex min-h-[44px] items-center text-ink-400 transition-colors hover:text-white lg:min-h-0"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
