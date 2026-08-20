/**
 * English dictionary — every string of UI chrome and section copy on the site.
 * `ar.ts` must satisfy this exact shape (TypeScript enforces it), so nothing
 * can ship half-translated.
 *
 * Page BODY content (equipment, services, company statements) lives in
 * src/content/* and is bilingual there.
 */
export const en = {
  meta: {
    localeLabel: "English",
    localeShort: "EN",
    switchTo: "العربية",
  },

  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    fleet: "Equipment",
    industries: "Industries",
    quality: "Quality",
    clients: "Clients",
    faqs: "FAQs",
    contact: "Contact",
    request: "Request Equipment",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryLabel: "Primary",
    mobileLabel: "Mobile menu",
    skipToContent: "Skip to content",
  },

  actions: {
    request: "Request Equipment",
    requestShort: "Request",
    contactUs: "Contact Us",
    exploreFleet: "Explore Our Fleet",
    viewFleet: "View All Equipment",
    viewDetails: "View Details",
    viewAll: "All Equipment",
    learnMore: "Learn More",
    submit: "Send Request",
    sending: "Sending…",
    send: "Send Message",
    email: "Email Us",
    viewOnMap: "View on map",
    backHome: "Back to Home",
  },

  hero: {
    eyebrow: "Established 1992 · Yanbu Al Bahr, Saudi Arabia",
    title: "Heavy Equipment Rental & Transportation",
    tagline: "Reliable equipment. Dependable transportation.",
    subtitle:
      "Over 30 years supplying heavy lifting, construction, earthmoving and transportation equipment to projects across the Kingdom of Saudi Arabia, with qualified operators and drivers.",
    primaryCta: "Explore Our Fleet",
    secondaryCta: "Request Equipment",
    metaEstablished: "Established 1992",
    metaLocation: "Yanbu Al Bahr, KSA",
    metaCoverage: "Kingdom-wide coverage",
    imageCaption: "Heavy lifting · earthmoving · transportation",
  },

  home: {
    capabilityTitle: "What we supply",
    capabilitySubtitle:
      "Five equipment groups covering heavy lifting, material handling and access, construction and earthmoving, transportation, and site power.",
    fleetTitle: "Fleet & equipment",
    fleetSubtitle:
      "Well-maintained equipment ready for deployment, with experienced operators and drivers provided on request.",
    industriesTitle: "Industries we serve",
    industriesSubtitle:
      "Oil & gas, petrochemical, construction & infrastructure, and power & energy projects across Saudi Arabia.",
    whyTitle: "Why choose Jowain?",
    whySubtitle: "Your trusted heavy equipment partner.",
    valuesTitle: "Our core values",
    valuesSubtitle: "Excellence in every operation.",
    clientsTitle: "Our valued clients",
    clientsSubtitle:
      "Equipment and transportation support for contractors and operators on major industrial projects.",
    qualityTitle: "Quality commitment",
    ctaTitle: "Tell us what your project needs",
    ctaSubtitle:
      "Send your equipment or transportation requirement and our team will respond with availability.",
  },

  pages: {
    aboutTitle: "Three decades of heavy equipment capability",
    aboutLead:
      "Jowain Yanbu Est. has supplied heavy equipment and transportation solutions from Yanbu Al Bahr since 1992, serving construction, industrial and energy projects across the Kingdom of Saudi Arabia.",
    visionTitle: "Our vision",
    visionKicker: "Our vision for the future",
    missionTitle: "Our mission",
    missionKicker: "Our commitment to every project",
    fleetTitle: "Equipment & fleet",
    fleetLead:
      "Heavy lifting, material handling, earthmoving, transportation and site power equipment, available with qualified operators and drivers where required.",
    servicesTitle: "Services",
    servicesLead:
      "Equipment rental and transportation services built around what the project needs on site.",
    industriesTitle: "Industries we serve",
    industriesLead:
      "We support heavy lifting, earthmoving and transportation requirements across four primary sectors.",
    qualityTitle: "Quality commitment",
    qualityLead:
      "Quality is at the core of everything we do: reliable equipment, professional service and high operational standards on every project.",
    qualityPhilosophyTitle: "Our quality philosophy",
    qualityPracticeTitle: "How we deliver it",
    clientsTitle: "Our valued clients",
    clientsLead:
      "Jowain Yanbu Est. supplies equipment and transportation to contractors and operators working on major industrial and infrastructure projects.",
    clientsDirectTitle: "Direct client relationships",
    clientsGridTitle: "Organisations we support",
    whyTitle: "Why choose Jowain?",
    whyLead: "Your trusted heavy equipment partner.",
    contactTitle: "Contact us",
    contactLead:
      "Send us your equipment or transportation requirement and our team will respond with availability.",
    requestTitle: "Request equipment",
    requestLead:
      "Tell us the equipment or transportation you need, where it is needed and for how long.",
    faqsTitle: "Frequently asked questions",
    faqsLead:
      "Common questions about renting equipment and arranging transportation with us.",
    sitemapTitle: "Sitemap",
    sitemapLead: "Every page on this website.",
    privacyTitle: "Privacy policy",
    termsTitle: "Terms of use",
  },

  labels: {
    applications: "Applications",
    specifications: "Specifications",
    included: "What's included",
    relatedEquipment: "Related equipment",
    otherServices: "Other services",
    exploreCategory: "Explore category",
    categories: "Equipment categories",
    capacityRange: "Capacity range",
    onRequest: "Available on request",
    imageNote:
      "Category photograph. Images of the specific unit are provided with your quotation.",
    specNote:
      "Exact models and capacities are confirmed with your quotation. Tell us the task and we will recommend the right unit.",
    clientNote:
      "Client marks are reproduced from artwork supplied by Jowain Yanbu Est. and remain the property of their respective owners.",
    operatorsNote: "Qualified operators and drivers provided on request.",
    /** Short form for the hero fact rail, where the three cells share a row. */
    operatorsShort: "Qualified operators & drivers",
    searchEquipment: "Search equipment",
    searchEquipmentPlaceholder: "Search by name, type or capacity",
    resultSingular: "match",
    resultPlural: "matches",
    noResults: "No equipment matches that search",
    noResultsHint:
      "Try a broader term, or browse by category. If you need something not listed here, send us the requirement and we will tell you what we can supply.",
    clearSearch: "Clear search",
    quoteChecklist: "What to tell us for a fast quote",
    quoteChecklistNote:
      "Send what you know. We will come back on anything missing.",
    relatedService: "Part of",
    established: "Established",
    coverage: "Coverage",
    experience: "Industry experience",
    yearsPlus: "30+ years",
    equipmentGroups: "Equipment groups",
    location: "Location",
  },

  form: {
    legendContact: "Your details",
    legendRequirement: "Your requirement",
    name: "Full name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    equipment: "Equipment or service needed",
    equipmentPlaceholder: "Select equipment or a service",
    location: "Project location",
    duration: "Rental period",
    durationPlaceholder: "e.g. 3 months, or single lift",
    message: "Requirement details",
    messagePlaceholder:
      "Tell us about the lift, load or transportation you need, including site, timing and any access constraints.",
    required: "Required",
    optional: "Optional",
    successTitle: "Request received",
    successBody:
      "Thank you. Your request has been sent to our team and we will get back to you.",
    successReference: "Your reference",
    successFollowUp: "Quote this reference if you follow up by email:",
    draftRestored: "We kept what you had already typed.",
    errorTitle: "We could not send your request",
    errorTooMany:
      "Too many requests from this connection. Please wait a few minutes and try again.",
    errorBody:
      "Sorry, we couldn't send your request. Please try again, or email us directly.",
    invalidEmail: "Please enter a valid email address.",
    invalidName: "Please enter your name.",
    invalidMessage: "Please describe what you need.",
    consent:
      "By submitting this form you agree to be contacted about your enquiry.",
    honeypot: "Do not fill this field",
  },

  footer: {
    tagline:
      "Heavy equipment rental and transportation solutions across the Kingdom of Saudi Arabia since 1992.",
    quickLinks: "Company",
    equipment: "Equipment",
    contact: "Contact",
    rights: "All rights reserved.",
    address: "Address",
    phone: "Phone",
    email: "Email",
    website: "Website",
    privacy: "Privacy policy",
    terms: "Terms of use",
    sitemap: "Sitemap",
  },

  breadcrumb: {
    home: "Home",
    label: "Breadcrumb",
  },

  notFound: {
    title: "Page not found",
    body: "The page you're looking for doesn't exist or has moved.",
  },
};

export type Dictionary = typeof en;
