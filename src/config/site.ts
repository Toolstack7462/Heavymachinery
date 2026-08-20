/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH — BRAND, LOCATION & CONTACT
 * ============================================================================
 *  Every page, the header, footer, metadata, structured data and the sitemap
 *  read from this file.
 *
 *  SOURCE OF FACTS: "Jowain Yanbu Est. Profile Overview" (client-supplied
 *  company profile, August 2026) and the official Logo.pdf. Nothing here is
 *  inferred or invented.
 *
 *  DELIBERATELY ABSENT — the profile supplies no telephone or WhatsApp number,
 *  no street address, no opening hours and no social profiles. Those fields are
 *  therefore `null`/empty and every dependent UI element (click-to-call,
 *  WhatsApp buttons, hours row, social icons) hides itself. Do not fill them
 *  with plausible values; see docs/MISSING-INFO.md.
 * ============================================================================
 */

/** Domain serving the site today. Used when `SITE_URL` is not set. */
const FALLBACK_ORIGIN = "https://jowainyanbu.com";

/**
 * Resolve the canonical origin from the environment, tolerating the shapes
 * people actually paste into a hosting control panel: a bare hostname, a
 * trailing slash, or a full URL. Anything unparseable falls back rather than
 * shipping a malformed `metadataBase`, which would throw at build time.
 *
 * `NEXT_PUBLIC_SITE_URL` is accepted as an alias because some platforms (and
 * Vercel's own UI) nudge users toward the `NEXT_PUBLIC_` prefix. Neither value
 * is a secret — the canonical domain is public by definition.
 */
function resolveSiteUrl(): string {
  const raw = (
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    ""
  ).trim();
  if (!raw) return FALLBACK_ORIGIN;

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

export const site = {
  /** Short public-facing brand name. */
  name: "Jowain Yanbu Est.",
  /** Full brand name used in headings & metadata. */
  fullName: "Jowain Yanbu Est.",
  /** Registered establishment name as printed in the company profile. */
  legalName: "Jowain Yanbu Est.",
  /** Wordmark shown in the header/footer lockup. */
  logoText: "JOWAIN",
  /** Second line of the wordmark lockup. */
  logoSubText: "YANBU EST.",

  /** Corporate positioning line from the profile cover. */
  positioning: "Heavy Equipment Rental & Transportation",
  /** Primary tagline from the profile. */
  tagline: "Reliable Equipment. Dependable Transportation.",

  /**
   * Canonical production origin — no trailing slash.
   *
   * Read from `SITE_URL` so one environment variable controls every absolute
   * URL the site emits: canonical tags, hreflang alternates, Open Graph and
   * Twitter URLs, sitemap.xml, robots.txt and every JSON-LD `@id`. Set it once
   * in the hosting platform and the whole site follows.
   *
   * The fallback is the domain the client confirmed on 20 August 2026 and
   * which is serving on Hostinger with a valid certificate. The company
   * profile PDF printed a different domain, "www.jowain.net"; that is
   * superseded.
   */
  url: resolveSiteUrl(),

  /** Year of establishment (profile: "EST. 1992"). */
  foundedYear: 1992,
  /**
   * Reference year used for the "30+ years" claim so the number never drifts
   * from what the profile itself states.
   */
  profileYear: 2026,

  contact: {
    /**
     * Telephone numbers, supplied by the client on 20 August 2026.
     *
     * The supplied company profile contained no number at all, so for a long
     * time every call affordance was absent rather than invented. These are the
     * first verified numbers and they switch tap-to-call on across the header,
     * footer, contact panel and the enquiry-failure fallback.
     *
     * `display` is what a human reads; `e164` is what `tel:` needs. Both Saudi
     * mobile numbers: +966 followed by nine digits. Keep the two in step — the
     * displayed string and the dialled string must never diverge.
     */
    phones: [
      { display: "+966 53 799 4279", e164: "+966537994279" },
      { display: "+966 56 174 2282", e164: "+966561742282" },
    ] as ReadonlyArray<{ display: string; e164: string }>,

    /**
     * WhatsApp is NOT assumed from the numbers above. Both are Saudi mobiles
     * and either could plausibly be the WhatsApp line, but "plausibly" is not
     * verification: pointing a WhatsApp button at a number that does not answer
     * on WhatsApp is a broken call-to-action. Set this to the confirmed E.164
     * number and the WhatsApp affordance appears; leave it null and it stays
     * absent. See docs/CLIENT-INPUT-REQUIRED.md.
     */
    whatsapp: null as string | null,

    /**
     * Published enquiry inbox.
     *
     * HISTORY, because this has moved twice and the reasoning matters:
     * the company profile printed the contact line as one unbroken string,
     * "Contactsul@jowain.net". That was carried verbatim rather than silently
     * "corrected". It was then briefly changed to contact@jowainyanbu.com on
     * instruction, and changed back here on 20 August 2026 at the client's
     * explicit direction. This address is the one to publish.
     *
     * NOTE FOR ENQUIRY DELIVERY: this inbox is on jowain.net, while the site
     * and the Resend sending domain are jowainyanbu.com. That is fine for a
     * published contact address, but `EMAIL_FROM` must still be on the
     * Resend-verified domain — never this address — or SPF and DKIM fail and
     * the mail lands in spam. See docs/ENVIRONMENT.md.
     */
    email: "contactsul@jowain.net",

    address: {
      /** The profile gives a city only — no street address. */
      city: "Yanbu Al Bahr",
      region: "Al Madinah Province",
      country: "Saudi Arabia",
      countryCode: "SA",
      mapQuery: "Yanbu Al Bahr, Saudi Arabia",
    },

    /**
     * The company website as printed for a human: no protocol, no trailing
     * slash. Derived from `url` so the footer, the contact page and the social
     * card can never drift from the domain the site is actually served on.
     * Previously all three hardcoded "www.jowain.net", which told a visitor
     * already on jowainyanbu.com that the site lived somewhere else.
     */
    get website(): string {
      return resolveSiteUrl().replace(/^https?:\/\//, "");
    },

    /** Not supplied — the hours row hides while this is null. */
    hours: null as string | null,
  },

  /** Coverage claim supported by the profile ("Kingdom-wide"). */
  areaServed: "Saudi Arabia",

  /** Social profiles — none supplied; icons hide while empty. */
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },

  /** Locales. `ar` ships full RTL layout and fully translated content. */
  locales: ["en", "ar"] as const,
  defaultLocale: "en" as const,
} as const;

export type SiteConfig = typeof site;
export type Locale = (typeof site.locales)[number];

/**
 * NOTE ON THE EXPERIENCE CLAIM: the site says "over 30 years", which is what
 * the company profile says. Deliberately no `2026 - 1992` helper lives here —
 * publishing a computed "34+" would put a figure on the page that the client
 * has never stated.
 */

/** `mailto:` for the published enquiry inbox. */
export function mailtoLink(subject?: string): string {
  const base = `mailto:${site.contact.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** Google Maps search link for the stated location. */
export function mapLink(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    site.contact.address.mapQuery,
  )}`;
}
