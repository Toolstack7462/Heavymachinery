import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { images, unsplash } from "@/config/images";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText } from "@/lib/seo";
import { localeHref } from "@/lib/utils";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeader } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { ValueCard } from "@/components/blocks/Cards";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { overview, vision, mission, coreValues } from "@/content/company";
import { equipmentCategories } from "@/content/equipment";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.about,
    description: seoText.about[locale],
    path: "/about",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const facts = [
    {
      label: dict.labels.established,
      value: String(site.foundedYear),
      icon: "calendar",
    },
    {
      label: dict.labels.experience,
      value: dict.labels.yearsPlus,
      icon: "gauge",
    },
    {
      label: dict.labels.location,
      value:
        locale === "ar"
          ? "ينبع البحر، السعودية"
          : `${site.contact.address.city}, ${site.contact.address.country}`,
      icon: "mapPin",
    },
    {
      label: dict.labels.coverage,
      value: dict.hero.metaCoverage,
      icon: "map",
    },
    {
      label: dict.labels.equipmentGroups,
      value: String(equipmentCategories.length),
      icon: "layers",
    },
  ];

  return (
    <>
      <PageHero
        image={images.siteDusk}
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.nav.about }]}
        title={dict.pages.aboutTitle}
        lead={dict.pages.aboutLead}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="prose-article">
              {overview[locale].map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <aside className="lg:col-span-5">
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-ink-150 bg-surface-muted p-6">
                <dl className="divide-y divide-ink-150">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-ink-150">
                        <Icon name={fact.icon} size={18} />
                      </span>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {fact.label}
                        </dt>
                        <dd className="mt-0.5 font-heading font-bold text-ink-900">
                          {fact.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <Button
                  href={localeHref(locale, "/why-choose-us")}
                  variant="outline"
                  className="mt-6 w-full"
                  iconEnd="arrowRight"
                >
                  {dict.pages.whyTitle}
                </Button>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>

      {/* Full-bleed capability band */}
      <section className="relative h-[260px] overflow-hidden md:h-[400px]">
        <Image
          src={unsplash(images.siteDusk.id, 1920, 74)}
          alt={locale === "ar" ? images.siteDusk.altAr : images.siteDusk.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-transparent"
          aria-hidden="true"
        />
        <div className="container-page relative flex h-full items-center">
          <p className="max-w-lg font-heading text-xl font-bold leading-snug text-white md:text-3xl">
            {dict.hero.tagline}
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <Section muted>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              kicker: dict.pages.visionKicker,
              title: dict.pages.visionTitle,
              body: vision[locale],
              icon: "gauge",
            },
            {
              kicker: dict.pages.missionKicker,
              title: dict.pages.missionTitle,
              body: mission[locale],
              icon: "medal",
            },
          ].map((block, index) => (
            <Reveal key={block.title} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-ink-150 bg-white p-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <Icon name={block.icon} size={24} />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-brand-700">
                  {block.kicker}
                </p>
                <h2 className="mt-2 text-2xl">{block.title}</h2>
                {block.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Core values */}
      <Section>
        <SectionHeader
          title={dict.home.valuesTitle}
          subtitle={dict.home.valuesSubtitle}
          align="center"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {coreValues.map((value, index) => (
            <Reveal key={value.key} delay={index * 0.06}>
              <ValueCard locale={locale} value={value} numbered={index + 1} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
