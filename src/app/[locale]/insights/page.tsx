import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { InsightCard } from "@/components/blocks/Cards";
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
    title: dict.nav.insights,
    description:
      "Guides and tips on heavy equipment selection, rental, transport and safe lifting for construction projects in Qatar.",
    path: "/insights",
  });
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.nav.insights }]}
        title="Insights & Guides"
        lead="Practical, no-nonsense guidance on choosing, renting and running heavy equipment."
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((i) => (
            <InsightCard
              key={i.slug}
              locale={locale}
              insight={i}
              readLabel="min read"
            />
          ))}
        </div>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
