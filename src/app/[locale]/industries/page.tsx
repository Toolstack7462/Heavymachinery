import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Icon } from "@/components/Icon";
import { industries } from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.industries,
    description:
      "We support construction, infrastructure, industrial, oil & gas, demolition, landscaping and events projects across Qatar.",
    path: "/industries",
  });
}

export default async function IndustriesPage({
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
        crumbs={[{ label: dict.nav.industries }]}
        eyebrow={dict.sections.industriesTitle}
        title={dict.sections.industriesTitle}
        lead={dict.sections.industriesSubtitle}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {industries.map((ind) => (
            <div
              key={ind.slug}
              id={ind.slug}
              className="flex gap-5 rounded-2xl border border-ink-100 bg-white p-6 scroll-mt-24 shadow-[var(--shadow-card)]"
            >
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Icon name={ind.icon} size={28} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-ink-900">{ind.title}</h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {ind.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
