import type { Metadata } from "next";
import { images } from "@/config/images";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { whyChooseUs, fleetHighlights } from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.pages.whyTitle,
    description: seoText.why[locale],
    path: "/why-choose-us",
  });
}

export default async function WhyChooseUsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const reasons = [...whyChooseUs, ...fleetHighlights];

  return (
    <>
      <PageHero
        image={images.siteDusk}
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.pages.whyTitle }]}
        title={dict.pages.whyTitle}
        lead={dict.pages.whyLead}
      />
      <Section>
        <ol className="divide-y divide-ink-150 border-y border-ink-150">
          {reasons.map((reason, index) => (
            <li key={reason.key}>
              <Reveal>
                <div className="grid items-start gap-5 py-8 md:grid-cols-12 md:gap-8">
                  <div className="flex items-center gap-4 md:col-span-4">
                    <span
                      className="font-heading text-3xl font-extrabold text-ink-200"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                      <Icon name={reason.icon} size={24} />
                    </span>
                  </div>
                  <div className="md:col-span-8">
                    <h2 className="text-xl md:text-2xl">
                      {reason.title[locale]}
                    </h2>
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {reason.description[locale]}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
