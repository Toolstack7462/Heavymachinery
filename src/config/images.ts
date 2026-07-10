/**
 * ============================================================================
 *  IMAGERY — central, editable image references
 * ============================================================================
 *  Photography is sourced from Unsplash (free under the Unsplash License).
 *  Every ID below was visually verified to depict real heavy equipment.
 *  Replace these with the CLIENT'S OWN photography before launch — swap the
 *  `id` (and refine the `alt` voice) in one place and the whole site updates.
 *
 *  Alt text is written as brand voice, not filenames.
 * ============================================================================
 */

const BASE = "https://images.unsplash.com/photo-";

/** Build an optimised Unsplash URL. next/image re-optimises on top of this. */
export function unsplash(id: string, w = 1600, q = 78): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export interface Img {
  id: string;
  alt: string;
}

export const images = {
  hero: {
    id: "1628645419184-26a1f2757340",
    alt: "A tracked excavator on open ground at golden hour under a clear Gulf sky",
  },
  earthworks: {
    id: "1652303713917-2666b8bee507",
    alt: "An excavator cutting a trench with an operator in high-visibility gear",
  },
  fleetYard: {
    id: "1610477865545-37711c53144d",
    alt: "A line-up of excavators, a dozer and trucks staged in a plant yard",
  },
  siteAerial: {
    id: "1629807472592-2649bfa09f9c",
    alt: "Aerial view of dump trucks and a wheel loader working a materials yard",
  },
  demolition: {
    id: "1534097575056-ddba81f714c8",
    alt: "Aerial view of an excavator breaking out and loading spoil into a truck",
  },
} as const satisfies Record<string, Img>;

/** Fleet category cover images. */
export const categoryImages: Record<string, Img> = {
  earthmoving: {
    id: "1629807473015-41699c4471b5",
    alt: "A wheel loader lifting a full bucket of earth, kicking up dust",
  },
  lifting: {
    id: "1780362959783-9373296db52b",
    alt: "A yellow mobile crane rigged and ready to lift on site",
  },
  transportation: {
    id: "1622645636770-11fbf0611463",
    alt: "A heavy rigid dump truck hauling material across a quarry road",
  },
  power: {
    id: "1583024011792-b165975b52f5",
    alt: "An excavator silhouetted against a dusk sky on a prepared site",
  },
};

/**
 * Per-equipment photography — ONLY where a real matching photo was verified.
 * Machines without an entry fall back to the engineered graphite panel + glyph
 * (honest: no mislabelled or duplicated stock shots).
 */
export const equipmentImages: Record<string, Img> = {
  excavators: {
    id: "1649807533255-bbc9c9fb7d77",
    alt: "A tracked excavator working a hillside in bright sun",
  },
  "long-boom-excavators": {
    id: "1580901369227-308f6f40bdeb",
    alt: "An excavator with an extended arm reaching across rocky ground",
  },
  "mini-excavators": {
    id: "1637669886956-bf0e1cc4f0d3",
    alt: "A compact excavator standing on a raised platform against a moody sky",
  },
  "wheel-loaders": {
    id: "1629807473015-41699c4471b5",
    alt: "A wheel loader lifting a full bucket of earth",
  },
  dozers: {
    id: "1630288214173-a119cf823388",
    alt: "A tracked machine pushing earth on a cleared site",
  },
  "mobile-cranes": {
    id: "1780362959783-9373296db52b",
    alt: "A yellow mobile crane rigged for a lift",
  },
  "truck-mounted-cranes": {
    id: "1768658500241-a96c803b10ae",
    alt: "A truck-mounted crane loading materials onto its bed",
  },
  "dump-trucks": {
    id: "1622645636770-11fbf0611463",
    alt: "A heavy rigid dump truck hauling material",
  },
};

export function equipmentImage(slug: string): Img | undefined {
  return equipmentImages[slug];
}
