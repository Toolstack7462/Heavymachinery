"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { images, photoSrc } from "@/config/images";
import type { Locale } from "@/config/site";

/**
 * Hero photograph with a very small pointer-driven parallax.
 *
 * The image is inset-scaled by 4% so it can move ~10px in either axis without
 * exposing an edge. Fine-pointer devices only, off under reduced motion, and
 * transform-only so it never triggers layout. The scrim is a sibling so the
 * text contrast never moves with the picture.
 *
 * IMPLEMENTATION NOTE — this and `Tilt` were the only consumers of the
 * `motion` package, a ~120 KB chunk shipped to every visitor for two effects
 * that only fine-pointer devices ever see. The offsets are now two CSS custom
 * properties written from one rAF-throttled handler; `.hero-parallax` in
 * globals.css owns the easing and the reduced-motion and coarse-pointer
 * opt-outs. Identical result, no dependency, nothing shipped to phones.
 */
export function HeroMedia({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-ink-950"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const node = ref.current;
        if (!node) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        if (frame.current) cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          node.style.setProperty("--parallax-x", `${(px * 20).toFixed(2)}px`);
          node.style.setProperty("--parallax-y", `${(py * 12).toFixed(2)}px`);
        });
      }}
      onPointerLeave={() => {
        if (frame.current) cancelAnimationFrame(frame.current);
        const node = ref.current;
        if (!node) return;
        node.style.setProperty("--parallax-x", "0px");
        node.style.setProperty("--parallax-y", "0px");
      }}
    >
      <div
        ref={ref}
        className="hero-parallax absolute inset-0"
        style={{ "--parallax-x": "0px", "--parallax-y": "0px" } as CSSProperties}
      >
        <Image
          src={photoSrc(images.hero.id)}
          alt={locale === "ar" ? images.hero.altAr : images.hero.alt}
          fill
          priority
          sizes="100vw"
          className="scale-[1.04] object-cover object-center"
        />
      </div>

      {/*
        Legibility scrim: strongest at the copy edge, clearing over the machine.
        The direction flips in RTL so the Arabic copy — which sits on the right
        — gets the same contrast the English copy gets on the left.
      */}
      {/*
        Mobile keeps a much darker far stop. On a wide viewport the copy sits in
        the left third and the machine stays visible on the right, but at 390px
        the text spans the full width and runs into the bright sky: measured
        against the actual photograph, the tagline and subtitle fell to 2.4:1
        there. Darker below md, original composition from md up.
      */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/75 md:via-ink-950/85 md:to-ink-950/35 rtl:bg-gradient-to-l"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/45"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-grid-dark opacity-40" aria-hidden="true" />
    </div>
  );
}
