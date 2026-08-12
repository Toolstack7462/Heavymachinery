import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";

type Variant = "primary" | "secondary" | "outline" | "onDark" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Buttons carry the interaction feedback for the whole site: a 150ms colour
 * transition, a 1px lift on hover, a real press state, and a trailing icon
 * that steps forward on hover (mirrored in RTL). Minimum height is 44px so
 * every button is a comfortable touch target on site, in gloves, on a phone.
 */
const base =
  "group/btn inline-flex min-h-[44px] cursor-pointer select-none items-center justify-center gap-2 rounded-lg font-heading font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_1px_2px_rgba(11,20,40,0.12)] hover:-translate-y-px hover:bg-brand-700 hover:shadow-[0_8px_20px_-10px_rgba(44,71,166,0.7)] focus-visible:outline-brand-600",
  secondary:
    "bg-ink-900 text-white hover:-translate-y-px hover:bg-ink-800 hover:shadow-[0_8px_20px_-12px_rgba(11,20,40,0.55)] focus-visible:outline-ink-900",
  outline:
    "border border-ink-200 bg-white text-ink-900 hover:border-brand-600 hover:text-brand-700 focus-visible:outline-brand-600",
  onDark:
    "border border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-white/70 hover:bg-white/10 focus-visible:outline-white",
  ghost:
    "text-ink-700 hover:bg-ink-50 hover:text-ink-900 focus-visible:outline-brand-600",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-6 py-3.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconEnd?: string;
  className?: string;
  children: ReactNode;
}

interface LinkButtonProps extends CommonProps {
  href: string;
  external?: boolean;
}

interface NativeButtonProps
  extends CommonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  href?: undefined;
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const {
    variant = "primary",
    size = "md",
    icon,
    iconEnd,
    className,
    children,
  } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon && <Icon name={icon} size={18} className="shrink-0" />}
      <span>{children}</span>
      {iconEnd && (
        <Icon
          name={iconEnd}
          size={18}
          className="shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5"
        />
      )}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const {
    type = "button",
    // strip non-DOM props before spreading onto <button>
    variant: _v,
    size: _s,
    icon: _i,
    iconEnd: _ie,
    className: _c,
    children: _ch,
    ...rest
  } = props as NativeButtonProps;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
