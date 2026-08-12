import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

export function Section({
  children,
  className,
  muted = false,
  dark = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  muted?: boolean;
  dark?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "section",
        muted && "bg-surface-muted",
        dark && "bg-ink-900 text-ink-100",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

/**
 * Section header. A short brand rule sets the rhythm instead of the tiny
 * uppercase eyebrow label repeated above every heading — the rule reads as
 * engineering, the repeated label reads as a template.
 */
export function SectionHeader({
  title,
  subtitle,
  align = "left",
  dark = false,
  className,
}: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <span
        className={cn("rule", align === "center" && "mx-auto")}
        aria-hidden="true"
      />
      <h2
        className={cn(
          "mt-5 text-[1.75rem] sm:text-3xl md:text-4xl",
          dark && "text-white",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "measure mt-4 text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto",
            dark ? "text-ink-300" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
