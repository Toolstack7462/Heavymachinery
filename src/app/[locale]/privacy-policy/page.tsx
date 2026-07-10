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
    title: dict.footer.privacy,
    description: `Privacy Policy for ${site.fullName}.`,
    path: "/privacy-policy",
    noindex: false,
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
        crumbs={[{ label: dict.footer.privacy }]}
        title={dict.footer.privacy}
        lead="How we handle the information you share with us."
      />
      <Section>
        <div className="prose-article mx-auto max-w-3xl">
          <p className="text-sm text-muted-foreground">
            <strong>Template notice:</strong> This is a starter privacy policy. Have
            it reviewed by legal counsel and adapted to your actual data practices
            and Qatar regulations before relying on it.
          </p>

          <h2>1. Information we collect</h2>
          <p>
            When you contact us or request a quote, we collect the information you
            provide — such as your name, company, email, phone number and details of
            your enquiry. We may also collect basic, non-identifying analytics about
            how visitors use this website.
          </p>

          <h2>2. How we use your information</h2>
          <p>
            We use your information to respond to enquiries, prepare quotations,
            provide our services and improve our website. We do not sell your
            personal information.
          </p>

          <h2>3. Sharing</h2>
          <p>
            We only share your information with service providers who help us operate
            our business (for example email or hosting providers) and where required
            by law. Any such providers are expected to protect your information.
          </p>

          <h2>4. Data retention</h2>
          <p>
            We keep enquiry information for as long as necessary to respond to and
            manage your request and to meet legal or business requirements.
          </p>

          <h2>5. Your rights</h2>
          <p>
            You may request access to, correction of, or deletion of the personal
            information you have shared with us by contacting us using the details on
            our Contact page.
          </p>

          <h2>6. Contact</h2>
          <p>
            For any privacy questions, contact us at{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or{" "}
            {site.contact.phonePrimary}.
          </p>

          <p className="text-sm text-muted-foreground">
            Last updated: editable — set the effective date before publishing.
          </p>
        </div>
      </Section>
    </>
  );
}
