import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { site, mailtoLink } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { privacySections } from "@/content/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.pages.privacyTitle,
    description:
      locale === "ar"
        ? "كيف نتعامل مع المعلومات التي تشاركها عبر هذا الموقع."
        : "How Jowain Yanbu Est. handles the information you share through this website.",
    path: "/privacy-policy",
  });
}

export default async function PrivacyPage({
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
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.pages.privacyTitle }]}
        title={dict.pages.privacyTitle}
        lead={
          locale === "ar"
            ? "كيف نتعامل مع المعلومات التي تشاركها معنا."
            : "How we handle the information you share with us."
        }
      />
      <Section>
        <div className="prose-article mx-auto">
          {privacySections.map((section, index) => (
            <section key={section.heading.en}>
              <h2>
                {index + 1}. {section.heading[locale]}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.en}>{paragraph[locale]}</p>
              ))}
            </section>
          ))}
          <h2>
            {privacySections.length + 1}. {dict.footer.contact}
          </h2>
          <p>
            <a href={mailtoLink()} className="text-brand-700 underline">
              {site.contact.email}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
