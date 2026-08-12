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

  /** Production domain, from the profile ("www.jowain.net"). */
  url: "https://www.jowain.net",

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
     * EXACTLY as printed in the company profile, where the contact line reads
     * "Contactsul@jowain.net" (one unbroken string). It is published verbatim
     * rather than silently "corrected" — the client should confirm whether the
     * intended address is this, or "sul@jowain.net" with a "Contact" label that
     * lost its separator. Tracked in docs/MISSING-INFO.md.
     */
    email: "contactsul@jowain.net",
    /** The raw string as it appears in the source document. */
    emailAsPrinted: "Contactsul@jowain.net",

    address: {
      /** The profile gives a city only — no street address. */
      city: "Yanbu Al Bahr",
      region: "Al Madinah Province",
      country: "Saudi Arabia",
      countryCode: "SA",
      mapQuery: "Yanbu Al Bahr, Saudi Arabia",
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
