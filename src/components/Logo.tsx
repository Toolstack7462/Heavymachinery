import Link from "next/link";
import { site } from "@/config/site";
import { localeHref } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Original RASIKH logo lockup: an angular amber "monolith" mark (three
 * ascending blades suggesting solidity + forward motion) beside the wordmark.
 * Fully SVG, theme-independent, no external assets. Replace with the client's
 * real logo by editing this component (mark) and `site.logoText`.
 */
export function LogoMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="10" fill="var(--color-ink-900)" />
      {/* three ascending amber blades */}
      <path d="M12 34V22l5-3v15z" fill="var(--color-brand-500)" />
      <path d="M21.5 34V16l5-3v21z" fill="var(--color-brand-400)" />
      <path d="M31 34V10l5-3v27z" fill="var(--color-brand-300)" />
      <path
        d="M11 37h26"
        stroke="var(--color-brand-500)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  locale,
  className,
  invert = false,
}: {
  locale: string;
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link
      href={localeHref(locale, "/")}
      className={cn(
        "inline-flex items-center gap-2.5 group",
        className,
      )}
      aria-label={`${site.fullName} — home`}
    >
      <LogoMark size={38} className="transition-transform duration-200 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading font-extrabold tracking-tight text-xl",
            invert ? "text-white" : "text-ink-900",
          )}
        >
          {site.logoText}
        </span>
        <span
          className={cn(
            "text-[0.62rem] font-semibold uppercase tracking-[0.18em] mt-0.5",
            invert ? "text-brand-300" : "text-brand-700",
          )}
        >
          Heavy Equipment · Qatar
        </span>
      </span>
    </Link>
  );
}
