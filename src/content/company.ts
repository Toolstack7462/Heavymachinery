/**
 * ============================================================================
 *  COMPANY CONTENT — overview, vision, mission, values, why-us, industries,
 *  quality commitment, fleet highlights.
 * ============================================================================
 *  EVERY statement below traces to the client-supplied "Jowain Yanbu Est.
 *  Profile Overview" (August 2026). Wording is tightened for the web; no
 *  factual claim is added, extended or embellished.
 *
 *  NOT PRESENT, THEREFORE NOT PUBLISHED: project counts, client counts,
 *  employee numbers, turnover, fleet unit counts, certifications (ISO or
 *  otherwise), awards, testimonials, leadership names, and any performance
 *  percentage. Do not add them without a verified client source.
 * ============================================================================
 */

import type { L, LL } from "@/i18n/localized";

/* ------------------------------------------------------------------ */
/* Company overview                                                    */
/* ------------------------------------------------------------------ */

/** About-page body copy. Profile source: "Company Overview" page. */
export const overview: LL = {
  en: [
    "Jowain Yanbu Est. was established in 1992 in Yanbu Al Bahr, on the Red Sea coast of the Kingdom of Saudi Arabia. Over more than 30 years we have built a comprehensive heavy equipment rental and transportation business serving projects across the Kingdom.",
    "Our equipment covers heavy lifting, light lifting and access, construction and earthmoving plant, power and supporting equipment, and full transportation services. That runs from certified mobile cranes and crawler cranes through to lowbed trailers, tankers and site power.",
    "Qualified operators and drivers are provided when required, ensuring reliability, operational efficiency and long-term customer value on every project we support.",
  ],
  ar: [
    "تأسّست مؤسسة Jowain Yanbu Est. عام 1992 في ينبع البحر على ساحل البحر الأحمر بالمملكة العربية السعودية. وعلى مدى أكثر من ثلاثين عاماً بنَينا نشاطاً متكاملاً لتأجير المعدات الثقيلة وخدمات النقل يخدم مشاريع في مختلف مناطق المملكة.",
    "تغطي معداتنا الرفع الثقيل، والرفع الخفيف والوصول الآمن، ومعدات الإنشاء وأعمال الحفر، ومعدات الطاقة والمساندة، وخدمات النقل الكاملة. ويمتد ذلك من الرافعات المتحركة المعتمدة والرافعات الزاحفة إلى المقاطر المنخفضة والصهاريج وتغذية المواقع بالطاقة.",
    "ونوفّر مشغّلين وسائقين مؤهّلين عند الحاجة، بما يضمن الموثوقية والكفاءة التشغيلية وقيمة مستدامة للعميل في كل مشروع ندعمه.",
  ],
};

/* ------------------------------------------------------------------ */
/* Vision & mission — profile pages "Our Vision" / "Our Mission"        */
/* ------------------------------------------------------------------ */

export const vision: LL = {
  en: [
    "To be the trusted and preferred heavy equipment rental and transportation solutions provider in the Kingdom of Saudi Arabia, recognised for our reliability, operational capability, quality service and long-term customer relationships.",
    "We strive to build lasting partnerships with our clients by delivering dependable, high-quality equipment and transportation solutions that support the successful completion of every project we serve.",
  ],
  ar: [
    "أن نكون المزوّد الموثوق والمفضّل لحلول تأجير المعدات الثقيلة والنقل في المملكة العربية السعودية، معروفين بموثوقيتنا وقدرتنا التشغيلية وجودة خدمتنا وعلاقاتنا الطويلة الأمد مع عملائنا.",
    "ونسعى إلى بناء شراكات دائمة مع عملائنا من خلال تقديم معدات وحلول نقل موثوقة وعالية الجودة تدعم الإنجاز الناجح لكل مشروع نخدمه.",
  ],
};

export const mission: LL = {
  en: [
    "Our mission is to provide dependable heavy equipment rental and transportation services that support the efficient and successful completion of every project. We are committed to deploying reliable, well-maintained equipment operated by experienced and qualified personnel.",
    "We uphold responsible operations, strong customer commitment and consistent service excellence, delivering real value across every project we support throughout the Kingdom of Saudi Arabia.",
  ],
  ar: [
    "مهمتنا هي تقديم خدمات موثوقة لتأجير المعدات الثقيلة والنقل تدعم إنجاز كل مشروع بكفاءة ونجاح. ونحن ملتزمون بتشغيل معدات موثوقة وجيدة الصيانة يديرها كوادر ذوو خبرة ومؤهّلون.",
    "ونحافظ على عمليات مسؤولة، والتزام قوي تجاه العميل، وتميّز مستمر في الخدمة، بما يحقّق قيمة حقيقية في كل مشروع ندعمه في مختلف مناطق المملكة العربية السعودية.",
  ],
};

