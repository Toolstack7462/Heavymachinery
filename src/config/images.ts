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

/**
 * Photography is SELF-HOSTED under `public/photos/<key>.jpg`.
 *
 * It used to be fetched from images.unsplash.com at request time, which meant
 * every cold image cost the server an outbound HTTPS round trip to Unsplash
 * before `sharp` could even start resizing. On CloudLinux shared hosting, where
 * CPU is capped per account, that showed up exactly as reported: equipment
 * pages slow to paint, and images that sometimes never arrived at all. It also
 * made the fleet grid depend on a third party staying up.
 *
 * Serving from disk removes the round trip, removes the dependency, and lets
 * Next optimise from a local file. Masters are capped at a 1600px long edge and
 * re-encoded at quality 82 progressive, because nothing on the site renders
 * larger than that.
 *
 * The Unsplash License permits this: download, host and use commercially, no
 * attribution required. `mini-excavators.jpg` is client-supplied, not Unsplash.
 */

/** Public path for a photo key. */
export function photoSrc(key: string): string {
  return `/photos/${key}.jpg`;
}

export interface Img {
  /** File key: resolves to `/photos/<key>.jpg`. */
  id: string;
  /**
   * Optional CSS `object-position` for the crop.
   *
   * Cards crop with `object-cover`, which keeps the centre. That is right for
   * most frames and wrong for a few: a tall photograph of a crawler crane
   * centres on the cab and clips the tracks, which are the feature that tells a
   * buyer it is a crawler and not a wheeled mobile crane. Setting this biases
   * the crop toward the part of the image that identifies the machine.
   */
  position?: string;
  /** Alt text is written as description, never as a filename or keyword list. */
  alt: string;
  altAr: string;
}

export const images = {
  hero: {
    id: "hero",
    alt: "A tracked excavator standing on open ground at golden hour",
    altAr: "حفّارة مجنزرة على أرض مفتوحة عند ساعة الغروب",
  },
  fleetLineup: {
    id: "fleetLineup",
    alt: "Excavators and support plant staged in a line across an equipment yard",
    altAr: "حفّارات ومعدات مساندة مصطفّة في ساحة المعدات",
  },
  siteDusk: {
    id: "siteDusk",
    alt: "An excavator silhouetted against a dusk sky on a prepared site",
    altAr: "حفّارة تظهر بظلّها أمام سماء الغروب في موقع مُهيّأ",
  },
  earthworks: {
    id: "earthworks",
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
    id: "excavators",
    alt: "A tracked excavator with its bucket lowered on a working platform",
    altAr: "حفّارة مجنزرة وذراعها منخفض على منصة عمل",
  },
  "mini-excavators": {
    /*
     * Replaced 20 August 2026. The previous frame was atmospheric but the
     * machine sat tiny and half-hidden in heavy fog: a buyer could not see the
     * equipment, which is the only reason the photograph is there.
     * Verified: Wacker Neuson compact excavator, whole machine and arm visible.
     */
    id: "mini-excavators",
    alt: "A compact tracked excavator with its arm folded, parked on open ground",
    altAr: "حفّارة مصغّرة مجنزرة وذراعها مطوي، متوقفة على أرض مفتوحة",
  },
  "wheel-loaders": {
    id: "wheel-loaders",
    alt: "A wheel loader lifting a full bucket of earth",
    altAr: "لودر بعجل يرفع حمولة كاملة من التراب",
  },
  "mobile-cranes": {
    id: "mobile-cranes",
    alt: "A mobile crane with its boom stowed, parked and ready to mobilise",
    altAr: "رافعة متحركة بذراع مطوي، جاهزة للانتقال إلى الموقع",
  },
  "boom-trucks": {
    /*
     * Replaced 20 August 2026. The previous frame showed a rusted truck under a
     * canopy with loose slings heaped on the bed. It was the right machine, but
     * a company presenting a maintained fleet should not illustrate it with
     * tired plant. Verified: Hyundai truck-mounted crane, knuckle boom behind
     * the cab, outriggers down, flat bed clear.
     */
    id: "boom-trucks",
    alt: "A truck-mounted crane parked with its boom stowed over a clear flat bed",
    altAr: "شاحنة مزوّدة برافعة، ذراعها مطوي فوق سطح تحميل خالٍ",
  },
  "dump-trucks": {
    id: "dump-trucks",
    alt: "An articulated dump truck loaded with material on a haul road",
    altAr: "قلّاب مفصلي محمّل بالمواد على طريق نقل",
  },

  /*
   * Added 20 August 2026. Each of the three was downloaded and looked at before
   * being accepted, because Unsplash alt text cannot be trusted for machinery:
   * the top result for "bulldozer" is a Doosan DL300 WHEEL LOADER, and the top
   * results for "crawler crane" include two skid steers. Publishing on the
   * strength of a caption would have put the wrong machine under a category
   * heading, which to a procurement engineer is a specification error.
   */
  "skid-steer-loaders": {
    // Verified: John Deere 332G, four wheels, lift arms, bucket attached.
    id: "skid-steer-loaders",
    alt: "A compact skid steer loader with its bucket resting on the ground",
    altAr: "لودر انزلاقي صغير وجاروفه مستقرّ على الأرض",
  },
  "crawler-cranes": {
    // Verified: Kobelco crawler crane, crawler tracks and lattice boom.
    id: "crawler-cranes",
    // Portrait source; no landscape crawler crane exists in the free library.
    // Bias the crop downward so the tracks make the frame.
    position: "center 72%",
    alt: "A crawler crane on tracks with its lattice boom raised at a site",
    altAr: "رافعة زاحفة على جنزير وذراعها الشبكي مرفوع في الموقع",
  },
  telehandlers: {
    /*
     * The Merlo frame that first went in here was the right machine but shot
     * portrait, so the 16:10 card cropped it to mostly building facade with the
     * machine cut off. Verified replacement: JCB telehandler, landscape, whole
     * machine in frame.
     */
    id: "telehandlers",
    alt: "A compact telehandler with its telescopic boom lowered, parked kerbside",
    altAr: "رافعة تلسكوبية مدمجة وذراعها منخفض، متوقفة على جانب الطريق",
  },
  rollers: {
    // Verified: JCB VM115 single-drum vibratory soil compactor.
    id: "rollers",
    alt: "A single-drum vibratory roller standing on a prepared road base",
    altAr: "مدحلة هزّازة بأسطوانة واحدة على طبقة أساس مُهيّأة",
  },
  "scissor-and-man-lifts": {
    // Verified: a row of scissor lifts, scissor mechanism and rails visible.
    id: "scissor-and-man-lifts",
    alt: "Scissor lifts lined up in an equipment yard with their platforms lowered",
    altAr: "مقصّات رفع مصطفّة في ساحة المعدات ومنصّاتها منخفضة",
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
