import type { Dictionary } from "@/i18n/dictionaries";
import { services } from "@/content/services";
import { equipmentCategories } from "@/content/equipment";

export interface NavLink {
  label: string;
  href: string;
  /** Optional grouped children for mega-menu. */
  children?: { label: string; href: string; description?: string }[];
}

/** Primary navigation, localized via the dictionary. */
export function getPrimaryNav(dict: Dictionary): NavLink[] {
  return [
    { label: dict.nav.home, href: "/" },
    {
      label: dict.nav.services,
      href: "/services",
      children: services.map((s) => ({
        label: s.title,
        href: `/services/${s.slug}`,
        description: s.tagline,
      })),
    },
    {
      label: dict.nav.fleet,
      href: "/fleet",
      children: equipmentCategories.map((c) => ({
        label: c.title,
        href: `/fleet?category=${c.key}`,
        description: c.blurb,
      })),
    },
    { label: dict.nav.industries, href: "/industries" },
    {
      label: dict.nav.about,
      href: "/about",
      children: [
        { label: dict.nav.about, href: "/about" },
        { label: dict.nav.leadership, href: "/leadership" },
        { label: dict.nav.safety, href: "/safety-quality" },
        { label: dict.nav.whyUs, href: "/why-choose-us" },
        { label: dict.nav.projects, href: "/projects" },
      ],
    },
    { label: dict.nav.insights, href: "/insights" },
    { label: dict.nav.contact, href: "/contact" },
  ];
}

/** Footer link columns. */
export function getFooterNav(dict: Dictionary) {
  return {
    quickLinks: [
      { label: dict.nav.about, href: "/about" },
      { label: dict.nav.leadership, href: "/leadership" },
      { label: dict.nav.industries, href: "/industries" },
      { label: dict.nav.safety, href: "/safety-quality" },
      { label: dict.nav.whyUs, href: "/why-choose-us" },
      { label: dict.nav.faqs, href: "/faqs" },
      { label: dict.nav.insights, href: "/insights" },
    ],
    services: services.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
    })),
  };
}
