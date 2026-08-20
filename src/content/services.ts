/**
 * ============================================================================
 *  SERVICES — central data source
 * ============================================================================
 *  The five service groups mirror the equipment categories named in the
 *  client's company profile: heavy lifting, light lifting / material handling
 *  and access, construction & earthmoving, transportation, and site power &
 *  support.
 *
 *  SCOPE DISCIPLINE: Jowain Yanbu Est. is presented as an equipment rental and
 *  transportation provider, which is what the profile claims. Contracting
 *  execution, demolition works and earthworks-as-a-service are NOT offered
 *  here — the profile makes no such claim, so the site does not either.
 * ============================================================================
 */

import type { L, LL } from "@/i18n/localized";
import type { IconName } from "@/components/Icon";

export interface ServiceItem {
  slug: string;
  title: L;
  /** Card & hero one-liner. */
  tagline: L;
  summary: L;
  /** Detail-page body paragraphs. */
  body: LL;
  /** What the service includes. */
  features: LL;
  /** Equipment slugs cross-linked from the detail page. */
  relatedEquipment: string[];
  icon: IconName;
}

export const services: ServiceItem[] = [
  {
    slug: "heavy-lifting-equipment-rental",
    title: {
      en: "Heavy Lifting Equipment Rental",
      ar: "تأجير معدات الرفع الثقيل",
    },
    tagline: {
      en: "Certified cranes from 20 to 3200 tonnes.",
      ar: "رافعات معتمدة من 20 إلى 3200 طن.",
    },
    summary: {
      en: "Certified mobile cranes, rough terrain cranes and crawler cranes for construction, industrial, petrochemical and oil & gas lifting.",
      ar: "رافعات متحركة معتمدة، ورافعات للطرق الوعرة، ورافعات زاحفة لأعمال الرفع في مشاريع الإنشاء والصناعة والبتروكيماويات والنفط والغاز.",
    },
    body: {
      en: [
        "Our heavy lifting fleet covers certified mobile cranes from 20 tonnes to 1200 tonnes, rough terrain cranes from 25 tonnes to 120 tonnes, and crawler cranes from 55 tonnes to 3200 tonnes. That covers everything from routine structural lifts to petrochemical and mega-project work.",
        "Cranes are supplied with qualified operators on request. Tell us the load, the radius and the ground conditions, and we will recommend the class of machine that suits the lift.",
      ],
      ar: [
        "يغطي أسطول الرفع الثقيل لدينا رافعات متحركة معتمدة من 20 طناً إلى 1200 طن، ورافعات للطرق الوعرة من 25 طناً إلى 120 طناً، ورافعات زاحفة من 55 طناً إلى 3200 طن. وهي قدرة تمتد من أعمال الرفع الإنشائية المعتادة إلى مشاريع البتروكيماويات والمشاريع الكبرى.",
        "وتُوفَّر الرافعات مع مشغّلين مؤهّلين عند الطلب. أخبرنا بوزن الحمل ونصف الدوران وطبيعة الأرض، وسنرشّح فئة المعدة المناسبة لعملية الرفع.",
      ],
    },
    features: {
      en: [
        "Certified mobile cranes: 20 T – 1200 T",
        "Rough terrain cranes: 25 T – 120 T",
        "Crawler cranes: 55 T – 3200 T",
        "Qualified operators provided on request",
        "Construction, industrial, petrochemical and oil & gas applications",
      ],
      ar: [
        "رافعات متحركة معتمدة: 20 – 1200 طن",
        "رافعات للطرق الوعرة: 25 – 120 طناً",
        "رافعات زاحفة: 55 – 3200 طن",
        "مشغّلون مؤهّلون عند الطلب",
        "تطبيقات في الإنشاء والصناعة والبتروكيماويات والنفط والغاز",
      ],
    },
    relatedEquipment: ["mobile-cranes", "rough-terrain-cranes", "crawler-cranes"],
    icon: "crane",
  },
  {
    slug: "material-handling-and-access",
    title: {
      en: "Material Handling & Access Solutions",
      ar: "حلول مناولة المواد والوصول الآمن",
    },
    tagline: {
      en: "Safe elevated access and everyday lifting.",
      ar: "وصول آمن للمرتفعات ومناولة يومية للمواد.",
    },
    summary: {
      en: "Scissor and man lifts, forklifts and telehandlers for maintenance access, warehouse handling and placing materials at height.",
      ar: "مقصّات ورافعات أفراد، ورافعات شوكية، ورافعات تلسكوبية لأعمال الصيانة ومناولة المستودعات ووضع المواد على ارتفاع.",
    },
    body: {
      en: [
        "Light lifting keeps day-to-day work moving. Scissor lifts and man lifts give safe elevated access for maintenance, construction and industrial facility operations; forklifts handle material across warehouses, yards and project laydown areas.",
        "Telehandlers combine reach with lifting capacity, placing materials at height across construction sites and project operations where a crane is more machine than the task needs.",
      ],
      ar: [
        "أعمال الرفع الخفيف هي ما يُبقي العمل اليومي متحرّكاً. توفّر المقصّات ورافعات الأفراد وصولاً آمناً إلى المرتفعات لأعمال الصيانة والإنشاء وتشغيل المرافق الصناعية، وتتولّى الرافعات الشوكية مناولة المواد في المستودعات والساحات ومناطق تجميع المواد بالمشروع.",
        "وتجمع الرافعات التلسكوبية بين المدى وقدرة الرفع لوضع المواد على ارتفاع في مواقع الإنشاء وعمليات المشاريع، حيث تكون الرافعة الكبيرة أكثر مما تتطلّبه المهمة.",
      ],
    },
    features: {
      en: [
        "Scissor lifts and man lifts for elevated access",
        "Forklifts for warehouse, yard and site handling",
        "Telehandlers for lifting and placing at height",
        "Maintenance, construction and industrial facility work",
        "Operators provided on request",
      ],
      ar: [
        "مقصّات ورافعات أفراد للوصول إلى المرتفعات",
        "رافعات شوكية للمستودعات والساحات والمواقع",
        "رافعات تلسكوبية للرفع والوضع على ارتفاع",
        "أعمال الصيانة والإنشاء والمرافق الصناعية",
        "مشغّلون عند الطلب",
      ],
    },
    relatedEquipment: ["scissor-and-man-lifts", "forklifts", "telehandlers"],
    icon: "telehandler",
  },
  {
    slug: "construction-and-earthmoving",
    title: {
      en: "Construction & Earthmoving Equipment",
      ar: "معدات الإنشاء وأعمال الحفر",
    },
    tagline: {
      en: "Excavate, grade, load, compact.",
      ar: "حفر وتمهيد وتحميل ودمك.",
    },
    summary: {
      en: "Excavators, bulldozers and graders, wheel and skid loaders, backhoe loaders and rollers for civil and infrastructure works.",
      ar: "حفّارات، وجرّافات وممهّدات، ولوادر بعجل ولوادر انزلاقية، ولوادر حفّارة ومداحل للأعمال المدنية والبنية التحتية.",
    },
    body: {
      en: [
        "Our construction and earthmoving fleet covers the full sequence of ground work: full-size and mini excavators for excavation and trenching, bulldozers and motor graders for clearing and grading, wheel and skid loaders for loading and site preparation, and backhoe loaders and rollers for versatile digging and compaction.",
        "Equipment is available across civil works, infrastructure and industrial site preparation, with qualified operators supplied when the project requires them.",
      ],
      ar: [
        "يغطي أسطول الإنشاء وأعمال الحفر لدينا تسلسل الأعمال الترابية كاملاً: حفّارات كاملة الحجم وصغيرة للحفر وشقّ الخنادق، وجرّافات وممهّدات لإزالة العوائق والتمهيد، ولوادر بعجل ولوادر انزلاقية للتحميل وتهيئة الموقع، ولوادر حفّارة ومداحل لأعمال الحفر والدمك المتنوّعة.",
        "والمعدات متاحة للأعمال المدنية والبنية التحتية وتهيئة المواقع الصناعية، مع توفير مشغّلين مؤهّلين عندما يتطلّب المشروع ذلك.",
      ],
    },
    features: {
      en: [
        "Full-size and mini excavators",
        "Bulldozers and motor graders",
        "Wheel loaders and skid steer loaders",
        "Backhoe loaders and road rollers",
        "Excavation, trenching, clearing, grading, loading and compaction",
      ],
      ar: [
        "حفّارات كاملة الحجم وحفّارات صغيرة",
        "جرّافات وممهّدات",
        "لوادر بعجل ولوادر انزلاقية",
        "لوادر حفّارة ومداحل طرق",
        "حفر وشقّ خنادق وإزالة عوائق وتمهيد وتحميل ودمك",
      ],
    },
    relatedEquipment: ["excavators", "bulldozers", "motor-graders", "wheel-loaders"],
    icon: "excavator",
  },
  {
    slug: "transportation-services",
    title: { en: "Transportation Services", ar: "خدمات النقل" },
    tagline: {
      en: "Trailers, trucks and tankers, Kingdom-wide.",
      ar: "مقاطر وشاحنات وصهاريج على مستوى المملكة.",
    },
    summary: {
      en: "Lowbed and flatbed trailers, boom trucks and dump trucks, plus water, fuel and vacuum tankers with qualified drivers.",
      ar: "مقاطر منخفضة ومسطّحة، وشاحنات برافعة وقلّابات، وصهاريج مياه ووقود وشفط مع سائقين مؤهّلين.",
    },
    body: {
      en: [
        "Lowbed trailers move heavy machinery, flatbed trailers carry project cargo, and boom trucks and dump trucks handle versatile site operations. Water, fuel and vacuum tankers plus pickup support vehicles keep sites supplied and serviced.",
        "Qualified drivers are available, with transportation coverage across the Kingdom of Saudi Arabia.",
      ],
      ar: [
        "تنقل المقاطر المنخفضة المعدات الثقيلة، وتحمل المقاطر المسطّحة شحنات المشاريع، وتتولّى الشاحنات ذات الرافعة والقلّابات العمليات المتنوّعة في الموقع. كما تُبقي صهاريج المياه والوقود والشفط ومركبات الدعم المواقع مزوَّدة ومخدومة.",
        "وسائقون مؤهّلون متاحون، مع تغطية لخدمات النقل في مختلف مناطق المملكة العربية السعودية.",
      ],
    },
    features: {
      en: [
        "Lowbed trailers for heavy machinery",
        "Flatbed trailers for project cargo",
        "Boom trucks and dump trucks",
        "Water, fuel and vacuum tankers",
        "Pickup support vehicles",
        "Qualified drivers · Kingdom-wide coverage",
      ],
      ar: [
        "مقاطر منخفضة لنقل المعدات الثقيلة",
        "مقاطر مسطّحة لشحنات المشاريع",
        "شاحنات برافعة وقلّابات",
        "صهاريج مياه ووقود وشفط",
        "مركبات دعم (بيك أب)",
        "سائقون مؤهّلون · تغطية على مستوى المملكة",
      ],
    },
    relatedEquipment: ["lowbed-trailers", "flatbed-trailers", "dump-trucks", "water-tankers"],
    icon: "trailer",
  },
  {
    slug: "site-power-and-support",
    title: {
      en: "Site Power & Support Solutions",
      ar: "حلول الطاقة والمساندة في الموقع",
    },
    tagline: {
      en: "Air, power, welding and light.",
      ar: "هواء وطاقة ولحام وإضاءة.",
    },
    summary: {
      en: "Air compressors, power generators, welding machines and tower lights that keep work running through the shift and into the night.",
      ar: "ضواغط هواء ومولّدات كهرباء وماكينات لحام وأبراج إضاءة تُبقي العمل مستمراً خلال الورديات وحتى الليل.",
    },
    body: {
      en: [
        "High-capacity air compressors drive pneumatic tools, blasting and general site operations. Power generators provide continuous electrical supply for construction and industrial sites where grid power is unavailable or unreliable.",
        "Welding machines and tower lights support fabrication, maintenance and night operations.",
      ],
      ar: [
        "تشغّل ضواغط الهواء عالية السعة العدد الهوائية وأعمال التجليخ والعمليات العامة في الموقع. وتوفّر مولّدات الكهرباء تغذية كهربائية مستمرة لمواقع الإنشاء والمواقع الصناعية حيث لا تتوفّر الشبكة أو لا يُعتمد عليها.",
        "وتدعم ماكينات اللحام وأبراج الإضاءة أعمال التصنيع والصيانة والعمل الليلي.",
      ],
    },
    features: {
      en: [
        "High-capacity air compressors",
        "Power generators for continuous supply",
        "Welding machines for fabrication and maintenance",
        "Tower lights for night operations",
        "Suited to all project types",
      ],
      ar: [
        "ضواغط هواء عالية السعة",
        "مولّدات كهرباء لتغذية مستمرة",
        "ماكينات لحام لأعمال التصنيع والصيانة",
        "أبراج إضاءة للعمل الليلي",
        "مناسبة لجميع أنواع المشاريع",
      ],
    },
    relatedEquipment: ["air-compressors", "power-generators", "welding-machines", "tower-lights"],
    icon: "power",
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((s) => s.slug === slug);
}