/* ------------------------------------------------------------------ */
/* Core values — profile page "Our Core Values" (exactly three)         */
/* ------------------------------------------------------------------ */

export interface ValueItem {
  key: string;
  title: L;
  description: L;
  icon: string;
}

export const coreValues: ValueItem[] = [
  {
    key: "quality-reliability",
    title: { en: "Quality & Reliability", ar: "الجودة والموثوقية" },
    description: {
      en: "High standards in equipment and service delivery, with dependable solutions supporting every project requirement.",
      ar: "معايير عالية في المعدات وتقديم الخدمة، وحلول يُعتمد عليها تلبّي متطلبات كل مشروع.",
    },
    icon: "medal",
  },
  {
    key: "integrity-professionalism",
    title: { en: "Integrity & Professionalism", ar: "النزاهة والاحترافية" },
    description: {
      en: "Professional, responsible and transparent business conduct, with operational and service excellence.",
      ar: "سلوك مهني ومسؤول وشفّاف في العمل، مع تميّز في التشغيل والخدمة.",
    },
    icon: "shield",
  },
  {
    key: "customer-commitment",
    title: { en: "Customer Commitment", ar: "الالتزام تجاه العميل" },
    description: {
      en: "Understanding customer needs, building lasting relationships and delivering consistent value across every project.",
      ar: "فهم احتياجات العميل، وبناء علاقات دائمة، وتقديم قيمة ثابتة في كل مشروع.",
    },
    icon: "handshake",
  },
];

/* ------------------------------------------------------------------ */
/* Why choose Jowain — profile page "Why Choose Jowain?" (three)        */
/* ------------------------------------------------------------------ */

export const whyChooseUs: ValueItem[] = [
  {
    key: "established-1992",
    title: { en: "Established since 1992", ar: "قائمة منذ عام 1992" },
    description: {
      en: "Over 30 years of industry experience in heavy equipment rental and transportation.",
      ar: "أكثر من 30 عاماً من الخبرة في تأجير المعدات الثقيلة وخدمات النقل.",
    },
    icon: "calendar",
  },
  {
    key: "kingdom-wide",
    title: { en: "Kingdom-wide coverage", ar: "تغطية على مستوى المملكة" },
    description: {
      en: "Serving projects across Saudi Arabia with reliable equipment and transportation solutions.",
      ar: "نخدم مشاريع في مختلف مناطق المملكة العربية السعودية بمعدات وحلول نقل موثوقة.",
    },
    icon: "map",
  },
  {
    key: "qualified-personnel",
    title: { en: "Qualified personnel", ar: "كوادر مؤهّلة" },
    description: {
      en: "Certified operators and drivers provided upon request for every project requirement.",
      ar: "مشغّلون وسائقون معتمدون يُوفَّرون عند الطلب لتلبية متطلبات كل مشروع.",
    },
    icon: "users",
  },
];

/* ------------------------------------------------------------------ */
/* Fleet highlights — profile page "Fleet & Equipment Overview"         */
/* ------------------------------------------------------------------ */

export const fleetHighlights: ValueItem[] = [
  {
    key: "ready-for-deployment",
    title: { en: "Ready for deployment", ar: "جاهزة للتشغيل" },
    description: {
      en: "Well-maintained, reliable equipment available across heavy lifting, construction, earthmoving and transportation categories.",
      ar: "معدات موثوقة وجيدة الصيانة متاحة في فئات الرفع الثقيل والإنشاء وأعمال الحفر والنقل.",
    },
    icon: "wrench",
  },
  {
    key: "qualified-coverage",
    title: {
      en: "Qualified personnel & KSA coverage",
      ar: "كوادر مؤهّلة وتغطية داخل المملكة",
    },
    description: {
      en: "Experienced operators and drivers provided upon request, with service coverage across the Kingdom of Saudi Arabia.",
      ar: "مشغّلون وسائقون ذوو خبرة يُوفَّرون عند الطلب، مع تغطية خدمية في مختلف مناطق المملكة.",
    },
    icon: "users",
  },
];

/* ------------------------------------------------------------------ */
/* Industries — profile page "Industries We Serve" (exactly four)       */
/* ------------------------------------------------------------------ */

export interface Industry {
  slug: string;
  title: L;
  description: L;
  icon: string;
}

