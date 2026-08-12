"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { images, unsplash } from "@/config/images";
import type { Locale } from "@/config/site";

/**
 * Hero photograph with a very small pointer-driven parallax.
 *
 * The image is inset-scaled by 4% so it can move ~10px in either axis without
 * exposing an edge. Fine-pointer devices only, off under reduced motion, and
 * transform-only so it never triggers layout. The scrim is a sibling so the
 * text contrast never moves with the picture.
 */
export function HeroMedia({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 24, mass: 0.6 };
  const x = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), spring);
  const y = useSpring(useTransform(py, [-0.5, 0.5], [-6, 6]), spring);

  const picture = (
    <Image
      src={unsplash(images.hero.id, 1920, 78)}
      alt={locale === "ar" ? images.hero.altAr : images.hero.alt}
      fill
      priority
      sizes="100vw"
      className="scale-[1.04] object-cover object-center"
    />
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-ink-950"
      onPointerMove={
        reduce
          ? undefined
          : (event) => {
              if (event.pointerType !== "mouse") return;
              if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
                return;
              const rect = event.currentTarget.getBoundingClientRect();
              px.set((event.clientX - rect.left) / rect.width - 0.5);
              py.set((event.clientY - rect.top) / rect.height - 0.5);
            }
      }
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {reduce ? (
        <div className="absolute inset-0">{picture}</div>
      ) : (
        <motion.div className="absolute inset-0" style={{ x, y }}>
          {picture}
        </motion.div>
      )}

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
