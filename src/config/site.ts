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
     * No telephone or WhatsApp number appears anywhere in the supplied
     * profile. Keep `null` until the client provides verified numbers — the
     * UI drops all call/WhatsApp affordances while these are null.
     */
    phone: null as string | null,
    phoneE164: null as string | null,
    whatsapp: null as string | null,

    /**
     * Published enquiry inbox, confirmed by the client on 20 August 2026.
     *
     * This SUPERSEDES the company profile, which printed the contact line as
     * one unbroken string, "Contactsul@jowain.net". That was carried verbatim
     * for a while rather than silently "corrected", and the ambiguity is now
     * resolved: the address is `contact@jowainyanbu.com`, on the same domain
     * the site is served from. Keeping the inbox and the site on one domain is
     * also what makes SPF and DKIM straightforward for enquiry delivery.
     */
    email: "contact@jowainyanbu.com",

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
