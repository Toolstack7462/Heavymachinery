import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ContactInfo } from "@/components/blocks/ContactInfo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.quote,
    description:
      "Request a quote for heavy equipment rental or contracting services in Qatar. Fast response with availability and pricing.",
    path: "/request-a-quote",
  });
}

export default async function QuotePage({
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
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.nav.quote }]}
        title={dict.sections.quoteTitle}
        lead={dict.sections.quoteSubtitle}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-ink-100 bg-white p-6 md:p-8 shadow-[var(--shadow-card)]">
              <EnquiryForm dict={dict} variant="quote" defaultEquipment={equipment} />
            </div>
          </div>
          <div className="lg:col-span-5">
            <ContactInfo dict={dict} />
          </div>
        </div>
      </Section>
    </>
  );
}
