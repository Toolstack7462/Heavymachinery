import type { Locale } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { HeroMedia } from "@/components/home/HeroMedia";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Homepage hero — the dark industrial anchor of an otherwise light site.
 *
 * Reads in three seconds: who (Jowain Yanbu Est., in the header lockup above),
 * what (heavy equipment rental & transportation), since when and from where.
 * Copy is server-rendered; only the photograph's parallax is client-side, so
 * the largest paint is not waiting on JavaScript.
 */
export function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const facts = [
    { icon: "calendar" as const, label: dict.hero.metaEstablished },
    { icon: "map" as const, label: dict.hero.metaCoverage },
    { icon: "users" as const, label: dict.labels.operatorsShort },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      <HeroMedia locale={locale} />

      <div className="container-page relative py-16 md:py-24 lg:py-28">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow text-brand-200">{dict.hero.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.06}>
            {/*
              `pretty` rather than the global `balance`: balancing this
              headline on a narrow viewport left "Rental" alone on its own
              line. `pretty` protects against orphans without equalising line
              lengths, which is the right trade for a three-word-plus-ampersand
              headline.
            */}
            <h1 className="mt-5 text-[2.1rem] leading-[1.06] text-white [text-wrap:pretty] sm:text-5xl lg:text-[3.5rem]">
              {dict.hero.title}
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 font-heading text-lg font-semibold text-accent-300 sm:text-xl">
              {dict.hero.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-200 sm:text-lg">
              {dict.hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                href={localeHref(locale, "/fleet")}
                size="lg"
                iconEnd="arrowRight"
              >
                {dict.hero.primaryCta}
              </Button>
              <Button
                href={localeHref(locale, "/request-a-quote")}
                variant="onDark"
                size="lg"
              >
                {dict.hero.secondaryCta}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Fact rail — verified claims only, no invented statistics. */}
      <div className="relative border-t border-white/10 bg-ink-950/55 backdrop-blur-sm">
        <div className="container-page">
          <ul className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 rtl:sm:divide-x-reverse">
            {facts.map((fact) => (
              <li
                key={fact.label}
                className="flex items-center gap-3 py-4 sm:justify-center sm:px-4"
              >
                <Icon
                  name={fact.icon}
                  size={18}
                  className="shrink-0 text-accent-300"
                />
                <span className="text-sm font-medium text-ink-100">
                  {fact.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
