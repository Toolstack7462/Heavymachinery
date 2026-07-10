import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-heading font-semibold rounded-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 disabled:pointer-events-none cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-ink-900 hover:bg-brand-600 hover:text-ink-900 shadow-[0_6px_20px_-8px_rgba(245,166,35,0.7)] hover:-translate-y-0.5",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800 hover:-translate-y-0.5 shadow-[0_6px_20px_-10px_rgba(16,17,20,0.6)]",
  outline:
    "border border-ink-200 bg-white text-ink-900 hover:border-ink-900 hover:bg-ink-50",
  ghost: "text-ink-700 hover:text-ink-900 hover:bg-ink-50",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1ebe5a] hover:-translate-y-0.5 shadow-[0_6px_20px_-10px_rgba(37,211,102,0.7)]",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2",
  md: "text-[0.95rem] px-5 py-2.5",
  lg: "text-base px-6 py-3.5",
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
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {iconEnd && <Icon name={iconEnd} size={18} />}
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
