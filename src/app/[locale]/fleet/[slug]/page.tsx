import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { locales } from "@/i18n/config";
import { equipmentImage, categoryImages, unsplash } from "@/config/images";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { localeHref } from "@/lib/utils";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { EquipmentCard } from "@/components/blocks/Cards";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/Button";
import {
  equipment,
  getEquipmentBySlug,
  getEquipmentByCategory,
  getCategoryMeta,
} from "@/content/equipment";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    equipment.map((e) => ({ locale, slug: e.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getEquipmentBySlug(slug);
  if (!item) return {};
  return buildMetadata({
    locale,
    title: `${item.name} Rental in Qatar`,
    description: item.summary,
    path: `/fleet/${slug}`,
  });
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const item = getEquipmentBySlug(slug);
  if (!item) notFound();

  const cat = getCategoryMeta(item.category);
  const related = getEquipmentByCategory(item.category)
    .filter((e) => e.slug !== slug)
    .slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    category: cat.title,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "QAR",
      price: "0",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "QAR",
        valueAddedTaxIncluded: false,
      },
      seller: { "@id": `${site.url}/#organization` },
    },
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[
          { label: dict.nav.fleet, href: "/fleet" },
          { label: cat.title, href: `/fleet?category=${item.category}` },
          { label: item.name },
        ]}
        title={item.name}
        lead={item.summary}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Visual */}
          <div className="lg:col-span-5">
            {(() => {
              const photo = equipmentImage(item.slug) ?? categoryImages[item.category];
              return photo ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900">
                  <Image
                    src={unsplash(photo.id, 900, 76)}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-ink-900">
                  <div className="absolute inset-0 bg-grid opacity-10" aria-hidden="true" />
                  <Icon name={item.icon} size={120} className="relative text-brand-400" />
                </div>
              );
            })()}
            <p className="mt-3 text-xs text-muted-foreground text-center">
              Representative image — request photos of the specific unit on quotation.
            </p>
          </div>

          {/* Details */}
          <div className="lg:col-span-7">
            <p className="prose-article">{item.description}</p>

            <h2 className="mt-8 text-lg font-bold text-ink-900">Applications</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {item.applications.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-sm">
                  <Icon name="check" size={18} className="text-success mt-0.5 shrink-0" />
                  <span className="text-ink-700">{a}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-lg font-bold text-ink-900">Specifications</h2>
            <dl className="mt-4 overflow-hidden rounded-xl border border-ink-100">
              {item.specs.map((s, i) => (
                <div
                  key={s.label}
                  className={i % 2 === 0 ? "bg-white" : "bg-surface-muted"}
                >
                  <div className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium text-ink-900 text-end">{s.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={localeHref(locale, `/request-a-quote?equipment=${item.slug}`)}
                iconEnd="arrowRight"
              >
                {dict.actions.requestQuote}
              </Button>
              <Button href={localeHref(locale, "/contact")} variant="outline">
                {dict.actions.contactUs}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section muted>
          <h2 className="text-2xl font-bold text-ink-900">
            {dict.sections.relatedEquipment}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e) => (
              <EquipmentCard
                key={e.slug}
                locale={locale}
                item={e}
                cta={dict.actions.viewDetails}
              />
            ))}
          </div>
        </Section>
      )}

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
