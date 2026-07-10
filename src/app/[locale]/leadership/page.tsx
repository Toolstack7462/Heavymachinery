import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/blocks/CtaBand";
import { leadership } from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.nav.leadership,
    description:
      "Meet the leadership behind our heavy equipment rental and contracting business in Qatar.",
    path: "/leadership",
  });
}

/** Monogram avatar from a name (no invented photos). */
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default async function LeadershipPage({
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
        crumbs={[{ label: dict.nav.leadership }]}
        eyebrow={dict.nav.leadership}
        title="Leadership"
        lead="Experienced leadership committed to integrity, professionalism and the success of every project we support."
      />

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          {leadership.map((leader) => (
            <div
              key={leader.name}
              className="flex flex-col gap-5 rounded-2xl border border-ink-100 bg-white p-6 sm:flex-row shadow-[var(--shadow-card)]"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-2xl font-heading font-bold text-brand-400">
                {initials(leader.name)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink-900">{leader.name}</h2>
                <p className="text-sm font-semibold text-brand-700">
                  {leader.role}
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {leader.bio}
                </p>
                {leader.placeholder && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Editable — confirm name, title, photo and bio before publishing.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 rounded-xl border border-ink-100 bg-surface-muted p-4 text-sm text-muted-foreground">
          Additional leadership and department heads can be added in{" "}
          <code>src/content/company.ts</code> once confirmed.
        </p>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
