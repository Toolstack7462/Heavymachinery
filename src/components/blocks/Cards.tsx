import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/config/site";
import { localeHref, cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/Icon";
import { Tilt } from "@/components/motion/Tilt";
import type { ServiceItem } from "@/content/services";
import type { EquipmentItem } from "@/content/equipment";
import { getCategoryMeta, equipmentHighlight } from "@/content/equipment";
import type { Industry, ValueItem } from "@/content/company";
import { equipmentImage, unsplash } from "@/config/images";

/**
 * Card elevation rule: resting state is a solid 1px border and no shadow —
 * the "hairline border + wide soft shadow at rest" combination is the tell of
 * a template. Depth appears only on hover, as a lift cue.
 */
const cardBase =
  "group flex h-full flex-col rounded-2xl border border-ink-150 bg-white transition-[border-color,box-shadow,transform] duration-300 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]";

function IconTile({
  name,
  className,
  size = 24,
}: {
  name: IconName;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-colors duration-300 group-hover:bg-brand-100",
        className,
      )}
    >
      <Icon name={name} size={size} />
    </span>
  );
}

/**
 * Card headings take their level from context, because the same card appears
 * in two places: as the page's own list (index pages, where it follows the h1
 * and must be an h2) and inside a titled section (homepage, related equipment,
 * where the section owns the h2 and the card is an h3). Hard-coding h3
 * produced an h1 → h3 skip on /fleet, /services and /industries.
 */
type HeadingLevel = 2 | 3;

function CardHeading({
  level = 3,
  className,
  children,
}: {
  level?: HeadingLevel;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return <Tag className={className}>{children}</Tag>;
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
      {label}
      <Icon
        name="arrowRight"
        size={16}
        className="transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
      />
    </span>
  );
}

export function ServiceCard({
  locale,
  service,
  cta,
  headingLevel,
}: {
  locale: Locale;
  service: ServiceItem;
  cta: string;
  headingLevel?: HeadingLevel;
}) {
  return (
    <Link
      href={localeHref(locale, `/services/${service.slug}`)}
      className={cn(cardBase, "p-6")}
    >
      <IconTile name={service.icon} />
      <CardHeading
        level={headingLevel}
        className="mt-5 text-lg font-bold text-ink-900 transition-colors group-hover:text-brand-700"
      >
        {service.title[locale]}
      </CardHeading>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.summary[locale]}
      </p>
      <CardArrow label={cta} />
    </Link>
  );
}

export function EquipmentCard({
  locale,
  item,
  cta,
  headingLevel,
}: {
  locale: Locale;
  item: EquipmentItem;
  cta: string;
  headingLevel?: HeadingLevel;
}) {
  const photo = equipmentImage(item.slug);
  const category = getCategoryMeta(item.category);
  const highlight = equipmentHighlight(item);

  return (
    <Tilt className="h-full">
      <Link
        href={localeHref(locale, `/fleet/${item.slug}`)}
        className={cn(cardBase, "overflow-hidden")}
      >
        <div className="relative h-44 overflow-hidden bg-ink-900">
          {photo ? (
            <Image
              src={unsplash(photo.id, 640, 70)}
              alt={locale === "ar" ? photo.altAr : photo.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            /*
             * No verified photograph of this machine type exists, so the panel
             * carries the item's most useful documented fact instead of a
             * decorative glyph: the capacity range for cranes, the equipment
             * type for everything else. An empty frame says "no inventory";
             * "55 T – 3200 T" says the opposite.
             */
            <div className="flex h-full flex-col justify-center px-5">
              <div
                className="absolute inset-0 bg-grid-dark opacity-60"
                aria-hidden="true"
              />
              <Icon
                name={item.icon}
                size={24}
                className="relative mb-3 text-brand-300"
              />
              {highlight && (
                <p
                  dir="ltr"
                  className="relative font-heading text-[1.75rem] font-extrabold leading-none tracking-tight text-white tabular-nums rtl:text-end"
                >
                  {highlight.value[locale]}
                </p>
              )}
            </div>
          )}
          <span
            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-950/85 to-transparent"
            aria-hidden="true"
          />
          <span className="absolute bottom-3 start-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
            <Icon name={category.icon} size={14} />
            {category.title[locale]}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <CardHeading
            level={headingLevel}
            className="text-lg font-bold text-ink-900 transition-colors group-hover:text-brand-700"
          >
            {item.name[locale]}
          </CardHeading>
          <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
            {item.summary[locale]}
          </p>
          <CardArrow label={cta} />
        </div>
      </Link>
    </Tilt>
  );
}

export function IndustryCard({
  locale,
  industry,
  headingLevel,
}: {
  locale: Locale;
  industry: Industry;
  headingLevel?: HeadingLevel;
}) {
  return (
    <div
      id={industry.slug}
      className={cn(cardBase, "scroll-mt-24 flex-row gap-5 p-6")}
    >
      <IconTile name={industry.icon} className="shrink-0" size={24} />
      <div>
        <CardHeading
          level={headingLevel}
          className="text-lg font-bold text-ink-900"
        >
          {industry.title[locale]}
        </CardHeading>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {industry.description[locale]}
        </p>
      </div>
    </div>
  );
}

export function ValueCard({
  locale,
  value,
}: {
  locale: Locale;
  value: ValueItem;
  /** 1-based index, shown as a quiet ordinal for short value sets. */
}) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-ink-150 bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-brand-200 hover:shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-4">
        <IconTile name={value.icon} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink-900">
        {value.title[locale]}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {value.description[locale]}
      </p>
    </div>
  );
}
