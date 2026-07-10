import type { SVGProps } from "react";
import {
  Shield,
  Clock,
  Medal,
  Handshake,
  Map,
  Gauge,
  Tag,
  Calendar,
  Users,
  Layers,
  Building2,
  Factory,
  Trees,
  Wrench,
  Leaf,
  ClipboardCheck,
  Phone,
  Mail,
  MapPin,
  Globe,
  Check,
  Star,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Truck,
  Forklift,
  Zap,
  Quote,
  Route,
  type LucideIcon,
} from "lucide-react";

/**
 * Unified icon system.
 * - `equipmentGlyphs` are hand-authored line icons for machinery/services
 *   (Lucide has no excavator/dozer/crane), drawn on a 24×24 grid, 1.75 stroke.
 * - Everything else maps to Lucide for a single, consistent visual language.
 * Never use emoji as icons.
 */

const lucideMap: Record<string, LucideIcon> = {
  shield: Shield,
  clock: Clock,
  medal: Medal,
  handshake: Handshake,
  map: Map,
  gauge: Gauge,
  tag: Tag,
  calendar: Calendar,
  users: Users,
  layers: Layers,
  building: Building2,
  road: Route,
  factory: Factory,
  tree: Trees,
  wrench: Wrench,
  leaf: Leaf,
  clipboard: ClipboardCheck,
  phone: Phone,
  mail: Mail,
  mapPin: MapPin,
  globe: Globe,
  check: Check,
  star: Star,
  chevronRight: ChevronRight,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  menu: Menu,
  close: X,
  truck: Truck,
  forklift: Forklift,
  power: Zap,
  quote: Quote,
};

/** Hand-authored equipment/service glyphs. */
const equipmentGlyphs: Record<string, React.ReactNode> = {
  excavator: (
    <>
      <path d="M2 20h9" />
      <path d="M4 20v-3h5v3" />
      <circle cx="5" cy="20" r="1.4" />
      <circle cx="8.5" cy="20" r="1.4" />
      <path d="M9 15h3l1-3" />
      <path d="M13 12l4-5" />
      <path d="M17 7l3 1-1 3-3-1z" />
      <path d="M9 15v-2h3v2" />
    </>
  ),
  dozer: (
    <>
      <path d="M3 19h11" />
      <circle cx="5" cy="19" r="1.5" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="13" cy="19" r="1.5" />
      <path d="M4 17h10l-1-4H8l-2 2H4z" />
      <path d="M18 8v9" />
      <path d="M14 13h3" />
    </>
  ),
  loader: (
    <>
      <path d="M2 19h13" />
      <circle cx="6" cy="19" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
      <path d="M4 17h9v-4H8l-2 2H4z" />
      <path d="M13 15l5-3" />
      <path d="M18 12h4v4h-4z" />
    </>
  ),
  grader: (
    <>
      <path d="M2 19h18" />
      <circle cx="5" cy="19" r="1.5" />
      <circle cx="15" cy="19" r="1.5" />
      <circle cx="18" cy="19" r="1.5" />
      <path d="M4 17V9h5l4 3h4v5" />
      <path d="M6 17l6-5" />
    </>
  ),
  roller: (
    <>
      <path d="M3 20a4 4 0 1 0 0-.001Z" />
      <circle cx="7" cy="16" r="4" />
      <path d="M11 13h6v-3h-5l-1 3" />
      <path d="M17 12h3v4h-3" />
    </>
  ),
  crane: (
    <>
      <path d="M4 21h8" />
      <path d="M8 21V5" />
      <path d="M8 5H4l4-2 4 2H8" />
      <path d="M8 6h12" />
      <path d="M20 6l-3 3" />
      <path d="M17 9v3" />
      <path d="M15.5 12h3" />
    </>
  ),
  telehandler: (
    <>
      <path d="M2 19h12" />
      <circle cx="5" cy="19" r="1.6" />
      <circle cx="11" cy="19" r="1.6" />
      <path d="M3 17v-4h6v4" />
      <path d="M9 14l10-6" />
      <path d="M19 8h3" />
      <path d="M6 13V9h3" />
    </>
  ),
  trailer: (
    <>
      <path d="M2 17h20" />
      <path d="M2 17v-4h15v4" />
      <circle cx="6" cy="19" r="1.5" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
      <path d="M17 13h5" />
    </>
  ),
  demolition: (
    <>
      <path d="M3 21h12" />
      <path d="M5 21v-6l4-1v7" />
      <path d="M9 14l2-6" />
      <circle cx="12" cy="6" r="2.5" />
      <path d="M14 4l4-2" />
      <path d="M6 15l-2 2" />
    </>
  ),
  contracting: (
    <>
      <path d="M3 21h18" />
      <path d="M6 21V8l6-4 6 4v13" />
      <path d="M9 21v-5h6v5" />
      <path d="M9 11h2M13 11h2" />
    </>
  ),
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  const glyph = equipmentGlyphs[name];
  if (glyph) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={className}
        {...props}
      >
        {glyph}
      </svg>
    );
  }
  const LucideCmp = lucideMap[name];
  if (!LucideCmp) return null;
  return (
    <LucideCmp
      width={size}
      height={size}
      strokeWidth={1.75}
      aria-hidden="true"
      focusable="false"
      className={className}
    />
  );
}
