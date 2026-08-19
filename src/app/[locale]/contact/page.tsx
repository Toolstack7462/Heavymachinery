import type { Metadata } from "next";
import { images } from "@/config/images";
import type { Locale } from "@/config/site";
import { site, mapLink } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ContactInfo } from "@/components/blocks/ContactInfo";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.contact,
    description: seoText.contact[locale],
    path: "/contact",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        image={images.siteDusk}
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.nav.contact }]}
        title={dict.pages.contactTitle}
        lead={dict.pages.contactLead}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <ContactInfo locale={locale} dict={dict} />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="rounded-2xl border border-ink-150 bg-white p-6 md:p-8">
              <EnquiryForm locale={locale} dict={dict} variant="contact" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/*
        Location band instead of an embedded map. The profile gives a city, not
        a street address, so a pinned embed would imply a precision we do not
        have — and it would ship a third-party frame, cookies and ~1MB of
        script for a single point on the Red Sea coast. A link to Maps does the
        same job, and lets the CSP forbid frames outright.
      */}
      <Section muted>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-ink-150 bg-ink-900 px-6 py-12 md:px-12">
            <div
              className="absolute inset-0 bg-grid-dark opacity-70"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-accent-300 ring-1 ring-white/10">
                  <Icon name="mapPin" size={24} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                    {dict.labels.location}
                  </p>
                  <p className="mt-1 font-heading text-xl font-bold text-white">
                    {locale === "ar"
                      ? "ينبع البحر، المملكة العربية السعودية"
                      : `${site.contact.address.city}, ${site.contact.address.country}`}
                  </p>
                  <p className="mt-2 text-sm text-ink-300">
                    {dict.hero.metaCoverage}
                  </p>
                </div>
              </div>
              <Button
                href={mapLink()}
                external
                variant="onDark"
                icon="mapPin"
              >
                {dict.actions.viewOnMap}
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
