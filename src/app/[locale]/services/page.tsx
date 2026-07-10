import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { ServiceCard } from "@/components/blocks/Cards";
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
    description:
      "Heavy equipment rental, earthworks, transport, lifting, demolition and contracting services across Qatar.",
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
        crumbs={[{ label: dict.nav.services }]}
        title={dict.nav.services}
        lead={dict.sections.servicesSubtitle}
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard
              key={s.slug}
              locale={locale}
              service={s}
              cta={dict.actions.viewDetails}
            />
          ))}
        </div>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
