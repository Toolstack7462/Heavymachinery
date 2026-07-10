import type { Locale } from "@/config/site";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";

/**
 * Standard interior-page hero: eyebrow, title, lead paragraph and breadcrumbs
 * on a subtle textured light band. Keeps every page visually consistent.
 */
export function PageHero({
  locale,
  homeLabel,
  crumbs,
  eyebrow,
  title,
  lead,
}: {
  locale: Locale;
  homeLabel: string;
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-surface-muted">
      <div className="absolute inset-0 bg-grid opacity-[0.4]" aria-hidden="true" />
      <div
        className="absolute -top-20 -end-16 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-page relative py-10 md:py-16">
        <Breadcrumbs locale={locale} homeLabel={homeLabel} items={crumbs} />
        <div className="mt-6 max-w-3xl">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-ink-900">
            {title}
          </h1>
          {lead && (
            <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed">
              {lead}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
