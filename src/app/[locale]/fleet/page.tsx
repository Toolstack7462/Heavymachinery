import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { localeHref, cn } from "@/lib/utils";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { EquipmentCard } from "@/components/blocks/Cards";
import { Icon } from "@/components/Icon";
import {
  equipment,
  equipmentCategories,
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
    title: dict.nav.fleet,
    description:
      "Browse our heavy equipment fleet — excavators, loaders, dozers, graders, rollers, cranes, telehandlers, forklifts, trailers, dump trucks, generators and compressors for rent across Qatar.",
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

  const filtered = activeCategory
    ? equipment.filter((e) => e.category === activeCategory)
    : equipment;

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.nav.fleet }]}
        title={dict.nav.fleet}
        lead={dict.sections.fleetSubtitle}
      />

      <Section>
        {/* Category filter */}
        <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Equipment categories">
          <Link
            href={localeHref(locale, "/fleet")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              !activeCategory
                ? "border-ink-900 bg-ink-900 text-white"
                : "border-ink-200 bg-white text-ink-700 hover:border-brand-300",
            )}
          >
            {dict.actions.viewAll}
          </Link>
          {equipmentCategories.map((c) => (
            <Link
              key={c.key}
              href={localeHref(locale, `/fleet?category=${c.key}`)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === c.key
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 bg-white text-ink-700 hover:border-brand-300",
              )}
            >
              <Icon name={c.icon} size={16} />
              {c.title}
            </Link>
          ))}
        </div>

        {activeCategory && (
          <p className="mt-6 max-w-2xl text-muted-foreground">
            {equipmentCategories.find((c) => c.key === activeCategory)?.blurb}
          </p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EquipmentCard
              key={e.slug}
              locale={locale}
              item={e}
              cta={dict.actions.viewDetails}
            />
          ))}
        </div>

        <p className="mt-10 rounded-xl border border-ink-100 bg-surface-muted p-4 text-sm text-muted-foreground">
          <Icon name="clipboard" size={16} className="inline-block me-1.5 -mt-0.5 text-brand-600" />
          Model numbers and exact capacities are confirmed on quotation. Tell us
          your task and we will recommend the right machine.
        </p>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
