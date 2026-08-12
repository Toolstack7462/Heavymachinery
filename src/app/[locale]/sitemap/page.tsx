import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { localeHref } from "@/lib/utils";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { services } from "@/content/services";
import { equipment } from "@/content/equipment";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.pages.sitemapTitle,
    description: dict.pages.sitemapLead,
    path: "/sitemap",
  });
}

export default async function HtmlSitemapPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const columns = [
    {
      title: dict.footer.quickLinks,
      links: [
        { label: dict.nav.home, href: "/" },
        { label: dict.nav.about, href: "/about" },
        { label: dict.nav.quality, href: "/quality" },
        { label: dict.pages.whyTitle, href: "/why-choose-us" },
        { label: dict.nav.industries, href: "/industries" },
        { label: dict.nav.clients, href: "/clients" },
        { label: dict.nav.faqs, href: "/faqs" },
        { label: dict.nav.contact, href: "/contact" },
        { label: dict.pages.requestTitle, href: "/request-a-quote" },
        { label: dict.footer.privacy, href: "/privacy-policy" },
        { label: dict.footer.terms, href: "/terms" },
      ],
    },
    {
      title: dict.nav.services,
      links: [
        { label: dict.pages.servicesTitle, href: "/services" },
        ...services.map((service) => ({
          label: service.title[locale],
          href: `/services/${service.slug}`,
        })),
      ],
    },
    {
      title: dict.nav.fleet,
      links: [
        { label: dict.pages.fleetTitle, href: "/fleet" },
        ...equipment.map((item) => ({
          label: item.name[locale],
          href: `/fleet/${item.slug}`,
        })),
      ],
    },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.pages.sitemapTitle }]}
        title={dict.pages.sitemapTitle}
        lead={dict.pages.sitemapLead}
      />
      <Section>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-brand-700">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localeHref(locale, link.href)}
                      className="text-ink-700 transition-colors hover:text-brand-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
