# Design

Visual system for the Jowain Yanbu Est. site. **Premium light industrial
corporate**: white and cool blue-grey surfaces, deep navy anchors, one blue
primary and one green support accent. Tokens live in `src/app/globals.css`
(`@theme`); photography in `src/config/images.ts`.

## Deriving the palette from the logo

The official emblem (`public/brand/jowain-emblem.png`, extracted from the
supplied `Logo.pdf`) is drawn in two screen primaries: **`#0000FF`** blue and
**`#00FF00`** green. Those are correct for the trademark and unusable as
interface colour — they vibrate on white and fail small-text contrast.

The system therefore keeps the emblem's two **hue families** — blue ≈ 228°, green
≈ 140° — at professional saturation and lightness, and never touches the emblem
itself.

## Colour

| Role | Token | Value | Contrast on white |
| --- | --- | --- | --- |
| Primary interactive | `--color-brand-600` | `#2c47a6` | 8.21:1 |
| Link / hover text | `--color-brand-700` | `#233a85` | 10.42:1 |
| Accent on dark | `--color-brand-500` | `#3f61c4` | 5.65:1 |
| Support accent | `--color-accent-500` | `#22955d` | 3.80:1 — icons and large text only |
| Support accent text | `--color-accent-600` | `#17784a` | 5.49:1 |
| Ink / headings | `--color-ink-900` | `#14203a` | 16.19:1 |
| Body text | `--color-muted-foreground` | `#4b5876` | 7.10:1 |
| Background | `--color-background` | `#ffffff` | — |
| Muted surface | `--color-surface-muted` | `#f5f7fb` | — |
| Border | `--color-border` | `#e4e9f2` | — |

Full blue, green and navy ramps (50–950) are defined in `@theme`. Brand colour is
kept to roughly a tenth of the surface: rules, icons, links, primary buttons and
dark section backgrounds. Everything else is neutral.

Green is a **support** accent — fact-rail icons, checkmarks, the accent rule on
dark bands, success states. It never competes with blue for calls to action.

## Typography

| Role | Face | Notes |
| --- | --- | --- |
| Headings, UI, numerals | **Archivo** 500–800 | Tight industrial grotesque; `-0.02em` tracking |
| Body | **Source Sans 3** 400–700 | Humanist, open apertures, built for long-form UI reading |
| Arabic (both roles) | **Noto Sans Arabic** 400–700 | Swapped in at the root on `/ar`; tracking reset to 0, leading raised to 1.85 |

The pair sits on a real **contrast axis** — grotesque display against humanist
body. The obvious pairing (Archivo + Inter) puts two neo-grotesques together,
which reads as one slightly inconsistent family rather than two deliberate
voices, and Inter is the most-defaulted interface face on the web.

Scale: h1 `2rem → 3.5rem`, h2 `1.75rem → 2.25rem`, h3 `1.125rem`, body
`1rem`, small `0.875rem`. Long-form copy uses `.prose-article` at
`1.0625rem/1.75`.

**Measure is capped in `ch`, not pixels.** `.prose-article` and the `.measure`
utility both cap at `68ch`; `.measure-tight` at `58ch`. This matters: swapping
the body face from a grotesque to a humanist widened every paragraph by ~18
characters at an identical pixel width. A `max-w-3xl` says nothing about how
many characters are on the line — `68ch` says exactly that, in any face.

## Rhythm and shape

- Section padding `3.5rem` mobile → `5.5rem` desktop.
- Container `80rem`, gutters `1.25rem` → `2rem`.
- Radii stop at `0.75rem` (`--radius-2xl`). No 30–40px pills.
- Cards rest on a 1px border with **no** shadow; `--shadow-lift` appears on hover
  only. The "hairline border + wide soft shadow at rest" combination is the
  template tell this system avoids.
- Section headers use a 40×3px **brand rule**, not a tiny uppercase eyebrow.
  The eyebrow style survives in exactly one place: above the homepage H1.

## Dark bands

Deep navy (`--color-ink-900` / `950`) with `bg-grid-dark` texture is used for the
hero, the "Why choose Jowain?" section, conversion bands, the contact location
band and the footer. Four to five per page maximum, always as punctuation between
light sections.

Text on navy: `ink-100` (16.2:1), `ink-200` (13.6:1), `ink-300` (9.0:1) and
`ink-400` (5.7:1) all pass AA. **`ink-500` on `ink-900` measures 3.4:1 and must
not carry text** — the footer's small print uses `ink-400` for that reason.

## Imagery

Photography is licensed Unsplash stock, each frame opened and checked against the
label it carries. There is **no category-level fallback image**: equipment
without a verified photograph of that exact machine type renders a navy panel
with the fine grid and its line glyph. That keeps the catalogue honest — a
procurement engineer reads a wrong photo as a specification error.

Client marks in `public/clients/` are sliced from the client-supplied board at
native resolution, keep their own trademark colours, and are optically balanced
by a per-mark `scale` factor rather than forced to identical pixel dimensions.

## Motion

| Where | What | Limits |
| --- | --- | --- |
| Section entrances | opacity + 12px rise, once | CSS + one IntersectionObserver; hidden state only applies when JS is present |
| Equipment cards | pointer tilt, `rotateX/Y` | ±4.5°, spring back, **mouse + fine pointer only** |
| Hero photograph | pointer parallax | ±10px / ±6px on a 4% inset scale |
| Buttons | 1px lift, press scale `0.985`, icon steps 2px | 150ms |
| Client marks | border tint + soft shadow | no scale, no greyscale |

Rules: `prefers-reduced-motion: reduce` removes the hidden start state and all
transitions; nothing loops; nothing animates on touch that depends on hover;
no scroll-jacking; no WebGL.

## RTL

Layout is built on logical properties (`ps/pe`, `start/end`, `inset-inline`), so
`dir="rtl"` mirrors it without overrides. Specific RTL handling:

- The hero scrim gradient flips (`rtl:bg-gradient-to-l`) so Arabic copy keeps the
  same contrast the English copy has.
- Arrow icons rotate 180°; hover translation reverses.
- The `YANBU EST.` wordmark and standalone figures like `30+` are marked
  `dir="ltr"` so bidi does not move their punctuation.
- Arabic headings reset the negative tracking and gain leading.

## Accessibility targets

WCAG 2.1 AA. Single `h1` per page, landmark structure, skip link, visible
2px focus ring at `--color-ring`, labelled form fields with errors tied by
`aria-describedby`, `aria-current` on active nav, alt text written as
description, and no information conveyed by hover alone.

**Touch targets are 44×44 minimum, verified by measurement** (509 interactive
elements across 12 mobile renders in both locales). Where a control should stay
visually small — breadcrumbs, footer link lists, contact rows — the hit area is
grown with padding and pulled back with negative margin (`-my-3 py-3`) so the
target and the visual size are allowed to differ. Footer lists relax to their
tight desktop rhythm from `lg` up, where the input device is a mouse.

Two rules the framework does not give you for free:

- Tailwind v4's preflight leaves `<button>` on the default arrow cursor; a base
  rule restores `cursor: pointer` on every interactive element.
- The blanket `prefers-reduced-motion` override would freeze the submit
  spinner. Loading indicators are *essential* motion under WCAG 2.3.3, so
  `.animate-spin` is exempted and simply runs slower (1.6s).
