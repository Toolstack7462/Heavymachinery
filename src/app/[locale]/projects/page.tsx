import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { localeHref } from "@/lib/utils";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { industries } from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.projects,
    description:
      "Project experience across construction, infrastructure, industrial and demolition works in Qatar.",
    path: "/projects",
  });
}

export default async function ProjectsPage({
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
        crumbs={[{ label: dict.nav.projects }]}
        title="Projects & Capabilities"
        lead="We support projects of all sizes across Qatar's construction, infrastructure, industrial and demolition sectors."
      />

      {/* Capability areas (real, generic) instead of invented project claims */}
      <Section>
        <h2 className="text-2xl font-bold text-ink-900">Where we work</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          The sectors we regularly support with equipment, transport, lifting and
          contracting.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <div
              key={ind.slug}
              className="rounded-2xl border border-ink-100 bg-white p-6"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Icon name={ind.icon} size={22} />
              </span>
              <h3 className="mt-4 font-bold text-ink-900">{ind.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {ind.description}
              </p>
            </div>
          ))}
        </div>

        {/* Honest editable notice — no fabricated case studies */}
        <div className="mt-10 rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 p-8 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-700 ring-1 ring-brand-100">
            <Icon name="clipboard" size={24} />
          </span>
          <h3 className="mt-4 text-lg font-bold text-ink-900">
            Project case studies coming soon
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Detailed project case studies (with client permission, photos and
            verified scope) will be published here. This section is intentionally
            left as an editable template so no unverified project claims are shown.
          </p>
          <Button
            href={localeHref(locale, "/contact")}
            variant="outline"
            className="mt-6"
          >
            {dict.actions.contactUs}
          </Button>
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
