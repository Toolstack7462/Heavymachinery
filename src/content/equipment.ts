/**
 * ============================================================================
 *  FLEET / EQUIPMENT CATALOGUE — central data source
 * ============================================================================
 *  Drives the /fleet catalogue index AND every individual equipment page
 *  (generated from `slug`). To add a machine, append an object here.
 *
 *  HONESTY RULE: capacities/specs below use ONLY figures stated in the supplied
 *  company profile (e.g. Dozer D8/D155, Roller 10T, Cranes 50/65/100T,
 *  Forklift 5/10T, Grader 14G, Mini Excavator 3.5/5.5T). Anything not verified
 *  is written as "Available on request" — DO NOT invent tonnages, model numbers,
 *  year, or counts. Fill the `specsEditable` fields once confirmed by the client.
 * ============================================================================
 */

export type EquipmentCategory =
  | "earthmoving"
  | "lifting"
  | "transportation"
  | "power";

export interface EquipmentSpec {
  label: string;
  /** Verified value, or "Available on request" placeholder. */
  value: string;
}

export interface EquipmentItem {
  slug: string;
  name: string;
  category: EquipmentCategory;
  /** One-line summary for cards. */
  summary: string;
  /** Longer description for the detail page. */
  description: string;
  /** Typical jobs this machine handles (generic, not project claims). */
  applications: string[];
  /** Verified specs + editable placeholders. */
  specs: EquipmentSpec[];
  /** Lucide icon key (see components/Icon). */
  icon: string;
}

export interface CategoryMeta {
  key: EquipmentCategory;
  title: string;
  blurb: string;
  icon: string;
}

export const equipmentCategories: CategoryMeta[] = [
  {
    key: "earthmoving",
    title: "Earthmoving & Excavation",
    blurb:
      "Excavators, loaders, dozers, graders and compaction plant for bulk earthworks, grading and site preparation.",
    icon: "excavator",
  },
  {
    key: "lifting",
    title: "Lifting & Material Handling",
    blurb:
      "Mobile cranes, telehandlers, forklifts and truck-mounted cranes for precise, safe load handling on site.",
    icon: "crane",
  },
  {
    key: "transportation",
    title: "Heavy Transport & Haulage",
    blurb:
      "Low-bed and flatbed trailers plus dump trucks for moving plant, aggregates and spoil across Qatar.",
    icon: "truck",
  },
  {
    key: "power",
    title: "Power & Site Support",
    blurb:
      "Generators and air compressors to keep sites energised and productive, day and night.",
    icon: "power",
  },
];

const onRequest = "Available on request";

