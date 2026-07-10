# Design

Visual system for the RASIKH heavy-equipment site. Premium light corporate,
industrial amber on white/graphite. Tokens live in `src/app/globals.css`
(`@theme`); imagery in `src/config/images.ts`.

## Theme

Light, high-contrast, industrial. The physical scene: a procurement officer or
site engineer in Qatar, on a phone in bright sun, judging competence in seconds.
Legibility and real machinery photography carry the weight; chrome stays quiet.

Color strategy: **Restrained-committed** — white/graphite surface, a single
saturated amber accent (≤10% of surface) plus graphite mass for CTAs, footer and
image scrims. Amber is voice, not decoration.

## Color

| Role | Token | Value |
|------|-------|-------|
| Accent / CTA | `--color-brand-500` | `#f5a623` |
| Accent hover | `--color-brand-600` | `#d9820f` |
| Ink / heading | `--color-ink-900` | `#1a1d21` |
| Body text | `--color-muted-foreground` | `#4d5865` |
| Background | `--color-background` | `#ffffff` |
| Muted surface | `--color-surface-muted` | `#f6f7f9` |
| Border | `--color-border` | `#e5e8ec` |

Full amber (50–950) and ink (50–950) ramps defined in `@theme`. Body text meets
≥4.5:1; amber is used with graphite text (dark-on-amber) for CTAs, never as light
text on white.

## Typography

- **Headings:** Lexend (geometric, engineered, confident).
- **Body:** Source Sans 3 (humanist, highly legible at small sizes / on mobile).
- Paired on a contrast axis (geometric display + humanist text), one accent each.
- Display H1 `clamp` max ≈ 3.75rem (60px), letter-spacing `-0.02em` (not cramped).
- `text-wrap: balance` on headings, `pretty` on prose; body line-height 1.6.

## Motion

Restrained and functional: 150–300ms ease transitions, hover lift + `active:scale`
press feedback, `group-hover` image scale on cards. Full `prefers-reduced-motion`
fallback in `globals.css`. No scroll-jacking, no per-section fade reflex.

## Imagery

Real, verified heavy-equipment photography (Unsplash, free license) at decisive
moments — hero, fleet category tiles, equipment detail, an About capability band.
Individual SKUs without a verified matching photo fall back to an engineered
graphite panel + line glyph (honest, never a mislabelled stock shot). Swap for the
client's owned photography via `src/config/images.ts`.

## Components & layout

- `container-page` max-width 80rem; `.section` vertical rhythm (4rem → 6rem).
- Cards: 16–20px radius, **border at rest, shadow only on hover** (no ghost-card
  border+shadow pairing). Icon tiles at 48px on amber-tint with a 1px ring.
- Custom SVG icon system (`components/Icon.tsx`) — equipment glyphs hand-authored,
  UI glyphs from Lucide; one stroke language, never emoji.
- Interior pages: `PageHero` with a graphite/amber left marker (no repeated
  uppercase eyebrow kicker). One deliberate kicker on the home hero only.
- Full RTL support; logical properties (`ms/me/ps/pe`, `start/end`).

## Anti-patterns actively avoided

Eyebrow-on-every-section, identical endless card grids, ghost cards, gradient text,
side-stripe borders, over-rounding (>24px), zero-imagery on an imagery brief,
invented trust signals.
