import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Locale } from "@/config/site";
import { locales } from "@/i18n/config";
import { equipmentImage, unsplash } from "@/config/images";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, equipmentJsonLd } from "@/lib/seo";
import { localeHref, cn } from "@/lib/utils";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { EquipmentCard } from "@/components/blocks/Cards";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import {
  equipment,
  getEquipmentBySlug,
  getEquipmentByCategory,
  getCategoryMeta,
} from "@/content/equipment";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    equipment.map((item) => ({ locale, slug: item.slug })),
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
  const suffix =
    locale === "ar"
      ? "للتأجير في المملكة العربية السعودية"
      : "rental in Saudi Arabia";
  return buildMetadata({
    locale,
    title: `${item.name[locale]} — ${suffix}`,
    description: item.description[locale],
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

  const category = getCategoryMeta(item.category);
  const related = getEquipmentByCategory(item.category)
    .filter((other) => other.slug !== slug)
    .slice(0, 3);
  const photo = equipmentImage(item.slug);

  return (
    <>
      <JsonLd
        data={equipmentJsonLd({
          name: item.name.en,
          description: item.description.en,
          category: category.title.en,
          path: localeHref(locale, `/fleet/${slug}`),
        })}
      />
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[
          { label: dict.nav.fleet, href: "/fleet" },
          {
            label: category.title[locale],
            href: `/fleet?category=${item.category}`,
          },
          { label: item.name[locale] },
        ]}
        title={item.name[locale]}
        lead={item.summary[locale]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Visual */}
          <Reveal className="lg:col-span-5">
            {photo ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900">
                <Image
                  src={unsplash(photo.id, 900, 78)}
                  alt={locale === "ar" ? photo.altAr : photo.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-ink-900">
                <div
                  className="absolute inset-0 bg-grid-dark opacity-70"
                  aria-hidden="true"
                />
                <Icon
                  name={item.icon}
                  size={112}
                  className="relative text-brand-300"
                />
              </div>
            )}
            {photo && (
              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                {dict.labels.imageNote}
              </p>
            )}
          </Reveal>

          {/* Detail */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="prose-article">{item.description[locale]}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="mt-8 font-heading text-lg font-bold text-ink-900">
                {dict.labels.applications}
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {item.applications[locale].map((application) => (
                  <li key={application} className="flex items-start gap-2.5 text-sm">
                    <Icon
                      name="check"
                      size={18}
                      className="mt-0.5 shrink-0 text-accent-600"
                    />
                    <span className="text-ink-700">{application}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-8 font-heading text-lg font-bold text-ink-900">
                {dict.labels.specifications}
              </h2>
              <dl className="mt-4 overflow-hidden rounded-xl border border-ink-150">
                {item.specs.map((spec, index) => (
                  <div
                    key={spec.label[locale]}
                    className={cn(index % 2 === 0 ? "bg-white" : "bg-surface-muted")}
                  >
                    <div className="flex justify-between gap-4 px-4 py-3 text-sm">
                      <dt className="text-muted-foreground">
                        {spec.label[locale]}
                      </dt>
                      {/* tabular-nums keeps "20 T – 1200 T" and "55 T – 3200 T"
                          aligned down the column instead of drifting. */}
                      <dd className="text-end font-medium tabular-nums text-ink-900">
                        {spec.value[locale]}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
              <p className="measure mt-3 text-xs leading-relaxed text-muted-foreground">
                {dict.labels.specNote}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href={localeHref(
                    locale,
                    `/request-a-quote?equipment=${item.slug}`,
                  )}
                  iconEnd="arrowRight"
                >
                  {dict.actions.request}
                </Button>
                <Button href={localeHref(locale, "/contact")} variant="outline">
                  {dict.actions.contactUs}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section muted>
          <h2 className="text-2xl">{dict.labels.relatedEquipment}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((other, index) => (
              <Reveal key={other.slug} delay={index * 0.06}>
                <EquipmentCard
                  locale={locale}
                  item={other}
                  cta={dict.actions.viewDetails}
                />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