export const equipment: EquipmentItem[] = [
  // ---------------------------- EARTHMOVING ----------------------------
  {
    slug: "excavators",
    name: "Tracked Excavators",
    category: "earthmoving",
    summary:
      "Versatile tracked excavators for bulk digging, trenching, loading and demolition support.",
    description:
      "Our tracked excavators handle everything from bulk excavation and trenching to loading and structural demolition support. Paired with experienced operators, they deliver productive, precise digging across foundations, utilities and infrastructure works.",
    applications: [
      "Bulk excavation & cut-to-fill",
      "Trenching for utilities & drainage",
      "Loading trucks & material handling",
      "Demolition support with breakers",
    ],
    specs: [
      { label: "Class", value: "Multiple classes available" },
      { label: "Attachments", value: "Bucket / breaker (on request)" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Model & capacity", value: onRequest },
    ],
    icon: "excavator",
  },
  {
    slug: "long-boom-excavators",
    name: "Long Boom Excavators",
    category: "earthmoving",
    summary:
      "Extended-reach excavators for deep excavation, slope work and high-reach applications.",
    description:
      "Long boom (long-reach) excavators extend digging depth and reach for canal work, deep excavation, slope battering and high-reach demolition where a standard machine cannot safely operate.",
    applications: [
      "Deep excavation & dredging support",
      "Slope profiling & battering",
      "High-reach demolition",
      "Hard-to-access reach work",
    ],
    specs: [
      { label: "Type", value: "Long-reach / long boom" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Reach & capacity", value: onRequest },
    ],
    icon: "excavator",
  },
  {
    slug: "mini-excavators",
    name: "Mini Excavators",
    category: "earthmoving",
    summary:
      "Compact 3.5T and 5.5T excavators for confined-space, precision and finishing work.",
    description:
      "Compact and manoeuvrable, our mini excavators are ideal for confined sites, landscaping, precision trenching and finishing work where larger plant cannot reach.",
    applications: [
      "Confined-space excavation",
      "Landscaping & finishing",
      "Precision trenching",
      "Interior & access-restricted works",
    ],
    specs: [
      { label: "Operating weight", value: "3.5 T & 5.5 T classes" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Attachments", value: onRequest },
    ],
    icon: "excavator",
  },
  {
    slug: "wheel-excavators",
    name: "Wheel Excavators",
    category: "earthmoving",
    summary:
      "Wheeled excavators for fast repositioning across paved and urban work sites.",
    description:
      "Wheel excavators combine excavation performance with road mobility, moving quickly between work fronts on paved and urban sites without a low-bed transfer.",
    applications: [
      "Urban & roadside works",
      "Utility maintenance",
      "Multi-front site work",
      "Loading & clean-up",
    ],
    specs: [
      { label: "Type", value: "Rubber-tyred / wheeled" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Model & capacity", value: onRequest },
    ],
    icon: "excavator",
  },
  {
    slug: "wheel-loaders",
    name: "Wheel Loaders",
    category: "earthmoving",
    summary:
      "High-output wheel loaders for loading, stockpiling and material handling.",
    description:
      "Wheel loaders move and load aggregates, sand and spoil at high volume, keeping haulage cycles and material handling productive across quarries and construction sites.",
    applications: [
      "Loading trucks & hoppers",
      "Stockpiling aggregates",
      "Site clean-up & backfilling",
      "Material handling",
    ],
    specs: [
      { label: "Type", value: "Front wheel loader" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Bucket capacity", value: onRequest },
    ],
    icon: "loader",
  },
  {
    slug: "backhoe-loaders",
    name: "Backhoe Loaders",
    category: "earthmoving",
    summary:
      "All-round backhoe loaders combining a loading bucket and excavating arm in one machine.",
    description:
      "The versatile workhorse of any site — a loading bucket up front and an excavating backhoe at the rear — ideal for utilities, small excavation, loading and general-purpose tasks.",
    applications: [
      "Utility & trench works",
      "Loading & backfilling",
      "General site duties",
      "Small excavation",
    ],
    specs: [
      { label: "Type", value: "Loader + backhoe" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Model & capacity", value: onRequest },
    ],
    icon: "loader",
  },
  {
    slug: "dozers",
    name: "Bulldozers (D8 / D155)",
    category: "earthmoving",
    summary:
      "Heavy dozers including D8 and D155 classes for pushing, spreading and land clearing.",
    description:
      "High-traction bulldozers for bulk pushing, spreading, ripping and land clearing on large earthworks and infrastructure projects. Available in D8 and D155 classes.",
    applications: [
      "Bulk earth pushing & spreading",
      "Land clearing & grubbing",
      "Ripping hard ground",
      "Haul-road formation",
    ],
    specs: [
      { label: "Classes", value: "D8 & D155" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Blade & ripper", value: onRequest },
    ],
    icon: "dozer",
  },
  {
    slug: "graders",
    name: "Motor Graders (14G)",
    category: "earthmoving",
    summary:
      "Motor graders including the 14G class for fine grading and road formation.",
    description:
      "Motor graders deliver accurate levelling, cambering and fine grading for road formation, sub-base preparation and large flat surfaces. 14G class available.",
    applications: [
      "Road & haul-road grading",
      "Sub-base & camber formation",
      "Fine levelling",
      "Surface maintenance",
    ],
    specs: [
      { label: "Class", value: "14G" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Blade width", value: onRequest },
    ],
    icon: "grader",
  },
  {
    slug: "rollers",
    name: "Compaction Rollers (10T)",
    category: "earthmoving",
    summary:
      "10-tonne compaction rollers for sub-base, asphalt and embankment compaction.",
    description:
      "Vibratory compaction rollers (10 T class) achieve target density on sub-base, embankments and asphalt, delivering durable, well-compacted surfaces.",
    applications: [
      "Sub-base compaction",
      "Embankment & fill compaction",
      "Asphalt rolling",
      "Trench reinstatement",
    ],
    specs: [
      { label: "Operating weight", value: "10 T class" },
      { label: "Type", value: "Vibratory roller" },
      { label: "Operated / bare rental", value: "Both available" },
    ],
    icon: "roller",
  },
  {
    slug: "skid-steer-loaders",
    name: "Skid Steer Loaders",
    category: "earthmoving",
    summary:
      "Compact, agile skid steers with quick-change attachments for tight sites.",
    description:
      "Highly manoeuvrable skid steer loaders take a wide range of attachments for loading, sweeping, breaking and grading in confined and finishing environments.",
    applications: [
      "Confined-site loading",
      "Sweeping & clean-up",
      "Attachment-based tasks",
      "Landscaping & finishing",
    ],
    specs: [
      { label: "Type", value: "Skid steer" },
      { label: "Attachments", value: "Multiple (on request)" },
      { label: "Operated / bare rental", value: "Both available" },
    ],
    icon: "loader",
  },

  // ----------------------------- LIFTING -------------------------------
  {
    slug: "mobile-cranes",
    name: "Mobile Cranes (50T · 65T · 100T)",
    category: "lifting",
    summary:
      "50, 65 and 100-tonne mobile cranes with certified operators for safe lifting.",
    description:
      "Our mobile crane fleet covers 50 T, 65 T and 100 T capacities for structural lifts, equipment placement and precast handling. Supplied with trained operators and a focus on lift planning and safety.",
    applications: [
      "Structural & steel lifts",
      "Precast & panel placement",
      "Equipment & plant positioning",
      "General site lifting",
    ],
    specs: [
      { label: "Capacities", value: "50 T · 65 T · 100 T" },
      { label: "Supply", value: "Operated with certified crew" },
      { label: "Lift study", value: "Provided on request" },
    ],
    icon: "crane",
  },
  {
    slug: "truck-mounted-cranes",
    name: "Truck-Mounted Cranes (5T · 7T · 10T)",
    category: "lifting",
    summary:
      "Trucks with cranes (5T, 7T, 10T) combining transport and self-loading lift.",
    description:
      "Truck-mounted cranes combine haulage and lifting in one unit (5 T, 7 T and 10 T), ideal for self-loading deliveries, pipe handling and medium lifts where a full mobile crane is not required.",
    applications: [
      "Self-loading deliveries",
      "Pipe & material handling",
      "Medium lifts",
      "Site logistics",
    ],
    specs: [
      { label: "Crane capacities", value: "5 T · 7 T · 10 T" },
      { label: "Supply", value: "Operated" },
      { label: "Bed length", value: onRequest },
    ],
    icon: "crane",
  },
  {
    slug: "telehandlers",
    name: "Telehandlers",
    category: "lifting",
    summary:
      "Telescopic handlers for lifting and placing loads at height and reach.",
    description:
      "Telehandlers combine forklift and crane capability with extended reach, placing loads at height across construction, steel and finishing works.",
    applications: [
      "Placing loads at height",
      "Material distribution",
      "Steel & cladding support",
      "General site handling",
    ],
    specs: [
      { label: "Type", value: "Telescopic handler" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Lift height & capacity", value: onRequest },
    ],
    icon: "telehandler",
  },
  {
    slug: "forklifts",
    name: "Forklifts (5T & 10T)",
    category: "lifting",
    summary:
      "5-tonne and 10-tonne forklifts for yard, warehouse and site material handling.",
    description:
      "Diesel forklifts in 5 T and 10 T capacities handle palletised and heavy loads across yards, laydown areas and warehouses.",
    applications: [
      "Yard & laydown handling",
      "Container loading/unloading",
      "Warehouse operations",
      "Heavy palletised loads",
    ],
    specs: [
      { label: "Capacities", value: "5 T & 10 T" },
      { label: "Fuel", value: "Diesel" },
      { label: "Operated / bare rental", value: "Both available" },
    ],
    icon: "forklift",
  },

  // -------------------------- TRANSPORTATION ---------------------------
  {
    slug: "low-bed-trailers",
    name: "Low-Bed Trailers",
    category: "transportation",
    summary:
      "Low-bed trailers for transporting tracked plant and oversized loads.",
    description:
      "Low-bed (lowboy) trailers move heavy tracked machinery and oversized loads safely and legally across Qatar, with experienced transport crews handling loading and securing.",
    applications: [
      "Plant & machinery transfer",
      "Oversized load transport",
      "Inter-site mobilisation",
      "Project logistics",
    ],
    specs: [
      { label: "Type", value: "Low-bed / lowboy" },
      { label: "Supply", value: "With prime mover & crew" },
      { label: "Deck capacity", value: onRequest },
    ],
    icon: "trailer",
  },
  {
    slug: "flatbed-trailers",
    name: "Flatbed Trailers (40ft)",
    category: "transportation",
    summary:
      "40ft flatbed trailers for general heavy haulage and material transport.",
    description:
      "40ft flatbed trailers handle general heavy haulage — steel, pipes, precast and containers — with reliable scheduling and trained drivers.",
    applications: [
      "General heavy haulage",
      "Steel, pipe & precast transport",
      "Container movement",
      "Material delivery",
    ],
    specs: [
      { label: "Deck length", value: "40 ft" },
      { label: "Supply", value: "With prime mover & crew" },
      { label: "Payload", value: onRequest },
    ],
    icon: "trailer",
  },
  {
    slug: "dump-trucks",
    name: "Dump Trucks",
    category: "transportation",
    summary:
      "Tipper/dump trucks for hauling aggregates, sand, spoil and demolition waste.",
    description:
      "Our dump (tipper) trucks move aggregates, sand, excavated spoil and demolition waste efficiently between load points, disposal sites and stockpiles.",
    applications: [
      "Aggregate & sand haulage",
      "Spoil & muck-away",
      "Demolition waste removal",
      "Bulk material transport",
    ],
    specs: [
      { label: "Type", value: "Tipper / dump truck" },
      { label: "Supply", value: "With driver" },
      { label: "Capacity", value: onRequest },
    ],
    icon: "truck",
  },

  // ------------------------------ POWER --------------------------------
  {
    slug: "generators",
    name: "Diesel Generators",
    category: "power",
    summary:
      "Diesel generators for temporary and standby power on site.",
    description:
      "Reliable diesel generators supply temporary and standby power for site offices, plant and equipment, keeping work productive where grid power is unavailable.",
    applications: [
      "Temporary site power",
      "Standby / backup power",
      "Powering plant & tools",
      "Events & remote sites",
    ],
    specs: [
      { label: "Type", value: "Diesel genset" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "kVA rating", value: onRequest },
    ],
    icon: "power",
  },
  {
    slug: "air-compressors",
    name: "Air Compressors",
    category: "power",
    summary:
      "Portable air compressors for breakers, tools and pneumatic equipment.",
    description:
      "Portable diesel air compressors drive breakers, pneumatic tools and site equipment, delivering steady airflow for demolition and construction tasks.",
    applications: [
      "Powering breakers & tools",
      "Pneumatic equipment",
      "Demolition support",
      "General site air supply",
    ],
    specs: [
      { label: "Type", value: "Portable diesel compressor" },
      { label: "Operated / bare rental", value: "Both available" },
      { label: "Airflow (cfm)", value: onRequest },
    ],
    icon: "power",
  },
];

/** Lookup helpers. */
export function getEquipmentBySlug(slug: string): EquipmentItem | undefined {
  return equipment.find((e) => e.slug === slug);
}

export function getEquipmentByCategory(
  category: EquipmentCategory,
): EquipmentItem[] {
  return equipment.filter((e) => e.category === category);
}

export function getCategoryMeta(key: EquipmentCategory): CategoryMeta {
  return equipmentCategories.find((c) => c.key === key)!;
}
