import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.footer.terms,
    description: `Terms of Use for ${site.fullName}.`,
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
        crumbs={[{ label: dict.footer.terms }]}
        title={dict.footer.terms}
        lead="The terms that govern the use of this website."
      />
      <Section>
        <div className="prose-article mx-auto max-w-3xl">
          <p className="text-sm text-muted-foreground">
            <strong>Template notice:</strong> These are starter terms for the website
            only. Rental and service contracts are governed by separate written
            agreements. Have these reviewed by legal counsel before publishing.
          </p>

          <h2>1. Use of this website</h2>
          <p>
            This website is provided for general information about our heavy equipment
            rental and contracting services. By using it, you agree to use it lawfully
            and not to misuse or disrupt it.
          </p>

          <h2>2. No binding quotation</h2>
          <p>
            Information on this website, including equipment listings and descriptions,
            is for guidance only and does not constitute a binding offer. Pricing,
            availability and specifications are confirmed in a written quotation.
          </p>

          <h2>3. Intellectual property</h2>
          <p>
            The content, branding and design of this website are the property of{" "}
            {site.legalName} unless otherwise stated, and may not be copied without
            permission.
          </p>

          <h2>4. Limitation of liability</h2>
          <p>
            We make reasonable efforts to keep information accurate and up to date but
            provide the website &quot;as is&quot; without warranties. We are not liable
            for any loss arising from reliance on website content.
          </p>

          <h2>5. Governing law</h2>
          <p>
            These terms are governed by the laws of the State of Qatar. Set your
            preferred jurisdiction and dispute-resolution terms before publishing.
          </p>

          <h2>6. Contact</h2>
          <p>
            Questions about these terms? Contact us at{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
          </p>

          <p className="text-sm text-muted-foreground">
            Last updated: editable — set the effective date before publishing.
          </p>
        </div>
      </Section>
    </>
  );
}
