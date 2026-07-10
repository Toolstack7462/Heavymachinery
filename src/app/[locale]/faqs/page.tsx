import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
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
    description:
      "Answers to common questions about heavy equipment rental, operated hire, delivery, terms and quotes in Qatar.",
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
      <JsonLd data={faqJsonLd()} />
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.nav.faqs }]}
        eyebrow={dict.sections.faqTitle}
        title={dict.sections.faqTitle}
        lead="Everything you need to know about renting equipment and working with us."
      />
      <Section>
        <div className="mx-auto max-w-3xl divide-y divide-ink-100">
          {faqs.map((f, i) => (
            <details key={i} className="group py-5" name="faq">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-semibold text-ink-900">
                {f.question}
                <Icon
                  name="chevronRight"
                  size={20}
                  className="shrink-0 rotate-90 text-brand-600 transition-transform group-open:-rotate-90"
                />
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
