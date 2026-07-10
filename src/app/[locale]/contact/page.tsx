import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ContactInfo } from "@/components/blocks/ContactInfo";

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
    description: `Contact ${site.fullName} for heavy equipment rental and contracting in Qatar. Call, WhatsApp or send us a message.`,
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
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.nav.contact }]}
        eyebrow={dict.actions.getInTouch}
        title={dict.sections.contactTitle}
        lead={dict.sections.ctaSubtitle}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ContactInfo dict={dict} />
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-ink-100 bg-white p-6 md:p-8 shadow-[var(--shadow-card)]">
              <EnquiryForm dict={dict} variant="contact" />
            </div>
          </div>
        </div>
      </Section>

      {/* Map — uses a privacy-friendly maps link/embed. Set a precise pin in
          site.contact.address.mapQuery before enabling a live embed. */}
      <Section muted>
        <div className="overflow-hidden rounded-2xl border border-ink-100">
          <iframe
            title="Location map"
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              site.contact.address.mapQuery,
            )}&output=embed`}
          />
        </div>
      </Section>
    </>
  );
}
