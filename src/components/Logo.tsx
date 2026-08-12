import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import { brand } from "@/config/images";
import { localeHref, cn } from "@/lib/utils";

/**
 * OFFICIAL BRAND LOCKUP.
 *
 * The emblem is the client's official mark, extracted from the supplied
 * Logo.pdf at native resolution with its transparency intact. It is never
 * recoloured, redrawn, stretched or cropped — only scaled proportionally.
 *
 * The supplied artwork is 177×172px, so the emblem is only ever rendered
 * small (≤56px in the header, ≤72px in the footer) where it stays crisp; the
 * company name is set in type beside it. That is also the correct way to use a
 * detailed circular seal: the seal carries the identity, the wordmark carries
 * the legibility.
 */
export function LogoMark({
  size = 44,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const height = Math.round((size * brand.emblemHeight) / brand.emblemWidth);
  return (
    <Image
      src={brand.emblem}
      alt=""
      width={size}
      height={height}
      priority={priority}
      className={className}
      aria-hidden="true"
    />
  );
}

export function Logo({
  locale,
  className,
  invert = false,
  size = 42,
  priority = false,
}: {
  locale: string;
  className?: string;
  invert?: boolean;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={localeHref(locale, "/")}
      // min-h-[44px] so the lockup is a full-size touch target; the header is
      // 76px tall, so this costs no layout.
      className={cn(
        "group inline-flex min-h-[44px] items-center gap-2.5 rounded-sm",
        className,
      )}
      aria-label={`${site.fullName} — ${
        locale === "ar" ? "الصفحة الرئيسية" : "home"
      }`}
    >
      <LogoMark
        size={size}
        priority={priority}
        className="shrink-0 transition-transform duration-300 group-hover:scale-[1.04]"
      />
      {/*
        The wordmark stays LTR even on Arabic pages: bidi reordering would move
        the full stop in "YANBU EST." to the front of the line (".YANBU EST").
      */}
      <span dir="ltr" className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-[1.0625rem] font-extrabold uppercase tracking-[0.02em]",
            invert ? "text-white" : "text-ink-900",
          )}
        >
          {site.logoText}
        </span>
        <span
          className={cn(
            "mt-1 font-heading text-[0.6875rem] font-semibold uppercase tracking-[0.16em]",
            invert ? "text-ink-300" : "text-ink-600",
          )}
        >
          {site.logoSubText}
        </span>
      </span>
    </Link>
  );
}
