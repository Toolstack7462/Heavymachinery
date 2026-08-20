import Image from "next/image";
import type { Locale } from "@/config/site";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { photoSrc, type Img } from "@/config/images";

/**
 * Standard interior-page hero.
 *
 * TWO COMPOSITIONS, chosen by whether the page supplies an `image`:
 *
 *  - **55/45 split** (default for content pages). Copy occupies the left 55%,
 *    a machinery photograph the right 45%. The text-only version left the
 *    entire right half of a 1440px viewport empty, which read as an unfinished
 *    layout rather than restraint — the copy simply ran out before the column
 *    did. A photograph gives the fold a subject and lets the page state what it
 *    is about before a word is read.
 *
 *  - **Text-only** where a photograph would be wrong: privacy policy, terms,
 *    the sitemap. Machinery imagery on a legal page is decoration pretending to
 *    be content.
 *
 * The band stays light. Making interior heroes navy would have anchored them,
 * but the page below is also largely light, and a dark hero plus a dark CTA
 * plus a dark footer turns the site into stripes. Contrast here comes from the
 * photograph, not from a colour block.
 *
 * Mobile stacks: copy first, image below at a wider crop, so the fold is copy
 * rather than a letterboxed photo.
 */
export function PageHero({
  locale,
  homeLabel,
  breadcrumbLabel,
  crumbs,
  title,
  lead,
  image,
}: {
  locale: Locale;
  homeLabel: string;
  breadcrumbLabel: string;
  crumbs: Crumb[];
  title: string;
  lead?: string;
  /** Omit for pages where a machinery photograph would be inappropriate. */
  image?: Img;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-150 bg-surface-muted">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      {/*
        A very shallow wash from the brand hue at the outer edge. It stops the
        flat grey reading as an empty plate without becoming a visible gradient.
      */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-50/70"
        aria-hidden="true"
      />

      <div className="container-page relative py-9 md:py-12">
        <Breadcrumbs
          locale={locale}
          homeLabel={homeLabel}
          label={breadcrumbLabel}
          items={crumbs}
        />

        <div
          className={
            image
              ? "mt-5 grid items-center gap-8 lg:grid-cols-[55fr_45fr] lg:gap-12"
              : "mt-5"
          }
        >
          <Reveal className={image ? undefined : "max-w-3xl"}>
            <span className="rule" aria-hidden="true" />
            <h1 className="mt-4 text-[2rem] sm:text-4xl md:text-[2.75rem]">
              {title}
            </h1>
            {lead && (
              <p className="measure mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {lead}
              </p>
            )}
          </Reveal>

          {image && (
            <Reveal delay={0.08}>
              <figure className="relative">
                {/*
                  Offset plate behind the photograph. It gives the right column
                  a second edge so the image reads as placed rather than
                  dropped in, and it is a flat tint — no shadow, because a
                  hairline border plus a wide soft shadow is the template tell
                  this system avoids.
                */}
                <span
                  className="absolute -bottom-2.5 -end-2.5 hidden h-full w-full rounded-xl border border-brand-200/70 bg-brand-50 sm:block"
                  aria-hidden="true"
                />
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-ink-150 bg-ink-900 lg:aspect-[4/3]">
                  <Image
                    src={photoSrc(image.id)}
                    alt={locale === "ar" ? image.altAr : image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                  {/* Keeps the photograph from competing with the headline. */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-ink-950/5 to-transparent"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute bottom-0 start-0 h-[3px] w-16 bg-signal-400"
                    aria-hidden="true"
                  />
                </div>
              </figure>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
