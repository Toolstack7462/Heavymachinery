import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { site, mailtoLink } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { termsSections } from "@/content/legal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.pages.termsTitle,
    description:
      locale === "ar"
        ? "الشروط التي تحكم استخدام هذا الموقع."
        : "The terms that govern the use of the Jowain Yanbu Est. website.",
    path: "/terms",
  });
}

export default async function TermsPage({
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
        crumbs={[{ label: dict.pages.termsTitle }]}
        title={dict.pages.termsTitle}
        lead={
          locale === "ar"
            ? "الشروط التي تحكم استخدام هذا الموقع."
            : "The terms that govern the use of this website."
        }
      />
      <Section>
        <div className="prose-article mx-auto">
          {termsSections.map((section, index) => (
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
            {termsSections.length + 1}. {dict.footer.contact}
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
