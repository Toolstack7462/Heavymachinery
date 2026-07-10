/**
 * INSIGHTS / BLOG — starter articles (original, educational, non-promotional).
 * These are genuine evergreen guides, safe to publish. Add more by appending.
 * Body is simple markdown-ish paragraphs and headings rendered by the article
 * page. Replace author/date when the client confirms editorial ownership.
 */
export interface Insight {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date — editable. */
  date: string;
  readMinutes: number;
  /** Array of blocks: { type: "h2" | "p" | "ul", ... } */
  body: InsightBlock[];
}

export type InsightBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export const insights: Insight[] = [
  {
    slug: "choosing-the-right-excavator",
    title: "How to Choose the Right Excavator for Your Site",
    excerpt:
      "Matching excavator class, reach and attachments to the job saves cost and keeps your programme on track. Here is a practical guide.",
    category: "Equipment Guides",
    date: "2025-01-15",
    readMinutes: 5,
    body: [
      {
        type: "p",
        text: "Choosing the right excavator is about matching the machine to the ground, the access and the task. Too small and you lose productivity; too large and you pay for capacity you cannot use — or cannot fit on site.",
      },
      { type: "h2", text: "Start with access and space" },
      {
        type: "p",
        text: "Confined or urban sites often call for mini excavators (3.5–5.5 tonne classes) or wheel excavators that reposition quickly on paved surfaces. Open earthworks sites can take larger tracked machines for higher output.",
      },
      { type: "h2", text: "Consider reach and depth" },
      {
        type: "p",
        text: "For deep excavation, slope work or high-reach demolition, long-boom (long-reach) excavators extend your working envelope safely. For standard digging and loading, a conventional tracked excavator is usually the most productive choice.",
      },
      { type: "h2", text: "Think about attachments" },
      {
        type: "ul",
        items: [
          "Buckets for digging, loading and grading",
          "Breakers for rock and demolition",
          "Operated hire when you need output without sourcing operators",
        ],
      },
      {
        type: "p",
        text: "If you are unsure, share your task, ground conditions and access with our team and we will recommend the right class and configuration.",
      },
    ],
  },
  {
    slug: "operated-vs-bare-rental",
    title: "Operated vs Bare Rental: Which Is Right for You?",
    excerpt:
      "Should you hire machinery with an operator or run it with your own crew? The answer depends on skills, risk and duration.",
    category: "Rental Tips",
    date: "2025-02-10",
    readMinutes: 4,
    body: [
      {
        type: "p",
        text: "One of the first decisions when renting heavy equipment is whether to take it bare (dry) or operated. Both have their place — the right choice depends on your team, the task and how long you need the machine.",
      },
      { type: "h2", text: "When operated rental makes sense" },
      {
        type: "ul",
        items: [
          "You need output quickly without sourcing and vetting operators",
          "The task is specialised — lifting, precision grading, demolition",
          "You want to keep operator competency and safety with the supplier",
        ],
      },
      { type: "h2", text: "When bare rental makes sense" },
      {
        type: "ul",
        items: [
          "You have trained, certified operators in-house",
          "The machine is needed for a longer duration",
          "You want full control over deployment across your site",
        ],
      },
      {
        type: "p",
        text: "Cranes and heavy transport are typically supplied operated for safety and compliance. For most other plant, we offer both options — ask us and we will advise on the best fit.",
      },
    ],
  },
  {
    slug: "planning-a-safe-lift",
    title: "Planning a Safe Lift: A Simple Checklist",
    excerpt:
      "Every safe lift starts before the crane arrives. Use this checklist to plan lifts that protect people and keep work on schedule.",
    category: "Safety",
    date: "2025-03-05",
    readMinutes: 6,
    body: [
      {
        type: "p",
        text: "Lifting operations carry real risk, but almost every incident is preventable with planning. A good lift plan answers the basic questions before the crane is on site.",
      },
      { type: "h2", text: "Know the load" },
      {
        type: "p",
        text: "Confirm the weight, dimensions and lifting points of the load. Never estimate the weight of a critical lift — verify it.",
      },
      { type: "h2", text: "Assess the ground and position" },
      {
        type: "p",
        text: "Check ground bearing capacity, outrigger positions, overhead obstructions and the swing radius. Choose a crane with adequate capacity at the required radius — not just the maximum rating.",
      },
      { type: "h2", text: "Plan the method and people" },
      {
        type: "ul",
        items: [
          "Agree a method statement and rigging plan",
          "Assign a competent lift supervisor, operator and signaller",
          "Brief the team and establish exclusion zones",
        ],
      },
      {
        type: "p",
        text: "Our crane services are supplied with trained crews and lift planning support. Share your lift details and we will help you plan it safely.",
      },
    ],
  },
];

export function getInsightBySlug(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug);
}
