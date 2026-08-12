"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/**
 * Very small pointer-driven perspective tilt for equipment cards.
 *
 * Deliberate limits, because industrial buyers are scanning a catalogue and
 * not watching a demo reel:
 *  - maximum ±4.5° of rotation, springing back to flat on leave
 *  - fine-pointer devices only (`hover: hover and pointer: fine`), so touch
 *    users get no tilt, no jitter and no wasted main-thread work
 *  - disabled outright under `prefers-reduced-motion`
 *  - transform-only (no layout properties), so it stays on the compositor
 *  - keyboard focus is untouched: the card is still a plain link inside
 */
export function Tilt({
  children,
  className,
  max = 4.5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.4 };
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), spring);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), spring);

  if (reduce) return <div className={className}>{children}</div>;

  const finePointer = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || !finePointer()) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
