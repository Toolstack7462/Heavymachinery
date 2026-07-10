import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { categoryImages, unsplash } from "@/config/images";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { localeHref } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/Section";
import { Hero } from "@/components/home/Hero";
import { CtaBand } from "@/components/blocks/CtaBand";
import {
  ServiceCard,
  IndustryCard,
  ValueCard,
  InsightCard,
} from "@/components/blocks/Cards";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { services } from "@/content/services";
import { equipmentCategories } from "@/content/equipment";
import { industries, values, whyChooseUs, stats, SHOW_STATS } from "@/content/company";
import { insights } from "@/content/insights";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    title: site.tagline,
    description: site.descriptionLong,
    path: "/",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const verifiedStats = stats.filter((s) => SHOW_STATS || s.verified);

  return (
    <>
      <Hero locale={locale} dict={dict} />

      {/* Stats strip (only verified figures shown unless SHOW_STATS enabled) */}
      {verifiedStats.length > 0 && (
        <section className="border-y border-ink-100 bg-surface-muted">
          <div className="container-page py-8">
            <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {verifiedStats.map((s) => (
                <div key={s.label} className="text-center">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-3xl md:text-4xl font-extrabold text-brand-600">
                      {s.value}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Services */}
      <Section>
        <SectionHeader
          title={dict.sections.servicesTitle}
          subtitle={dict.sections.servicesSubtitle}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard
              key={s.slug}
              locale={locale}
              service={s}
              cta={dict.actions.learnMore}
            />
          ))}
        </div>
      </Section>

      {/* Fleet categories */}
      <Section muted>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            title={dict.sections.fleetTitle}
            subtitle={dict.sections.fleetSubtitle}
          />
          <Button
            href={localeHref(locale, "/fleet")}
            variant="outline"
            iconEnd="arrowRight"
          >
            {dict.actions.viewFleet}
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {equipmentCategories.map((cat) => {
            const cover = categoryImages[cat.key];
            return (
              <Link
                key={cat.key}
                href={localeHref(locale, `/fleet?category=${cat.key}`)}
                className="group relative flex min-h-[19rem] flex-col justify-end overflow-hidden rounded-2xl bg-ink-900 p-6 text-white transition-transform duration-300 hover:-translate-y-1 active:scale-[0.99]"
              >
                {cover && (
                  <Image
                    src={unsplash(cover.id, 640, 68)}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
                  />
                )}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/10"
                  aria-hidden="true"
                />
                <div className="relative">
                  <Icon name={cat.icon} size={32} className="text-brand-400" />
                  <h3 className="mt-3 text-lg font-bold">{cat.title}</h3>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed">
                    {cat.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400">
                    {dict.actions.viewDetails}
                    <Icon
                      name="arrowRight"
                      size={16}
                      className="transition-transform group-hover:translate-x-1 rtl:rotate-180"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Why choose us */}
      <Section>
        <SectionHeader
          title={dict.sections.whyTitle}
          subtitle={dict.sections.whySubtitle}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.slice(0, 8).map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-ink-100 bg-white p-5"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Icon name={v.icon} size={22} />
              </span>
              <h3 className="mt-4 font-bold text-ink-900">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Values / safety */}
      <Section muted>
        <SectionHeader
          title={dict.sections.valuesTitle}
          align="center"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <ValueCard key={v.title} value={v} />
          ))}
        </div>
      </Section>

      {/* Industries */}
      <Section>
        <SectionHeader
          title={dict.sections.industriesTitle}
          subtitle={dict.sections.industriesSubtitle}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <IndustryCard key={i.slug} locale={locale} industry={i} />
          ))}
        </div>
      </Section>

      {/* Insights */}
      <Section muted>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader title={dict.nav.insights} />
          <Button
            href={localeHref(locale, "/insights")}
            variant="outline"
            iconEnd="arrowRight"
          >
            {dict.actions.viewAll}
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {insights.slice(0, 3).map((i) => (
            <InsightCard
              key={i.slug}
              locale={locale}
              insight={i}
              readLabel="min read"
            />
          ))}
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
