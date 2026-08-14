import type { SVGProps } from "react";
import {
  Shield,
  Medal,
  Handshake,
  Map,
  Gauge,
  Calendar,
  Users,
  Layers,
  Building2,
  Factory,
  Wrench,
  ClipboardCheck,
  Mail,
  MapPin,
  Globe,
  Check,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Truck,
  Forklift,
  Zap,
  Wind,
  Flame,
  Lightbulb,
  Search,
  type LucideIcon,
} from "lucide-react";

/**
 * Unified icon system.
 * - `equipmentGlyphs` are hand-authored line icons for machinery (Lucide has
 *   no crane, dozer, tanker or scissor lift), drawn on a 24×24 grid at 1.75
 *   stroke so they sit in the same visual language as Lucide.
 * - Everything else maps to Lucide.
 * Never use emoji as icons.
 */

const lucideMap: Record<string, LucideIcon> = {
  shield: Shield,
  medal: Medal,
  handshake: Handshake,
  map: Map,
  gauge: Gauge,
  calendar: Calendar,
  users: Users,
  layers: Layers,
  building: Building2,
  factory: Factory,
  wrench: Wrench,
  clipboard: ClipboardCheck,
  mail: Mail,
  mapPin: MapPin,
  globe: Globe,
  check: Check,
  chevronRight: ChevronRight,
  arrowRight: ArrowRight,
  menu: Menu,
  close: X,
  search: Search,
  truck: Truck,
  forklift: Forklift,
  power: Zap,
  generator: Zap,
  compressor: Wind,
  welder: Flame,
  towerLight: Lightbulb,
};

/** Hand-authored equipment glyphs. */
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
  crawlerCrane: (
    <>
      <path d="M3 21h10" />
      <path d="M3 19h10a2 2 0 0 0 0-2H3a2 2 0 0 0 0 2z" />
      <path d="M7 17V9" />
      <path d="M7 9l9-5" />
      <path d="M9.5 11.5l4.5-2.5" />
      <path d="M16 4v6" />
      <path d="M14.5 10h3" />
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
  scissorLift: (
    <>
      {/* platform, guard rail, double scissor pantograph, tracked base */}
      <path d="M4 7h13" />
      <path d="M4 7V4" />
      <path d="M17 7V4" />
      <path d="M6.5 9.5l8 4" />
      <path d="M14.5 9.5l-8 4" />
      <path d="M6.5 13.5l8 4" />
      <path d="M14.5 13.5l-8 4" />
      <path d="M3.5 19.5h14" />
      <circle cx="6.5" cy="21" r="1.1" />
      <circle cx="14.5" cy="21" r="1.1" />
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
  tanker: (
    <>
      <path d="M2 18h20" />
      <circle cx="7" cy="19.5" r="1.4" />
      <circle cx="17" cy="19.5" r="1.4" />
      <rect x="3" y="9" width="13" height="7" rx="3.5" />
      <path d="M16 16v-5h3l2 3v2" />
      <path d="M7.5 9v7M11.5 9v7" />
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
