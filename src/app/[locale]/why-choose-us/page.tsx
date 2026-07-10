import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Icon } from "@/components/Icon";
import { whyChooseUs } from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.whyUs,
    description:
      "Local Qatar experience, a modern fleet, skilled operators, flexible terms and a genuine commitment to safety and service.",
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

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.nav.whyUs }]}
        eyebrow={dict.sections.whyTitle}
        title={dict.sections.whyTitle}
        lead={dict.sections.whySubtitle}
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Icon name={v.icon} size={24} />
              </span>
              <h2 className="mt-4 text-lg font-bold text-ink-900">{v.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
