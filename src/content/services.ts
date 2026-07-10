/**
 * ============================================================================
 *  SERVICES — central data source
 * ============================================================================
 *  Drives /services index and each /services/[slug] detail page.
 *  Content is rewritten in original wording from the business scope described
 *  in the supplied profile. No project claims, client names or statistics.
 * ============================================================================
 */

export interface ServiceItem {
  slug: string;
  title: string;
  /** Card & hero one-liner. */
  tagline: string;
  summary: string;
  /** Detail-page body paragraphs. */
  body: string[];
  /** What the service includes. */
  features: string[];
  /** Related equipment category or slugs shown as cross-links. */
  relatedEquipment: string[];
  icon: string;
}

export const services: ServiceItem[] = [
  {
    slug: "heavy-equipment-rental",
    title: "Heavy Equipment Rental",
    tagline: "A modern fleet, ready when you are.",
    summary:
      "Daily, weekly and monthly rental of excavators, loaders, dozers, graders, rollers and more — bare or operated.",
    body: [
      "We provide comprehensive, reliable rental of heavy equipment and construction machinery to support projects of every size across Qatar. From bulk earthmoving plant to compact machines for confined sites, our fleet is maintained to a high standard and backed by experienced operators.",
      "Rent bare or fully operated, on flexible daily, weekly or monthly terms. Our team helps you match the right machine to the task, coordinates delivery, and keeps your programme moving with dependable availability.",
    ],
    features: [
      "Excavators, wheel & backhoe loaders, dozers, graders, rollers, skid steers",
      "Bare rental or operated with trained crews",
      "Flexible daily / weekly / monthly terms",
      "Well-maintained machinery & preventive servicing",
      "Delivery & mobilisation across Qatar",
    ],
    relatedEquipment: ["excavators", "wheel-loaders", "dozers", "graders"],
    icon: "excavator",
  },
  {
    slug: "earthworks",
    title: "Earthworks & Earthmoving",
    tagline: "Solid ground for every project.",
    summary:
      "Excavation, cut-and-fill, grading, compaction and site preparation delivered by plant and operators as a package.",
    body: [
      "Our earthworks capability covers excavation, bulk earthmoving, grading, compaction and site preparation. We mobilise the right combination of excavators, loaders, dozers, graders and rollers with skilled operators to deliver productive, well-controlled earthworks.",
      "Whether preparing a site for construction, forming roads and platforms, or shaping large-scale developments, we focus on accuracy, productivity and safe working methods on every front.",
    ],
    features: [
      "Bulk & detailed excavation",
      "Cut-to-fill & site levelling",
      "Grading, compaction & sub-base preparation",
      "Trenching for utilities & drainage",
      "Plant + operator packages",
    ],
    relatedEquipment: ["excavators", "dozers", "graders", "rollers"],
    icon: "dozer",
  },
  {
    slug: "heavy-transport",
    title: "Heavy Transport & Logistics",
    tagline: "Moving heavy loads, safely and on time.",
    summary:
      "Low-bed and flatbed transport of plant and oversized loads, plus dump-truck haulage for bulk material.",
    body: [
      "We move heavy machinery, oversized loads and bulk material across Qatar using low-bed and flatbed trailers and a fleet of dump trucks. Experienced transport crews handle loading, securing and legal, safe movement between sites.",
      "From mobilising plant to a new work front to hauling aggregates and removing spoil, our logistics support keeps materials and equipment where they need to be, when they need to be there.",
    ],
    features: [
      "Low-bed transport of tracked & oversized plant",
      "40ft flatbed haulage",
      "Dump-truck haulage of aggregates & spoil",
      "Loading, securing & escorting",
      "Reliable scheduling & coordination",
    ],
    relatedEquipment: ["low-bed-trailers", "flatbed-trailers", "dump-trucks"],
    icon: "truck",
  },
  {
    slug: "lifting-crane-services",
    title: "Lifting & Crane Services",
    tagline: "Precise, planned, certified lifting.",
    summary:
      "Mobile cranes (50T–100T), truck-mounted cranes and telehandlers with trained crews and lift planning.",
    body: [
      "Our lifting services combine mobile cranes up to 100 tonnes, truck-mounted cranes and telehandlers with trained operators and a disciplined approach to lift planning. We support structural lifts, precast placement, equipment positioning and general site handling.",
      "Safety leads every lift. We plan the method, assess the ground and loads, and execute with certified crews so materials are placed accurately and without incident.",
    ],
    features: [
      "Mobile cranes: 50 T · 65 T · 100 T",
      "Truck-mounted cranes: 5 T · 7 T · 10 T",
      "Telehandlers for reach & height",
      "Lift planning & method statements",
      "Certified operators & rigging crews",
    ],
    relatedEquipment: ["mobile-cranes", "truck-mounted-cranes", "telehandlers"],
    icon: "crane",
  },
  {
    slug: "demolition",
    title: "Demolition Services",
    tagline: "Controlled, safe, environmentally responsible.",
    summary:
      "Planned demolition of structures with the right machinery, strict safety and clean waste removal.",
    body: [
      "We deliver safe, efficient and well-planned demolition for a wide range of structures. Our team brings the right machinery and technical expertise to carry out controlled demolition works with strict adherence to safety standards and environmental regulations.",
      "From method planning and utility isolation through to breaking, sorting and clearing, we manage demolition end to end — including muck-away and site clean-up — so the site is left ready for what comes next.",
    ],
    features: [
      "Controlled structural demolition",
      "Excavator-mounted breakers & shears",
      "Safety- & environment-led method planning",
      "Waste sorting, muck-away & clean-up",
      "Site clearance & handover",
    ],
    relatedEquipment: ["excavators", "long-boom-excavators", "dump-trucks"],
    icon: "demolition",
  },
  {
    slug: "contracting",
    title: "Contracting & Project Execution",
    tagline: "A single-source partner from start to finish.",
    summary:
      "General contracting works with reliable project management, quality execution and timely completion.",
    body: [
      "Beyond equipment and services, we undertake a wide range of contracting works — delivering quality execution, dependable project management and timely completion. We coordinate plant, people and logistics into a single, accountable delivery.",
      "Successful projects depend on clear communication and strong coordination. We foster collaboration among project teams, operators, supervisors and site personnel to keep operations smooth, productive and safe from start to finish.",
    ],
    features: [
      "General contracting works",
      "Single-source plant, labour & logistics",
      "Project coordination & management",
      "Quality-focused execution",
      "On-programme, on-standard delivery",
    ],
    relatedEquipment: ["excavators", "wheel-loaders", "mobile-cranes"],
    icon: "contracting",
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((s) => s.slug === slug);
}
