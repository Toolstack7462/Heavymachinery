/**
 * ============================================================================
 *  OUR VALUED CLIENTS
 * ============================================================================
 *  TWO client sources, both supplied by Jowain Yanbu Est., both reproduced
 *  faithfully — nothing here was sourced from the internet:
 *
 *  1. `clientLogos` — the 25 marks on the supplied "Our Valued Clients" board
 *     (WhatsApp image, 10 Aug 2026). Each cell was sliced from that artwork at
 *     native resolution into public/clients/*.png with its original colours
 *     intact. No mark is recoloured, distorted or substituted.
 *
 *  2. `directClients` — the client names printed on the company profile's
 *     "Our Valued Clients" page.
 *
 *  NOTE FOR FUTURE AUDITS: the Qatar-based names below are CURRENT Jowain
 *  clients listed in the 2026 company profile. They are not residue from the
 *  previous placeholder identity — do not "purge" them.
 *
 *  One mark on the board (a Saudi government emblem) has an inner ring of
 *  Arabic text that is not legible at the supplied resolution. Rather than
 *  guess the organisation, it carries a neutral description. See
 *  docs/MISSING-INFO.md.
 * ============================================================================
 */

import type { L } from "@/i18n/localized";

export interface ClientLogo {
  slug: string;
  /** Name as legible on the supplied artwork. */
  name: string;
  /** Accessible description, per locale. */
  alt: L;
  width: number;
  height: number;
  /**
   * Optical size correction. Wide-and-thin marks read as oversized when they
   * fill the cell width; near-square marks read as undersized. This nudges
   * each mark toward equal visual weight instead of equal raw dimensions.
   */
  scale: number;
}

const logo = (
  slug: string,
  name: string,
  width: number,
  height: number,
  scale = 1,
): ClientLogo => ({
  slug,
  name,
  alt: { en: `${name} logo`, ar: `شعار ${name}` },
  width,
  height,
  scale,
});

export const clientLogos: ClientLogo[] = [
  logo("saudi-aramco", "Saudi Aramco", 178, 61),
  logo("sabic", "SABIC", 145, 79),
  logo("anabeeb", "Anabeeb", 111, 96, 1.12),
  logo("satorp", "SATORP", 165, 110),
  logo("doosan", "Doosan", 155, 78),
  logo("gs-engineering-construction", "GS E&C", 88, 95, 1.12),
  logo("sepco", "SEPCO", 143, 75),
  logo("tecnicas-reunidas", "Técnicas Reunidas", 160, 96),
  logo("sinohydro", "Sinohydro", 181, 63),
  logo("sadara", "Sadara", 174, 69),
  logo("sipchem", "Sipchem", 169, 81),
  logo("china-harbour-engineering", "China Harbour Engineering Company", 184, 111),
  {
    slug: "kingdom-of-saudi-arabia",
    name: "Kingdom of Saudi Arabia",
    alt: {
      en: "Logo of a Kingdom of Saudi Arabia government organisation",
      ar: "شعار جهة حكومية في المملكة العربية السعودية",
    },
    width: 101,
    height: 101,
    scale: 1.12,
  },
  logo("kentz", "Kentz", 140, 78),
  logo("ctci-corporation", "CTCI Corporation", 182, 81),
  logo("china-petroleum-pipeline", "China Petroleum Pipeline Engineering", 182, 85),
  logo("hanwha", "Hanwha", 144, 97),
  logo("technip", "Technip", 170, 62),
  logo("sinopec", "Sinopec", 106, 111, 1.12),
  logo("saudi-electricity-company", "Saudi Electricity Company", 169, 79),
  logo("samsung-engineering", "Samsung Engineering", 183, 104),
  logo("daelim", "Daelim", 183, 43, 0.88),
  logo("crec-china-railway", "CREC", 126, 105, 1.12),
  logo("hyundai", "Hyundai", 181, 33, 0.85),
  logo("sk-engineering-construction", "SK E&C", 156, 89),
];

export interface DirectClientGroup {
  region: L;
  names: string[];
}

/** Printed on the profile's "Our Valued Clients" page, exactly as listed. */
export const directClients: DirectClientGroup[] = [
  {
    region: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
    names: ["Kabbani", "TCC", "Abraak International"],
  },
  {
    region: { en: "Qatar", ar: "قطر" },
    names: [
      "Landworx Company",
      "UCC Qatar",
      "Redco International Qatar",
      "Petrosarve Qatar",
      "Iris Qatar",
      "UCC PMV Qatar",
    ],
  },
];