export const industries: Industry[] = [
  {
    slug: "oil-and-gas",
    title: { en: "Oil & Gas", ar: "النفط والغاز" },
    description: {
      en: "Heavy equipment and specialised transportation for oil & gas projects, pipelines and field operations across Saudi Arabia.",
      ar: "معدات ثقيلة ونقل متخصّص لمشاريع النفط والغاز وخطوط الأنابيب والعمليات الحقلية في مختلف مناطق المملكة.",
    },
    icon: "factory",
  },
  {
    slug: "petrochemical",
    title: { en: "Petrochemical", ar: "البتروكيماويات" },
    description: {
      en: "Industrial lifting, earthmoving and transportation solutions supporting petrochemical plant construction and operations.",
      ar: "حلول الرفع الصناعي وأعمال الحفر والنقل لدعم إنشاء وتشغيل مصانع البتروكيماويات.",
    },
    icon: "layers",
  },
  {
    slug: "construction-and-infrastructure",
    title: {
      en: "Construction & Infrastructure",
      ar: "الإنشاء والبنية التحتية",
    },
    description: {
      en: "Heavy lifting, excavation, grading and civil works equipment for large-scale infrastructure and site development projects.",
      ar: "معدات الرفع الثقيل والحفر والتمهيد والأعمال المدنية لمشاريع البنية التحتية وتطوير المواقع واسعة النطاق.",
    },
    icon: "building",
  },
  {
    slug: "power-and-energy",
    title: { en: "Power & Energy", ar: "الطاقة والكهرباء" },
    description: {
      en: "Equipment and transportation solutions for power generation, energy infrastructure and industrial project execution.",
      ar: "معدات وحلول نقل لمشاريع توليد الطاقة والبنية التحتية للطاقة وتنفيذ المشاريع الصناعية.",
    },
    icon: "power",
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Quality commitment — profile page "Quality Commitment"              */
/* ------------------------------------------------------------------ */

export const qualityPhilosophy: L = {
  en: "At Jowain Yanbu Est., quality is at the core of everything we do. We are committed to providing reliable equipment and professional services that are fully aligned with our customers' requirements, so every project is supported to the highest operational standards.",
  ar: "في مؤسسة Jowain Yanbu Est.، الجودة في صميم كل ما نقوم به. ونحن ملتزمون بتوفير معدات موثوقة وخدمات احترافية تتوافق تماماً مع متطلبات عملائنا، بما يضمن دعم كل مشروع بأعلى المعايير التشغيلية.",
};

export const qualityPractice: L = {
  en: "We maintain dependable service delivery through rigorous equipment maintenance, qualified personnel and professional working practices. Our commitment to continuous improvement ensures lasting value and consistent excellence across every project we support.",
  ar: "ونحافظ على تقديم خدمة يُعتمد عليها من خلال صيانة صارمة للمعدات، وكوادر مؤهّلة، وممارسات عمل احترافية. والتزامنا بالتحسين المستمر يضمن قيمة مستدامة وتميّزاً ثابتاً في كل مشروع ندعمه.",
};

/** The four practices named in the profile's quality statement. */
export const qualityCommitments: ValueItem[] = [
  {
    key: "maintenance",
    title: { en: "Rigorous equipment maintenance", ar: "صيانة صارمة للمعدات" },
    description: {
      en: "Planned maintenance keeps every unit dependable and ready for deployment when a project calls it forward.",
      ar: "الصيانة المخطّطة تُبقي كل وحدة موثوقة وجاهزة للتشغيل عند طلبها في المشروع.",
    },
    icon: "wrench",
  },
  {
    key: "personnel",
    title: { en: "Qualified personnel", ar: "كوادر مؤهّلة" },
    description: {
      en: "Experienced, qualified operators and drivers are provided for the equipment they run.",
      ar: "نوفّر مشغّلين وسائقين ذوي خبرة ومؤهّلين للمعدات التي يتولّون تشغيلها.",
    },
    icon: "users",
  },
  {
    key: "practices",
    title: {
      en: "Professional working practices",
      ar: "ممارسات عمل احترافية",
    },
    description: {
      en: "Responsible operations and professional conduct on every site where our equipment works.",
      ar: "عمليات مسؤولة وسلوك مهني في كل موقع تعمل فيه معداتنا.",
    },
    icon: "clipboard",
  },
  {
    key: "improvement",
    title: { en: "Continuous improvement", ar: "التحسين المستمر" },
    description: {
      en: "We review how we work so service quality stays consistent from one project to the next.",
      ar: "نراجع طريقة عملنا لتبقى جودة الخدمة ثابتة من مشروع إلى آخر.",
    },
    icon: "gauge",
  },
];
