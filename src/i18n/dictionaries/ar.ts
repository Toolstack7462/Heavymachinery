import type { Dictionary } from "./en";

/**
 * Arabic dictionary (Modern Standard Arabic).
 *
 * SCOPE & HONESTY NOTE:
 * - Short UI chrome (navigation, buttons, form labels) is translated in
 *   standard Arabic and is safe to ship.
 * - Longer marketing sentences are a reasonable first-pass translation and
 *   should be reviewed by a native speaker before launch. Arabic pages show a
 *   small "translation under review" notice (see `meta.translationPending`)
 *   so nothing is presented as final/verified.
 * - Page BODY content (services/equipment descriptions in src/content/*) is not
 *   yet translated; the Arabic route renders that content in English until the
 *   client supplies Arabic copy. This is intentional and documented.
 */
export const ar: Dictionary = {
  meta: {
    localeLabel: "العربية",
    translationPending: "الترجمة العربية قيد المراجعة.",
  },
  nav: {
    home: "الرئيسية",
    about: "من نحن",
    leadership: "القيادة",
    services: "الخدمات",
    fleet: "المعدات والأسطول",
    industries: "القطاعات",
    projects: "المشاريع",
    safety: "السلامة والجودة",
    whyUs: "لماذا نحن",
    faqs: "الأسئلة الشائعة",
    insights: "المقالات",
    contact: "اتصل بنا",
    quote: "اطلب عرض سعر",
  },
  actions: {
    requestQuote: "اطلب عرض سعر",
    getQuote: "احصل على عرض سعر",
    callNow: "اتصل الآن",
    whatsapp: "واتساب",
    viewFleet: "استعرض الأسطول",
    exploreServices: "استكشف الخدمات",
    learnMore: "اعرف المزيد",
    viewDetails: "عرض التفاصيل",
    viewAll: "عرض الكل",
    backTo: "العودة إلى",
    readMore: "اقرأ المزيد",
    submit: "إرسال الطلب",
    sending: "جارٍ الإرسال…",
    send: "إرسال الرسالة",
    contactUs: "اتصل بنا",
    getInTouch: "تواصل معنا",
  },
  hero: {
    eyebrow: "تأجير المعدات الثقيلة والمقاولات · قطر",
    title: "نُشغّل تقدّم قطر",
    subtitle:
      "شريك متكامل لتأجير المعدات الثقيلة والأعمال الترابية والنقل والرفع والهدم والمقاولات — مدعوم بأسطول حديث وطواقم مدرَّبة.",
    primaryCta: "اطلب عرض سعر",
    secondaryCta: "استعرض أسطولنا",
    trust: "موثوق لتوفير معدات موثوقة وخدمة يُعتمد عليها في جميع أنحاء قطر.",
  },
  sections: {
    servicesTitle: "ماذا نقدّم",
    servicesSubtitle:
      "حلول متكاملة للمعدات الثقيلة والمقاولات، تُنفَّذ بأمان وفي الوقت المحدد.",
    fleetTitle: "أسطولنا",
    fleetSubtitle: "مجموعة واسعة من المعدات جيدة الصيانة لمشاريع بمختلف الأحجام.",
    industriesTitle: "القطاعات التي نخدمها",
    industriesSubtitle:
      "دعم مشاريع البناء والبنية التحتية والصناعة والهدم في جميع أنحاء قطر.",
    whyTitle: "لماذا تختارنا",
    whySubtitle: "خبرة محلية وأسطول حديث والتزام حقيقي بالسلامة والخدمة.",
    ctaTitle: "جاهز للمضي قدماً بمشروعك؟",
    ctaSubtitle: "أخبرنا باحتياجاتك وسيتواصل فريقنا معك بالتوفر والأسعار.",
    valuesTitle: "قيمنا",
    quoteTitle: "اطلب عرض سعر",
    quoteSubtitle: "شارك متطلبات المعدات أو المشروع وسنعاود التواصل معك سريعاً.",
    faqTitle: "الأسئلة الشائعة",
    contactTitle: "اتصل بنا",
    relatedEquipment: "معدات ذات صلة",
    relatedServices: "خدمات ذات صلة",
    exploreCategory: "استكشف الفئة",
  },
  form: {
    name: "الاسم الكامل",
    company: "الشركة",
    email: "البريد الإلكتروني",
    phone: "الهاتف / واتساب",
    service: "الخدمة / المعدات المطلوبة",
    servicePlaceholder: "اختر خدمة",
    duration: "مدة التأجير",
    location: "موقع المشروع",
    message: "الرسالة / المتطلبات",
    messagePlaceholder: "أخبرنا عن مشروعك أو المعدات التي تحتاجها…",
    required: "مطلوب",
    optional: "اختياري",
    successTitle: "تم استلام الطلب",
    successBody: "شكراً لك — تم استلام طلبك وسيتواصل معك فريقنا قريباً.",
    errorTitle: "حدث خطأ ما",
    errorBody:
      "عذراً، تعذّر إرسال طلبك. يرجى المحاولة مرة أخرى أو التواصل معنا هاتفياً أو عبر واتساب.",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
    invalidName: "يرجى إدخال اسمك.",
    invalidMessage: "يرجى إضافة رسالة قصيرة.",
    consent:
      "بإرسالك للطلب فإنك توافق على التواصل معك بخصوص استفسارك. راجع سياسة الخصوصية.",
  },
  footer: {
    tagline: "تأجير المعدات الثقيلة والمقاولات في جميع أنحاء قطر.",
    quickLinks: "روابط سريعة",
    ourServices: "خدماتنا",
    contact: "اتصل بنا",
    followUs: "تابعنا",
    rights: "جميع الحقوق محفوظة.",
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    hours: "ساعات العمل",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    sitemap: "خريطة الموقع",
    builtNote: "هذه نسخة تجريبية. اسم العلامة وبعض التفاصيل عناصر قابلة للتعديل.",
  },
  breadcrumb: {
    home: "الرئيسية",
  },
  notFound: {
    title: "الصفحة غير موجودة",
    body: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    cta: "العودة إلى الرئيسية",
  },
};
