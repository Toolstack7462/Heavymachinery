import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { images, unsplash } from "@/config/images";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText } from "@/lib/seo";
import { localeHref } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/Section";
import { Hero } from "@/components/home/Hero";
import { CtaBand } from "@/components/blocks/CtaBand";
import { ClientWall } from "@/components/blocks/ClientWall";
import { EquipmentCard, IndustryCard } from "@/components/blocks/Cards";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { equipmentCategories, getEquipmentBySlug } from "@/content/equipment";
import { industries, whyChooseUs, overview } from "@/content/company";

/**
 * Six units that show the breadth of the fleet at a glance — lifting, digging,
 * loading and haulage. Ordered so the two lifting cards lead, since cranes are
 * the capability the profile leads with.
 */
const FEATURED = [
  "mobile-cranes",
  "crawler-cranes",
  "excavators",
  "wheel-loaders",
  "dump-trucks",
  "boom-trucks",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.hero.title,
    description: seoText.home[locale],
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
  const featured = FEATURED.map(getEquipmentBySlug).filter(
    (item): item is NonNullable<typeof item> => Boolean(item),
  );

  return (
    <>
      <Hero locale={locale} dict={dict} />

      {/* What we supply — an equipment index, not another row of cards. */}
      <Section>
        <SectionHeader
          title={dict.home.capabilityTitle}
          subtitle={dict.home.capabilitySubtitle}
        />
        <Reveal className="mt-10">
          <ul className="grid divide-y divide-ink-150 overflow-hidden rounded-2xl border border-ink-150 sm:grid-cols-2 lg:grid-cols-5 lg:divide-y-0 lg:divide-x rtl:lg:divide-x-reverse">
            {equipmentCategories.map((category) => (
              <li key={category.key} className="sm:border-b sm:border-ink-150 lg:border-b-0">
                <Link
                  href={localeHref(locale, `/fleet?category=${category.key}`)}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-surface-muted"
                >
                  <Icon
                    name={category.icon}
                    size={30}
                    className="text-brand-600 transition-transform duration-300 group-hover:-translate-y-0.5"
                  />
                  <h3 className="mt-4 font-heading text-base font-bold text-ink-900 group-hover:text-brand-700">
                    {category.title[locale]}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {category.blurb[locale]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    {dict.labels.exploreCategory}
                    <Icon
                      name="arrowRight"
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* Featured equipment */}
      <Section muted>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            title={dict.home.fleetTitle}
            subtitle={dict.home.fleetSubtitle}
          />
          <Reveal>
            <Button
              href={localeHref(locale, "/fleet")}
              variant="outline"
              iconEnd="arrowRight"
            >
              {dict.actions.viewFleet}
            </Button>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, index) => (
            <Reveal key={item.slug} delay={(index % 3) * 0.06}>
              <EquipmentCard
                locale={locale}
                item={item}
                cta={dict.actions.viewDetails}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Experience band — asymmetric image/text composition */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900">
              <Image
                src={unsplash(images.fleetLineup.id, 1200, 76)}
                alt={
                  locale === "ar"
                    ? images.fleetLineup.altAr
                    : images.fleetLineup.alt
                }
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="lg:col-span-6">
            <Reveal>
              <span className="rule" aria-hidden="true" />
              <h2 className="mt-5 text-[1.75rem] sm:text-3xl md:text-4xl">
                {dict.pages.aboutTitle}
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                {overview[locale][0]}
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {overview[locale][2]}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-ink-150 pt-6">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {dict.labels.established}
                  </dt>
                  <dd className="mt-1 font-heading text-2xl font-extrabold tabular-nums text-ink-900">
                    {site.foundedYear}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {dict.labels.experience}
                  </dt>
                  {/*
                    "30+", exactly as the company profile states it — not the
                    calendar arithmetic from 1992, which would put a figure on
                    the page the client has never published.
                  */}
                  <dd
                    dir="ltr"
                    className="mt-1 font-heading text-2xl font-extrabold tabular-nums text-ink-900 rtl:text-end"
                  >
                    30<span className="text-brand-600">+</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {dict.labels.equipmentGroups}
                  </dt>
                  <dd className="mt-1 font-heading text-2xl font-extrabold tabular-nums text-ink-900">
                    {equipmentCategories.length}
                  </dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={0.12}>
              <Button
                href={localeHref(locale, "/about")}
                variant="outline"
                className="mt-8"
                iconEnd="arrowRight"
              >
                {dict.nav.about}
              </Button>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Industries */}
      <Section muted>
        <SectionHeader
          title={dict.home.industriesTitle}
          subtitle={dict.home.industriesSubtitle}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {industries.map((industry, index) => (
            <Reveal key={industry.slug} delay={(index % 2) * 0.06}>
              <IndustryCard locale={locale} industry={industry} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Why choose Jowain — dark contrast section, three verified reasons */}
      <Section dark>
        <SectionHeader
          title={dict.home.whyTitle}
          subtitle={dict.home.whySubtitle}
          dark
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
          {whyChooseUs.map((reason, index) => (
            <div key={reason.key} className="bg-ink-900 p-7">
              <Reveal delay={index * 0.06}>
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-accent-300 ring-1 ring-white/10">
                    <Icon name={reason.icon} size={24} />
                  </span>
                  <span
                    className="font-heading text-2xl font-extrabold text-white/25"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-white">
                  {reason.title[locale]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">
                  {reason.description[locale]}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </Section>

      {/* Clients */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            title={dict.home.clientsTitle}
            subtitle={dict.home.clientsSubtitle}
          />
          <Reveal>
            <Button
              href={localeHref(locale, "/clients")}
              variant="outline"
              iconEnd="arrowRight"
            >
              {dict.nav.clients}
            </Button>
          </Reveal>
        </div>
        <ClientWall locale={locale} limit={10} className="mt-10" />
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
