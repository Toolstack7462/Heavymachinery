import Image from "next/image";
import type { Locale } from "@/config/site";
import { clientLogos } from "@/content/clients";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Client logo wall.
 *
 * Rules this grid follows, and why:
 *  - Marks keep their own trademark colours. Recolouring a client's logo into
 *    the Jowain palette (or greyscaling it) misrepresents their brand.
 *  - Each cell is a fixed box and every mark is `object-contain`, so nothing is
 *    stretched. A per-mark `scale` nudges wide-thin and near-square marks
 *    toward equal *optical* weight rather than equal pixel dimensions.
 *  - 5 across on desktop, 3 on tablet, 2 on mobile; white cells, one hairline
 *    border, no carousel, no heavy shadow.
 */
export function ClientWall({
  locale,
  limit,
  className,
}: {
  locale: Locale;
  /** Render only the first N marks (used on the homepage). */
  limit?: number;
  className?: string;
}) {
  const logos = limit ? clientLogos.slice(0, limit) : clientLogos;

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4",
        className,
      )}
    >
      {logos.map((client, index) => (
        <li key={client.slug}>
          <Reveal delay={Math.min(index, 9) * 0.03}>
            <div className="flex h-24 items-center justify-center rounded-xl border border-ink-150 bg-white px-4 transition-[border-color,box-shadow] duration-300 hover:border-brand-200 hover:shadow-[var(--shadow-card)] sm:h-28 sm:px-6">
              <Image
                src={`/clients/${client.slug}.png`}
                alt={client.alt[locale]}
                width={client.width}
                height={client.height}
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 22vw, 170px"
                className="h-auto w-auto object-contain"
                style={{
                  maxHeight: `${Math.round(58 * client.scale)}px`,
                  maxWidth: `${Math.round(100 * client.scale)}%`,
                }}
              />
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
