import Image from "next/image";
import type { Locale } from "@/config/site";
import { site, telLink } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { images, unsplash } from "@/config/images";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="absolute inset-0 bg-grid opacity-[0.5]"
        aria-hidden="true"
      />
      <div className="container-page relative py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Copy */}
          <div>
            <span className="eyebrow">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
              {dict.hero.eyebrow}
            </span>
            <h1 className="mt-5 text-[2.5rem] leading-[1.04] sm:text-5xl lg:text-6xl font-extrabold text-ink-900">
              {dict.hero.title}
              <span className="mt-1 block text-brand-600">
                {site.taglineSecondary}.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              {dict.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={localeHref(locale, "/request-a-quote")}
                size="lg"
                iconEnd="arrowRight"
              >
                {dict.hero.primaryCta}
              </Button>
              <Button
                href={localeHref(locale, "/fleet")}
                variant="outline"
                size="lg"
              >
                {dict.hero.secondaryCta}
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-600">
              <a
                href={telLink()}
                className="inline-flex items-center gap-2 font-semibold text-ink-900 hover:text-brand-700"
              >
                <Icon name="phone" size={18} className="text-brand-600" />
                <span className="tabular-nums">{site.contact.phonePrimary}</span>
              </a>
              <span className="inline-flex items-center gap-2">
                <Icon name="check" size={18} className="text-success" />
                {dict.hero.trust}
              </span>
            </div>
          </div>

          {/* Hero photograph */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-900 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={unsplash(images.hero.id, 1400, 80)}
                alt={images.hero.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
              {/* graphite gradient for text legibility */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent"
                aria-hidden="true"
              />
              {/* Safety/operations chip anchored in the image */}
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl bg-ink-900/70 p-3.5 backdrop-blur-sm ring-1 ring-white/10">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-ink-900">
                  <Icon name="shield" size={20} />
                </span>
                <p className="text-sm font-medium text-white">
                  Safety-led operations · trained operators · maintained fleet
                </p>
              </div>
            </div>
            {/* Small offset "years in Qatar" marker — factual, not a hero-metric */}
            <div className="absolute -top-3 -start-3 hidden rounded-xl bg-white px-4 py-3 shadow-[var(--shadow-elevated)] ring-1 ring-ink-100 sm:block">
              <p className="font-heading text-2xl font-extrabold text-ink-900">
                {2026 - site.foundedYear}
                <span className="text-brand-600">+</span>
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                years in Qatar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
