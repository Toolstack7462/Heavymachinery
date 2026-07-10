import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { site } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { localeHref } from "@/lib/utils";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeader } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { ValueCard } from "@/components/blocks/Cards";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { values, visionMission } from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.about,
    description: site.descriptionLong,
    path: "/about",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const yearsInQatar = 2026 - site.foundedYear;

  return (
    <>
      <PageHero
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        crumbs={[{ label: dict.nav.about }]}
        eyebrow={dict.nav.about}
        title={`Built on solid ground`}
        lead={site.descriptionLong}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="prose-article">
              <p>
                {site.fullName} is a Qatar-based heavy equipment rental and
                contracting company. We deliver a single-source solution for the
                construction, infrastructure, industrial and commercial sectors —
                bringing together equipment rental, earthworks, heavy transport,
                lifting, demolition and project execution under one accountable
                partner.
              </p>
              <p>
                Our extensive fleet of modern machinery — excavators, wheel and
                backhoe loaders, dozers, graders, rollers, cranes, forklifts,
                telehandlers, generators, compressors, dump trucks, low-bed and
                flatbed trailers and specialised equipment — enables us to support
                projects of all sizes and complexities.
              </p>
              <p>
                Beyond equipment, we believe successful project delivery depends on
                coordination, clear communication and an uncompromising commitment
                to safety. We foster collaboration among project teams, operators,
                supervisors and site personnel to keep operations smooth, productive
                and safe.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Brand note:</strong> {site.name} — {site.nameMeaning} The
                name is an editable placeholder; replace it with the registered
                brand in <code>src/config/site.ts</code>.
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl bg-ink-900 p-6 text-white">
              <div className="grid grid-cols-2 gap-4">
                <Stat value={`${yearsInQatar}+`} label="Years in Qatar" />
                <Stat value="20+" label="Equipment types" />
                <Stat value="6" label="Core services" />
                <Stat value="1" label="Accountable partner" />
              </div>
              <p className="mt-5 text-sm text-ink-400 leading-relaxed">
                Figures shown are verified. Additional performance statistics are
                available once confirmed with the client.
              </p>
              <Button
                href={localeHref(locale, "/why-choose-us")}
                variant="primary"
                className="mt-6 w-full"
                iconEnd="arrowRight"
              >
                {dict.nav.whyUs}
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section muted>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-ink-100 bg-white p-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Icon name="gauge" size={24} />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-ink-900">Our Vision</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {visionMission.vision}
            </p>
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <Icon name="medal" size={24} />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-ink-900">Our Mission</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {visionMission.mission}
            </p>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeader
          eyebrow={dict.sections.valuesTitle}
          title={dict.sections.valuesTitle}
          align="center"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <ValueCard key={v.title} value={v} />
          ))}
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-3xl font-extrabold text-brand-400">{value}</p>
      <p className="mt-1 text-sm text-ink-300">{label}</p>
    </div>
  );
}
