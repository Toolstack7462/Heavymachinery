/**
 * FAQs — original, honest answers. Also feed the FAQPage JSON-LD.
 * Avoid unverifiable specifics (exact rates, delivery times) — keep editable.
 */
export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What areas in Qatar do you serve?",
    answer:
      "We provide heavy equipment rental and contracting services across Qatar. Contact us with your site location and we will confirm mobilisation and logistics for your project.",
  },
  {
    question: "Do you offer bare rental or operated equipment?",
    answer:
      "Both. Most machines are available as bare (dry) rental or fully operated with trained operators. Cranes and heavy transport are typically supplied operated, with certified crews.",
  },
  {
    question: "What rental terms are available?",
    answer:
      "We offer flexible daily, weekly and monthly rental terms to suit projects of every scale. Longer-term hire and project packages can be arranged — request a quote and we will tailor the terms.",
  },
  {
    question: "Which equipment do you have in your fleet?",
    answer:
      "Our fleet includes excavators (including mini, wheel and long-boom), wheel and backhoe loaders, bulldozers, motor graders, compaction rollers, skid steers, mobile and truck-mounted cranes, telehandlers, forklifts, dump trucks, low-bed and flatbed trailers, generators and air compressors.",
  },
  {
    question: "Can you deliver equipment to my site?",
    answer:
      "Yes. We operate low-bed and flatbed trailers and can mobilise plant to your site across Qatar. Delivery is arranged as part of your rental or project scope.",
  },
  {
    question: "Do you handle demolition and contracting works?",
    answer:
      "Yes. Alongside equipment rental we carry out controlled demolition and a range of contracting works, managing method planning, safety, waste removal and site clearance end to end.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Use the Request a Quote form with your equipment or project requirements, or contact us directly by phone or WhatsApp. We will respond with availability and pricing.",
  },
  {
    question: "How large a crane can you provide?",
    answer:
      "Our mobile crane fleet includes 50, 65 and 100-tonne capacities, plus truck-mounted cranes for smaller lifts. Share your lift details and we will recommend the right crane and lift plan.",
  },
];
