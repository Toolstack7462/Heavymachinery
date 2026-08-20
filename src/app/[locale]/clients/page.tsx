import type { Metadata } from "next";
import { images } from "@/config/images";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, seoText } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section, SectionHeader } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { ClientWall } from "@/components/blocks/ClientWall";
import { Reveal } from "@/components/motion/Reveal";
import { directClients } from "@/content/clients";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.clients,
    description: seoText.clients[locale],
    path: "/clients",
  });
}

export default async function ClientsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        image={images.fleetLineup}
        locale={locale}
        homeLabel={dict.breadcrumb.home}
        breadcrumbLabel={dict.breadcrumb.label}
        crumbs={[{ label: dict.nav.clients }]}
        title={dict.pages.clientsTitle}
        lead={dict.pages.clientsLead}
      />

      <Section>
        <SectionHeader title={dict.pages.clientsGridTitle} />
        <ClientWall locale={locale} className="mt-10" />
        {/*
          `measure` (68ch), not `max-w-3xl`. At 12px a 48rem box put 151
          characters on one line — DESIGN.md makes this exact point: a pixel
          max-width says nothing about how many characters land on the line.
        */}
        <p className="measure mt-8 text-xs leading-relaxed text-muted-foreground">
          {dict.labels.clientNote}
        </p>
      </Section>

      <Section muted>
        <SectionHeader title={dict.pages.clientsDirectTitle} />
        {/*
          A wall of typographic marks, not a list with a hairline under every
          row. These nine are named in the company profile but no artwork for
          them was supplied: the 25 marks above came from the client's own logo
          board, and none of these appear on it. Setting each name in the
          display face is honest — it presents the client without passing a
          guessed graphic off as their trademark. Drop a real logo into
          `src/content/clients.ts` and this becomes an image wall with no other
          change. See docs/CLIENT-INPUT-REQUIRED.md.
        */}
        <div className="mt-10 space-y-10">
          {directClients.map((group, groupIndex) => (
            <Reveal key={group.region.en} delay={groupIndex * 0.06}>
              <div className="flex items-center gap-3">
                <span className="rule" aria-hidden="true" />
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-brand-700">
                  {group.region[locale]}
                </h3>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {group.names.map((name) => (
                  <li key={name}>
                    <div className="flex h-full min-h-[88px] items-center justify-center rounded-xl border border-ink-150 bg-white px-4 py-5 text-center transition-colors hover:border-brand-200">
                      {/*
                        dir="ltr" so bidi does not reorder a Latin company name
                        inside the Arabic layout.
                      */}
                      <span
                        dir="ltr"
                        className="font-heading text-sm font-bold leading-snug tracking-tight text-ink-800 sm:text-base"
                      >
                        {name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
