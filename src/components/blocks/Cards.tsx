import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/config/site";
import { localeHref, cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import type { ServiceItem } from "@/content/services";
import type { EquipmentItem } from "@/content/equipment";
import type { Industry, Value } from "@/content/company";
import type { Insight } from "@/content/insights";
import { equipmentImage, categoryImages, unsplash } from "@/config/images";

/**
 * Card elevation rule (avoids the "ghost card" 1px-border + wide-shadow tell):
 * resting state = solid border only; shadow appears on hover as a lift cue.
 */
const cardBase =
  "group flex flex-col rounded-2xl border border-ink-150 bg-white transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] hover:border-brand-200 hover:shadow-[var(--shadow-elevated)]";

function IconTile({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100",
        className,
      )}
    >
      <Icon name={name} size={24} />
    </span>
  );
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
      {label}
      <Icon
        name="arrowRight"
        size={16}
        className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
      />
    </span>
  );
}

export function ServiceCard({
  locale,
  service,
  cta,
}: {
  locale: Locale;
  service: ServiceItem;
  cta: string;
}) {
  return (
    <Link
      href={localeHref(locale, `/services/${service.slug}`)}
      className={cn(cardBase, "p-6")}
    >
      <IconTile name={service.icon} />
      <h3 className="mt-5 text-xl font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
        {service.summary}
      </p>
      <CardArrow label={cta} />
    </Link>
  );
}

export function EquipmentCard({
  locale,
  item,
  cta,
}: {
  locale: Locale;
  item: EquipmentItem;
  cta: string;
}) {
  const photo = equipmentImage(item.slug) ?? categoryImages[item.category];
  return (
    <Link
      href={localeHref(locale, `/fleet/${item.slug}`)}
      className={cn(cardBase, "overflow-hidden")}
    >
      <div className="relative h-44 overflow-hidden bg-ink-900">
        {photo ? (
          <Image
            src={unsplash(photo.id, 640, 70)}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="absolute inset-0 bg-grid opacity-10" aria-hidden="true" />
            <Icon name={item.icon} size={56} className="relative text-brand-400" />
          </div>
        )}
        <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/70 to-transparent" aria-hidden="true" />
        <span className="absolute bottom-2.5 start-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
          <Icon name={item.icon} size={14} />
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
          {item.name}
        </h3>
        <p className="mt-1.5 flex-1 text-sm text-muted-foreground leading-relaxed">
          {item.summary}
        </p>
        <CardArrow label={cta} />
      </div>
    </Link>
  );
}

export function IndustryCard({
  locale,
  industry,
}: {
  locale: Locale;
  industry: Industry;
}) {
  return (
    <Link
      href={localeHref(locale, `/industries#${industry.slug}`)}
      className="group flex gap-4 rounded-2xl border border-ink-150 bg-white p-5 transition-all duration-300 hover:border-brand-200 hover:shadow-[var(--shadow-elevated)]"
    >
      <IconTile name={industry.icon} className="shrink-0" />
      <div>
        <h3 className="font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
          {industry.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {industry.description}
        </p>
      </div>
    </Link>
  );
}

export function ValueCard({ value }: { value: Value }) {
  return (
    <div className="rounded-2xl border border-ink-150 bg-white p-6">
      <IconTile name={value.icon} />
      <h3 className="mt-4 text-lg font-bold text-ink-900">{value.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {value.description}
      </p>
    </div>
  );
}

export function InsightCard({
  locale,
  insight,
  readLabel,
}: {
  locale: Locale;
  insight: Insight;
  readLabel: string;
}) {
  return (
    <Link
      href={localeHref(locale, `/insights/${insight.slug}`)}
      className={cn(cardBase, "p-6")}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
        {insight.category}
      </span>
      <h3 className="mt-3 text-lg font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
        {insight.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
        {insight.excerpt}
      </p>
      <span className="mt-4 text-xs text-ink-500">
        {insight.readMinutes} {readLabel}
      </span>
    </Link>
  );
}
