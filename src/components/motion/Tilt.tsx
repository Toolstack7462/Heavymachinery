"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Very small pointer-driven perspective tilt for equipment cards.
 *
 * Deliberate limits, because industrial buyers are scanning a catalogue and
 * not watching a demo reel:
 *  - maximum ±4.5° of rotation, easing back to flat on leave
 *  - fine-pointer devices only (`hover: hover and pointer: fine`), so touch
 *    users get no tilt, no jitter and no wasted main-thread work
 *  - disabled outright under `prefers-reduced-motion` (handled in CSS)
 *  - transform-only (no layout properties), so it stays on the compositor
 *  - keyboard focus is untouched: the card is still a plain link inside
 *
 * IMPLEMENTATION NOTE — why this is hand-rolled rather than a motion library:
 * this effect and the hero parallax were the only two consumers of `motion`,
 * which cost a ~120 KB chunk on every route that renders a card grid. Both are
 * fine-pointer-only, so mobile visitors downloaded the library and never saw
 * the effect. The same result is two CSS custom properties, one rAF-throttled
 * pointer handler and a transition — so the dependency is gone.
 *
 * The angles are written to `--tilt-x` / `--tilt-y` and consumed by the
 * `.tilt` rule in globals.css, which also owns the easing and the
 * reduced-motion and coarse-pointer opt-outs. Keeping the media queries in CSS
 * means the server-rendered markup is already correct and nothing has to be
 * re-decided after hydration.
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
  const ref = useRef<HTMLDivElement>(null);
  /** Pending rAF id, so a burst of pointermove events costs one write a frame. */
  const frame = useRef(0);

  function apply(rotateX: number, rotateY: number) {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
  }

  return (
    <div
      ref={ref}
      className={className ? `tilt ${className}` : "tilt"}
      style={{ "--tilt-x": "0deg", "--tilt-y": "0deg" } as CSSProperties}
      onPointerMove={(event) => {
        // Mouse only. A stylus or touch contact should never start this.
        if (event.pointerType !== "mouse") return;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        if (frame.current) cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          node.dataset.tilting = "true";
          apply(-py * max * 2, px * max * 2);
        });
      }}
      onPointerLeave={() => {
        if (frame.current) cancelAnimationFrame(frame.current);
        const node = ref.current;
        if (!node) return;
        // Drop the tracking flag so the longer easing takes over on the way back.
        delete node.dataset.tilting;
        apply(0, 0);
      }}
    >
      {children}
    </div>
  );
}
