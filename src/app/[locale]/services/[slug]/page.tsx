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
import { Reveal } from "@/components/motion/Reveal";
import { services, getServiceBySlug } from "@/content/services";
import { getEquipmentBySlug } from "@/content/equipment";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
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
    title: service.title[locale],
    description: service.summary[locale],
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
    .map(getEquipmentBySlug)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <JsonLd
        data={serviceJsonLd(
          service.title.en,
          service.summary.en,
          localeHref(locale, `/services/${slug}`),
        )}
      />
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[
          { label: dict.nav.services, href: "/services" },
          { label: service.title[locale] },
        ]}
        title={service.title[locale]}
        lead={service.summary[locale]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="prose-article">
              {service.body[locale].map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <aside className="lg:col-span-5">
            <Reveal delay={0.08}>
              <div className="sticky top-24 rounded-2xl border border-ink-150 bg-surface-muted p-6">
                <h2 className="font-heading text-lg font-bold text-ink-900">
                  {dict.labels.included}
                </h2>
                <ul className="mt-4 space-y-3">
                  {service.features[locale].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Icon
                        name="check"
                        size={18}
                        className="mt-0.5 shrink-0 text-accent-600"
                      />
                      <span className="text-ink-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-2.5">
                  <Button
                    href={localeHref(locale, "/request-a-quote")}
                    className="w-full"
                    iconEnd="arrowRight"
                  >
                    {dict.actions.request}
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
            </Reveal>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section muted>
          <h2 className="text-2xl">{dict.labels.relatedEquipment}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
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
      )}

      <Section>
        <h2 className="text-2xl">{dict.labels.otherServices}</h2>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {services
            .filter((other) => other.slug !== slug)
            .map((other) => (
              <Link
                key={other.slug}
                href={localeHref(locale, `/services/${other.slug}`)}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700"
              >
                <Icon name={other.icon} size={16} />
                {other.title[locale]}
              </Link>
            ))}
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
