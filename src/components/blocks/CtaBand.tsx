import type { Locale } from "@/config/site";
import { mailtoLink, site } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { localeHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Conversion band, reused across pages.
 *
 * Only affordances backed by real contact information appear here: the enquiry
 * form and the published email address. There is no click-to-call or WhatsApp
 * button, because the company profile supplies no telephone number.
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
    /*
     * The band sits on the muted surface, not on white.
     *
     * Previously this was a navy box on white, directly above the navy footer:
     * white -> navy -> thin white strip -> navy, which reads as two disconnected
     * blocks rather than a close. On the muted ground the page steps
     * white -> grey -> navy, and the band belongs to the sequence.
     *
     * Top padding is also reduced. Section padding above plus section padding
     * here put 9rem of empty white between the last card and the band on every
     * page that ends this way.
     */
    <section className="border-t border-ink-150 bg-surface-muted pb-12 pt-10 md:pb-16 md:pt-12">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-12 md:px-12 md:py-14">
            <div
              className="absolute inset-0 bg-grid-dark opacity-70"
              aria-hidden="true"
            />
            <div
              className="absolute -top-32 -end-24 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative max-w-2xl">
              <span className="rule rule-accent" aria-hidden="true" />
              <h2 className="mt-5 text-2xl text-white sm:text-3xl md:text-4xl">
                {title ?? dict.home.ctaTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-300 sm:text-lg">
                {subtitle ?? dict.home.ctaSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href={localeHref(locale, "/request-a-quote")}
                  size="lg"
                  iconEnd="arrowRight"
                >
                  {dict.actions.request}
                </Button>
                <Button
                  href={mailtoLink(site.positioning)}
                  variant="onDark"
                  size="lg"
                  icon="mail"
                >
                  {site.contact.email}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
