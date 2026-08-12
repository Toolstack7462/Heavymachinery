/**
 * ============================================================================
 *  FLEET / EQUIPMENT CATALOGUE — central data source
 * ============================================================================
 *  Drives the /fleet index and every /fleet/[slug] page.
 *
 *  CATEGORIES AND ITEMS come from the client's company profile: heavy lifting,
 *  light lifting (material handling & access), construction & earthmoving,
 *  transportation, and power & supporting equipment.
 *
 *  HONESTY RULE — the ONLY capacity figures published anywhere on this site are
 *  the three ranges the profile states:
 *      certified mobile cranes  20 T – 1200 T
 *      rough terrain cranes     25 T – 120 T
 *      crawler cranes           55 T – 3200 T
 *  No other tonnage, model number, lift height, payload, kVA rating or unit
 *  count exists in the source, so every other specification reads
 *  "Available on request". Do not invent them.
 * ============================================================================
 */

import type { L, LL } from "@/i18n/localized";

export type EquipmentCategory =
  | "heavy-lifting"
  | "material-handling"
  | "earthmoving"
  | "transportation"
  | "power";

export interface EquipmentSpec {
  label: L;
  value: L;
}

export interface EquipmentItem {
  slug: string;
  name: L;
  category: EquipmentCategory;
  /** One-line summary for cards. */
  summary: L;
  /** Longer description for the detail page. */
  description: L;
  /** Typical jobs this equipment handles — capability, not project claims. */
  applications: LL;
  specs: EquipmentSpec[];
  icon: string;
}

export interface CategoryMeta {
  key: EquipmentCategory;
  title: L;
  blurb: L;
  icon: string;
}

export const equipmentCategories: CategoryMeta[] = [
  {
    key: "heavy-lifting",
    title: { en: "Heavy Lifting", ar: "الرفع الثقيل" },
    blurb: {
      en: "Certified mobile, rough terrain and crawler cranes from 20 tonnes to 3200 tonnes.",
      ar: "رافعات متحركة معتمدة ورافعات للطرق الوعرة ورافعات زاحفة من 20 طناً إلى 3200 طن.",
    },
    icon: "crane",
  },
  {
    key: "material-handling",
    title: {
      en: "Material Handling & Access",
      ar: "مناولة المواد والوصول الآمن",
    },
    blurb: {
      en: "Scissor and man lifts, forklifts and telehandlers for safe access and everyday handling.",
      ar: "مقصّات ورافعات أفراد ورافعات شوكية ورافعات تلسكوبية للوصول الآمن والمناولة اليومية.",
    },
    icon: "telehandler",
  },
  {
    key: "earthmoving",
    title: { en: "Construction & Earthmoving", ar: "الإنشاء وأعمال الحفر" },
    blurb: {
      en: "Excavators, bulldozers, graders, loaders and rollers for civil and infrastructure works.",
      ar: "حفّارات وجرّافات وممهّدات ولوادر ومداحل للأعمال المدنية والبنية التحتية.",
    },
    icon: "excavator",
  },
  {
    key: "transportation",
    title: { en: "Transportation", ar: "النقل" },
    blurb: {
      en: "Lowbed and flatbed trailers, boom and dump trucks, tankers and support vehicles.",
      ar: "مقاطر منخفضة ومسطّحة، وشاحنات برافعة وقلّابات، وصهاريج ومركبات دعم.",
    },
    icon: "trailer",
  },
  {
    key: "power",
    title: { en: "Power & Support", ar: "الطاقة والمساندة" },
    blurb: {
      en: "Compressors, generators, welding machines and tower lights for continuous site operation.",
      ar: "ضواغط ومولّدات وماكينات لحام وأبراج إضاءة لاستمرار العمل في الموقع.",
    },
    icon: "power",
  },
];

/* ------------------------------------------------------------------ */
/* Shared specification vocabulary — translated once, reused          */
/* ------------------------------------------------------------------ */

const SPEC = {
  capacityRange: { en: "Capacity range", ar: "نطاق الحمولة" },
  type: { en: "Type", ar: "النوع" },
  supply: { en: "Supply", ar: "طريقة التوريد" },
  coverage: { en: "Coverage", ar: "التغطية" },
  modelSpec: {
    en: "Model & exact specification",
    ar: "الطراز والمواصفات الدقيقة",
  },
  onRequest: { en: "Available on request", ar: "متاح عند الطلب" },
  withOperator: {
    en: "Qualified operator on request",
    ar: "مشغّل مؤهّل عند الطلب",
  },
  withDriver: { en: "Qualified driver on request", ar: "سائق مؤهّل عند الطلب" },
  kingdomWide: {
    en: "Kingdom-wide, Saudi Arabia",
    ar: "على مستوى المملكة العربية السعودية",
  },
} as const;

