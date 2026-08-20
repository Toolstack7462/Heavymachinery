import type { Metadata } from "next";
import { site, type Locale } from "@/config/site";
import { localeHref } from "@/lib/utils";
import { services } from "@/content/services";
import { equipmentCategories } from "@/content/equipment";
import { faqs } from "@/content/faqs";

/**
 * Page metadata with canonical URL, hreflang alternates, Open Graph and
 * Twitter cards. `path` is locale-agnostic ("/services"); alternates are
 * generated for every locale plus x-default.
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
  // The home title carries the localized positioning line; interior pages get
  // the page name plus the brand.
  const fullTitle =
    path === "/" ? `${site.fullName} — ${title}` : `${title} | ${site.name}`;

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
      locale: locale === "ar" ? "ar_SA" : "en_US",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImages,
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/**
 * Organization + LocalBusiness graph.
 *
 * `telephone` now carries the client-confirmed numbers. `sameAs` is still
 * omitted while no social accounts are confirmed — an incomplete graph beats a
 * fabricated one.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    url: site.url,
    logo: `${site.url}/brand/jowain-emblem-512.png`,
    image: `${site.url}/opengraph-image`,
    description: `Heavy equipment rental and transportation solutions across the Kingdom of Saudi Arabia since ${site.foundedYear}. Certified cranes, construction and earthmoving equipment, trailers, trucks, tankers and site power, with qualified operators and drivers.`,
    slogan: site.tagline,
    email: site.contact.email,
    telephone: site.contact.phones.map((phone) => phone.e164),
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address.city,
      addressRegion: site.contact.address.region,
      addressCountry: site.contact.address.countryCode,
    },
    areaServed: { "@type": "Country", name: site.areaServed },
    knowsLanguage: ["en", "ar"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.contact.email,
        telephone: site.contact.phones.map((phone) => phone.e164),
        areaServed: site.contact.address.countryCode,
        availableLanguage: ["English", "Arabic"],
      },
    ],
    makesOffer: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title.en,
        description: service.summary.en,
      },
    })),
  };
}

/** Service schema for a service detail page. */
export function serviceJsonLd(
  name: string,
  description: string,
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: site.positioning,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "Country", name: site.areaServed },
    url: `${site.url}${path}`,
  };
}

/**
 * Equipment pages describe a rental service, not a purchasable product, so
 * they use Service rather than Product: there is no published price, and a
 * Product offer without one is invalid structured data.
 */
export function equipmentJsonLd({
  name,
  description,
  category,
  path,
}: {
  name: string;
  description: string;
  category: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: `${category} — equipment rental`,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "Country", name: site.areaServed },
    url: `${site.url}${path}`,
  };
}

/** FAQPage schema, in the requested locale. */
export function faqJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question[locale],
      acceptedAnswer: { "@type": "Answer", text: faq.answer[locale] },
    })),
  };
}

/** WebSite schema. */
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

/** Equipment category list for the fleet index page. */
export function fleetJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:
      locale === "ar"
        ? "فئات المعدات — Jowain Yanbu Est."
        : "Equipment categories — Jowain Yanbu Est.",
    itemListElement: equipmentCategories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.title[locale],
      description: category.blurb[locale],
    })),
  };
}

