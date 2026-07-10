/**
 * ============================================================================
 *  SINGLE SOURCE OF TRUTH — BRAND & CONTACT CONFIG
 * ============================================================================
 *  Edit THIS FILE to rebrand the entire website. Every page, the header,
 *  footer, metadata, structured data, WhatsApp/phone CTAs and the sitemap
 *  read from here. Nothing else needs to change to swap the brand.
 *
 *  NOTE ON PLACEHOLDER BRAND:
 *  "RASIKH Heavy Equipment & Contracting" is an ORIGINAL placeholder name
 *  (Arabic: رَاسِخ — "solid / firmly established"). Replace `name`, `legalName`,
 *  `logoText` and the domain with the client's real registered brand.
 *
 *  CONTACT DETAILS below are REAL, taken from the supplied company profile and
 *  are safe to publish. The email currently uses the legacy address — replace
 *  with a branded inbox (e.g. info@yourdomain.com) once the domain is live.
 * ============================================================================
 */

export const site = {
  /** Public-facing brand name (placeholder — replace with real name). */
  name: "RASIKH",
  /** Full brand name used in headings & metadata. */
  fullName: "RASIKH Heavy Equipment & Contracting",
  /** Registered legal entity name (replace with real W.L.L. registration). */
  legalName: "RASIKH Heavy Equipment & Contracting W.L.L.",
  /** Short wordmark shown in the logo lockup. */
  logoText: "RASIKH",
  /** Meaning note surfaced in the About page (editable). */
  nameMeaning: "rāsikh (رَاسِخ) — solid, firmly established, deeply rooted.",

  tagline: "Powering Qatar's Progress",
  taglineSecondary: "Built on Solid Ground",
  descriptionShort:
    "Heavy equipment rental, earthmoving, transportation, lifting, demolition and contracting across Qatar.",
  descriptionLong:
    "A Qatar-based heavy equipment rental and contracting company delivering a single-source solution for earthworks, machinery rental, heavy transport, lifting, demolition and project execution — backed by a modern fleet, trained operators and an uncompromising commitment to safety.",

  /** Production domain (replace once live). Used for canonical URLs & sitemap. */
  url: "https://www.rasikh-qatar.com",

  /** Year the underlying business was established (verified: 2013). */
  foundedYear: 2013,

  contact: {
    // REAL, verified from the company profile — safe to publish.
    phonePrimary: "+974 5000 4159",
    phoneSecondary: "+974 5539 3445",
    /** E.164 for tel:/wa.me links (no spaces, no leading +for wa.me). */
    phonePrimaryE164: "+97450004159",
    whatsappNumber: "97450004159",
    // Legacy email from the profile. REPLACE with a branded address when live.
    email: "info@rasikh-qatar.com",
    emailNote:
      "Placeholder branded email — the profile lists Desertqueen0007@gmail.com as the operational inbox. Confirm the address to publish.",
    address: {
      line1: "Zone 57, Street 509, Building 42",
      city: "Doha",
      country: "Qatar",
      countryCode: "QA",
      /** Fill with a precise pin before enabling the map embed. */
      mapQuery: "Zone 57 Street 509 Doha Qatar",
    },
    /** Editable — set real opening hours. */
    hours: "Sat–Thu, 7:00 AM – 7:00 PM (GST)",
  },

  /** Social profiles — leave empty to hide. Fill when accounts exist. */
  social: {
    linkedin: "",
    instagram: "",
    facebook: "",
    youtube: "",
  },

  /** Locales. `ar` ships full RTL layout; Arabic copy is editable placeholder. */
  locales: ["en", "ar"] as const,
  defaultLocale: "en" as const,
} as const;

export type SiteConfig = typeof site;
export type Locale = (typeof site.locales)[number];

/** WhatsApp deep link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** tel: link for the primary line. */
export function telLink(): string {
  return `tel:${site.contact.phonePrimaryE164}`;
}
