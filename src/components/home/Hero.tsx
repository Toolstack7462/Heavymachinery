import type { Locale } from "@/config/site";
import { site, telLink } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { equipmentCategories } from "@/content/equipment";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-grid opacity-[0.5]" aria-hidden="true" />
      <div
        className="absolute -top-40 -end-40 h-[36rem] w-[36rem] rounded-full bg-brand-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-page relative py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Copy */}
          <div className="lg:col-span-7">
            <span className="eyebrow">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
              {dict.hero.eyebrow}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink-900 leading-[1.05]">
              {dict.hero.title}
              <span className="block text-brand-600 mt-1">
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

          {/* Visual — abstract equipment category tiles (no stock photos yet) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-ink-100 bg-white p-5 shadow-[var(--shadow-elevated)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {dict.sections.fleetTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  Qatar
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {equipmentCategories.map((cat) => (
                  <div
                    key={cat.key}
                    className="group rounded-xl bg-ink-900 p-4 text-white relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-grid opacity-10"
                      aria-hidden="true"
                    />
                    <Icon
                      name={cat.icon}
                      size={30}
                      className="relative text-brand-400"
                    />
                    <p className="relative mt-3 text-sm font-semibold leading-tight">
                      {cat.title}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-surface-muted p-4">
                <div className="flex items-center gap-3">
                  <Icon name="shield" size={22} className="text-brand-600" />
                  <p className="text-sm font-medium text-ink-800">
                    Safety-led operations · Trained operators · Maintained fleet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
