import type { Metadata } from "next";
import { images } from "@/config/images";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { IndustryCard } from "@/components/blocks/Cards";
import { Reveal } from "@/components/motion/Reveal";
import { industries } from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.industries,
    description: seoText.industries[locale],
    path: "/industries",
  });
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        image={images.earthworks}
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.nav.industries }]}
        title={dict.pages.industriesTitle}
        lead={dict.pages.industriesLead}
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {industries.map((industry, index) => (
            <Reveal key={industry.slug} delay={(index % 2) * 0.06}>
              <IndustryCard
                locale={locale}
                industry={industry}
                headingLevel={2}
              />
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
