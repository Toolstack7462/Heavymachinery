import type { Metadata } from "next";
import { site, type Locale } from "@/config/site";
import { localeHref } from "@/lib/utils";
import { services } from "@/content/services";
import { faqs } from "@/content/faqs";

/**
 * Build page metadata with canonical + hreflang alternates, Open Graph & Twitter.
 * `path` is locale-agnostic (e.g. "/services"); alternates are generated per locale.
 */
export function buildMetadata({
  locale,
  title,
  description,
  path = "/",
  noindex = false,
  images,
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
  images?: string[];
}): Metadata {
  const url = `${site.url}${localeHref(locale, path)}`;
  const fullTitle =
    path === "/"
      ? `${site.fullName} — ${site.tagline}`
      : `${title} | ${site.name}`;

  const ogImages = (images ?? ["/opengraph-image"]).map((src) =>
    src.startsWith("http") ? src : `${site.url}${src}`,
  );

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: url,
      languages: {
        en: `${site.url}${localeHref("en", path)}`,
        ar: `${site.url}${localeHref("ar", path)}`,
        "x-default": `${site.url}${localeHref("en", path)}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: site.fullName,
      title: fullTitle,
      description,
      url,
      locale: locale === "ar" ? "ar_QA" : "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImages,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/** Organization + LocalBusiness combined graph (site-wide). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    description: site.descriptionLong,
    email: site.contact.email,
    telephone: site.contact.phonePrimaryE164,
    foundingDate: String(site.foundedYear),
    areaServed: { "@type": "Country", name: "Qatar" },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address.line1,
      addressLocality: site.contact.address.city,
      addressCountry: site.contact.address.countryCode,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.contact.phonePrimaryE164,
        contactType: "sales",
        areaServed: "QA",
        availableLanguage: ["English", "Arabic"],
      },
    ],
    sameAs: Object.values(site.social).filter(Boolean),
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title },
    })),
  };
}

/** Service schema for a service detail page. */
export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "Country", name: "Qatar" },
    url: `${site.url}${path}`,
  };
}

/** FAQPage schema. */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** WebSite schema with search action. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.fullName,
    inLanguage: ["en", "ar"],
    publisher: { "@id": `${site.url}/#organization` },
  };
}
