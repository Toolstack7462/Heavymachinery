/**
 * English dictionary — UI chrome + section copy. Page-level marketing content
 * for services/equipment lives in src/content/*. This is the canonical shape;
 * ar.ts must satisfy `Dictionary`.
 */
export const en = {
  meta: {
    localeLabel: "English",
    translationPending: "",
  },
  nav: {
    home: "Home",
    about: "About",
    leadership: "Leadership",
    services: "Services",
    fleet: "Fleet & Equipment",
    industries: "Industries",
    projects: "Projects",
    safety: "Safety & Quality",
    whyUs: "Why Choose Us",
    faqs: "FAQs",
    insights: "Insights",
    contact: "Contact",
    quote: "Request a Quote",
  },
  actions: {
    requestQuote: "Request a Quote",
    getQuote: "Get a Quote",
    callNow: "Call Now",
    whatsapp: "WhatsApp",
    viewFleet: "View Fleet",
    exploreServices: "Explore Services",
    learnMore: "Learn More",
    viewDetails: "View Details",
    viewAll: "View All",
    backTo: "Back to",
    readMore: "Read More",
    submit: "Submit Request",
    sending: "Sending…",
    send: "Send Message",
    contactUs: "Contact Us",
    getInTouch: "Get in Touch",
  },
  hero: {
    eyebrow: "Heavy Equipment Rental & Contracting · Qatar",
    title: "Powering Qatar's Progress",
    subtitle:
      "A single-source partner for heavy equipment rental, earthworks, transport, lifting, demolition and contracting — backed by a modern fleet and trained crews.",
    primaryCta: "Request a Quote",
    secondaryCta: "Explore Our Fleet",
    trust: "Trusted for reliable plant and dependable service across Qatar.",
  },
  sections: {
    servicesTitle: "What We Do",
    servicesSubtitle:
      "End-to-end heavy equipment and contracting solutions, delivered safely and on time.",
    fleetTitle: "Our Fleet",
    fleetSubtitle:
      "A broad range of well-maintained machinery for projects of every scale.",
    industriesTitle: "Industries We Serve",
    industriesSubtitle:
      "Supporting construction, infrastructure, industrial and demolition projects across Qatar.",
    whyTitle: "Why Choose Us",
    whySubtitle:
      "Local experience, a modern fleet and a genuine commitment to safety and service.",
    ctaTitle: "Ready to move your project forward?",
    ctaSubtitle:
      "Tell us what you need and our team will respond with availability and pricing.",
    valuesTitle: "What We Stand For",
    quoteTitle: "Request a Quote",
    quoteSubtitle:
      "Share your equipment or project requirements and we will get back to you quickly.",
    faqTitle: "Frequently Asked Questions",
    contactTitle: "Contact Us",
    relatedEquipment: "Related Equipment",
    relatedServices: "Related Services",
    exploreCategory: "Explore Category",
  },
  form: {
    name: "Full Name",
    company: "Company",
    email: "Email",
    phone: "Phone / WhatsApp",
    service: "Service / Equipment Needed",
    servicePlaceholder: "Select a service",
    duration: "Rental Duration",
    location: "Project Location",
    message: "Message / Requirements",
    messagePlaceholder: "Tell us about your project or the equipment you need…",
    required: "Required",
    optional: "Optional",
    successTitle: "Request received",
    successBody:
      "Thank you — your request has been received. Our team will get back to you shortly.",
    errorTitle: "Something went wrong",
    errorBody:
      "Sorry, we couldn't send your request. Please try again, or contact us directly by phone or WhatsApp.",
    invalidEmail: "Please enter a valid email address.",
    invalidName: "Please enter your name.",
    invalidMessage: "Please add a short message.",
    consent:
      "By submitting, you agree to be contacted about your enquiry. See our Privacy Policy.",
  },
  footer: {
    tagline: "Heavy equipment rental & contracting across Qatar.",
    quickLinks: "Quick Links",
    ourServices: "Our Services",
    contact: "Contact",
    followUs: "Follow Us",
    rights: "All rights reserved.",
    address: "Address",
    phone: "Phone",
    email: "Email",
    hours: "Hours",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    sitemap: "Sitemap",
    builtNote:
      "This is a demonstration build. Brand name and some details are editable placeholders.",
  },
  breadcrumb: {
    home: "Home",
  },
  notFound: {
    title: "Page not found",
    body: "The page you're looking for doesn't exist or has moved.",
    cta: "Back to Home",
  },
};

export type Dictionary = typeof en;
