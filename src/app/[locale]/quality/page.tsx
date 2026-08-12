import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeader } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { ValueCard } from "@/components/blocks/Cards";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/motion/Reveal";
import {
  qualityPhilosophy,
  qualityPractice,
  qualityCommitments,
  fleetHighlights,
} from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.quality,
    description: seoText.quality[locale],
    path: "/quality",
  });
}

export default async function QualityPage({
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
        crumbs={[{ label: dict.nav.quality }]}
        title={dict.pages.qualityTitle}
        lead={dict.pages.qualityLead}
      />

      {/* Philosophy — a single, quiet statement, given room to be read */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <span className="rule" aria-hidden="true" />
            <h2 className="mt-5 text-2xl md:text-3xl">
              {dict.pages.qualityPhilosophyTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-ink-700">
              {qualityPhilosophy[locale]}
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              {qualityPractice[locale]}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* The four named practices */}
      <Section muted>
        <SectionHeader title={dict.pages.qualityPracticeTitle} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {qualityCommitments.map((commitment, index) => (
            <Reveal key={commitment.key} delay={(index % 2) * 0.06}>
              <ValueCard locale={locale} value={commitment} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Fleet readiness */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {fleetHighlights.map((highlight, index) => (
            <Reveal key={highlight.key} delay={index * 0.06}>
              <div className="flex h-full gap-5 rounded-2xl border border-ink-150 bg-white p-6">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100">
                  <Icon name={highlight.icon} size={24} />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-bold text-ink-900">
                    {highlight.title[locale]}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {highlight.description[locale]}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
