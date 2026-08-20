import type { Dictionary } from "./en";

/**
 * Arabic dictionary (Modern Standard Arabic), first-class and complete:
 * every English string above has an Arabic equivalent, and all page body
 * content in src/content/* is bilingual too — no Arabic route falls back to
 * English copy, so there is no "translation pending" notice.
 *
 * TRANSLATION POLICY: the Arabic conveys exactly the same factual claims as
 * the English, which in turn come only from the client's company profile. No
 * claim, figure or capability is added, softened or embellished in translation.
 *
 * The brand name is intentionally kept as "Jowain Yanbu Est." — the client has
 * not supplied an official Arabic registered name, and inventing one would put
 * an unverified legal entity name on the site.
 */
export const ar: Dictionary = {
  meta: {
    localeLabel: "العربية",
    localeShort: "ع",
    switchTo: "English",
  },

  nav: {
    home: "الرئيسية",
    about: "عن الشركة",
    services: "الخدمات",
    fleet: "المعدات",
    industries: "القطاعات",
    quality: "الجودة",
    clients: "عملاؤنا",
    faqs: "الأسئلة الشائعة",
    contact: "اتصل بنا",
    request: "طلب معدات",
    menu: "القائمة",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    primaryLabel: "الرئيسية",
    mobileLabel: "قائمة الجوال",
    skipToContent: "تخطَّ إلى المحتوى",
  },

  actions: {
    request: "طلب معدات",
    requestShort: "طلب",
    contactUs: "اتصل بنا",
    exploreFleet: "استعرض أسطولنا",
    viewFleet: "عرض جميع المعدات",
    viewDetails: "عرض التفاصيل",
    viewAll: "جميع المعدات",
    learnMore: "اعرف المزيد",
    submit: "إرسال الطلب",
    sending: "جارٍ الإرسال…",
    send: "إرسال الرسالة",
    email: "راسلنا بالبريد",
    viewOnMap: "عرض على الخريطة",
    backHome: "العودة إلى الرئيسية",
  },

  hero: {
    eyebrow: "تأسست عام 1992 · ينبع البحر، المملكة العربية السعودية",
    title: "تأجير المعدات الثقيلة وخدمات النقل",
    tagline: "معدات موثوقة. نقل يُعتمد عليه.",
    subtitle:
      "أكثر من 30 عاماً في توفير معدات الرفع الثقيل والإنشاء وأعمال الحفر والنقل لمشاريع في مختلف مناطق المملكة العربية السعودية، مع مشغّلين وسائقين مؤهّلين.",
    primaryCta: "استعرض أسطولنا",
    secondaryCta: "طلب معدات",
    metaEstablished: "تأسست عام 1992",
    metaLocation: "ينبع البحر، السعودية",
    metaCoverage: "تغطية على مستوى المملكة",
    imageCaption: "رفع ثقيل · أعمال حفر · نقل",
  },

  home: {
    capabilityTitle: "ما نوفّره",
    capabilitySubtitle:
      "خمس مجموعات من المعدات تغطي الرفع الثقيل، ومناولة المواد والوصول الآمن، والإنشاء وأعمال الحفر، والنقل، وتغذية المواقع بالطاقة.",
    fleetTitle: "الأسطول والمعدات",
    fleetSubtitle:
      "معدات جيدة الصيانة وجاهزة للتشغيل، مع توفير مشغّلين وسائقين ذوي خبرة عند الطلب.",
    industriesTitle: "القطاعات التي نخدمها",
    industriesSubtitle:
      "مشاريع النفط والغاز، والبتروكيماويات، والإنشاء والبنية التحتية، والطاقة والكهرباء في مختلف مناطق المملكة.",
    whyTitle: "لماذا جوين؟",
    whySubtitle: "شريكك الموثوق في المعدات الثقيلة.",
    valuesTitle: "قيمنا الأساسية",
    valuesSubtitle: "التميّز في كل عملية.",
    clientsTitle: "عملاؤنا",
    clientsSubtitle:
      "دعم بالمعدات والنقل لمقاولين ومشغّلين في مشاريع صناعية كبرى.",
    qualityTitle: "التزامنا بالجودة",
    ctaTitle: "أخبرنا بما يحتاجه مشروعك",
    ctaSubtitle:
      "أرسل متطلبات المعدات أو النقل وسيوافيك فريقنا بالتوفّر والتفاصيل.",
  },

  pages: {
    aboutTitle: "ثلاثة عقود من القدرة في المعدات الثقيلة",
    aboutLead:
      "توفّر مؤسسة Jowain Yanbu Est. حلول المعدات الثقيلة والنقل من ينبع البحر منذ عام 1992، لخدمة مشاريع الإنشاء والصناعة والطاقة في مختلف مناطق المملكة العربية السعودية.",
    visionTitle: "رؤيتنا",
    visionKicker: "رؤيتنا للمستقبل",
    missionTitle: "مهمتنا",
    missionKicker: "التزامنا في كل مشروع",
    fleetTitle: "المعدات والأسطول",
    fleetLead:
      "معدات الرفع الثقيل، ومناولة المواد، وأعمال الحفر، والنقل، وتغذية المواقع بالطاقة، متاحة مع مشغّلين وسائقين مؤهّلين عند الحاجة.",
    servicesTitle: "الخدمات",
    servicesLead:
      "خدمات تأجير المعدات والنقل مبنية على ما يحتاجه المشروع فعلياً في الموقع.",
    industriesTitle: "القطاعات التي نخدمها",
    industriesLead:
      "ندعم متطلبات الرفع الثقيل وأعمال الحفر والنقل في أربعة قطاعات رئيسية.",
    qualityTitle: "التزامنا بالجودة",
    qualityLead:
      "الجودة في صميم كل ما نقوم به: معدات موثوقة، وخدمة احترافية، ومعايير تشغيلية عالية في كل مشروع.",
    qualityPhilosophyTitle: "فلسفتنا في الجودة",
    qualityPracticeTitle: "كيف نحقّقها",
    clientsTitle: "عملاؤنا",
    clientsLead:
      "توفّر مؤسسة Jowain Yanbu Est. المعدات وخدمات النقل لمقاولين ومشغّلين يعملون في مشاريع صناعية وبنية تحتية كبرى.",
    clientsDirectTitle: "علاقات مباشرة مع العملاء",
    clientsGridTitle: "جهات نخدمها",
    whyTitle: "لماذا جوين؟",
    whyLead: "شريكك الموثوق في المعدات الثقيلة.",
    contactTitle: "اتصل بنا",
    contactLead:
      "أرسل إلينا متطلبات المعدات أو النقل وسيوافيك فريقنا بالتوفّر والتفاصيل.",
    requestTitle: "طلب معدات",
    requestLead:
      "أخبرنا بالمعدات أو النقل المطلوب، وموقع العمل، والمدة المطلوبة.",
    faqsTitle: "الأسئلة الشائعة",
    faqsLead: "أسئلة متكرّرة حول تأجير المعدات وترتيب أعمال النقل معنا.",
    sitemapTitle: "خريطة الموقع",
    sitemapLead: "جميع صفحات هذا الموقع.",
    privacyTitle: "سياسة الخصوصية",
    termsTitle: "شروط الاستخدام",
  },

  labels: {
    applications: "مجالات الاستخدام",
    specifications: "المواصفات",
    included: "ما يشمله",
    relatedEquipment: "معدات ذات صلة",
    otherServices: "خدمات أخرى",
    exploreCategory: "استعرض الفئة",
    categories: "فئات المعدات",
    capacityRange: "نطاق الحمولة",
    onRequest: "متاح عند الطلب",
    imageNote:
      "صورة توضيحية للفئة. تُقدَّم صور الوحدة المطلوبة تحديداً مع عرض السعر.",
    specNote:
      "تُحدَّد الطرازات والحمولات بدقة مع عرض السعر. أخبرنا بطبيعة العمل وسنرشّح الوحدة المناسبة.",
    clientNote:
      "شعارات العملاء مأخوذة من مواد مقدَّمة من مؤسسة Jowain Yanbu Est.، وتبقى ملكاً لأصحابها.",
    operatorsNote: "مشغّلون وسائقون مؤهّلون عند الطلب.",
    operatorsShort: "مشغّلون وسائقون مؤهّلون",
    searchEquipment: "ابحث في المعدات",
    searchEquipmentPlaceholder: "ابحث بالاسم أو النوع أو الحمولة",
    resultSingular: "نتيجة",
    resultPlural: "نتيجة",
    noResults: "لا توجد معدات مطابقة لهذا البحث",
    noResultsHint:
      "جرّب كلمة أعم أو تصفّح حسب الفئة. وإن كنت تحتاج معدة غير مدرجة هنا، أرسل لنا المتطلب وسنخبرك بما يمكننا توفيره.",
    clearSearch: "مسح البحث",
    quoteChecklist: "ما الذي نحتاج معرفته لتسعير سريع",
    quoteChecklistNote: "أرسل ما هو متاح لديك، وسنسألك عمّا ينقص.",
    relatedService: "ضمن خدمة",
    established: "التأسيس",
    coverage: "التغطية",
    experience: "الخبرة",
    yearsPlus: "أكثر من 30 عاماً",
    equipmentGroups: "مجموعات المعدات",
    location: "الموقع",
  },

  form: {
    legendContact: "بياناتك",
    legendRequirement: "متطلباتك",
    name: "الاسم الكامل",
    company: "الشركة",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    equipment: "المعدات أو الخدمة المطلوبة",
    equipmentPlaceholder: "اختر معدات أو خدمة",
    location: "موقع المشروع",
    duration: "مدة التأجير",
    durationPlaceholder: "مثال: 3 أشهر، أو عملية رفع واحدة",
    message: "تفاصيل المتطلبات",
    messagePlaceholder:
      "أخبرنا عن عملية الرفع أو الحمل أو النقل المطلوبة، مع ذكر الموقع والتوقيت وأي قيود على الوصول.",
    required: "مطلوب",
    optional: "اختياري",
    successTitle: "تم استلام الطلب",
    successBody: "شكراً لك. تم إرسال طلبك إلى فريقنا وسيتواصل معك.",
    successReference: "رقمك المرجعي",
    successFollowUp: "اذكر هذا الرقم عند المتابعة عبر البريد الإلكتروني:",
    draftRestored: "احتفظنا بما كنت قد كتبته.",
    errorTitle: "تعذّر إرسال طلبك",
    errorTooMany:
      "عدد كبير من الطلبات من هذا الاتصال. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.",
    errorBody:
      "عذراً، تعذّر إرسال طلبك. يرجى المحاولة مرة أخرى أو مراسلتنا بالبريد الإلكتروني مباشرة.",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
    invalidName: "يرجى إدخال اسمك.",
    invalidMessage: "يرجى وصف ما تحتاجه.",
    consent: "بإرسال هذا النموذج فإنك توافق على التواصل معك بخصوص استفسارك.",
    honeypot: "لا تكتب في هذا الحقل",
  },

  footer: {
    tagline:
      "حلول تأجير المعدات الثقيلة والنقل في مختلف مناطق المملكة العربية السعودية منذ عام 1992.",
    quickLinks: "الشركة",
    equipment: "المعدات",
    contact: "التواصل",
    rights: "جميع الحقوق محفوظة.",
    madeBy: "تصميم وتطوير",
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    website: "الموقع الإلكتروني",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    sitemap: "خريطة الموقع",
  },

  breadcrumb: {
    home: "الرئيسية",
    label: "مسار التنقل",
  },

  notFound: {
    title: "الصفحة غير موجودة",
    body: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
  },
};
