import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/config/site";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";
import { localeHref } from "@/lib/utils";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { EquipmentCard } from "@/components/blocks/Cards";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/Button";
import { services, getServiceBySlug } from "@/content/services";
import { getEquipmentBySlug } from "@/content/equipment";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    locale,
    title: service.title,
    description: service.summary,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const related = service.relatedEquipment
    .map((s) => getEquipmentBySlug(s))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <>
      <JsonLd
        data={serviceJsonLd(
          service.title,
          service.summary,
          localeHref(locale, `/services/${slug}`),
        )}
      />
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[
          { label: dict.nav.services, href: "/services" },
          { label: service.title },
        ]}
        title={service.title}
        lead={service.summary}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="prose-article">
              {service.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-ink-100 bg-surface-muted p-6 sticky top-24">
              <h2 className="text-lg font-bold text-ink-900">
                What&apos;s included
              </h2>
              <ul className="mt-4 space-y-3">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Icon
                      name="check"
                      size={18}
                      className="text-success mt-0.5 shrink-0"
                    />
                    <span className="text-ink-700">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-2.5">
                <Button
                  href={localeHref(locale, "/request-a-quote")}
                  className="w-full"
                  iconEnd="arrowRight"
                >
                  {dict.actions.requestQuote}
                </Button>
                <Button
                  href={localeHref(locale, "/contact")}
                  variant="outline"
                  className="w-full"
                >
                  {dict.actions.contactUs}
                </Button>
              </div>
            </div>
          </aside>
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

      {/* Other services */}
      <Section>
        <h2 className="text-2xl font-bold text-ink-900">
          {dict.sections.relatedServices}
        </h2>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {services
            .filter((s) => s.slug !== slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={localeHref(locale, `/services/${s.slug}`)}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700 transition-colors"
              >
                <Icon name={s.icon} size={16} />
                {s.title}
              </Link>
            ))}
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
