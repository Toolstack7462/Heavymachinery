import type { Locale } from "@/config/site";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Standard interior-page hero: breadcrumbs, title and lead on a light
 * blue-grey band with a fine engineering grid. One consistent entry point for
 * every page below the homepage.
 */
export function PageHero({
  locale,
  homeLabel,
  breadcrumbLabel,
  crumbs,
  title,
  lead,
}: {
  locale: Locale;
  homeLabel: string;
  breadcrumbLabel: string;
  crumbs: Crumb[];
  title: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-150 bg-surface-muted">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div className="container-page relative py-10 md:py-14">
        <Breadcrumbs
          locale={locale}
          homeLabel={homeLabel}
          label={breadcrumbLabel}
          items={crumbs}
        />
        <Reveal className="mt-6 max-w-3xl">
          <span className="rule" aria-hidden="true" />
          <h1 className="mt-5 text-[2rem] sm:text-4xl md:text-[2.75rem]">
            {title}
          </h1>
          {lead && (
            <p className="measure mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {lead}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
