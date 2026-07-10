import Link from "next/link";
import type { Locale } from "@/config/site";
import { localeHref, cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import type { ServiceItem } from "@/content/services";
import type { EquipmentItem } from "@/content/equipment";
import type { Industry, Value } from "@/content/company";
import type { Insight } from "@/content/insights";

/** A reusable icon tile. */
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
      className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] hover:border-brand-200 hover:shadow-[var(--shadow-elevated)]"
    >
      <IconTile name={service.icon} />
      <h3 className="mt-5 text-xl font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
        {service.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
        {service.summary}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        {cta}
        <Icon
          name="arrowRight"
          size={16}
          className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
        />
      </span>
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
  return (
    <Link
      href={localeHref(locale, `/fleet/${item.slug}`)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] hover:border-brand-200 hover:shadow-[var(--shadow-elevated)]"
    >
      {/* Visual placeholder tile — replace with real equipment photography */}
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-ink-900 to-ink-700">
        <div className="absolute inset-0 bg-grid opacity-10" aria-hidden="true" />
        <Icon name={item.icon} size={64} className="relative text-brand-400" />
        <span className="absolute bottom-2 end-3 text-[10px] font-medium uppercase tracking-wider text-ink-400">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
          {item.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed flex-1">
          {item.summary}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
          {cta}
          <Icon
            name="arrowRight"
            size={16}
            className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
          />
        </span>
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
      className="group flex gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-300 hover:border-brand-200 hover:shadow-[var(--shadow-card)]"
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
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-card)]">
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
      className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 active:scale-[0.99] hover:border-brand-200 hover:shadow-[var(--shadow-elevated)]"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
        {insight.category}
      </span>
      <h3 className="mt-3 text-lg font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
        {insight.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
        {insight.excerpt}
      </p>
      <span className="mt-4 text-xs text-ink-500">
        {insight.readMinutes} {readLabel}
      </span>
    </Link>
  );
}
