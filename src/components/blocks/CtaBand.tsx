import type { Locale } from "@/config/site";
import { site, telLink, whatsappLink } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/**
 * High-contrast conversion band (graphite + amber). Reused on most pages.
 */
export function CtaBand({
  locale,
  dict,
  title,
  subtitle,
}: {
  locale: Locale;
  dict: Dictionary;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-14 md:px-14 md:py-16">
          <div className="absolute inset-0 bg-grid opacity-[0.15]" aria-hidden="true" />
          <div
            className="absolute -top-24 -end-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {title ?? dict.sections.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-ink-300 leading-relaxed">
              {subtitle ?? dict.sections.ctaSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={localeHref(locale, "/request-a-quote")}
                size="lg"
                iconEnd="arrowRight"
              >
                {dict.actions.requestQuote}
              </Button>
              <Button href={telLink()} variant="outline" size="lg" icon="phone" className="!bg-transparent !text-white !border-ink-600 hover:!border-white hover:!bg-white/5">
                {site.contact.phonePrimary}
              </Button>
              <Button
                href={whatsappLink()}
                external
                variant="whatsapp"
                size="lg"
              >
                {dict.actions.whatsapp}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
