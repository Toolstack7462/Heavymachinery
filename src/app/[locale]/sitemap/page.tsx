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
import { insights } from "@/content/insights";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.footer.sitemap,
    description: "Browse every page on the website.",
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

  const columns: { title: string; links: { label: string; href: string }[] }[] =
    [
      {
        title: dict.footer.quickLinks,
        links: [
          { label: dict.nav.home, href: "/" },
          { label: dict.nav.about, href: "/about" },
          { label: dict.nav.leadership, href: "/leadership" },
          { label: dict.nav.industries, href: "/industries" },
          { label: dict.nav.safety, href: "/safety-quality" },
          { label: dict.nav.whyUs, href: "/why-choose-us" },
          { label: dict.nav.projects, href: "/projects" },
          { label: dict.nav.faqs, href: "/faqs" },
          { label: dict.nav.contact, href: "/contact" },
          { label: dict.nav.quote, href: "/request-a-quote" },
          { label: dict.footer.privacy, href: "/privacy-policy" },
          { label: dict.footer.terms, href: "/terms" },
        ],
      },
      {
        title: dict.nav.services,
        links: [
          { label: `${dict.nav.services} (index)`, href: "/services" },
          ...services.map((s) => ({
            label: s.title,
            href: `/services/${s.slug}`,
          })),
        ],
      },
      {
        title: dict.nav.fleet,
        links: [
          { label: `${dict.nav.fleet} (index)`, href: "/fleet" },
          ...equipment.map((e) => ({
            label: e.name,
            href: `/fleet/${e.slug}`,
          })),
        ],
      },
      {
        title: dict.nav.insights,
        links: [
          { label: `${dict.nav.insights} (index)`, href: "/insights" },
          ...insights.map((i) => ({
            label: i.title,
            href: `/insights/${i.slug}`,
          })),
        ],
      },
    ];

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.footer.sitemap }]}
        title={dict.footer.sitemap}
        lead="Every page on this website, in one place."
      />
      <Section>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-brand-700">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={localeHref(locale, l.href)}
                      className="text-ink-700 hover:text-brand-700 transition-colors"
                    >
                      {l.label}
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
