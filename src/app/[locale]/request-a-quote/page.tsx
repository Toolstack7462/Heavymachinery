import type { Metadata } from "next";
import { images } from "@/config/images";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ContactInfo } from "@/components/blocks/ContactInfo";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.pages.requestTitle,
    description: seoText.request[locale],
    path: "/request-a-quote",
  });
}

export default async function RequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ equipment?: string }>;
}) {
  const { locale } = await params;
  const { equipment } = await searchParams;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        image={images.fleetLineup}
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.pages.requestTitle }]}
        title={dict.pages.requestTitle}
        lead={dict.pages.requestLead}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="rounded-2xl border border-ink-150 bg-white p-6 md:p-8">
              <EnquiryForm
                locale={locale}
                dict={dict}
                variant="request"
                defaultEquipment={equipment}
              />
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <ContactInfo locale={locale} dict={dict} />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