/** Reusable, source-backed SEO descriptions. */
export const seoText = {
  home: {
    en: `Heavy equipment rental and transportation across Saudi Arabia since 1992 from Jowain Yanbu Est. Certified mobile, rough terrain and crawler cranes, construction and earthmoving equipment, trailers, trucks, tankers and site power, with qualified operators and drivers. Based in Yanbu Al Bahr.`,
    ar: `تأجير المعدات الثقيلة وخدمات النقل في المملكة العربية السعودية منذ عام 1992 مع مؤسسة Jowain Yanbu Est. رافعات متحركة معتمدة ورافعات للطرق الوعرة ورافعات زاحفة، ومعدات الإنشاء وأعمال الحفر، ومقاطر وشاحنات وصهاريج وتغذية بالطاقة، مع مشغّلين وسائقين مؤهّلين. المقر في ينبع البحر.`,
  },
  about: {
    en: "Established in Yanbu Al Bahr in 1992, Jowain Yanbu Est. brings over 30 years of heavy equipment rental and transportation experience to projects across the Kingdom of Saudi Arabia.",
    ar: "تأسّست مؤسسة Jowain Yanbu Est. في ينبع البحر عام 1992، وتقدّم خبرة تتجاوز 30 عاماً في تأجير المعدات الثقيلة وخدمات النقل لمشاريع في مختلف مناطق المملكة العربية السعودية.",
  },
  fleet: {
    en: "Browse the Jowain Yanbu Est. equipment fleet: certified mobile cranes (20–1200 T), rough terrain cranes (25–120 T), crawler cranes (55–3200 T), excavators, bulldozers, graders, loaders, rollers, trailers, trucks, tankers, generators, compressors and tower lights for rent in Saudi Arabia.",
    ar: "استعرض أسطول معدات مؤسسة Jowain Yanbu Est.: رافعات متحركة معتمدة (20–1200 طن)، ورافعات للطرق الوعرة (25–120 طناً)، ورافعات زاحفة (55–3200 طن)، وحفّارات وجرّافات وممهّدات ولوادر ومداحل ومقاطر وشاحنات وصهاريج ومولّدات وضواغط وأبراج إضاءة للتأجير في المملكة العربية السعودية.",
  },
  services: {
    en: "Heavy lifting equipment rental, material handling and access solutions, construction and earthmoving equipment, transportation services, and site power and support across Saudi Arabia.",
    ar: "تأجير معدات الرفع الثقيل، وحلول مناولة المواد والوصول الآمن، ومعدات الإنشاء وأعمال الحفر، وخدمات النقل، وتغذية المواقع بالطاقة والمساندة في مختلف مناطق المملكة العربية السعودية.",
  },
  industries: {
    en: "Equipment and transportation support for oil & gas, petrochemical, construction & infrastructure, and power & energy projects across Saudi Arabia.",
    ar: "دعم بالمعدات وخدمات النقل لمشاريع النفط والغاز والبتروكيماويات والإنشاء والبنية التحتية والطاقة والكهرباء في مختلف مناطق المملكة العربية السعودية.",
  },
  quality: {
    en: "Reliable equipment, qualified personnel, rigorous maintenance and professional working practices define the quality commitment behind every Jowain Yanbu Est. project.",
    ar: "معدات موثوقة، وكوادر مؤهّلة، وصيانة صارمة، وممارسات عمل احترافية تشكّل التزام الجودة خلف كل مشروع تدعمه مؤسسة Jowain Yanbu Est.",
  },
  clients: {
    en: "Jowain Yanbu Est. supplies heavy equipment and transportation to contractors and operators working on major industrial, energy and infrastructure projects.",
    ar: "توفّر مؤسسة Jowain Yanbu Est. المعدات الثقيلة وخدمات النقل لمقاولين ومشغّلين يعملون في مشاريع صناعية وطاقية وبنية تحتية كبرى.",
  },
  why: {
    en: "Established since 1992, with Kingdom-wide coverage and qualified personnel. Three reasons projects across Saudi Arabia rely on Jowain Yanbu Est.",
    ar: "قائمة منذ عام 1992، وتغطية على مستوى المملكة، وكوادر مؤهّلة. ثلاثة أسباب تجعل مشاريع في مختلف مناطق المملكة تعتمد على مؤسسة Jowain Yanbu Est.",
  },
  contact: {
    en: "Contact Jowain Yanbu Est. in Yanbu Al Bahr, Saudi Arabia for heavy equipment rental and transportation. Send your requirement and we will respond with availability.",
    ar: "تواصل مع مؤسسة Jowain Yanbu Est. في ينبع البحر بالمملكة العربية السعودية لتأجير المعدات الثقيلة وخدمات النقل. أرسل متطلباتك وسنوافيك بالتوفّر.",
  },
  request: {
    en: "Request heavy equipment or transportation from Jowain Yanbu Est. Tell us the equipment, the project location and how long you need it.",
    ar: "اطلب معدات ثقيلة أو خدمة نقل من مؤسسة Jowain Yanbu Est. أخبرنا بالمعدات وموقع المشروع والمدة المطلوبة.",
  },
  faqs: {
    en: "Common questions about renting heavy equipment and arranging transportation with Jowain Yanbu Est. in Saudi Arabia, including crane capacities, operators, Kingdom-wide coverage and how to request a unit.",
    ar: "أسئلة شائعة حول تأجير المعدات الثقيلة وترتيب أعمال النقل مع مؤسسة Jowain Yanbu Est. في المملكة العربية السعودية، ومنها حمولات الرافعات والمشغّلين والتغطية وكيفية طلب الوحدات.",
  },
} as const;
