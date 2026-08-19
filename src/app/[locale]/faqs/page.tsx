import type { Metadata } from "next";
import { images } from "@/config/images";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, faqJsonLd, seoText } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icon";
import { faqs } from "@/content/faqs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.faqs,
    description: seoText.faqs[locale],
    path: "/faqs",
  });
}

export default async function FaqsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <JsonLd data={faqJsonLd(locale)} />
      <PageHero
        image={images.earthworks}
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.nav.faqs }]}
        title={dict.pages.faqsTitle}
        lead={dict.pages.faqsLead}
      />
      <Section>
        <div className="mx-auto max-w-3xl divide-y divide-ink-150">
          {/*
            The vertical padding lives on <summary>, not on <details>: the
            summary is the element you tap, and on <details> it produced a 24px
            touch target for single-line questions.
          */}
          {faqs.map((faq) => (
            <details key={faq.question.en} className="group" name="faq">
              <summary className="flex list-none items-center justify-between gap-4 py-5 font-heading text-base font-semibold text-ink-900 md:text-lg">
                {faq.question[locale]}
                <Icon
                  name="chevronRight"
                  size={20}
                  className="shrink-0 rotate-90 text-brand-600 transition-transform duration-200 group-open:-rotate-90"
                />
              </summary>
              <p className="measure -mt-1 pb-5 leading-relaxed text-muted-foreground">
                {faq.answer[locale]}
              </p>
            </details>
          ))}
        </div>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
