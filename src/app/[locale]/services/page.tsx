import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { ServiceCard } from "@/components/blocks/Cards";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/content/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.services,
    description: seoText.services[locale],
    path: "/services",
  });
}

export default async function ServicesPage({
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
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.nav.services }]}
        title={dict.pages.servicesTitle}
        lead={dict.pages.servicesLead}
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={(index % 3) * 0.06}>
              <ServiceCard
                locale={locale}
                service={service}
                cta={dict.actions.viewDetails}
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
