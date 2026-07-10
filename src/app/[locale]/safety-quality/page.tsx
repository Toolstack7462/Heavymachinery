import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeader } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { ValueCard } from "@/components/blocks/Cards";
import { Icon } from "@/components/Icon";
import { safetyCommitments } from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.safety,
    description:
      "Safety-led operations, trained operators, maintained equipment and environmental responsibility on every project.",
    path: "/safety-quality",
  });
}

export default async function SafetyQualityPage({
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
        crumbs={[{ label: dict.nav.safety }]}
        eyebrow={dict.nav.safety}
        title="Safety & Quality"
        lead="Safety leads every lift, load and excavation. We plan the method, maintain the machines and train the people who run them."
      />

      <Section>
        <SectionHeader title="Our commitments" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {safetyCommitments.map((c) => (
            <ValueCard key={c.title} value={c} />
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="rounded-2xl border border-ink-100 bg-white p-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Icon name="clipboard" size={24} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-ink-900">
                Certifications & accreditations
              </h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Formal certifications (for example ISO or workplace safety
                accreditations) are intentionally not listed here. We will publish
                them with verified certificate details once provided — we never
                display unverified credentials.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Add verified certifications in{" "}
                <code>src/content/company.ts</code>.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
