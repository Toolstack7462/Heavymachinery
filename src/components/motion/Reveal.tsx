import type { CSSProperties, ReactNode } from "react";

/**
 * Section entrance reveal — progressive enhancement, not a JavaScript gate.
 *
 * The server renders this element fully VISIBLE and marks it `data-reveal`.
 * The hidden start state is applied by CSS only when the runtime has flagged
 * the document with `.js` (see the inline flag in the locale layout), and only
 * when the visitor has not asked for reduced motion. So:
 *   - no JavaScript, or a failed bundle → the copy is simply there
 *   - a crawler that does not execute scripts → indexes real, visible content
 *   - `prefers-reduced-motion: reduce` → no hidden state, no transition
 *
 * Movement is deliberately small: 12px and one 0.5s ease, applied to section
 * blocks and card grids — never to individual paragraphs.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Seconds. Use small increments (0.05–0.08) to stagger a grid. */
  delay?: number;
  className?: string;
}) {
  const style =
    delay > 0
      ? ({ "--reveal-delay": `${delay}s` } as CSSProperties)
      : undefined;

  return (
    <div data-reveal className={className} style={style}>
      {children}
    </div>
  );
}
