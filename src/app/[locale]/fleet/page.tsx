import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText, fleetJsonLd } from "@/lib/seo";
import { localeHref, cn } from "@/lib/utils";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { EquipmentCard } from "@/components/blocks/Cards";
import { FleetFilter } from "@/components/blocks/FleetFilter";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/motion/Reveal";
import {
  equipment,
  equipmentCategories,
  getCategoryMeta,
  type EquipmentCategory,
} from "@/content/equipment";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.pages.fleetTitle,
    description: seoText.fleet[locale],
    path: "/fleet",
  });
}

export default async function FleetPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const dict = getDictionary(locale);

  const activeCategory = equipmentCategories.find((c) => c.key === category)
    ?.key as EquipmentCategory | undefined;
  const active = activeCategory
    ? equipmentCategories.find((c) => c.key === activeCategory)
    : undefined;
  const filtered = activeCategory
    ? equipment.filter((item) => item.category === activeCategory)
    : equipment;

  // min-h-[44px]: the category filter is the primary control on this page and
  // is used on site, on a phone, often with gloves on.
  const pill =
    "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors";

  return (
    <>
      <JsonLd data={fleetJsonLd(locale)} />
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.nav.fleet }]}
        title={dict.pages.fleetTitle}
        lead={dict.pages.fleetLead}
      />

      <Section>
        <nav aria-label={dict.labels.categories} className="flex flex-wrap gap-2.5">
          <Link
            href={localeHref(locale, "/fleet")}
            aria-current={!activeCategory ? "page" : undefined}
            className={cn(
              pill,
              !activeCategory
                ? "border-ink-900 bg-ink-900 text-white"
                : "border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:text-brand-700",
            )}
          >
            {dict.actions.viewAll}
          </Link>
          {equipmentCategories.map((meta) => (
            <Link
              key={meta.key}
              href={localeHref(locale, `/fleet?category=${meta.key}`)}
              aria-current={activeCategory === meta.key ? "page" : undefined}
              className={cn(
                pill,
                activeCategory === meta.key
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:text-brand-700",
              )}
            >
              <Icon name={meta.icon} size={16} />
              {meta.title[locale]}
            </Link>
          ))}
        </nav>

        {active && (
          <p className="mt-6 max-w-2xl text-muted-foreground">
            {active.blurb[locale]}
          </p>
        )}

        {/*
          Cards are rendered here on the server and handed to the filter island
          as children, so search costs an input and a `hidden` toggle rather
          than a client-side copy of the catalogue.
        */}
        <FleetFilter
          dict={dict}
          items={filtered.map((item, index) => ({
            slug: item.slug,
            haystack: [
              item.name[locale],
              item.summary[locale],
              getCategoryMeta(item.category).title[locale],
              ...item.specs.map((spec) => spec.value[locale]),
            ]
              .join(" ")
              .toLowerCase(),
            card: (
              <Reveal delay={(index % 3) * 0.05} className="h-full">
                {/* h2: on the index the cards are the page's own list. */}
                <EquipmentCard
                  locale={locale}
                  item={item}
                  cta={dict.actions.viewDetails}
                  headingLevel={2}
                />
              </Reveal>
            ),
          }))}
        />

        <p className="measure mt-10 flex items-start gap-2.5 rounded-xl border border-ink-150 bg-surface-muted p-4 text-sm text-muted-foreground">
          <Icon
            name="clipboard"
            size={18}
            className="mt-0.5 shrink-0 text-brand-600"
          />
          {dict.labels.specNote}
        </p>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
