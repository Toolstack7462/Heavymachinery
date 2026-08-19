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
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {dict.labels.clientNote}
        </p>
      </Section>

      <Section muted>
        <SectionHeader title={dict.pages.clientsDirectTitle} />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {directClients.map((group, index) => (
            <Reveal key={group.region.en} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-ink-150 bg-white p-6">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-brand-700">
                  {group.region[locale]}
                </h3>
                <ul className="mt-4 divide-y divide-ink-150">
                  {group.names.map((name) => (
                    <li
                      key={name}
                      className="py-2.5 font-medium text-ink-800 first:pt-0 last:pb-0"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
