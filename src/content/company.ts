/**
 * ============================================================================
 *  COMPANY CONTENT — About, Leadership, Vision/Mission, Why-Us, Industries,
 *  Safety, Values, Stats.
 * ============================================================================
 *  All copy is ORIGINAL, describing the same business scope as the profile.
 *
 *  UNVERIFIED CLAIMS POLICY:
 *  - `stats` (500+ projects / 500+ clients from the profile) are marked
 *    `verified: false` and are DISABLED by default via `SHOW_STATS`. Enable
 *    only after the client confirms the numbers.
 *  - Leadership names/titles come from the profile; confirm before publishing
 *    a rebranded site. No testimonials or client logos are invented.
 * ============================================================================
 */

/** Master switch — keep false until the client confirms the figures. */
export const SHOW_STATS = false;

export interface Stat {
  value: string;
  label: string;
  verified: boolean;
}

/** From the profile — UNVERIFIED for a rebrand. Gated by SHOW_STATS. */
export const stats: Stat[] = [
  { value: "500+", label: "Projects supported", verified: false },
  { value: "500+", label: "Clients served", verified: false },
  { value: "13+", label: "Years in Qatar", verified: true },
  { value: "20+", label: "Equipment types", verified: true },
];

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export const values: Value[] = [
  {
    title: "Safety First",
    description:
      "Every lift, load and excavation is planned around the safety of our people, our clients and the public. Safe methods are non-negotiable.",
    icon: "shield",
  },
  {
    title: "Reliability",
    description:
      "Well-maintained machinery, trained operators and dependable scheduling keep your programme moving without surprises.",
    icon: "clock",
  },
  {
    title: "Quality",
    description:
      "We hold ourselves to high standards of workmanship and equipment condition, delivering results our clients can build on.",
    icon: "medal",
  },
  {
    title: "Partnership",
    description:
      "We build long-term relationships based on trust, clear communication and a genuine commitment to our clients' success.",
    icon: "handshake",
  },
];

/** Why-choose-us points — original rewrite of the profile's list. */
export const whyChooseUs: Value[] = [
  {
    title: "Qatar & GCC focus",
    description:
      "Deep local experience in Qatar's construction and contracting needs, with practical knowledge of how projects run here.",
    icon: "map",
  },
  {
    title: "Modern fleet",
    description:
      "A broad range of heavy construction equipment — excavators, dozers, loaders, rollers, cranes and more — kept in strong working condition.",
    icon: "excavator",
  },
  {
    title: "Efficient & technology-driven",
    description:
      "Well-specified machinery and disciplined operations for higher productivity, safety and performance on site.",
    icon: "gauge",
  },
  {
    title: "Cost-effective solutions",
    description:
      "Competitive rates and flexible rental terms that deliver strong value for your project budget.",
    icon: "tag",
  },
  {
    title: "Flexible terms",
    description:
      "Daily, weekly and monthly rental options to suit projects of every scale and duration.",
    icon: "calendar",
  },
  {
    title: "Logistics capacity",
    description:
      "Strong storage and transport capability ensuring equipment availability and timely deployment where you need it.",
    icon: "truck",
  },
  {
    title: "Skilled team",
    description:
      "Trained, experienced operators and support staff for reliable service and professional handling of every machine.",
    icon: "users",
  },
  {
    title: "Single-source solution",
    description:
      "Rental, earthworks, transport, lifting, demolition and contracting from one accountable partner.",
    icon: "layers",
  },
];

export interface Industry {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const industries: Industry[] = [
  {
    slug: "construction-building",
    title: "Construction & Building",
    description:
      "Plant, lifting and earthworks support for residential, commercial and mixed-use construction projects.",
    icon: "building",
  },
  {
    slug: "infrastructure-roads",
    title: "Infrastructure & Roads",
    description:
      "Earthmoving, grading, compaction and haulage for roads, utilities and public infrastructure works.",
    icon: "road",
  },
  {
    slug: "industrial-oil-gas",
    title: "Industrial, Oil & Gas",
    description:
      "Heavy lifting, transport and equipment support for industrial facilities and energy-sector sites.",
    icon: "factory",
  },
  {
    slug: "demolition-remediation",
    title: "Demolition & Site Clearance",
    description:
      "Controlled demolition, muck-away and clearance to prepare sites safely for redevelopment.",
    icon: "demolition",
  },
  {
    slug: "landscaping-development",
    title: "Landscaping & Development",
    description:
      "Compact plant and finishing equipment for landscaping, site development and precision works.",
    icon: "tree",
  },
  {
    slug: "events-temporary-works",
    title: "Events & Temporary Works",
    description:
      "Generators, telehandlers and support plant for temporary installations and short-term projects.",
    icon: "power",
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

/** Vision / Mission — original rewrites. */
export const visionMission = {
  vision:
    "To be the preferred partner for heavy equipment rental and contracting in Qatar and across the GCC — setting the standard for reliability, safety and value through people, equipment and disciplined operations.",
  mission:
    "To support Qatar's growth and infrastructure development by delivering dependable heavy equipment and contracting solutions — executed safely, on time and to a high standard, while building lasting relationships with the clients we serve.",
};

/**
 * Leadership — sourced from the profile. `placeholder: true` means the value
 * needs client confirmation before publishing a rebranded site.
 * No photos are invented; a neutral monogram is shown until a photo is added.
 */
export interface Leader {
  name: string;
  role: string;
  bio: string;
  placeholder: boolean;
}

export const leadership: Leader[] = [
  {
    name: "Abid Ali Hazrat Said",
    role: "Chief Executive Officer",
    bio: "Our Chief Executive leads the company with a focus on integrity, professionalism and customer satisfaction. Under this leadership the business has built its reputation on quality service, a modern fleet and a commitment to supporting Qatar's construction and infrastructure sectors.",
    placeholder: true,
  },
];

/** Safety & Quality commitments — original, non-certified claims only. */
export const safetyCommitments: Value[] = [
  {
    title: "Method-led lifting & excavation",
    description:
      "Lifts and excavations are planned with method statements and risk assessments before work begins.",
    icon: "clipboard",
  },
  {
    title: "Trained, competent operators",
    description:
      "Our operators are experienced and trained in the safe operation of the machinery they run.",
    icon: "users",
  },
  {
    title: "Maintained, inspected equipment",
    description:
      "Preventive maintenance and pre-use checks keep machinery reliable and safe on site.",
    icon: "wrench",
  },
  {
    title: "Environmental responsibility",
    description:
      "Demolition and earthworks follow environmental regulations, with responsible waste handling and clean-up.",
    icon: "leaf",
  },
];

/**
 * NOTE: Formal certifications (ISO, OSHAD, etc.) are intentionally OMITTED.
 * Add them only when the client provides verified certificate numbers.
 */