/** Standard three-row spec table for operated equipment. */
const operatedSpecs = (type: L): EquipmentSpec[] => [
  { label: SPEC.type, value: type },
  { label: SPEC.supply, value: SPEC.withOperator },
  { label: SPEC.modelSpec, value: SPEC.onRequest },
];

/** Standard spec table for transportation units. */
const transportSpecs = (type: L): EquipmentSpec[] => [
  { label: SPEC.type, value: type },
  { label: SPEC.supply, value: SPEC.withDriver },
  { label: SPEC.coverage, value: SPEC.kingdomWide },
];

/** Spec table for cranes, where the profile does state a capacity range. */
const craneSpecs = (range: L): EquipmentSpec[] => [
  { label: SPEC.capacityRange, value: range },
  { label: SPEC.supply, value: SPEC.withOperator },
  { label: SPEC.modelSpec, value: SPEC.onRequest },
];

export const equipment: EquipmentItem[] = [
  /* ------------------------- HEAVY LIFTING ------------------------- */
  {
    slug: "mobile-cranes",
    name: { en: "Certified Mobile Cranes", ar: "رافعات متحركة معتمدة" },
    category: "heavy-lifting",
    summary: {
      en: "Certified mobile cranes with capacities from 20 tonnes to 1200 tonnes.",
      ar: "رافعات متحركة معتمدة بحمولات من 20 طناً إلى 1200 طن.",
    },
    description: {
      en: "Capacities ranging from 20 tonnes to 1200 tonnes for construction, industrial and infrastructure projects. Supplied certified, and with a qualified operator when the lift calls for one.",
      ar: "حمولات تمتد من 20 طناً إلى 1200 طن لمشاريع الإنشاء والصناعة والبنية التحتية. تُوفَّر معتمدة، ومع مشغّل مؤهّل عندما تتطلّب عملية الرفع ذلك.",
    },
    applications: {
      en: [
        "Structural and steel lifting",
        "Equipment and plant positioning",
        "Infrastructure and industrial project lifts",
      ],
      ar: [
        "رفع الهياكل والحديد الإنشائي",
        "تركيب وتمركز المعدات والمنشآت",
        "أعمال الرفع في مشاريع البنية التحتية والصناعة",
      ],
    },
    specs: craneSpecs({ en: "20 T – 1200 T", ar: "20 – 1200 طن" }),
    icon: "crane",
  },
  {
    slug: "rough-terrain-cranes",
    name: { en: "Rough Terrain Cranes", ar: "رافعات الطرق الوعرة" },
    category: "heavy-lifting",
    summary: {
      en: "25 to 120 tonne cranes built for off-road and uneven ground.",
      ar: "رافعات من 25 إلى 120 طناً مصمّمة للأراضي الوعرة وغير المستوية.",
    },
    description: {
      en: "Capacities from 25 tonnes to 120 tonnes, ideal for off-road and uneven terrain on construction and industrial sites where a road-going crane cannot work safely.",
      ar: "حمولات من 25 طناً إلى 120 طناً، مثالية للأراضي الوعرة وغير المستوية في مواقع الإنشاء والمواقع الصناعية التي لا تستطيع الرافعات المخصّصة للطرق العمل فيها بأمان.",
    },
    applications: {
      en: [
        "Off-road and uneven terrain lifting",
        "Confined industrial site work",
        "Pipeline and field operations support",
      ],
      ar: [
        "الرفع في الأراضي الوعرة وغير المستوية",
        "العمل في المواقع الصناعية الضيّقة",
        "دعم عمليات خطوط الأنابيب والعمل الحقلي",
      ],
    },
    specs: craneSpecs({ en: "25 T – 120 T", ar: "25 – 120 طناً" }),
    icon: "crane",
  },
  {
    slug: "crawler-cranes",
    name: { en: "Crawler Cranes", ar: "رافعات زاحفة (كراولر)" },
    category: "heavy-lifting",
    summary: {
      en: "Heavy-duty crawler cranes from 55 tonnes to 3200 tonnes.",
      ar: "رافعات زاحفة للأحمال الثقيلة من 55 طناً إلى 3200 طن.",
    },
    description: {
      en: "Heavy-duty crawler cranes from 55 tonnes to 3200 tonnes for petrochemical, oil & gas and mega projects, where sustained heavy lifting on tracks is required.",
      ar: "رافعات زاحفة للأحمال الثقيلة من 55 طناً إلى 3200 طن لمشاريع البتروكيماويات والنفط والغاز والمشاريع الكبرى، حيث يلزم رفع ثقيل مستمر على مجنزرات.",
    },
    applications: {
      en: [
        "Petrochemical plant construction",
        "Oil & gas module and vessel lifts",
        "Mega-project heavy lifting",
      ],
      ar: [
        "إنشاء مصانع البتروكيماويات",
        "رفع الوحدات والأوعية في مشاريع النفط والغاز",
        "الرفع الثقيل في المشاريع الكبرى",
      ],
    },
    specs: craneSpecs({ en: "55 T – 3200 T", ar: "55 – 3200 طن" }),
    icon: "crawlerCrane",
  },

  /* --------------------- MATERIAL HANDLING ------------------------- */
  {
    slug: "scissor-and-man-lifts",
    name: { en: "Scissor & Man Lifts", ar: "مقصّات ورافعات أفراد" },
    category: "material-handling",
    summary: {
      en: "Safe elevated access for maintenance and industrial facility work.",
      ar: "وصول آمن إلى المرتفعات لأعمال الصيانة وتشغيل المرافق الصناعية.",
    },
    description: {
      en: "Scissor lifts and man lifts providing safe elevated access for maintenance, construction and industrial facility operations, indoors and out.",
      ar: "مقصّات ورافعات أفراد توفّر وصولاً آمناً إلى المرتفعات لأعمال الصيانة والإنشاء وتشغيل المرافق الصناعية، داخل المباني وخارجها.",
    },
    applications: {
      en: [
        "Plant and facility maintenance access",
        "Installation and finishing at height",
        "Inspection in industrial facilities",
      ],
      ar: [
        "الوصول لأعمال صيانة المصانع والمرافق",
        "التركيب والتشطيب على ارتفاع",
        "أعمال الفحص في المرافق الصناعية",
      ],
    },
    specs: operatedSpecs({
      en: "Scissor lift / man lift",
      ar: "مقص رفع / رافعة أفراد",
    }),
    icon: "scissorLift",
  },
  {
    slug: "forklifts",
    name: { en: "Forklifts", ar: "رافعات شوكية" },
    category: "material-handling",
    summary: {
      en: "Reliable forklifts for warehouse, yard and project material handling.",
      ar: "رافعات شوكية موثوقة لمناولة المواد في المستودعات والساحات والمشاريع.",
    },
    description: {
      en: "Reliable forklifts for warehouse, site and project material handling across industrial and construction environments.",
      ar: "رافعات شوكية موثوقة لمناولة المواد في المستودعات والمواقع والمشاريع في البيئات الصناعية والإنشائية.",
    },
    applications: {
      en: [
        "Warehouse and store operations",
        "Yard and laydown area handling",
        "Loading and unloading project materials",
      ],
      ar: [
        "عمليات المستودعات والمخازن",
        "المناولة في الساحات ومناطق تجميع المواد",
        "تحميل وتنزيل مواد المشروع",
      ],
    },
    specs: operatedSpecs({ en: "Forklift", ar: "رافعة شوكية" }),
    icon: "forklift",
  },
  {
    slug: "telehandlers",
    name: { en: "Telehandlers", ar: "رافعات تلسكوبية" },
    category: "material-handling",
    summary: {
      en: "Versatile lifting and placing of materials at height and reach.",
      ar: "رفع ووضع المواد على ارتفاع وبمدى واسع.",
    },
    description: {
      en: "Versatile telehandlers for lifting and placing materials at height across construction sites and project operations.",
      ar: "رافعات تلسكوبية متعدّدة الاستخدام لرفع ووضع المواد على ارتفاع في مواقع الإنشاء وعمليات المشاريع.",
    },
    applications: {
      en: [
        "Placing materials at height",
        "Distributing loads across a site",
        "Cladding and steelwork support",
      ],
      ar: [
        "وضع المواد على ارتفاع",
        "توزيع الأحمال في أنحاء الموقع",
        "دعم أعمال التكسية والحديد الإنشائي",
      ],
    },
    specs: operatedSpecs({ en: "Telescopic handler", ar: "رافعة تلسكوبية" }),
    icon: "telehandler",
  },

  /* ------------------------- EARTHMOVING --------------------------- */
  {
    slug: "excavators",
    name: { en: "Excavators", ar: "حفّارات" },
    category: "earthmoving",
    summary: {
      en: "Full-size excavators for excavation, trenching and earthmoving.",
      ar: "حفّارات كاملة الحجم لأعمال الحفر وشقّ الخنادق والأعمال الترابية.",
    },
    description: {
      en: "Full-size excavators for excavation, trenching and earthmoving on construction and civil works sites, working productively through bulk digging and loading cycles.",
      ar: "حفّارات كاملة الحجم لأعمال الحفر وشقّ الخنادق والأعمال الترابية في مواقع الإنشاء والأعمال المدنية، بأداء منتج في دورات الحفر الكبير والتحميل.",
    },
    applications: {
      en: [
        "Bulk excavation and cut-to-fill",
        "Trenching for utilities and drainage",
        "Loading trucks and material handling",
      ],
      ar: [
        "الحفر الكبير وأعمال القطع والردم",
        "شقّ الخنادق للخدمات والصرف",
        "تحميل الشاحنات ومناولة المواد",
      ],
    },
    specs: operatedSpecs({ en: "Tracked excavator", ar: "حفّارة مجنزرة" }),
    icon: "excavator",
  },
  {
    slug: "mini-excavators",
    name: { en: "Mini Excavators", ar: "حفّارات صغيرة" },
    category: "earthmoving",
    summary: {
      en: "Compact excavators for confined-space and precision work.",
      ar: "حفّارات صغيرة للأماكن الضيّقة والأعمال الدقيقة.",
    },
    description: {
      en: "Compact and manoeuvrable mini excavators for confined sites, precision trenching and finishing work where larger plant cannot reach.",
      ar: "حفّارات صغيرة سهلة الحركة للمواقع الضيّقة وشقّ الخنادق الدقيق وأعمال التشطيب حيث لا تستطيع المعدات الأكبر الوصول.",
    },
    applications: {
      en: [
        "Confined-space excavation",
        "Precision trenching",
        "Access-restricted works",
      ],
      ar: [
        "الحفر في الأماكن الضيّقة",
        "شقّ الخنادق الدقيق",
        "الأعمال محدودة الوصول",
      ],
    },
    specs: operatedSpecs({ en: "Mini excavator", ar: "حفّارة صغيرة" }),
    icon: "excavator",
  },
  {
    slug: "bulldozers",
    name: { en: "Bulldozers", ar: "جرّافات (بلدوزر)" },
    category: "earthmoving",
    summary: {
      en: "Heavy bulldozers for site clearing and bulk pushing.",
      ar: "جرّافات ثقيلة لإزالة عوائق المواقع ودفع الأتربة بكميات كبيرة.",
    },
    description: {
      en: "Heavy bulldozers for site clearing and bulk earth pushing across civil and infrastructure projects, forming platforms and haul roads as work progresses.",
      ar: "جرّافات ثقيلة لإزالة عوائق المواقع ودفع الأتربة بكميات كبيرة في المشاريع المدنية والبنية التحتية، مع تشكيل المنصات وطرق النقل مع تقدّم العمل.",
    },
    applications: {
      en: [
        "Site clearing and grubbing",
        "Bulk earth pushing and spreading",
        "Haul-road and platform formation",
      ],
      ar: [
        "إزالة عوائق المواقع وتنظيفها",
        "دفع الأتربة وتوزيعها بكميات كبيرة",
        "تشكيل طرق النقل والمنصات",
      ],
    },
    specs: operatedSpecs({ en: "Tracked bulldozer", ar: "جرّافة مجنزرة" }),
    icon: "dozer",
  },
  {
    slug: "motor-graders",
    name: { en: "Motor Graders", ar: "ممهّدات (جريدر)" },
    category: "earthmoving",
    summary: {
      en: "Motor graders for accurate grading and road construction.",
      ar: "ممهّدات لأعمال التمهيد الدقيق وإنشاء الطرق.",
    },
    description: {
      en: "Motor graders for grading and road construction across civil and infrastructure projects, delivering accurate levels, cambers and finished surfaces.",
      ar: "ممهّدات لأعمال التمهيد وإنشاء الطرق في المشاريع المدنية والبنية التحتية، بمناسيب دقيقة وميول وأسطح نهائية مستوية.",
    },
    applications: {
      en: [
        "Road and haul-road grading",
        "Sub-base and camber formation",
        "Fine levelling and surface finishing",
      ],
      ar: [
        "تمهيد الطرق وطرق النقل",
        "تشكيل طبقة الأساس والميول",
        "التسوية الدقيقة وتشطيب الأسطح",
      ],
    },
    specs: operatedSpecs({ en: "Motor grader", ar: "ممهّدة" }),
    icon: "grader",
  },
  {
    slug: "wheel-loaders",
    name: { en: "Wheel Loaders", ar: "لوادر بعجل" },
    category: "earthmoving",
    summary: {
      en: "Wheel loaders for loading, material handling and site preparation.",
      ar: "لوادر بعجل للتحميل ومناولة المواد وتهيئة المواقع.",
    },
    description: {
      en: "Wheel loaders for material handling, loading and site preparation on industrial and construction projects, keeping haulage cycles fed and stockpiles managed.",
      ar: "لوادر بعجل لمناولة المواد والتحميل وتهيئة المواقع في المشاريع الصناعية والإنشائية، بما يُبقي دورات النقل مغذّاة والمخزون منظّماً.",
    },
    applications: {
      en: [
        "Loading trucks and hoppers",
        "Stockpiling aggregates",
        "Backfilling and site clean-up",
      ],
      ar: [
        "تحميل الشاحنات والقوادس",
        "تجميع الركام في مخزون",
        "الردم وتنظيف الموقع",
      ],
    },
    specs: operatedSpecs({ en: "Wheel loader", ar: "لودر بعجل" }),
    icon: "loader",
  },
  {
    slug: "skid-steer-loaders",
    name: { en: "Skid Steer Loaders", ar: "لوادر انزلاقية" },
    category: "earthmoving",
    summary: {
      en: "Compact skid loaders for tight sites and finishing work.",
      ar: "لوادر انزلاقية صغيرة للمواقع الضيّقة وأعمال التشطيب.",
    },
    description: {
      en: "Skid loaders for material handling, loading and site preparation where space is tight and manoeuvrability matters more than bucket size.",
      ar: "لوادر انزلاقية لمناولة المواد والتحميل وتهيئة المواقع حيث تكون المساحة ضيّقة وتكون خفّة الحركة أهم من حجم القادوس.",
    },
    applications: {
      en: [
        "Confined-site loading",
        "Clean-up and finishing work",
        "Attachment-based site tasks",
      ],
      ar: [
        "التحميل في المواقع الضيّقة",
        "أعمال التنظيف والتشطيب",
        "المهام التي تعتمد على الملحقات",
      ],
    },
    specs: operatedSpecs({ en: "Skid steer loader", ar: "لودر انزلاقي" }),
    icon: "loader",
  },
  {
    slug: "backhoe-loaders",
    name: { en: "Backhoe Loaders", ar: "لوادر حفّارة (باكهو)" },
    category: "earthmoving",
    summary: {
      en: "Versatile backhoe loaders for digging and loading in one machine.",
      ar: "لوادر حفّارة متعدّدة الاستخدام تجمع الحفر والتحميل في آلة واحدة.",
    },
    description: {
      en: "Backhoe loaders for versatile digging and loading tasks across site preparation and civil works: a loading bucket at the front and an excavating arm at the rear.",
      ar: "لوادر حفّارة لأعمال الحفر والتحميل المتنوّعة في تهيئة المواقع والأعمال المدنية: قادوس تحميل في المقدّمة وذراع حفر في الخلف.",
    },
    applications: {
      en: [
        "Utility and trench works",
        "Loading and backfilling",
        "General site duties",
      ],
      ar: [
        "أعمال الخدمات والخنادق",
        "التحميل والردم",
        "المهام العامة في الموقع",
      ],
    },
    specs: operatedSpecs({ en: "Backhoe loader", ar: "لودر حفّار" }),
    icon: "loader",
  },
  {
    slug: "rollers",
    name: { en: "Road Rollers", ar: "مداحل طرق" },
    category: "earthmoving",
    summary: {
      en: "Road rollers for compaction across site prep and civil works.",
      ar: "مداحل طرق لأعمال الدمك في تهيئة المواقع والأعمال المدنية.",
    },
    description: {
      en: "Road rollers for compaction tasks across site preparation and civil works, achieving target density on sub-base, fill and finished surfaces.",
      ar: "مداحل طرق لأعمال الدمك في تهيئة المواقع والأعمال المدنية، للوصول إلى الكثافة المطلوبة في طبقة الأساس والردم والأسطح النهائية.",
    },
    applications: {
      en: [
        "Sub-base and fill compaction",
        "Embankment compaction",
        "Trench reinstatement",
      ],
      ar: [
        "دمك طبقة الأساس والردم",
        "دمك الجسور الترابية",
        "إعادة تأهيل الخنادق",
      ],
    },
    specs: operatedSpecs({ en: "Road roller", ar: "مدحلة طرق" }),
    icon: "roller",
  },

  /* ------------------------ TRANSPORTATION ------------------------- */
  {
    slug: "lowbed-trailers",
    name: { en: "Lowbed Trailers", ar: "مقاطر منخفضة (لوبد)" },
    category: "transportation",
    summary: {
      en: "Lowbed trailers for moving heavy machinery.",
      ar: "مقاطر منخفضة لنقل المعدات الثقيلة.",
    },
    description: {
      en: "Lowbed trailers for transporting heavy machinery between sites, with qualified drivers and coverage across the Kingdom of Saudi Arabia.",
      ar: "مقاطر منخفضة لنقل المعدات الثقيلة بين المواقع، مع سائقين مؤهّلين وتغطية في مختلف مناطق المملكة العربية السعودية.",
    },
    applications: {
      en: [
        "Moving tracked and oversized plant",
        "Inter-site mobilisation",
        "Project equipment logistics",
      ],
      ar: [
        "نقل المعدات المجنزرة وذات الأبعاد الكبيرة",
        "الانتقال بين المواقع",
        "الخدمات اللوجستية لمعدات المشروع",
      ],
    },
    specs: transportSpecs({ en: "Lowbed trailer", ar: "مقطورة منخفضة" }),
    icon: "trailer",
  },
  {
    slug: "flatbed-trailers",
    name: { en: "Flatbed Trailers", ar: "مقاطر مسطّحة (فلاتبد)" },
    category: "transportation",
    summary: {
      en: "Flatbed trailers for project cargo.",
      ar: "مقاطر مسطّحة لشحنات المشاريع.",
    },
    description: {
      en: "Flatbed trailers for steel, pipe, precast and containerised project cargo, with qualified drivers and Kingdom-wide coverage.",
      ar: "مقاطر مسطّحة لنقل الحديد والأنابيب والعناصر مسبقة الصب والحمولات في حاويات، مع سائقين مؤهّلين وتغطية على مستوى المملكة.",
    },
    applications: {
      en: [
        "Steel, pipe and precast transport",
        "Containerised cargo movement",
        "General project haulage",
      ],
      ar: [
        "نقل الحديد والأنابيب والعناصر مسبقة الصب",
        "نقل الحمولات في حاويات",
        "النقل العام لشحنات المشاريع",
      ],
    },
    specs: transportSpecs({ en: "Flatbed trailer", ar: "مقطورة مسطّحة" }),
    icon: "trailer",
  },
  {
    slug: "boom-trucks",
    name: { en: "Boom Trucks", ar: "شاحنات برافعة (بوم ترك)" },
    category: "transportation",
    summary: {
      en: "Boom trucks combining transport with self-loading lift.",
      ar: "شاحنات برافعة تجمع النقل مع الرفع والتحميل الذاتي.",
    },
    description: {
      en: "Boom trucks for versatile site operations, combining transport with a self-loading lift for deliveries that would otherwise need a separate crane.",
      ar: "شاحنات برافعة للعمليات المتنوّعة في الموقع، تجمع النقل مع رافعة للتحميل الذاتي في التوريدات التي تحتاج عادةً إلى رافعة منفصلة.",
    },
    applications: {
      en: [
        "Self-loading site deliveries",
        "Pipe and material handling",
        "Medium lifts on site",
      ],
      ar: [
        "التوريد مع التحميل الذاتي في الموقع",
        "مناولة الأنابيب والمواد",
        "أعمال الرفع المتوسّطة في الموقع",
      ],
    },
    specs: transportSpecs({
      en: "Truck-mounted boom",
      ar: "رافعة مثبّتة على شاحنة",
    }),
    icon: "crane",
  },
  {
    slug: "dump-trucks",
    name: { en: "Dump Trucks", ar: "قلّابات" },
    category: "transportation",
    summary: {
      en: "Dump trucks for versatile site haulage.",
      ar: "قلّابات لأعمال النقل المتنوّعة في الموقع.",
    },
    description: {
      en: "Dump trucks for versatile site operations, hauling aggregates, sand and excavated material between load points, stockpiles and disposal areas.",
      ar: "قلّابات للعمليات المتنوّعة في الموقع، لنقل الركام والرمل والمواد المحفورة بين نقاط التحميل والمخزون ومناطق التخلّص.",
    },
    applications: {
      en: [
        "Aggregate and sand haulage",
        "Excavated material removal",
        "Bulk material transport on site",
      ],
      ar: [
        "نقل الركام والرمل",
        "إزالة المواد المحفورة",
        "نقل المواد السائبة داخل الموقع",
      ],
    },
    specs: transportSpecs({ en: "Tipper / dump truck", ar: "شاحنة قلّابة" }),
    icon: "truck",
  },
  {
    slug: "water-tankers",
    name: { en: "Water Tankers", ar: "صهاريج مياه" },
    category: "transportation",
    summary: {
      en: "Water tankers for site supply and dust suppression.",
      ar: "صهاريج مياه لتزويد المواقع وتخفيف الغبار.",
    },
    description: {
      en: "Water tankers supplying construction and industrial sites, with qualified drivers and coverage across the Kingdom of Saudi Arabia.",
      ar: "صهاريج مياه لتزويد مواقع الإنشاء والمواقع الصناعية، مع سائقين مؤهّلين وتغطية في مختلف مناطق المملكة العربية السعودية.",
    },
    applications: {
      en: [
        "Site water supply",
        "Dust suppression on haul roads",
        "Compaction and earthworks support",
      ],
      ar: [
        "تزويد الموقع بالمياه",
        "تخفيف الغبار على طرق النقل",
        "دعم أعمال الدمك والأعمال الترابية",
      ],
    },
    specs: transportSpecs({ en: "Water tanker", ar: "صهريج مياه" }),
    icon: "tanker",
  },
  {
    slug: "fuel-tankers",
    name: { en: "Fuel Tankers", ar: "صهاريج وقود" },
    category: "transportation",
    summary: {
      en: "Fuel tankers keeping plant and generators supplied.",
      ar: "صهاريج وقود تُبقي المعدات والمولّدات مزوَّدة.",
    },
    description: {
      en: "Fuel tankers keeping plant, generators and site equipment supplied, operated by qualified drivers with Kingdom-wide coverage.",
      ar: "صهاريج وقود تُبقي المعدات والمولّدات وأجهزة الموقع مزوَّدة، يشغّلها سائقون مؤهّلون مع تغطية على مستوى المملكة.",
    },
    applications: {
      en: [
        "Refuelling plant and equipment",
        "Generator fuel supply",
        "Remote site fuel logistics",
      ],
      ar: [
        "تزويد المعدات والآليات بالوقود",
        "تغذية المولّدات بالوقود",
        "الخدمات اللوجستية للوقود في المواقع النائية",
      ],
    },
    specs: transportSpecs({ en: "Fuel tanker", ar: "صهريج وقود" }),
    icon: "tanker",
  },
  {
    slug: "vacuum-tankers",
    name: { en: "Vacuum Tankers", ar: "صهاريج شفط" },
    category: "transportation",
    summary: {
      en: "Vacuum tankers for site drainage and liquid waste removal.",
      ar: "صهاريج شفط لتصريف المواقع وإزالة النفايات السائلة.",
    },
    description: {
      en: "Vacuum tankers for removing liquids and slurry from construction and industrial sites, with qualified drivers and Kingdom-wide coverage.",
      ar: "صهاريج شفط لإزالة السوائل والحمأة من مواقع الإنشاء والمواقع الصناعية، مع سائقين مؤهّلين وتغطية على مستوى المملكة.",
    },
    applications: {
      en: [
        "Excavation dewatering support",
        "Liquid waste removal",
        "Industrial facility clean-up",
      ],
      ar: [
        "دعم نزح المياه من الحفريات",
        "إزالة النفايات السائلة",
        "تنظيف المرافق الصناعية",
      ],
    },
    specs: transportSpecs({ en: "Vacuum tanker", ar: "صهريج شفط" }),
    icon: "tanker",
  },
  {
    slug: "pickup-support-vehicles",
    name: { en: "Pickup Support Vehicles", ar: "مركبات دعم (بيك أب)" },
    category: "transportation",
    summary: {
      en: "Pickup support vehicles for crews, tools and light loads.",
      ar: "مركبات دعم لنقل الطواقم والعدد والأحمال الخفيفة.",
    },
    description: {
      en: "Pickup support vehicles moving crews, tools and light loads around and between sites, keeping maintenance and supervision mobile.",
      ar: "مركبات دعم لنقل الطواقم والعدد والأحمال الخفيفة داخل المواقع وبينها، بما يُبقي أعمال الصيانة والإشراف متحرّكة.",
    },
    applications: {
      en: [
        "Crew and supervision transport",
        "Tool and spares delivery",
        "Light load movement between sites",
      ],
      ar: [
        "نقل الطواقم والمشرفين",
        "توصيل العدد وقطع الغيار",
        "نقل الأحمال الخفيفة بين المواقع",
      ],
    },
    specs: transportSpecs({ en: "Pickup support vehicle", ar: "مركبة دعم" }),
    icon: "truck",
  },

  /* --------------------------- POWER ------------------------------ */
  {
    slug: "air-compressors",
    name: { en: "Air Compressors", ar: "ضواغط هواء" },
    category: "power",
    summary: {
      en: "High-capacity air compressors for pneumatic tools and blasting.",
      ar: "ضواغط هواء عالية السعة للعدد الهوائية وأعمال التجليخ.",
    },
    description: {
      en: "High-capacity air compressors for pneumatic tools, blasting and site operations across all project types, delivering steady airflow through the shift.",
      ar: "ضواغط هواء عالية السعة للعدد الهوائية وأعمال التجليخ وعمليات الموقع في جميع أنواع المشاريع، بتدفّق هواء ثابت خلال الوردية.",
    },
    applications: {
      en: [
        "Driving pneumatic tools and breakers",
        "Blasting and surface preparation",
        "General site air supply",
      ],
      ar: [
        "تشغيل العدد الهوائية والمطارق",
        "التجليخ وتهيئة الأسطح",
        "تغذية الموقع بالهواء المضغوط",
      ],
    },
    specs: operatedSpecs({
      en: "Portable air compressor",
      ar: "ضاغط هواء متنقّل",
    }),
    icon: "compressor",
  },
  {
    slug: "power-generators",
    name: { en: "Power Generators", ar: "مولّدات كهرباء" },
    category: "power",
    summary: {
      en: "Generators ensuring continuous electrical supply on site.",
      ar: "مولّدات تضمن تغذية كهربائية مستمرة في الموقع.",
    },
    description: {
      en: "Reliable power generators ensuring continuous electrical supply for construction and industrial sites where grid power is unavailable or unreliable.",
      ar: "مولّدات كهرباء موثوقة تضمن تغذية كهربائية مستمرة لمواقع الإنشاء والمواقع الصناعية حيث لا تتوفّر الشبكة أو لا يُعتمد عليها.",
    },
    applications: {
      en: [
        "Temporary site power",
        "Standby and backup supply",
        "Powering plant, offices and tools",
      ],
      ar: [
        "تغذية مؤقتة للموقع بالكهرباء",
        "تغذية احتياطية وطوارئ",
        "تشغيل المعدات والمكاتب والعدد",
      ],
    },
    specs: operatedSpecs({ en: "Power generator", ar: "مولّد كهرباء" }),
    icon: "generator",
  },
  {
    slug: "welding-machines",
    name: { en: "Welding Machines", ar: "ماكينات لحام" },
    category: "power",
    summary: {
      en: "Professional welding machines for fabrication and maintenance.",
      ar: "ماكينات لحام احترافية لأعمال التصنيع والصيانة.",
    },
    description: {
      en: "Professional welding machines supporting fabrication and maintenance work on construction and industrial sites.",
      ar: "ماكينات لحام احترافية تدعم أعمال التصنيع والصيانة في مواقع الإنشاء والمواقع الصناعية.",
    },
    applications: {
      en: [
        "On-site fabrication",
        "Plant and structural maintenance",
        "Pipe and steel repair work",
      ],
      ar: [
        "التصنيع في الموقع",
        "صيانة المعدات والهياكل",
        "أعمال إصلاح الأنابيب والحديد",
      ],
    },
    specs: operatedSpecs({ en: "Welding machine", ar: "ماكينة لحام" }),
    icon: "welder",
  },
  {
    slug: "tower-lights",
    name: { en: "Tower Lights", ar: "أبراج إضاءة" },
    category: "power",
    summary: {
      en: "Tower lights supporting safe night operations.",
      ar: "أبراج إضاءة تدعم العمل الليلي بأمان.",
    },
    description: {
      en: "Tower lights supporting night operations, giving crews the light levels they need to work safely after dark.",
      ar: "أبراج إضاءة تدعم العمل الليلي، وتمنح الطواقم مستويات الإضاءة اللازمة للعمل بأمان بعد الغروب.",
    },
    applications: {
      en: [
        "Night-shift construction work",
        "Maintenance shutdown lighting",
        "Yard and laydown area lighting",
      ],
      ar: [
        "أعمال الإنشاء في الورديات الليلية",
        "إضاءة أعمال الصيانة والإيقاف المجدول",
        "إضاءة الساحات ومناطق تجميع المواد",
      ],
    },
    specs: operatedSpecs({ en: "Mobile tower light", ar: "برج إضاءة متنقّل" }),
    icon: "towerLight",
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
