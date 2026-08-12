import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/config/site";
import { services } from "@/content/services";
import { equipmentCategories } from "@/content/equipment";

export interface NavLink {
  label: string;
  href: string;
  /** Optional grouped children shown in a dropdown. */
  children?: { label: string; href: string; description?: string }[];
}

/**
 * Primary navigation.
 *
 * Six top-level items so the full menu fits from 1024px up without shrinking
 * type or crowding the CTA. Quality and Why-choose-us sit under About, which is
 * also how a buyer looks for them.
 */
export function getPrimaryNav(dict: Dictionary, locale: Locale): NavLink[] {
  return [
    {
      label: dict.nav.about,
      href: "/about",
      children: [
        { label: dict.nav.about, href: "/about" },
        { label: dict.nav.quality, href: "/quality" },
        { label: dict.pages.whyTitle, href: "/why-choose-us" },
      ],
    },
    {
      label: dict.nav.fleet,
      href: "/fleet",
      children: [
        { label: dict.actions.viewAll, href: "/fleet" },
        ...equipmentCategories.map((category) => ({
          label: category.title[locale],
          href: `/fleet?category=${category.key}`,
          description: category.blurb[locale],
        })),
      ],
    },
    {
      label: dict.nav.services,
      href: "/services",
      children: services.map((service) => ({
        label: service.title[locale],
        href: `/services/${service.slug}`,
        description: service.tagline[locale],
      })),
    },
    { label: dict.nav.industries, href: "/industries" },
    { label: dict.nav.clients, href: "/clients" },
    { label: dict.nav.contact, href: "/contact" },
  ];
}

/** Footer link columns. */
export function getFooterNav(dict: Dictionary, locale: Locale) {
  return {
    company: [
      { label: dict.nav.about, href: "/about" },
      { label: dict.nav.quality, href: "/quality" },
      { label: dict.pages.whyTitle, href: "/why-choose-us" },
      { label: dict.nav.industries, href: "/industries" },
      { label: dict.nav.clients, href: "/clients" },
      { label: dict.nav.faqs, href: "/faqs" },
    ],
    equipment: [
      { label: dict.actions.viewAll, href: "/fleet" },
      ...equipmentCategories.map((category) => ({
        label: category.title[locale],
        href: `/fleet?category=${category.key}`,
      })),
    ],
    services: services.map((service) => ({
      label: service.title[locale],
      href: `/services/${service.slug}`,
    })),
  };
}
