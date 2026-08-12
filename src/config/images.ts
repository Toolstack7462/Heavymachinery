/**
 * ============================================================================
 *  IMAGERY — central, editable image references
 * ============================================================================
 *  CLIENT-SUPPLIED PHOTOGRAPHY: none was provided. The supplied company
 *  profile is a Canva deck whose machinery photographs are AI-generated
 *  (malformed crane geometry, synthetic handshake stock), so they are
 *  deliberately NOT used here — publishing them would put fabricated
 *  equipment on a real company's website.
 *
 *  Until Jowain supplies its own fleet photography, categories use licensed
 *  Unsplash photography (free under the Unsplash License). Every ID below was
 *  opened and visually checked against the label it carries — a machine is
 *  never shown under the wrong category. Equipment types with no verified
 *  matching photograph intentionally fall back to the engineered navy panel
 *  and line glyph rather than borrowing a lookalike machine.
 *
 *  Swap `id` here (and refine `alt`) to move the whole site onto real Jowain
 *  photography in one place.
 * ============================================================================
 */

const BASE = "https://images.unsplash.com/photo-";

/** Build an optimised Unsplash URL. next/image re-optimises on top of this. */
export function unsplash(id: string, w = 1600, q = 76): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export interface Img {
  id: string;
  /** Alt text is written as description, never as a filename or keyword list. */
  alt: string;
  altAr: string;
}

export const images = {
  hero: {
    id: "1628645419184-26a1f2757340",
    alt: "A tracked excavator standing on open ground at golden hour",
    altAr: "حفّارة مجنزرة على أرض مفتوحة عند ساعة الغروب",
  },
  fleetLineup: {
    id: "1610477865545-37711c53144d",
    alt: "Excavators and support plant staged in a line across an equipment yard",
    altAr: "حفّارات ومعدات مساندة مصطفّة في ساحة المعدات",
  },
  siteDusk: {
    id: "1583024011792-b165975b52f5",
    alt: "An excavator silhouetted against a dusk sky on a prepared site",
    altAr: "حفّارة تظهر بظلّها أمام سماء الغروب في موقع مُهيّأ",
  },
  earthworks: {
    id: "1652303713917-2666b8bee507",
    alt: "An excavator cutting a trench with an operator in high-visibility gear",
    altAr: "حفّارة تشقّ خندقاً بوجود مشغّل يرتدي زياً عالي الوضوح",
  },
} as const satisfies Record<string, Img>;

/**
 * Per-equipment photography — ONLY where a photograph of that exact machine
 * type was verified by eye.
 *
 * There is deliberately NO category-level fallback. A crawler crane card must
 * never borrow the mobile-crane photograph, and a lowbed trailer must never
 * show a dump truck: to a procurement engineer that is a specification error,
 * not a design choice. Items without a verified photograph render the
 * engineered navy panel and their line glyph instead.
 */
export const equipmentImages: Record<string, Img> = {
  excavators: {
    id: "1649807533255-bbc9c9fb7d77",
    alt: "A tracked excavator with its bucket lowered on a working platform",
    altAr: "حفّارة مجنزرة وذراعها منخفض على منصة عمل",
  },
  "mini-excavators": {
    id: "1637669886956-bf0e1cc4f0d3",
    alt: "A compact excavator working on a raised platform in low light",
    altAr: "حفّارة صغيرة تعمل على منصة مرتفعة في ضوء خفيف",
  },
  "wheel-loaders": {
    id: "1629807473015-41699c4471b5",
    alt: "A wheel loader lifting a full bucket of earth",
    altAr: "لودر بعجل يرفع حمولة كاملة من التراب",
  },
  "mobile-cranes": {
    id: "1780362959783-9373296db52b",
    alt: "A mobile crane with its boom stowed, parked and ready to mobilise",
    altAr: "رافعة متحركة بذراع مطوي، جاهزة للانتقال إلى الموقع",
  },
  "boom-trucks": {
    id: "1768658500241-a96c803b10ae",
    alt: "A boom truck loading material onto its own flat bed",
    altAr: "شاحنة برافعة تحمّل المواد على سطحها",
  },
  "dump-trucks": {
    id: "1629807472592-2649bfa09f9c",
    alt: "An articulated dump truck loaded with material on a haul road",
    altAr: "قلّاب مفصلي محمّل بالمواد على طريق نقل",
  },
};

export function equipmentImage(slug: string): Img | undefined {
  return equipmentImages[slug];
}

/** Official brand assets, generated from the client-supplied Logo.pdf. */
export const brand = {
  emblem: "/brand/jowain-emblem.png",
  emblemLarge: "/brand/jowain-emblem-512.png",
  emblemWidth: 177,
  emblemHeight: 172,
} as const;
