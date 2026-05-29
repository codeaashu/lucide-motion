# Signature animations — authoring guide

> ### Source of truth
>
> **`.claude/skills/lucide-signature.md` is the authoritative authoring guide for agents and humans.** It carries the current three principles, the Tier 1 vocabulary table, the three-criteria check for overlay markers, and the anti-pattern catalog. Read it first.
>
> This document is a deeper reference. Use it for:
>
> - Section 2 — file layout, match helpers, the `ctx` interface.
> - Section 4 — the long-form authoring workflow with code excerpts.
> - Section 5 — the bell worked example end-to-end.
> - Section 6 — the catalog of motions currently available (append rows when you add a motion).
> - Section 7 — the family roadmap and priority order.
> - Section 8 — the validation checklist.
>
> Sections 1 (principles), 3 (tier rule), 9 (known pitfalls) duplicate material from the skill at lower fidelity and may lag. When the skill and this doc disagree, the skill wins.

This is the contributor-facing reference for writing `mode="signature"` animations. It describes the architecture, the two-tier rule the project follows, the step-by-step workflow for adding a signature, and a roadmap of which icon families to tackle next.

---

## 1. Goals & principles

Every Lucide icon should eventually have a unique, true-to-life
animation when consumers set `mode="signature"`. The bar is the bell:
the shell rocks from its top mount, the clapper swings as a free
pendulum inside, sound waves radiate outward from the mount. Each
motion is physics-aware and characteristic to what the icon depicts.

Four principles govern every motion in this library — read these
before authoring or reviewing a signature, and re-read them when a
motion you wrote doesn't feel right:

**1. Real-life physics first — bespoke per object.** Each motion
must mimic how *this specific real-world thing* actually behaves.
A heart contracts during systole (squeezes inward, not balloons
out); a bell rocks from its top mount; sound waves radiate
outward from their source, not from the icon centre; flames
flicker in HEIGHT not width; a moon reflects light (opacity only)
rather than emitting it (no radial scale); a clock's hands tick
clockwise in discrete steps. Generic transforms (scale, rotate,
translate) without grounding in the icon's real-world referent
feel arbitrary — design from the question *"how does this
physically behave in reality?"* before you reach for a keyframe
array.

**Never default to a generic pulse / shake / spin** to make an
icon "feel alive." If you find yourself reaching for a uniform
scale pulse, ask whether the real-world referent has a more
specific behaviour — it almost always does. Signatures are about
the icon's identity, so every signature should have a motion that
*only makes sense for that icon*.

**Animate per path — Lucide's path list IS the icon's anatomy.**
Lucide draws each icon as a list of SVG `<path>` / `<circle>` /
`<rect>` strokes, and the split is anatomical: the clock face is
its own path, the hand-pair is another; the bell shell is one,
the clapper is another, each sound wave is its own; every rain
drop is its own stroke; the moon crescent and the star sparkle in
`moon-star` are separate. **Match per path and design a separate
motion for each anatomical role.** A clock isn't one motion — it's
a steady face (`clockFace`) plus a ticking hand-pair
(`clockHands`). A bell is `bellShell` plus `bellClapper` plus
`bellSoundWaves`. A flame-kindling is `flameFlicker` (the flame
itself) plus `flameKindlingEmbers` (the wood underneath). A
composite icon (`sun-moon`, `cloud-sun-rain`, `cloud-hail`) layers
bespoke per-element motions on top of the shared body — moon
glows, sun radiates, drop falls, hailstone twinkles, lightning
flashes — not one shared transform smeared across every path.

The judgement call is per-path, not per-icon: "Could this
anatomical part move independently of the rest of the icon in
reality?" If yes, it deserves its own motion module matched by
`d` data (`matchPathD`, `matchPathDOneOf`, regex over
`pathAttrs.d`, or geometric predicates). If no (rigid sub-part of
a larger piece), it can share its parent's motion via the host-
coupling pattern in section 5.

**2. Cohesion — every non-shell path shares kinetic life with the host.**
A modifier (`+`, `−`, `×`, `✓`, slash, notification dot, crack zigzag,
EKG trace) sitting statically over a moving host reads as clip art
floating over an animation. Both Tier 1 markers AND Tier 2 elements
need motion that shares the host's `times`, but the *mechanism*
depends on the host's transform shape:

- **In-plane host transforms** (rotation, uniform scale, translation):
  the path directly inherits the host transform via per-value
  `inherit: true`. Slash rocks with the bell, slash scales with the
  heart, EKG line contracts with the heart.
- **Axis-asymmetric host transforms** (`scaleY`-only blink,
  `scaleX`-only sway): direct inheritance distorts the marker (a 45°
  diagonal slash inheriting `scaleY`-only flattens horizontally). The
  path instead synthesizes an in-plane companion (uniform `scale` dip,
  `opacity` dip) pinned to the host's `times`. Precedent:
  `eyeModifierReveal`, which defines its own `scale: [1, 0.85, 1]`
  over `EYE_BLINK_KEYFRAMES.times`. Going fully rigid is also wrong;
  the skill's three-criteria check covers this.

See section 5's worked example for the in-plane case, and
`.claude/skills/lucide-signature.md` step 4 (tier-1 markers note) for
the asymmetric case + the three-criteria check.

**3. Stay within the 24×24 viewBox.** SVGs default to
`overflow: hidden`, so any motion that pushes the stroke past the
viewBox edges visibly clips at runtime. Scale-based motion is always
a contraction (`scale ≤ 1`), never an expansion — rest is the maximum
and active oscillates downward. That's anatomically accurate for most
icons anyway (real hearts squeeze, real bells stay the same size
while they rock), and it can never clip regardless of strokeWidth or
path position.

For motions that need to read as outward expansion (sun rays
radiating, sound waves emitting), the effect comes from contracting
the active cycle *inward from rest*, not from exceeding rest. The
eye reads "return to rest from contracted" as outward radiation.
Precedent: `sunRayPulse` uses `scale: [1, 0.94, 1]` — rays start at
their Lucide-default length, contract 6% mid-cycle, and return to
full at the end. The previous `[1, 1.06, 1]` was rejected as a
viewBox violation; see project memory
`feedback_scaled_stroke_viewbox.md`.

**4. Every `active` keyframe array starts AND ends at the rest
value.** When the active animation completes, the icon stays at the
final keyframe — there is no engine-level snap-back. If the cycle
doesn't return to rest, the icon visibly drifts away from its
Lucide-original glyph after a play, leaving it permanently off-model.

Author each keyframe array as a closed loop: `scale: [1, 0.94, 1]`,
`y: [0, -3, 3, 0]`, `opacity: [1, 0.3, 1]`. For loop-shaped motions
(rain/snow falling, drops fading) wrap the visible cycle in
opacity-covered teleport beats so the bookend frames land at rest
position invisibly — see `cloud-rain-drops.ts` for the
`y: [0, -3, -1.5, 1.5, 3, 0]` + `opacity: [1, 0, 1, 1, 0, 1]`
pattern. Rotations are the only exception: `rotate: [0, -360]` is
fine because Motion snaps to keyframe[0] on re-trigger, making
`-360 ≡ 0` indistinguishable from rest.

The `rest-cycle.test.ts` invariant test catches violations
automatically — it imports every motion in `src/modes/motions/`,
invokes the factory, and asserts each animated property in `active`
lands back at its `rest` value (literally for most, mod-360 for
rotations). Run `pnpm test` before committing a new motion.

Icons without a registered signature fall back to `mode="draw"` (the
default stroke-on) and emit a one-time dev warning. The fallback is a
**runtime safety net only** — coverage gaps stay visible during
development but never break consumer apps. **`draw` is never the
design answer for any icon**; every icon eventually gets a real
signature. If an icon's subject has no real-world physical motion
(typography, geometric primitives, brand marks, alignment indicators,
UI device depictions, emoji), assign it to one of the **abstract
archetypes** — the authoritative catalog lives in
`.claude/skills/lucide-signature.md` under step 1's "Abstract
archetype catalog," and the per-family routing lives in section 7
below.

## 2. How signatures work

A **signature** is a `Mode` value associated with a specific icon. The
generated wrapper for that icon (`src/generated/<name>.tsx`) imports
its signature and forwards it to `<DrawIcon signature={signature} />`.
When the consumer sets `mode="signature"`, the engine resolves to that
Mode and calls its factory once per path in the icon.

Signatures are built by composing **Motion modules**. A Motion is a
small self-describing per-path animation:

```ts
interface Motion {
  matches: (ctx: ModeContext) => boolean;     // does this motion drive this path?
  factory: (ctx: ModeContext) => Variants;    // how does the path animate?
}
```

The `compose()` helper assembles motions into a Mode. At render time,
the engine iterates over the icon's paths and calls the signature's
factory for each one. The factory tries each Motion's `matches`
predicate in order; the first that returns true provides the variants.
Paths that don't match anything fall back to the default `"draw"`
factory and emit a dev warning.

### File layout

```
  library workspace source tree
├── types.ts              Mode, ModeContext, Motion type definitions
├── compose.ts            compose(), matchPathD, matchPathDOneOf, matchAnyPath
├── resolve.ts            resolveMode() — picks the right Mode at render time
├── draw.ts               The default stroke-on draw factory
│
├── motions/              Per-path animation modules — the reusable units
│   ├── atom/
│   │   └── spin.ts       Tiny shared factories (spin math used by sun/loader/...)
│   │
│   ├── bell-shell.ts     Bell family — host (exports BELL_SHELL_KEYFRAMES)
│   ├── bell-clapper.ts
│   ├── bell-sound-waves.ts          rocks with shell (Tier 2)
│   ├── bell-modifier-reveal.ts      ±/✓/slash reveal + rocks with shell (Tier 1)
│   ├── bell-dot-reveal.ts           circle reveal + rocks with shell (Tier 1)
│   │
│   ├── heart-beat.ts     Heart family — host (exports HEART_BEAT_KEYFRAMES)
│   ├── heart-pulse-line.ts          EKG draw + beats with heart (Tier 2)
│   ├── heart-handshake-clasp.ts     whole-icon pulse (Tier 2; merged path)
│   ├── heart-modifier-reveal.ts     crack/+/-/×/slash reveal + beats with heart (Tier 1)
│   │
│   ├── modifier-reveal.ts  Generic (no host coupling) — reserved for hosts
│   │                       whose primary motion is itself a pure draw
│   │
│   ├── eye-blink.ts      Singleton hosts
│   ├── star-twinkle.ts
│   ├── sun-ray-pulse.ts  Sun family — wildcard ray-radiation pulse
│   ├── moon-glow.ts                  reflected-light crescent (sun-moon + moon + moon-star) (Tier 2)
│   ├── moon-star-twinkle.ts          moon-star's four-pointed sparkle (Tier 2)
│   ├── snowflake-twinkle.ts          sun-snow's ice-crystal sparkle (Tier 2)
│   │
│   ├── clock-face.ts     Clock family — face/arc subtle pulse (exports CLOCK_FACE_KEYFRAMES)
│   ├── clock-hands.ts                hand-pair clockwise tick
│   ├── clock-modifier-reveal.ts      ±/✓/arrow/alert reveal + breathes with face
│   │
│   ├── cloud-body.ts     Cloud family — body subtle pulse (exports CLOUD_BODY_KEYFRAMES)
│   ├── cloud-rain-drops.ts           rain/drizzle/hail-vertical/rain-wind draw-down (Tier 2)
│   ├── cloud-snow-dots.ts            snow + hail-round contraction twinkle (Tier 2)
│   ├── cloud-fog-streaks.ts          horizontal fog reveal + opacity drift (Tier 2)
│   ├── cloud-lightning-bolt.ts       lightning flash-flicker (Tier 2)
│   ├── cloud-modifier-reveal.ts      alert/check/slash/cog/arrows/sync reveal + breathes with body
│   │
│   ├── droplet-shimmer.ts            Droplet family — drop bob + contraction + opacity dim (Tier 2)
│   ├── droplet-modifier-reveal.ts    droplet-off slash reveal + breathes with droplet
│   │
│   ├── umbrella-canopy.ts            Umbrella family — gentle sway + canopy contraction (Tier 2)
│   ├── umbrella-modifier-reveal.ts   umbrella-off slash reveal + sways with canopy
│   │
│   ├── flame-flicker.ts              Flame family — contraction scaleY + sway + brightness flicker (Tier 2)
│   ├── flame-kindling-embers.ts      flame-kindling's crossed sticks — ember glow + slight inherited sway
│   ├── fire-extinguisher-ready.ts    fire-extinguisher's device-armed pulse (not flame physics)
│   │
│   └── loader-spin.ts
│
└── signatures/           One file per signed icon; thin compose() calls
    ├── bell.ts
    ├── bell-plus.ts
    ├── bell-minus.ts
    ├── bell-check.ts
    ├── bell-off.ts
    ├── bell-ring.ts
    ├── bell-dot.ts
    ├── heart.ts
    ├── eye.ts
    ├── star.ts
    ├── sun.ts
    └── loader.ts
```

### Match helpers

Three helpers cover almost every case:

```ts
matchPathD("M3.262 15.326…")     // matches one specific <path> by its d
matchPathDOneOf(d1, d2, d3)      // matches any of several known d strings
matchAnyPath                     // matches every path (whole-icon motion)
```

For non-path SVG elements (`<circle>`, `<rect>`, `<line>`), write a
custom predicate that inspects `ctx.pathTag` and `ctx.pathAttrs`.
Attribute values are typed `string | number`, so wrap in `String(...)`
to compare defensively — Lucide emits them as strings today but the
type allows either:

```ts
matches: (ctx) =>
  ctx.pathTag === "circle" &&
  String(ctx.pathAttrs.cx) === "18" &&
  String(ctx.pathAttrs.r) === "3",
```

### What `ctx` carries

```ts
interface ModeContext {
  iconName: string;                                // "bell", "heart", …
  index: number;                                   // path index in the icon
  pathTag: string;                                 // "path", "circle", …
  pathAttrs: Record<string, string | number>;      // the path's attrs
  duration: number;                                // resolved timing
  delay: number;
  stagger: number;
  easing: Easing | Easing[];
  repeat: number;
  pathLength: number;                              // measured via getTotalLength()
}
```

`duration`/`delay`/`stagger`/`easing`/`repeat` are fully resolved by
the time the factory runs (per-icon prop > `MotionIconConfig` >
mode-preferred defaults > engine defaults). Factories use them
verbatim — never hand-roll prop fallbacks inside a motion.

`pathLength` is the rendered element's real length in user units,
measured by the engine via `getTotalLength()` in a layout effect. It
exists because Motion's own `pathLength` value (the one you'd reach for
as `pathLength: [0, 1]` in a variant) permanently writes
`pathLength="1"` + `stroke-dasharray="1 1"` to the DOM. On
open-but-closing paths (gear, cloud, heart) that leftover dash pattern
produces a visible seam where the start and end meet. The default
`draw` mode and every bespoke signature motion now use `ctx.pathLength`
to set a real `stroke-dasharray` and animate `stroke-dashoffset`
directly, then clear both back to `0` via `transitionEnd` so the
resting stroke is solid and seam-free, matching Lucide's static SVG
visually.

**Authoring rule:** when a NEW motion needs a stroke-on reveal, mirror
the dasharray approach in `src/modes/draw.ts` (or any existing
modifier-reveal, e.g. `bell-modifier-reveal.ts`). Never reach for
Motion's `pathLength` value — that's the leftover-dash trap.

## 3. The two-tier rule

> The authoritative tier definitions (including the full Tier 1 marker vocabulary table sorted by Lucide-catalog frequency) live in `.claude/skills/lucide-signature.md`. The summary below is for context; route through the skill if they conflict.

The single most important judgment call when authoring a signature. For each non-base path in an icon, classify it into one of two tiers. Both tiers share kinetic life with the host (principle 2). The tier decides what *additional* motion the path gets and which mechanism it shares the host's kinetic life through.

**Tier 1 — UI / state markers.** Plus, minus, check, ×, slash, off-mark, dot indicator, alert, warning, question mark, arrow markers, percent, info, asterisk. Lucide uses a fixed vocabulary of these across the catalog (full table in the skill). These are abstract semantic decorations whose purpose is to *signify a state* (added, removed, confirmed, silenced, has-notification). They don't represent anything physical, so they don't get bespoke physics. They reveal quietly (`pathLength` + `opacity` for paths; `scale` + `opacity` for circles).

Use the family's **coupled** modifier reveal (`heartModifierReveal`, `bellModifierReveal`, `eyeModifierReveal`, etc.). Place it LAST in the compose `motions` list since it `matchAnyPath`. The kinetic companion follows the host-transform-shape rule from principle 2: directly inherit if the host is in-plane (bell rotation, heart uniform scale); synthesize an in-plane companion pinned to the host's `times` if the host is axis-asymmetric (eye `scaleY` blink). See section 5 for the in-plane worked example.

For circle markers (notification dots), build the family's geometry-matched equivalent (`bellDotReveal`).

Generic `modifierReveal` / `dotReveal` (no host coupling) stay
available for the rare case of a family whose host motion is itself a
pure draw — but for any family whose host transforms, build a
family-specific reveal.

**Tier 2 — Real-life-grounded elements.** Sound waves, flames, water
drops, smoke, sparkles, light rays, electricity, lightning bolts,
cracks, EKG traces — anything that depicts an actual physical
phenomenon. These get bespoke motion that mimics how the real thing
behaves: sound waves radiate outward, flames flicker, water drops
fall, smoke drifts upward, hearts contract, cracks split. The motion
*is* the icon's character.

If a Tier 2 element sits visually inside or attached to a transforming
host (e.g. `heart-pulse`'s EKG trace passes through the heart,
`heart-crack`'s zigzag sits on the heart's surface,
`bell-ring`'s sound waves hang off the bell mount), it ALSO inherits
the host's primary transform via the same per-value `inherit: true`
pattern — its bespoke physics and the host's motion run together
through motion's per-value transitions. Otherwise it'll float
statically over the moving host (see section 5).

**Concrete examples already in the codebase:**

| Path | Tier | Motion |
| --- | --- | --- |
| The bell shell + clapper | **host** | `bellShell` + `bellClapper` (pendulum physics; shell exports `BELL_SHELL_KEYFRAMES`) |
| `bell-plus` / `-minus` / `-check` / `-off`'s modifiers | 1 | `bellModifierReveal` — reveal + rocks with shell |
| `bell-dot`'s dot circle | 1 | `bellDotReveal` — circle reveal + rocks with shell |
| `bell-ring`'s sound waves | **2** | `bellSoundWaves` — radiates outward; also rocks with shell |
| `bell-electric`'s dome + base | **host** | `bellElectricBody` (rapid in-place buzz instead of pendulum rock; exports `BELL_ELECTRIC_BODY_KEYFRAMES`) |
| `bell-electric`'s signal arcs | **2** | `bellElectricSignal` — double-pulse radiation from the dome; also rocks with body |
| `bell-electric`'s contact button | 1 | `bellElectricButton` — opacity press-feedback; also rocks with body |
| `bell-electric`'s center spark | 1 | `bellElectricSpark` — scale + opacity flash in place; also rocks with body |
| The heart outline | **host** | `heartBeat` (lub-dub contraction; exports `HEART_BEAT_KEYFRAMES`) |
| `heart-plus` / `-minus` / `-x` / `-off`'s modifiers + `heart-crack`'s crack | 1 | `heartModifierReveal` — reveal + beats with heart |
| `heart-pulse`'s EKG trace | **2** | `heartPulseLine` — linear paper-tape draw; also beats with heart |
| `heart-handshake`'s merged heart+hands | **2** | `heartHandshakeClasp` — single soft pulse on a merged path |
| The clock face (circle in `clock`/`clock-1..12`, partial arcs in `clock-{alert,arrow-up,arrow-down,check,fading,plus}`) | **host** | `clockFace` — tiny scale+opacity pulse (exports `CLOCK_FACE_KEYFRAMES`); `clock-fading`'s 5 arc fragments cascade via stagger |
| The clock hand-pair (combined minute+hour stroke starting with `M12 6v…`) | **2** | `clockHands` — clockwise 6° tick (one minute step), hold, ease back |
| `clock-{alert,arrow-up,arrow-down,check,plus}`'s state markers | 1 | `clockModifierReveal` — pathLength + opacity reveal that also scales with the host `clockFace` |
| `sun-dim` / `sun-medium`'s body + rays | **2** | `sunRayPulse` — scale-outward + opacity dim, staggered so the rays cascade outward from the sun's centre |
| `sun-moon`'s moon crescent | **2** | `moonGlow` — opacity-only (reflects light, doesn't radiate) |
| `sun-moon`'s sun rays + quarter-arc | **2** | `sunRayPulse` — radiates with the same cascade as `sun-dim`/`sun-medium` |
| `sun-snow`'s snowflake arms | **2** | `snowflakeTwinkle` — opacity double-pulse sparkle, negligible scale wobble for cohesion |
| `sun-snow`'s sun half-arc + rays | **2** | `sunRayPulse` — signature pivots at (10, 12), the sun's actual centre, so rays radiate cleanly from it |
| `moon`'s crescent | **2** | `moonGlow` — opacity-only soft dim/recover (moon reflects light rather than emits) |
| `moon-star`'s crescent | **2** | `moonGlow` — same opacity-only glow; signature pivots at the star centre (20, 5), but opacity is unaffected |
| `moon-star`'s four-pointed sparkle | **2** | `moonStarTwinkle` — sharp scale + opacity twinkle, scaled in place around the star's own centre |

When in doubt, ask: "does this path depict an actual physical thing that has its own motion in the real world, or is it a marker?" If the former, design Tier 2 motion. If the latter, use the family's coupled modifier reveal. **Either way, the path shares kinetic life with the host** via the in-plane-vs-asymmetric mechanism in principle 2.

## 4. Authoring workflow

The end-to-end process for adding a signature to one icon. Repeat per
icon in the family you're working on.

### Step 1 — Inspect the icon

Open `src/generated/<icon-name>.tsx`. Look at the `nodes` array. Note:

- How many paths the icon has
- The `d` string (or geometry for `<circle>` / `<rect>`) of each
- Which path represents what in the real-world thing the icon depicts

Compare visually if needed — `https://lucide.dev/icons/<name>` shows
the rendered icon, or render it locally via the playground.

### Step 2 — Decide per-path motion

For each path, ask in order:

1. **Does an existing motion module already match this path?** Check
   `src/modes/motions/`. Look for matching `d` strings or matching
   element geometry. If yes → just import it and move on.

2. **Is this path the host shape (or a variant of it)?** Match it via
   the family-base motion (`heartBeat`, `bellShell`, …). If a Lucide
   variant reshapes the host's `d` slightly (e.g. `bell-plus` carves
   out a corner), extend the motion's `matchPathDOneOf` list with the
   new `d`. While you're there, make sure the host motion exports its
   keyframe constants (`HEART_BEAT_KEYFRAMES`, `BELL_SHELL_KEYFRAMES`,
   …) so other family motions can inherit them.

3. **Is this a Tier 1 marker?** Use the family's coupled modifier
   reveal — `heartModifierReveal`, `bellModifierReveal`, etc. — which
   reveals the path AND inherits the host's transform via
   `inherit: true` per-value transitions. If the family doesn't have
   one yet, build it: a `matchAnyPath` motion that does
   `pathLength` + `opacity` reveal plus the host's primary keyframes
   per-value (see section 5's worked example). For circle markers,
   build a geometry-matched equivalent (`bellDotReveal`).

4. **Is this Tier 2 with bespoke physics?** Write a new motion module
   under `src/modes/motions/`. Name it `<icon>-<role>.ts` (e.g.
   `flame-core`, `clock-hour-hand`). If it sits inside or attached to
   a transforming host, also inherit the host's keyframes via the same
   per-value `inherit: true` pattern — its physics plays *with* the
   host, not *over* it.

### Step 3 — Write any new motion modules

Each module exports a single `Motion` value. Match strictly by path
data. Animate using `ctx` for all timing. Document the motion's intent
in a top-of-file JSDoc and reference which icons consume it.

Example skeleton (hypothetical — `flame` doesn't have a signature yet;
this is what one might look like):

```ts
import { matchPathD, type Motion } from "../compose";

const FLAME_CORE_D = "M…"; // paste from src/generated/flame.tsx

export const flameCore: Motion = {
  matches: matchPathD(FLAME_CORE_D),
  factory: (ctx) => ({
    rest:   { scale: 1, opacity: 1 },
    active: {
      scale:   [1, 1.08, 0.95, 1.05, 1],
      opacity: [1, 0.7, 1, 0.85, 1],
      transition: {
        duration: ctx.duration,
        delay:    ctx.delay + ctx.index * ctx.stagger,
        ease:     "easeInOut",
        repeat:   ctx.repeat,
      },
    },
  }),
};
```

For real reference, read any of the existing `motions/*.ts` files —
`bell-clapper.ts` and `bell-sound-waves.ts` are particularly good
examples of physics-aware Tier 2 motion.

### Step 4 — Write the signature

`src/modes/signatures/<icon>.ts`. Thin compose() call:

```ts
import { compose } from "../compose";
import { flameCore } from "../motions/flame-core";
import { flameOuter } from "../motions/flame-outer";

/**
 * Flame flickers — inner core wobbles faster than the outer tongue,
 * mimicking the way a real flame's heart is more active than its
 * envelope.
 */
export default compose({
  motions: [flameCore, flameOuter],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
  // No transformOrigin override — flame scales around the icon center.
});
```

Put more specific motions earlier in the list. Wildcard
(`matchAnyPath`) motions go last.

### Step 5 — Regenerate

```bash
pnpm --filter lucide-motion generate
```

The codegen detects the new signature file and re-emits the icon's
generated wrapper with the signature import + `signature={signature}`
prop wired up.

### Step 6 — Validate

```bash
pnpm typecheck     # from repo root, fans out to all workspaces
pnpm --filter lucide-motion test
```

Both should pass before you ask for review.

### Step 7 — Visual review

Open `/playground` and use the mode toggle next to the search bar to
set `signature`. Search for the icon(s) you added. Hover each one and
verify the animation reads correctly. Things to check:

- Does the motion match what the real-world thing does?
- Are Tier 1 modifiers quiet enough that they don't compete with the
  host motion?
- Does the icon respect the duration / easing without feeling
  abruptly cut off?
- Try it at `size={56}` AND `size={120}` — some motions look great
  small but exaggerated when large (or vice versa).
- Try a few triggers (hover, click) to make sure replay feels right.

### Step 8 — Hand off for review

Commit the new motions + signatures. The user reviews the family
visually and either signs off or requests adjustments. After sign-off,
move to the next family.

## 5. Worked example — the bell family

Reference implementation. Open these files in tandem when reading this
section: `src/modes/motions/bell-*.ts` and
`src/modes/signatures/bell-*.ts`.

The Lucide bell has two paths that recur across most variants:

- `M10.268 21a2 2 0 0 0 3.464 0` — the clapper bob (small curve at the
  bottom)
- `M3.262 15.326…` — the bell shell (the body)

Each variant adds modifier paths on top of these two:

| Variant | Adds |
| --- | --- |
| `bell-plus` | `+` (two short lines) |
| `bell-minus` | `−` (horizontal line) |
| `bell-check` | `✓` (checkmark) |
| `bell-off` | `/` (diagonal slash) |
| `bell-ring` | two sound-wave arcs |
| `bell-dot` | small `<circle>` notification |

Some variants reshape the base shell to make room for the modifier
(`bell-off` has a split shell, `bell-plus` carves out the top-right
corner). The `bellShell` motion lists all known shell `d` strings in a
`matchPathDOneOf` so every variant inherits the same rocking physics.

**Base bell** (`signatures/bell.ts`):

```ts
import { compose } from "../compose";
import { bellClapper } from "../motions/bell-clapper";
import { bellShell } from "../motions/bell-shell";

export default compose({
  motions: [bellClapper, bellShell],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 4px",   // top mount, not icon center
});
```

**Tier 1 variants** — every `*-plus`, `*-minus`, `*-check`, `*-off`
ends up identical except for the modifier intent. The same motions
list works because `modifierReveal` is `matchAnyPath` (it catches
whatever's left after clapper + shell match):

```ts
// signatures/bell-plus.ts (bell-minus, bell-check, bell-off are identical)
import { compose } from "../compose";
import { bellClapper } from "../motions/bell-clapper";
import { bellShell } from "../motions/bell-shell";
import { modifierReveal } from "../motions/modifier-reveal";

export default compose({
  motions: [bellClapper, bellShell, modifierReveal],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 4px",
});
```

**Tier 1 variant with a circle** — `bell-dot` has a notification dot
that's a `<circle>`, not a path. `dotReveal` matches it by geometry:

```ts
// signatures/bell-dot.ts
import { compose } from "../compose";
import { bellClapper } from "../motions/bell-clapper";
import { bellShell } from "../motions/bell-shell";
import { dotReveal } from "../motions/dot-reveal";

export default compose({
  motions: [bellClapper, bellShell, dotReveal],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 4px",
});
```

**Tier 2 variant** — `bell-ring` has actual sound waves that need
radiation physics. Bespoke motion:

```ts
// signatures/bell-ring.ts
import { compose } from "../compose";
import { bellClapper } from "../motions/bell-clapper";
import { bellShell } from "../motions/bell-shell";
import { bellSoundWaves } from "../motions/bell-sound-waves";

export default compose({
  motions: [bellClapper, bellShell, bellSoundWaves],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 4px",
});
```

`bellSoundWaves` matches the two wave `d` strings via
`matchPathDOneOf` and scales each wave from 0 around the bell's mount
pivot — so the waves visually emerge from where the bell hangs and
propagate outward, the way real sound waves do.

**Result**: six variants, ~80 lines of new code, zero re-typed bell
physics. The shared motion modules are the single source of truth.

### Coupling every non-shell path to the host's motion

When a host shape moves (scale, rotate, translate), anything else in
the icon that doesn't follow visually "floats" over a moving shape
and reads as disconnected. The fix isn't to limit it to Tier 2
internals — *every* non-shell path in the icon, including Tier 1
markers like +, −, ×, and the off-slash, should track the host so the
icon reads as one cohesive unit through the animation.

Convention: each host motion exports its keyframe constants, and any
family-specific reveal motion imports them and applies them via
motion's per-value `transition` so its own animated properties
(reveal, draw, opacity) can keep their independent timing.

```ts
// motions/heart-beat.ts
export const HEART_BEAT_KEYFRAMES = {
  scale: [1, 0.85, 1, 0.9, 0.95, 1],
  times: [0, 0.15, 0.3, 0.45, 0.6, 1],
};

// motions/heart-modifier-reveal.ts
import { HEART_BEAT_KEYFRAMES } from "./heart-beat";

export const heartModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { pathLength: 1, opacity: 1, scale: 1 },
    active: {
      pathLength: [0, 0, 1],
      opacity: [0, 0, 1],
      scale: HEART_BEAT_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // `inherit: true` is required — per-value transitions replace
        // the parent entirely unless this flag is set, which would drop
        // duration/delay/repeat and fall back to motion-dom's defaults.
        pathLength: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        opacity:    { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        // Scale piggybacks on the host's keyframes — every non-shell
        // path beats together with the heart.
        scale:      { inherit: true, ease: ctx.easing, times: HEART_BEAT_KEYFRAMES.times },
      },
    },
  }),
};
```

The host motion stays the single source of truth for "what the beat
looks like." Family-specific reveals only have to think about *their*
draw behavior. Reapply this pattern for every family with a primary
transform: build a `<family>ModifierReveal` (wildcard) that piggybacks
the host's keyframes, and the variants compose to
`[host, <family>ModifierReveal]`. Generic `modifierReveal` (no host
coupling) stays available for families whose host motion is itself a
pure draw — but for any family whose host transforms, prefer the
family-specific reveal.

The bell family follows the same pattern with `BELL_SHELL_KEYFRAMES`
(rotate / times / ease arrays) and a `bellModifierReveal` that
piggybacks the shell's damped rock onto the +/−/✓/off-slash strokes.
`bellDotReveal` does the same for the `<circle>` notification dot in
`bell-dot`, and `bellSoundWaves` in `bell-ring` also picks up the
shell's rotation so the sound waves stay anchored to the swinging
mount as they radiate outward.

## 6. Reusable motions currently available

When authoring a new signature, check this list first. If an existing
motion matches the path you're animating, just import and reuse.

| Module | Matches | Animates |
| --- | --- | --- |
| `motions/bell-clapper.ts` | Bell clapper d | Wider damped pendulum, ~6 swings |
| `motions/bell-shell.ts` | All known bell shell d variants | Gentle damped rotation, ~3.5 swings. Exports `BELL_SHELL_KEYFRAMES` for other bell-family motions to inherit. |
| `motions/bell-sound-waves.ts` | Bell-ring wave d's | Radiating pulses out from origin; rotate follows the host `bellShell` so the waves stay anchored to the swinging mount (Tier 2) |
| `motions/bell-modifier-reveal.ts` | `matchAnyPath` (wildcard) | Delayed `pathLength` + `opacity` reveal that also rotates with the host `bellShell`. Used for every non-shell non-clapper bell-family path — +, −, ✓, off-slash — so they stay anchored through the swing |
| `motions/bell-dot-reveal.ts` | Circle at cx=18,cy=5,r=3 | Scale + opacity for notification dots; rotate follows the host `bellShell` so the dot rocks with the bell (Tier 1) |
| `motions/bell-electric-body.ts` | Bell-electric dome circle + base rect | High-frequency low-amplitude buzz rotation around the dome center, ~5 micro-swings. Exports `BELL_ELECTRIC_BODY_KEYFRAMES` for the rest of the bell-electric family to inherit. Different physics from `bellShell` — electric bells vibrate in place rather than swinging from a mount. |
| `motions/bell-electric-signal.ts` | Bell-electric's two signal-arc d's | Double-pulse radiation scaled from the dome center; rotate follows the host `bellElectricBody` so the arcs stay anchored to the buzzing bell (Tier 2; faster cadence than `bellSoundWaves` to read as electric vs acoustic) |
| `motions/bell-electric-button.ts` | Circle at cx=20,cy=16,r=2 | Opacity-only press-feedback pulse (no scale so it stays anchored off-center); rotate follows the host `bellElectricBody` (Tier 1) |
| `motions/bell-electric-spark.ts` | `M9 9h.01` center-dot d | Scale + opacity flash in place at the bell's core (Lucide degenerate-dot path); rotate follows the host `bellElectricBody` (Tier 1) |
| `motions/modifier-reveal.ts` | `matchAnyPath` (wildcard) | Generic pathLength + opacity draw-in, no host coupling. Reserved for future families whose host motion is itself a pure draw — every family with a transforming host should build its own coupled variant (see `bellModifierReveal`, `heartModifierReveal`). |
| `motions/heart-beat.ts` | All known heart shell d variants (heart, heart-crack, heart-minus, heart-plus, heart-x, heart-pulse base, heart-off fragments) | Lub-dub scale beat (Tier 2) |
| `motions/heart-handshake-clasp.ts` | Heart-handshake's single merged d | Gentle whole-icon "shared warmth" pulse (Tier 2; merged path forces a whole-icon gesture) |
| `motions/heart-pulse-line.ts` | Heart-pulse's EKG waveform d | Linear `pathLength` sweep that draws the trace left-to-right; scale follows the host `heartBeat` so the line breathes with the heart (Tier 2) |
| `motions/heart-modifier-reveal.ts` | `matchAnyPath` (wildcard) | Delayed `pathLength` + `opacity` reveal that also scales with the host `heartBeat`. Used for every non-shell heart-family path — crack, ±, ×, off-slash — so they stay anchored through the beat |
| `motions/eye-blink.ts` | Eye-body paths (base almond, eye-off's three arc fragments, eye-off's pupil arc) + base eye pupil `<circle cx=12 cy=12 r=3>` | scaleY collapse to a sliver, then snap back open. Exports `EYE_BLINK_KEYFRAMES` so the family modifier-reveal can pin its own in-plane companion to the same `times`. State-marker paths fall through to `eyeModifierReveal` (Tier 2) |
| `motions/eye-closed-lid.ts` | The closed-lid arc d in `eye-closed` | scaleY contraction (`[1, 0.88, 1]`) — the orbicularis muscle tightens the already-shut lid then relaxes. Signature pivots at `12px 8px` (top of closed lid). Exports `EYE_CLOSED_LID_KEYFRAMES` for the lashes to inherit (Tier 2) |
| `motions/eye-closed-lashes.ts` | The four lash d's in `eye-closed` | Opacity dim cascade (inner-to-outer stagger) + inherited `EYE_CLOSED_LID_KEYFRAMES.scaleY` — lashes shimmer in sequence as the lid squeezes (Tier 2) |
| `motions/eye-modifier-reveal.ts` | `matchAnyPath` (wildcard) | Delayed `pathLength` + `opacity` strike that completes AT the blink apex (`times: [0, 0.15, 0.5]`) plus a uniform `scale` dip `[1, 0.85, 1]` over `EYE_BLINK_KEYFRAMES.times`. The synthesized in-plane companion gives the slash kinetic life shared with the blink without inheriting the asymmetric scaleY directly (which would flatten a diagonal). Canonical example of the asymmetric-host synthesized-companion pattern. Used for `eye-off`'s slash and any future eye-plus / eye-minus / eye-check markers |
| `motions/star-twinkle.ts` | Full star d, star-half left-outline d, and the two broken-outline fragments in star-off (`matchPathDOneOf`) | Opacity dim + recover, small rotation wobble, and a brief inward `scale` contraction (`[1, 0.9, 0.98, 1]`, scale ≤ 1 per principle 3 — was 1.18 prior to the star-half/star-off refactor). Exports `STAR_TWINKLE_KEYFRAMES` so the family's modifier reveal inherits the same rhythm (Tier 2) |
| `motions/star-modifier-reveal.ts` | `matchAnyPath` (wildcard) | pathLength + opacity draw-in for `star-off`'s slash, plus rotate + scale inherited from `STAR_TWINKLE_KEYFRAMES` so the slash wobbles and contracts in step with the broken star fragments (Tier 1) |
| `motions/sun-ray-pulse.ts` | `matchAnyPath` (wildcard) | Per-path scale-outward + opacity dim with stagger. Used as the catch-all in every sun signature (`sun`, `sun-dim`, `sun-medium`, sun parts of `sun-moon` and `sun-snow`) so the rays cascade outward from the sun's centre — light radiating from the surface (Tier 2) |
| `motions/moon-glow.ts` | Moon crescent d (both the small `sun-moon` variant and the larger `moon`/`moon-star` variant) | Opacity-only soft dim/glow with no scale (moon reflects light, doesn't radiate; off-centre crescent shouldn't translate when the signature pivots for the sun or the star) (Tier 2) |
| `motions/moon-star-twinkle.ts` | Moon-star's two short "+"-forming line d's | Sharp scale + opacity twinkle. The `moon-star` signature pivots at the star centre (20, 5) so this scales in place rather than translating across the icon (Tier 2) |
| `motions/snowflake-twinkle.ts` | Sun-snow's 5 snowflake d's | Sharp opacity double-pulse + barely-perceptible scale wobble — ice crystals sparkle by reflection, not by changing size (Tier 2) |
| `motions/clock-face.ts` | Full `<circle cx=12 cy=12 r=10>` OR any path containing the `[Aa]10 10 0` arc command (catches the partial faces in `clock-{alert,arrow-up,arrow-down,check,fading,plus}`) | Tiny scale + opacity pulse — clock faces stay mostly steady so the hands' tick is the focus. Exports `CLOCK_FACE_KEYFRAMES` for the family's modifier reveal to inherit. In `clock-fading`'s 5 arc fragments the per-path stagger cascades into the "fading" character (Tier 2) |
| `motions/clock-hands.ts` | Any path whose `d` starts with `M12 6v` (catches the combined minute+hour hand-pair stroke in every clock variant) | Clockwise tick — 6° forward (one minute step), hold, ease back to rest (Tier 2) |
| `motions/clock-modifier-reveal.ts` | `matchAnyPath` (wildcard) | pathLength + opacity reveal that also scales with the host `clockFace` so state modifiers (alert, arrow, check, plus) breathe in sync with the face instead of floating over a pulsing body |
| `motions/cloud-body.ts` | Cloud-body paths (matches `[Aa]7 7 0` arc OR `[Aa]5 5 0 1 1` arc — catches the standard cloud, the smaller cloud in `cloud-sun`/`-moon` composites, and `cloud-off`'s two split fragments) | Subtle scale-contraction + opacity dim. Exports `CLOUD_BODY_KEYFRAMES` for family motions to inherit (Tier 2) |
| `motions/cloud-rain-drops.ts` | Specific d list — rain (`v6`), drizzle (`v1`), hail-vertical (`v2`), cloud-sun/moon-rain short drops, plus rain-wind diagonals | pathLength + opacity reveal that draws the stroke along its natural direction (top-down for verticals, slanted for rain-wind). Inherits cloudBody scale (Tier 2) |
| `motions/cloud-snow-dots.ts` | Specific d list — `h.01` dots in `cloud-snow` and the round hailstones in `cloud-hail` | Contraction-only scale twinkle + opacity dip — flake dims and shrinks toward its own position, then recovers. Per the moon-star lesson, scale ≤ 1 keeps the bottom-row dots (y=22) safely inside the viewBox (Tier 2) |
| `motions/cloud-fog-streaks.ts` | `cloud-fog`'s two horizontal d's (`M16 17H7`, `M17 21H9`) | pathLength reveal + opacity dim/recover to suggest fog rolling. Inherits cloudBody scale (Tier 2) |
| `motions/cloud-lightning-bolt.ts` | `cloud-lightning`'s bolt d | Bolt sits at rest position and jolts downward 0.7 viewBox units at the strike moment (`y: [0, 0.7, 0, ...]`), paired with the multi-flash opacity flicker (1 → 0.15 → 1 → 0.4 → 1). Jolt amplitude tuned so the bolt's bottom cap stays inside the 24×24 viewBox. Inherits cloudBody scale for cohesion (Tier 2) |
| `motions/cloud-modifier-reveal.ts` | `matchAnyPath` (wildcard) | pathLength + opacity reveal that also scales with the host `cloudBody`. Used by cloud variants whose modifiers aren't covered by the bespoke weather motions — alert mark, check, off-slash, cog gear, download/upload arrows, sync/backup loops |
| `motions/droplet-shimmer.ts` | Any path with an arc command (`[Aa]\d…`) — catches drop shapes across `droplet`, `droplets`, and the two split fragments in `droplet-off`; the slash `m2 2 20 20` has no arc so it falls through | y-bob + scale-contraction + opacity dim — surface tension drawing the drop inward as it nears release (Tier 2). Exports `DROPLET_KEYFRAMES` |
| `motions/droplet-modifier-reveal.ts` | `matchAnyPath` (wildcard) | pathLength + opacity reveal for `droplet-off`'s slash; inherits `dropletShimmer`'s scale so the slash breathes with the drop fragments |
| `motions/umbrella-canopy.ts` | Explicit d-list — handle + tip + canopy + the two canopy fragments in `umbrella-off` | Scale contraction + rotation sway + opacity dim — umbrella catching wind, canopy resisting the gust (Tier 2). Exports `UMBRELLA_KEYFRAMES` |
| `motions/umbrella-modifier-reveal.ts` | `matchAnyPath` (wildcard) | pathLength + opacity reveal for `umbrella-off`'s slash; inherits `umbrellaCanopy`'s scale + rotate so the slash sways with the rest |
| `motions/flame-flicker.ts` | The two flame-teardrop d's (`flame` + `flame-kindling`) | scaleY contraction (flame briefly shrinks vertically toward its base) + ±2° rotation sway (tongue leans in a draft) + opacity flicker (hot core alternately exposed and shrouded). The signature pivots at the flame's BASE (`12px 16px` for `flame`, `12px 15px` for `flame-kindling`) so the base stays anchored while the tip dances. Exports `FLAME_KEYFRAMES` (Tier 2) |
| `motions/flame-kindling-embers.ts` | The two crossed-kindling diagonals in `flame-kindling` | Opacity-only ember glow (real burning wood doesn't translate, just glows) + inherited rotate from `flameFlicker` so the sticks rock subtly with the fire's draft (Tier 2) |
| `motions/fire-extinguisher-ready.ts` | `matchAnyPath` for `fire-extinguisher` | Subtle two-pulse scale contraction + opacity dim — a device-armed pulse rather than flame physics, because the extinguisher is a tool and never burns itself |
| `motions/loader-spin.ts` | `matchAnyPath` for loader | Infinite rotation (via `atom/spin`) |
| `motions/loader-circle-sweep.ts` | `loader-circle`'s single arc d | Continuous 0→360 rotation with `easeInOut` per cycle (surge-and-settle) + a mid-cycle opacity breath `[1, 0.78, 1]`. Differentiates from the base `loader` signature. Exports `LOADER_CIRCLE_KEYFRAMES` (Tier 2) |
| `motions/loader-pinwheel-blade.ts` | The three `loader-pinwheel` blade d's | Rigid 0→360 rotation under `easeInOut` (gust-driven cadence) + per-blade reflectance opacity dip phase-shifted by 0, 1/3, 2/3 of the cycle so the bright/dim wave moves around the pinwheel rather than pulsing uniformly. Exports `LOADER_PINWHEEL_KEYFRAMES` (Tier 2) |
| `motions/loader-pinwheel-hub.ts` | `<circle cx=12 cy=12 r=10>` in `loader-pinwheel` | Rigid 0→360 rotation inherited from `LOADER_PINWHEEL_KEYFRAMES` so the outer rim stays rigidly coupled to the blades. No opacity variation (circle has rotational symmetry) (Tier 2 housing) |
| `motions/refresh-arc-cycle.ts` | Arcs + tick arrowheads across `refresh-cw`, `refresh-ccw`, `refresh-ccw-dot`, and `refresh-cw-off`'s four broken-arc fragments | Pinch-then-spin physics: scale `[1, 0.85, 0.85, 1]` (contracts inward, holds while spinning, releases back), rotate `[0, 0, ±360, ±360]` (full revolution in the named direction, performed *while contracted* so the corner caps stay inside the viewBox — corner cap envelope ≈ 0.85 × 13.45 ≈ 11.43 from centre, comfortably inside the inscribed circle of radius 12). Direction comes from `iconName` (cw = +360, ccw = -360). Exports `REFRESH_ARC_KEYFRAMES` (Tier 2 — mechanical wind-up + rotation, the canonical refresh-button gesture) |
| `motions/refresh-center-dot.ts` | `<circle cx=12 cy=12 r=1>` in `refresh-ccw-dot` | Inherits `REFRESH_ARC_KEYFRAMES.scale` so the indicator pinches in lockstep with the wheel + opacity dip `[1, 0.55, 0.55, 1]` (dim during the spin, bright at rest = fresh data ready). Skips rotate inheritance because a circle at the rotation pivot is rotationally symmetric (Tier 2) |
| `motions/refresh-modifier-reveal.ts` | `matchAnyPath` (wildcard) | pathLength + opacity reveal for `refresh-cw-off`'s diagonal slash, timed to complete at the rotation midpoint (`t = 0.5`, the moment the wheel has spun 180°) — the slash strikes through at the apex of the action. Inherits the host's pinch via `REFRESH_ARC_KEYFRAMES.scale` for kinetic-life share but skips rotate (would carry the slash around the wheel and destroy the strike-through reading) |
| `motions/wifi-signal-wave.ts` | Wifi arc paths across `wifi`, `wifi-high`, `wifi-low`, `wifi-off`, `wifi-cog`, `wifi-pen`, and `wifi-sync` | Radio-wave propagation from the lower source point: each arc level is hidden and contracted until its own slot, then draws in while scaling back to full Lucide radius. Inner/middle/outer arcs complete at `t = 0.36/0.54/0.72`, so the wave visibly travels outward. Exports `WIFI_SIGNAL_KEYFRAMES` for source dots and modifiers to share the full-signal peak. |
| `motions/wifi-signal-source.ts` | Degenerate wifi source-dot paths (`M12 20h.01` and the partial inner dot in `wifi-sync`) | Source pulse before the wavefront: the primary source dot contracts then grows to full size at `t = 0.12`; the partial inner dot follows the gentler wave contraction so it reads as a signal remnant. |
| `motions/wifi-pen-write.ts` | `wifi-pen`'s editing pen d | The pen writes independently: it starts slightly up/right, draws along its own path while sliding down-left on the pen axis, then settles back at rest with a tiny nib rotation. Completes at the full-signal peak so the edit lands as the wave finishes animating in. |
| `motions/wifi-sync-arrows.ts` | The four sync-arrow paths in `wifi-sync` | Refresh-ccw-style rigid wheel motion: the four disjoint arrow fragments share the badge pivot (`16.965px 16.105px`), pinch inward, rotate one full counter-clockwise revolution while contracted, then release back to rest. Uses the refresh family's timing shape with a stronger `scale: [1, 0.78, 0.78, 1]` contraction because the badge sits near the right/bottom viewBox edges. |
| `motions/wifi-modifier-reveal.ts` | Fallback path badges in wifi variants plus `wifi-cog`'s `<circle cx=18 cy=18 r=3>` hub | Quiet pathLength + opacity reveal for the off-slash and remaining badge pieces. The off slash completes at the full-signal peak (`t = 0.72`) after the outer wave animates in; badges use opacity pulses for kinetic life without shifting around the wifi source. |
| `motions/zap-strike.ts` | Full zap bolt d + the three fragments in `zap-off` | Bolt sits at rest position and jolts downward 1 viewBox unit at the strike moment (`y: [0, 1, 0, ...]` over 15% of the cycle), paired with the multi-flash opacity flicker (1 → 0.15 → 1 → 0.4 → 1). easeOut on the jolt so the kick happens fast and the spring-back decelerates; linear opacity for crisp flash peaks. Jolt amplitude keeps the bolt's bottom cap inside the 24×24 viewBox. Exports `ZAP_KEYFRAMES` (Tier 2 — in-place strike impact + flash) |
| `motions/zap-modifier-reveal.ts` | `matchAnyPath` (wildcard) | pathLength + opacity reveal for `zap-off`'s diagonal slash, timed to complete at the host's first dim trough (`t = 0.15`, right after the bolt's strike + flash) so the slash lands in the dark moment. Synthesized uniform `scale` dip `[1, 0.92, 1]` provides continuous kinetic life across the rest of the cycle. Skips host's `y` inheritance (a sliding slash stops reading as a static strike-through) |
| `motions/rotate-arc-cycle.ts` | The arc + corner-arrowhead d's in `rotate-cw`, `rotate-ccw`, `rotate-ccw-key` | Quarter-turn-and-back: pinch to 0.85, swing ±90° in the named direction while contracted (cap envelope ≈ 0.85 × 13.45 ≈ 11.43 < 12), hold upright still contracted, release scale back to 1. Direction comes from `iconName` (cw = +90, ccw = -90). Exports `ROTATE_ARC_KEYFRAMES`. Differentiated from `refreshArcCycle` by the angle — refresh does a full revolution ("cycle done"), rotate does a quarter turn ("demonstrate rotation by 90°", the canonical image-editor action) (Tier 2) |
| `motions/rotate-key-turn.ts` | The key body paths (`M12 7v6`, `M12 9h2`) + `<circle cx=12 cy=15 r=2>` in `rotate-ccw-key` | Key spins one full counter-clockwise revolution about the icon's z axis (the global `transformOrigin` at (12, 12)) while the arc swings overhead. Plain `rotate` only — no translate compensation, no per-element pivot shifting. The spin's −180° midpoint lands on the arc's apex (t = 0.5) and the revolution completes at t = 0.85; ends at −360 ≡ 0 visually (same end-of-active pattern as `refreshArcCycle` holding at 360) (Tier 2) |
| `motions/rotate-square-spin.ts` | `matchAnyPath` (wildcard) for `rotate-cw-square` / `rotate-ccw-square` | Quarter-turn-and-back rotation of the whole icon (frame fragments + corner arrow). No contraction — the frame's furthest corner sits at radius ≈ 11.3 from (12, 12), inside the inscribed circle of the 24×24 viewBox. Direction from `iconName` (Tier 2) |
| `motions/rotate-3d-orbit.ts` | `matchAnyPath` (wildcard) for `rotate-3d` | Single eased 0→−360° counter-clockwise revolution of the whole icon. The two perpendicular orbital ellipses sweeping past each other through the cycle reads as 3D rotation, distinguishing this variant from the family's quarter-turn-and-back gesture. All path vertices sit at radii ≤ 9.86 from (12, 12) so no contraction is needed; `rotate` is set as the `[0, -360]` keyframes array (not a scalar `-360`) so each hover replays from 0 (Tier 2) |
| `motions/signal-bar.ts` | The 4 signal-strength bar d's (`M7 20v-4`, `M12 20v-8`, `M17 20V8`, `M22 4v16`) across `signal`, `signal-high`, `signal-medium`, `signal-low` | Bars rest at full height; a wave of pressure travels through them left-to-right — each bar in turn briefly `scaleY`-contracts toward the baseline (y=20) and dims, then springs back. Reads as a signal pulse radiating across the indicator. Signature pivots at `"12px 20px"` so contraction operates from the common baseline regardless of which x each bar lives at, and normalises Lucide's mixed stroke directions (one of the bars is stored top-to-bottom). Contraction-only per principle 3 — the tallest bar already reaches y=4 so any expansion would clip. Per-path stagger (`ctx.index` left-to-right) produces the wave. Exports `SIGNAL_BAR_KEYFRAMES` (Tier 2) |
| `motions/signal-dot.ts` | The degenerate dot `M2 20h.01` (zero-strength indicator) in every signal variant including `signal-zero` | Inherits `SIGNAL_BAR_KEYFRAMES.opacity` so the dot dim/recovers in step with the bar wave's leading edge — fires first (index 0) and the wave proceeds through the bars from there. Opacity only — the dot sits on the signature's baseline pivot where `scaleY` would compress its round stroke caps unnaturally (Tier 2 — semantic floor of the signal-strength scale, not a state marker) |
| `motions/battery-case.ts` | Battery terminal, base `<rect x=2 y=6 width=16 height=12 rx=2>`, and split casing fragments in `battery-charging`, `battery-plus`, `battery-warning` | Fully visible casing voltage behavior: empty/low states sag in opacity, charging state adds a tiny side-to-side electrical hum, normal states carry a quieter opacity ripple. Exports `BATTERY_CASE_KEYFRAMES` with `powerPeak = 0.64` so in-cell markers pulse at the frame's ready moment. No pathLength draw-on (Tier 2 host casing) |
| `motions/battery-cell-fill.ts` | Charge cell bars at x=6/10/14 across `battery-low`, `battery-medium`, `battery-full` (`M6 14v-4`, `M10 14v-4`, `M6 10v4`, `M10 10v4`, `M14 10v4`) | Fully visible state-aware voltage ripple: each existing charge cell briefly `scaleY`-contracts toward its own bottom baseline (`transformOrigin: "<x>px 14px"`), dims, then recovers. Internal timing moves left-to-right independent of Lucide node order; no pathLength draw-on (Tier 2 charge-state cells) |
| `motions/battery-charging-bolt.ts` | `battery-charging` lightning bolt `m11 7-3 5h4l-3 5` | Incoming-current flash on an already-visible bolt: opacity flash + uniform contraction/rebound + tiny y jolt, all inside the battery casing. No pathLength draw-on (Tier 2 charging current) |
| `motions/battery-modifier-reveal.ts` | `matchAnyPath` wildcard for remaining in-cell plus/warning strokes after the casing matches | Tier 1 state marker pulse for `battery-plus` and `battery-warning`: plus performs a press/rebound pulse; warning blinks like a low-voltage alert LED. Uses per-marker fill-box uniform scale and opacity cadence for continuous kinetic life without distorting the plus or exclamation marker. No pathLength draw-on; place last because it is greedy |
| `motions/volume-speaker.ts` | Base speaker d (`volume` / `volume-1` / `volume-2` / `volume-x`) + the two `volume-off` chassis fragments | Two-thump bassline — uniform `scale: [1, 0.93, 1, 0.96, 1]` over `times: [0, 0.18, 0.42, 0.66, 1]` modelling the cone driver pulling back then snapping forward to push air. The volume signatures pivot at `"11px 12px"` (the speaker mouth) so the contraction reads as the diaphragm drawing into the chassis. Exports `VOLUME_SPEAKER_KEYFRAMES` (Tier 2 host) |
| `motions/volume-sound-waves.ts` | Intact wave arcs in `volume-1` (`M16 9a5 5 0 0 1 0 6`) and `volume-2` (`M19.364 18.364a9 9 0 0 0 0-12.728`) | Cascading radial reveal — each arc starts contracted toward the speaker mouth and grows to its full Lucide radius. Inner full at `t = 0.42` (after the speaker's first thump); outer full at `t = 0.66` (second thump). pathLength draws the arc in during emergence, then the wave inherits the speaker's remaining thump for cohesion (Tier 2) |
| `motions/volume-modifier-reveal.ts` | `matchAnyPath` wildcard for the leftover paths in `volume-x` and `volume-off` | pathLength + opacity reveal completing at the speaker's second-thump apex (`t = 0.66`) plus inherited `VOLUME_SPEAKER_KEYFRAMES.scale` so the `×` strokes, the diagonal slash and `volume-off`'s broken arc fragments thump in step with the cone rather than floating statically |
| `motions/mail-envelope.ts` | Envelope body across `mail`, `mail-open`, and the carved body paths in `mail-{plus,minus,check,x,warning,question-mark,search}` | Fully visible rigid envelope body. It does not deform; opacity dips in step with the flap raise so the body shares kinetic life without warping the rectangle (Tier 2 host casing) |
| `motions/mail-flap.ts` | V-flap seam paths across the mail family (`m22 7...`, `m22 10...`) | Flap-raise gesture: `scaleY` contracts around the flap-corner pivot (`transformOrigin: "12px 7px"`), pulling the V's middle upward while the corners stay pinned. Opacity dips with the raise and recovers; no pathLength draw-on. Exports `MAIL_FLAP_KEYFRAMES` |
| `motions/mail-modifier-pulse.ts` | `matchAnyPath` wildcard for Tier 1 mail markers after envelope/flap/search matches (`+`, `−`, `✓`, `×`, `!`, `?`) | Visible-at-rest marker pulses: plus/minus/check/x/question pulse like status badges, warning blinks sharply like an alert indicator. Uniform fill-box scale preserves marker shape while opacity follows the flap rhythm; no pathLength reveal |
| `motions/mail-search-loupe.ts` | _Deprecated — replaced by `search-loupe.ts` during the Round-2 subject pass; file is now an empty `export {}` placeholder._ | _See `search-loupe.ts`._ |
| `motions/send-paper-plane.ts` | The paper-plane body + crease d's in `send` (diagonal) and `send-horizontal` (rightward) | Launch-and-respawn: plane translates forward in its facing direction (`x +`, `y −` for `send`; `x +` only for `send-horizontal` — direction comes from `iconName`), holds briefly, fades to 0 as it "leaves the frame," snaps back to (0, 0) while invisible, then fades back in at rest. Scale dips slightly toward 0.88 at the far position to read as perspective foreshortening (contraction-only per principle 3). Translate magnitude (≤ 2 units) keeps the plane's tip inside the 24×24 viewBox at the far position — `send`'s tip already sits at (~21.85, ~2.15) so a larger throw would clip (Tier 2 — paper-plane flight per section 7) |
| `motions/send-to-back.ts` | `send-to-back`'s front rect `<rect x=2 y=2 width=8 height=8>` plus a wildcard for the back rect + the two L-shaped connector paths | Front rect translates `+3, +3` toward the back rect's position and dims to 0.3 opacity, then returns — the direct visualisation of "send this layer to the back." Back rect + connector arrows share a quiet opacity sympathy dip on the same `times` so the icon reads as one cohesive shift gesture rather than the front rect moving alone (Tier 2 — UI layer-stacking command, distinct from the paper-plane `send` variants) |
| `motions/mic-body.ts` | The mic capsule `<rect x=9 y=2 width=6 height=13 rx=3>`, the mic-vocal ball `<circle cx=16 cy=7 r=5>`, and the path registry covering the U-arc holder, stem, mic-off's split capsule + U-arc fragments, and mic-vocal's handle + cable | "Mic is hot" pulse — uniform `scale: [1, 0.94, 1, 0.97, 1]` over `times: [0, 0.2, 0.45, 0.7, 1]` so the whole body reads as actively listening together. Carries the LED-indicator convention into a soft two-beat contraction across capsule, holder, stem, ball, handle, and cable. Exports `MIC_BODY_KEYFRAMES` (Tier 2 host) |
| `motions/mic-modifier-reveal.ts` | `matchAnyPath` wildcard for `mic-off`'s diagonal slash after the body registry matches | pathLength + opacity reveal completing at the body's second-pulse apex (`t = 0.7`) plus inherited `MIC_BODY_KEYFRAMES.scale` so the slash strikes through on a body event and pulses in step with the silenced capsule rather than floating statically |
| `motions/search-loupe.ts` | Loupe circles + handle strokes across every signed search-bearing icon: base `search` (r=8 @ (11,11)), search-* state-marker variants (same loupe), `scan-search` (r=3 @ (12,12)), `mail-search` (r=3 @ (18,18) + path-form circle), `folder-search` (r=3 @ (17,17)), `folder-search-2` (r=2.5 @ (11.5,12.5)). Matcher is scoped via `SEARCH_LOUPE_CENTERS` keyset so look-alike circles in unrelated icons never get claimed | Round-2 subject (canonical "magnifying glass inspecting" gesture): damped side-to-side rotation wobble `[0, -10, 8, -5, 2, 0]` around the loupe's own centre. Per-iconName centre lookup in `SEARCH_LOUPE_CENTERS` sets per-variant `transformOrigin` (resolved against `transformBox: "view-box"`) so each composite's loupe wobbles around its own centre without disturbing the host's pivot. Same per-iconName centre pattern as `cog-gear`'s `COG_CENTERS`. Exports `SEARCH_LOUPE_KEYFRAMES` for `searchModifierReveal` to inherit the rotation directly. Place FIRST in every search-bearing signature. Replaces the previous per-composite motions `search-scan.ts`, `scan-search-loupe.ts`, `mail-search-loupe.ts` (the latter used a scale+opacity scan-pulse — now unified to the wobble for consistency) |
| `motions/search-modifier-reveal.ts` | `matchAnyPath` wildcard for every search variant's inner glyph after the loupe + handle are claimed by `searchLoupe` — check tick, × strokes, slash, alert stem and dot. (Code brackets in `search-code` are claimed even earlier by `codeSymbol`.) | strokeDasharray + strokeDashoffset draw-in over the measured `ctx.pathLength` + opacity reveal, plus inherited `SEARCH_LOUPE_KEYFRAMES.rotate` so the marker tilts with the wobble (in-plane host, direct inherit; no distortion). Closed via `transitionEnd` so rest is dash-free. Place last in the compose list |
| `motions/search-scan.ts` | _Deprecated — replaced by `search-loupe.ts`; empty `export {}` placeholder._ | _See `search-loupe.ts`._ |
| `motions/scan-search-loupe.ts` | _Deprecated — `scan-search` now uses `search-loupe.ts`; empty `export {}` placeholder._ | _See `search-loupe.ts`._ |
| `motions/badge-shell.ts` | Lucide badge wavy outline d (identical across all 18 badge-* variants) | Uniform contraction-only scale + opacity dim — polished-shine-sweep archetype implemented as a brief tightening + dim so the medallion reads as catching light. Exports `BADGE_SHELL_KEYFRAMES` for the family modifier-reveal to inherit (Tier 2-style host on an abstract-archetype icon — every badge variant uses it) |
| `motions/badge-modifier-reveal.ts` | `matchAnyPath` wildcard for every non-shell badge-family path (state markers in `badge-{check,x,plus,minus,alert,info,percent,question-mark}` + currency emblems in `badge-{cent,dollar-sign,euro,indian-rupee,japanese-yen,pound-sterling,russian-ruble,swiss-franc,turkish-lira}`) | strokeDasharray + strokeDashoffset draw-in over the measured `ctx.pathLength` + opacity reveal, completing at the shell's light-beat apex (`t = 0.4`). Inherits `BADGE_SHELL_KEYFRAMES.scale` directly — uniform in-plane scale is safe for both orthogonal (`+`, `−`) and diagonal (`×`, `%`, slash) markers per principle 2. Closed via `transitionEnd`. Place last in the compose list |
| `motions/chart-axes.ts` | The L-shape axes path d (`M3 3v16a2 2 0 0 0 2 2h16`) shared by 19 of 23 chart-* variants | Two-beat opacity breath `[1, 0.88, 1, 0.94, 1]` — the axes momentarily recede so the data plot reads as the foreground action, then return. Exports `CHART_AXES_KEYFRAMES`. Tier 2 host frame for the chart family |
| `motions/chart-bars-vertical.ts` | Vertical column bar paths matched by regex `^M[\d.]+ [\d.]+[vV]` — covers `chart-column*`, `chart-no-axes-column*`, `chart-no-axes-combined`'s columns, `chart-bar-stacked`'s dividers | `scaleY` + opacity pressure wave from the chart baseline (signal-bar pattern). Per-bar stagger by `ctx.index` cascades left-to-right. Exports `CHART_BARS_VERTICAL_KEYFRAMES`. Signature pivots at the baseline (`"12px 21px"` for column variants) |
| `motions/chart-bars-horizontal.ts` | Horizontal bar paths matched by regex `^M[\d.]+ [\d.]+[hH]` — covers `chart-bar*`, `chart-gantt`, `chart-no-axes-gantt`, `chart-column-stacked`'s dividers | `scaleX` + opacity pressure wave from the y-axis baseline. Per-bar stagger cascades top-to-bottom. Exports `CHART_BARS_HORIZONTAL_KEYFRAMES`. Signature pivots at the y-axis (`"5px 12px"`) |
| `motions/chart-rect-bars.ts` | `pathTag === "rect"` — `<rect>` bars in `chart-bar-big`, `chart-column-big`, `chart-bar-stacked`, `chart-column-stacked` | Uniform `scale` + opacity dim with per-rect stagger. Uniform (not axis-locked) so rounded corners stay proportional. Exports `CHART_RECT_BARS_KEYFRAMES` |
| `motions/chart-line-stroke.ts` | The four data-line `d`s: `chart-line` zig-zag, `chart-spline` curve, `chart-area` polygon outline, `chart-no-axes-combined` top scallop | strokeDasharray + strokeDashoffset draw-in over the measured `ctx.pathLength` — the line/curve/area outline plots left-to-right, completing at `t = 0.7` and holding drawn while the axes' opacity breath finishes underneath. Opacity fades in early (`[0, 1, 1]` over `[0, 0.2, 1]`) so the stroke isn't invisibly snapped at frame 0. Closed via `transitionEnd` so the resting DOM is dash-free |
| `motions/chart-pie-sweep.ts` | The two `chart-pie` arcs (wedge + remaining 3/4) | Uniform `scale: [1, 0.88, 1]` + opacity dim around the pie's centre. Per-path stagger so the wedge leads the arc — the focused slice refreshes first |
| `motions/chart-scatter-dot.ts` | `<circle r=".5">` data points in `chart-scatter` (5 dots) | Per-dot `scale: [1, 0.4, 1]` + opacity flash with stagger — observations land in sequence |
| `motions/chart-network-activity.ts` | Two motions: `chartNetworkLink` matches the three connection-line `d`s in `chart-network`; `chartNetworkNode` matches `<circle r="2">` nodes | Connection lines briefly dim (`opacity [1, 0.25, 1]` + tiny scale) — signal in flight. Nodes pulse with `scale: [1, 0.7, 1]` + opacity — node activates. Both sequenced left-to-right by Lucide path order so the eye reads a packet hopping across the graph |
| `motions/chart-candlestick-flash.ts` | `<rect>`s and the four wick paths (`M9 5v4`, `M9 15v2`, `M17 3v2`, `M17 13v3`) in `chart-candlestick` | Uniform `scale: [1, 0.8, 1]` + opacity flash with stagger — both candles' wicks and bodies pulse together, left candle leading the right. `chart-candlestick`'s signature deliberately does NOT compose `chartBarsVertical` or `chartRectBars` so they don't claim the wicks/bodies with the wrong motion |
| `motions/monitor-chassis.ts` | Standard screen rect (`x=2 y=3 w=20 h=14`), the reshaped screen paths in `monitor-{cog,dot,off,smartphone}` (5 path d's), and the stand stem + base (path or `<line>` forms) | Damped ±6° swivel around the stand-top joint (`12px 17px`) — the canonical desktop-monitor gesture for the "Device interaction" abstract archetype — paired with a phase-locked opacity dip `[1, 0.72, 1, 0.88, 1]` so the screen flickers slightly as it angles away. Stand skips the rotate (would translate the base off-centre) but shares the opacity dip so the chassis breathes together. Sub-icons inherit BOTH rotate and opacity via the family modifier-reveal so payloads stay anchored to the display through the rock — addresses the badge gap (badge dims its shell but doesn't share with sub-icons; mail is the precedent that does it correctly). Exports `MONITOR_SCREEN_KEYFRAMES` |
| `motions/monitor-modifier-reveal.ts` | `matchAnyPath` wildcard for every non-chassis monitor-family path: state markers (`-check`, `-x`, `-up`, `-down`), payload glyphs (`-cog` teeth + hub, `-cloud` body, `-dot`, `-play` triangle, `-pause` bars, `-stop` rect, `-off` slash), and composite second-device anatomy (`-smartphone` phone, `-speaker` tower + dots) | Branches by element type — `<path>` / `<line>` get dasharray draw-in, `<circle>` / `<rect>` get scale-from-0 pivoted at the element's own `fill-box` centre so the reveal stamps in place. Reveal completes at `t = 0.25` (the screen's first-swivel apex). Opacity tracks `MONITOR_SCREEN_KEYFRAMES.opacity` from 0 — `[0, 0, 0.72, 1, 0.88, 1]` — so the payload emerges into the screen's first dim, then breathes with the display through the rest of the cycle. Rotate inherits the screen swivel directly. Place last in the compose list |
| `motions/shield-body.ts` | Standard shield crest outline d (11 variants), `shield-cog-corner`'s reshaped body, and `shield-off`'s two casing fragments — 4 path d's total | Brace-and-rebound deflect: damped ±4° tilt around the bottom-tip grip (`12px 22px`) `rotate: [0, -4, 3, -1, 0]` + phase-locked opacity dip `[1, 0.75, 1, 0.88, 1]` over `times: [0, 0.25, 0.5, 0.75, 1]`. Reads as the shield absorbing a strike and recoiling. Exports `SHIELD_BODY_KEYFRAMES` so the family modifier-reveal can inherit both curves directly |
| `motions/shield-modifier-reveal.ts` | `matchAnyPath` wildcard for every non-body shield-family path: state markers (`-check`, `-x`, `-plus`, `-minus`, `-alert`, `-ban`, `-question-mark`, `-off` slash, `-half` vertical divider), `<path>` ellipsis dots, payload glyphs (`-cog` teeth, `-cog-corner` teeth, `-user` torso arc), and circle payloads (`-cog` hub, `-cog-corner` hub, `-user` head) | Branches by element type — `<path>` / `<line>` get dasharray draw-in, `<circle>` gets scale-from-0 pivoted at the circle's own `fill-box` centre. Reveal completes at `t = 0.25` (the body's first tilt apex). Opacity tracks `SHIELD_BODY_KEYFRAMES.opacity` from 0 — `[0, 0, 0.75, 1, 0.88, 1]` — so the payload emerges into the shield's first dim and breathes with the crest. Rotate inherits the body's tilt directly. Place last in the compose list |
| `motions/message-square-body.ts` | Standard speech-bubble outline (both `.71.71` and `.7.7` spellings), reshaped bodies in `message-square-{dot,lock,share}`, the two casing fragments in `message-square-off`, and the ten dashed-outline segments in `message-square-dashed` — 17 path d's total | Speech bubble nodding while talking: damped ±3° rock around the tail tip (`3px 22px`) `rotate: [0, -3, 2, -1, 0]` + phase-locked opacity shimmer `[1, 0.78, 1, 0.9, 1]` over `times: [0, 0.25, 0.5, 0.75, 1]`. Reads as the bubble "speaking" with the tail planted at the speaker's mouth. Exports `MESSAGE_SQUARE_BODY_KEYFRAMES` |
| `motions/message-square-modifier-reveal.ts` | `matchAnyPath` wildcard for every non-body message-square-family path: state markers (`-check`, `-x`, `-plus`, `-diff`, `-warning`, `-off` slash, `-text` lines), payload glyphs (`-heart`, `-code` chevrons, `-reply` / `-share` arrows, `-quote` marks, `-lock` shackle), and shape payloads (`-dot` circle, `-lock` rect). The `-more` ellipsis dots are claimed earlier by `messageSquareTypingDots` | Branches by element type — `<path>` / `<line>` get dasharray draw-in, `<circle>` / `<rect>` get scale-from-0 pivoted at the element's own `fill-box` centre. Reveal completes at `t = 0.25` (the body's first nod apex). Opacity tracks `MESSAGE_SQUARE_BODY_KEYFRAMES.opacity` from 0 — `[0, 0, 0.78, 1, 0.9, 1]`. Rotate inherits the body's nod directly. Place last in the compose list |
| `motions/message-square-typing-dots.ts` | The three degenerate-dot d's at x = 8, 12, 16 in `message-square-more` | iMessage typing-indicator wave: each dot lifts `y: -1.2` toward the bubble roof in sequence (left → middle → right) at `t ∈ [0.15, 0.3] / [0.3, 0.55] / [0.55, 0.7]`, then drops back. Closed cycle per dot (first and last `y = 0`). Inherits both `MESSAGE_SQUARE_BODY_KEYFRAMES.rotate` and `.opacity` so the row nods and shimmers with the bubble. Placed BEFORE the family modifier-reveal in `message-square-more`'s compose list (Tier 2 bespoke physics — the row is a typing animation, not a draw-in marker) |
| `motions/message-circle-body.ts` | Standard round speech-bubble outline (10 variants share one path), `message-circle-off`'s two casing fragments around the diagonal slash, and `message-circle-dashed`'s eight arc + tail fragments — 11 path d's total | Same speech-bubble nod as `messageSquareBody`: damped ±3° rock around the tail tip (`3px 22px`) `rotate: [0, -3, 2, -1, 0]` + phase-locked opacity shimmer `[1, 0.78, 1, 0.9, 1]` over `times: [0, 0.25, 0.5, 0.75, 1]`. Exports `MESSAGE_CIRCLE_BODY_KEYFRAMES` |
| `motions/message-circle-modifier-reveal.ts` | `matchAnyPath` wildcard for every non-body message-circle-family path: state markers (`-check`, `-x`, `-plus`, `-warning` `!`, `-question-mark`, `-off` slash, `-more` ellipsis dots) and payload glyphs (`-heart`, `-code` chevrons, `-reply` arrow). Every variant's non-body anatomy is a `<path>` so this branchless reveal covers all of them — no `<circle>` / `<rect>` markers in the family | dasharray + dashoffset draw-in completing at `t = 0.25` (the body's first nod apex), opacity tracking `MESSAGE_CIRCLE_BODY_KEYFRAMES.opacity` from 0 — `[0, 0, 0.78, 1, 0.9, 1]`, and rotate inheriting the body's nod directly. Place last in the compose list |
| `motions/scan-corners-frame.ts` | The four corner-bracket d's shared by `scan`, `focus`, `fullscreen`, and `scan-{barcode,eye,face,heart,line,qr-code,search,text}` (11 icons) | Viewfinder lock-on: uniform `scale: [1, 0.94, 0.94, 1]` + opacity dim `[1, 0.85, 0.85, 1]` over `times: [0, 0.2, 0.5, 1]` — the brackets contract toward icon centre, hold the lock briefly, release. Signature pivots at `"12px 12px"`. Exports `SCAN_CORNERS_KEYFRAMES` |
| `motions/focus-reticle.ts` | `focus` reticle `<circle cx=12 cy=12 r=3>` | Autofocus convergence pulse: stronger `scale [1, 0.55, 0.55, 0.8, 1]` + opacity `[1, 0.6, 0.6, 0.85, 1]` over `times: [0, 0.2, 0.5, 0.75, 1]` — pinches deeper than the brackets and stays pinched during the lock-hold. Stays visible at rest (no draw-in) |
| `motions/fullscreen-inner-rect.ts` | `fullscreen` inner `<rect x=7 y=8 w=10 h=8>` | Inherits `SCAN_CORNERS_KEYFRAMES.scale` and `.opacity` directly — uniform contraction around the rect's own centre (12, 12). Reads as one cohesive "framing the content" gesture |
| `motions/scan-line-sweep.ts` | `scan-line` horizontal stroke `M7 12h10` | Vertical sweep `y: [0, -4, 4, 0]` over `times: [0, 0.3, 0.7, 1]` — the line at y=12 rises to y=8, drops to y=16, settles back. The canonical document-scanner laser pass. Inherits the corners' opacity; skips inheriting scale because the bespoke `y` IS the kinetic life |
| `motions/scan-barcode-bars.ts` | `scan-barcode` three vertical bars (`M8 7v10`, `M12 7v10`, `M17 7v10`) | `scaleY: [1, 0.55, 1]` + opacity `[1, 0.4, 1]` per-bar, with `ctx.index * 0.12` stagger so the wave moves left → right. Signature pivots at `"12px 17px"` (bars' shared baseline) so each bar contracts toward its own bottom |
| `motions/scan-eye-blink.ts` | `scan-eye` pupil `<circle cx=12 cy=12 r=1>` + eyelid arc `M18.944 12.33...` | Reuses `EYE_BLINK_KEYFRAMES.scaleY = [1, 0.1, 1]` from the canonical eye primitive on scan-eye's smaller geometry — same blink rhythm, different anatomy |
| `motions/scan-face-features.ts` | `scan-face` smile (`M8 14s1.5 2 4 2 4-2 4-2`) + two cheek dots (`M9 9h.01`, `M15 9h.01`) — two exported motions | Cheek dots opacity-wink at the lock-on midpoint (`[1, 0.2, 1]`); smile holds calm with a smaller opacity dip. Reads as "face detected, scan complete" |
| `motions/scan-search-loupe.ts` _(duplicate row — see line above; row preserved for diff context)_ | _Deprecated — `scan-search` now uses `search-loupe.ts`._ | _See `search-loupe.ts`._ |
| `motions/scan-qr-modules.ts` | `scan-qr-code`'s three paths + finder `<rect x=7 y=7 w=5 h=5>` | Sequential opacity pulse `[1, 1, 0.3, 1, 1]` over `times: [0, 0.3, 0.45, 0.8, 1]` with `ctx.index * 0.1` stagger — modules read in turn as the decoder works through the symbol |
| `motions/scan-text-lines.ts` | `scan-text` three lines (`M7 8h8`, `M7 12h10`, `M7 16h6`) | Top → bottom OCR read wave: `opacity: [1, 0.3, 1]` per-line with `ctx.index * 0.12` stagger. Lucide orders the lines top-to-bottom so `ctx.index` encodes reading order naturally |
| `motions/heart-beat.ts` registry | Now also matches `scan-heart`'s small heart `M7.828 13.07A3 3 0 0 1 12 8.764...` | scan-heart inherits the canonical lub-dub `[1, 0.85, 1, 0.9, 0.95, 1]` directly — same primitive physics, smaller heart geometry |
| `motions/folder-body.ts` | Standard closed folder body (2 spellings), the alternate canonical (`folder-dot`/`-kanban`/`-root`), 13 reshaped bodies where a composite inset-cuts the corner (`-archive`, `-clock`, `-cog`, `-git-2`, `-heart`, `-input`, `-key`, `-lock`, `-output`, `-pen`, `-search`, `-symlink`, `-sync`), and 2 open-folder shapes (`-open`, `-open-dot`) — 18 path d's total | Folder tipping-open gesture: damped ±3° tilt around the bottom-left spine (`4px 20px`) `rotate: [0, -3, 2, -1, 0]` + phase-locked opacity dip `[1, 0.78, 1, 0.9, 1]` over `times: [0, 0.25, 0.5, 0.75, 1]`. The top-left tab is the furthest point from the pivot so it moves the most — reads as the tab bending back as if the folder is being opened to peek inside. Sub-icons inherit BOTH rotate and opacity via the family modifier-reveal. Exports `FOLDER_BODY_KEYFRAMES` |
| `motions/folder-modifier-reveal.ts` | `matchAnyPath` wildcard for every non-body folder-family path: state markers (`-check`, `-x`, `-plus`, `-minus`, `-up`/`-down`), payload glyphs (`-bookmark`, `-code` chevrons, `-kanban` bars, `-clock` arm, `-cog` teeth, `-git` connectors, `-heart`, `-input`/`-output`/`-symlink` arrows + dividers, `-key` shackle, `-lock` shackle, `-pen` body, `-root` post, `-search`/`-search-2` loupe, `-sync` arrows, `-closed` divider), and shape payloads (`-archive`/`-dot`/`-git`/`-git-2`/`-clock`/`-cog`/`-key`/`-open-dot`/`-root`/`-search`/`-search-2` circles, `-lock` rect) | Branches by element type — `<path>` / `<line>` get dasharray draw-in, `<circle>` / `<rect>` get scale-from-0 pivoted at the element's own `fill-box` centre. Reveal completes at `t = 0.25` (the folder's first tilt apex). Opacity tracks `FOLDER_BODY_KEYFRAMES.opacity` from 0 — `[0, 0, 0.78, 1, 0.9, 1]`. `rotate` inherits the body's tilt directly. Place last in the compose list |
| `motions/receipt-body.ts` | The Lucide receipt outline (single d, byte-identical across all 10 variants) | Receipt dangling from a thermal printer: damped ±3° sway around the receipt's top edge (`10px 2px`) — the imagined print slot — `rotate: [0, -3, 2, -1, 0]` + phase-locked opacity dip `[1, 0.78, 1, 0.9, 1]` over `times: [0, 0.25, 0.5, 0.75, 1]`. Bottom-edge scallops sway the most (furthest from the pivot), top scallops barely move. Exports `RECEIPT_BODY_KEYFRAMES` |
| `motions/receipt-modifier-reveal.ts` | `matchAnyPath` wildcard for every non-body receipt-family path — currency symbols (`-cent`, `-dollar-sign` (the base `receipt`'s `S`-curve), `-euro`, `-indian-rupee`, `-japanese-yen`, `-pound-sterling`, `-russian-ruble`, `-swiss-franc`, `-turkish-lira`) and text lines (`receipt-text` — when not claimed earlier by `receiptTextLines`) | dasharray + dashoffset draw-in completing at `t = 0.25` (the body's first sway apex), opacity tracking `RECEIPT_BODY_KEYFRAMES.opacity` from 0 — `[0, 0, 0.78, 1, 0.9, 1]`, and rotate inheriting the body's sway directly. Every receipt variant's non-body anatomy is a `<path>` — no shape branch needed. Place last in the compose list |
| `motions/receipt-text-lines.ts` | The three horizontal lines in `receipt-text` (`M14 8H8`, `M16 12H8`, `M13 16H8`) | Same cascade as `messageSquareTextLines`: each line teleports up to `y = -3` (invisible via opacity = 0), then drops back to rest in sequence (top → middle → bottom at `t ∈ [0.001, 0.3] / [0.3, 0.55] / [0.55, 0.8]`). Inherits `rotate` from `RECEIPT_BODY_KEYFRAMES` so the lines sway with the receipt. Place BETWEEN body and modifier-reveal in `receipt-text`'s compose list (Tier 2 — line items being printed) |
| `motions/cog-gear.ts` | The 12 standalone-`cog` teeth + concentric `r=2` / `r=8` circles, plus the 8 composite tooth d's per signed cog position (cloud-cog at (12, 17), wifi-cog at (18, 18), monitor-cog at (18, 6)) and their `r=3` hub circles | Round-2 subject (canonical "configure" gesture): one eased 0→360° rotation per cycle. Per-variant `transformOrigin: "<cx>px <cy>px"` resolved against `transformBox: "view-box"` is set inside the factory via `COG_CENTERS[iconName]`, so each composite pins the spin to its own cog centre without disturbing the host's pivot. Add a row to `COG_CENTERS` + the tooth d-list whenever a new cog-bearing family is signed. Place FIRST in every cog-bearing signature so the teeth are claimed by rotation before the family modifier-reveal grabs them as a draw-in |
| `motions/settings-gear.ts` | `matchAnyPath` for the `settings` icon (wavy gear outline + central `r=3` socket) | Same rotation gesture as `cog-gear` but authored as `matchAnyPath` since `settings` has only two paths and both share the icon centre as their pivot. Scoped to `settings.ts` only — there is no `*-settings` composite family in Lucide |
| `motions/lock-shackle.ts` | The 10 unique shackle path d's across standalone (`lock`, `lock-open`, `lock-keyhole`, `lock-keyhole-open`) and composites (`folder-lock`, `message-square-lock`, `door-closed-locked`, `book-lock`, `file-lock`, `earth-lock`, `globe-lock`, `user-lock`) | Round-2 subject (canonical "lock test" gesture): anchorless `y: [0, -0.6, 0]` translate — the shackle gets tugged up briefly and snaps back. Translation has no pivot dependency so the same motion drops cleanly into any composite signature regardless of its `transformOrigin`. Exports `LOCK_SHACKLE_KEYFRAMES` so the body + keyhole can phase-lock their dips |
| `motions/lock-body.ts` | Lock body rects — 18×11 (lock, lock-open), 18×12 (lock-keyhole, lock-keyhole-open), 8×5 (every composite badge lock) — matched by `(width, height)` tuple | Opacity-only dim `[1, 0.78, 1]` phase-locked to `LOCK_SHACKLE_KEYFRAMES.times`. No transform → no pivot concern; works in every composite regardless of its transformOrigin |
| `motions/lock-keyhole.ts` | `<circle cx=12 cy=16 r=1>` in `lock-keyhole` and `lock-keyhole-open` | "Click" gesture: scale dip `[1, 0.55, 1]` + opacity dip phase-locked to the shackle pull. Per-variant `transformOrigin: "12px 16px"` pins the scale to the dot's own centre via view-box `transformBox`. Scoped to the two standalone keyhole icons |
| `motions/cog-gear.ts` | The 12 standalone-`cog` teeth + concentric `r=2` / `r=8` circles, plus the 8 composite tooth d's per signed cog position (cloud-cog at (12, 17), wifi-cog at (18, 18), monitor-cog at (18, 6)) and their `r=3` hub circles | Round-2 subject (canonical "configure" gesture): one eased 0→360° rotation per cycle. Per-variant `transformOrigin: "<cx>px <cy>px"` resolved against `transformBox: "view-box"` is set inside the factory via `COG_CENTERS[iconName]`, so each composite pins the spin to its own cog centre without disturbing the host's pivot. Add a row to `COG_CENTERS` + the tooth d-list whenever a new cog-bearing family is signed. Place FIRST in every cog-bearing signature so the teeth are claimed by rotation before the family modifier-reveal grabs them as a draw-in |
| `motions/settings-gear.ts` | `matchAnyPath` for the `settings` icon (wavy gear outline + central `r=3` socket) | Same rotation gesture as `cog-gear` but authored as `matchAnyPath` since `settings` has only two paths and both share the icon centre as their pivot. Scoped to `settings.ts` only — there is no `*-settings` composite family in Lucide |
| `motions/pen-write.ts` | The shared standalone diamond pen body d (covers `pen`, `pencil`, `pen-line`, `pencil-line`) plus the unique composite badge-pen d's per host (`file-pen`, `file-pen-line`, `folder-pen`) | Round-2 subject (canonical "edit" gesture): rotate wobble `[0, -4, 3, -1, 0]` + scale dip `[1, 0.96, 1, 0.98, 1]` + opacity dim around the pen's own bbox centre. Per-variant `transformOrigin: "50% 50%"` + `transformBox: "fill-box"` overrides the engine's view-box default just for the pen path so the same motion drops into any composite position (standalone full-page or badge-corner) without coupling to the signature's transformOrigin. Exports `PEN_WRITE_KEYFRAMES`. `wifi-pen` keeps its bespoke `wifiPenWrite` for tighter signal-keyframe sync — listed before `penWrite` in compose order |
| `motions/pen-line-stroke.ts` | The underline `M13 21h8` in `pen-line` and `pencil-line` | Opacity dim `[1, 0.5, 1, 0.78, 1]` phase-locked to `PEN_WRITE_KEYFRAMES.times` — the line refreshes as the pen wobbles through its writing stroke |
| `motions/pen-eraser-tip.ts` | The diagonal ferrule stroke `m15 5 4 4` at the eraser end of `pencil` and `pencil-line` | Phase-locked opacity dim `[1, 0.65, 1, 0.82, 1]` so the metal band catches light while the pen wobbles |
| `motions/code-symbol.ts` | The 18 unique chevron d's (9 left brackets + 9 right brackets) across standalone (`code`, `code-xml`) and composites (`file-code`, `file-code-corner`, `folder-code`, `message-circle-code`, `message-square-code`, `square-code`, `square-dashed-bottom-code`, `search-code`) | Round-2 subject (canonical "typing" gesture): left bracket translates `x: [0, +0.8, 0]` (rightward toward centre), right bracket translates `x: [0, -0.8, 0]` (leftward toward centre). Anchorless translate means no pivot dependency — drops cleanly into any composite signature. Per-d lookup via `LEFT_BRACKET_DS` / `RIGHT_BRACKET_DS` sets decides which direction each chevron moves. Exports `CODE_SYMBOL_KEYFRAMES`. Place FIRST in every code-bearing signature |
| `motions/code-xml-slash.ts` | The forward slash `m14.5 4-5 16` between the chevrons in `code-xml` | Phase-locked opacity dim `[1, 0.5, 1]` so the slash dims as the brackets pinch — reads as the XML tag being typed together |
| `motions/arrow-glide.ts` | `matchAnyPath` in any standalone cardinal or diagonal arrow signature (`arrow-up`, `arrow-down`, `arrow-left`, `arrow-right`, `arrow-up-right`, `arrow-up-left`, `arrow-down-right`, `arrow-down-left`) and the `move-*` family | Round-2 subject (canonical "go this way" gesture): anchorless `x` / `y` translate where the direction is looked up per `ctx.iconName` in `ARROW_DIRECTIONS`. Cardinals translate ±1 user unit; diagonals translate ±0.7 per axis (cos/sin 45°). Translate-only means no pivot dependency. Composite state-marker arrows (`file-arrow-up`, `clock-arrow-down`, `circle-arrow-up`, etc.) stay Tier 1 — they draw in via the host family's modifier-reveal, since those tiny corner badges are abstract state indicators not standalone arrows |
| `motions/crown-lift.ts` | `matchAnyPath` for `crown`; branches on the base-line `d` | Coronation lift — the jewelled band translates `y: [0, -1.2, 0.4, 0]` (rises, settles with a small overshoot) + an opacity glint at the apex. The crown's points are all one `<path>`, so they can't rise independently; the whole band lifts as one. The base line `M5 21h14` is the surface it rests on — stays planted with a faint opacity dip for cohesion (polished-shine-sweep archetype, redesigned bespoke per icon) |
| `motions/gem-facet-glint.ts` | `matchAnyPath` for `gem` (3 strokes) | Sharp opacity double-flash `[1, 0.45, 1, 0.8, 1]` + tiny scale contraction around each stroke's own `fill-box` centre, staggered by `ctx.index` so the specular glint travels facet-to-facet. No rotation — a cut gem sparkles by reflection, it doesn't spin (distinct from `starTwinkle`) |
| `motions/medal-sway.ts` | `matchAnyPath` for `medal`; branches to add a glint to the medallion + numeral | Whole-medal rigid-body sway — `rotate: [0, -5, 4, -2, 0]` pivoted at the medallion centre `"12px 17px"`. The disc is a circle centred on the pivot, so it's rotation-invariant and visibly "stays put" while the neck ribbon above swings; rotating as one rigid unit keeps the strap legs joined to the medallion (an `x`-translate on the strap alone tore that join apart, since the legs terminate at the disc's top edge). The medallion + "1" numeral also catch a light glint (`opacity: [1, 0.8, 1, 0.9, 1]`); the cloth strap only sways. ViewBox-safe at ±5° |
| `motions/ribbon-sway.ts` | `matchAnyPath` for `ribbon` | Whole-icon damped rotation `[0, -4, 3, -1.5, 0]`; the signature pivots at `"12px 7px"` (the rosette loop's centre) so the loop barely moves while the tails hanging below swing the most — a pinned prize rosette swaying on its pin. ViewBox-safe at ±4° |
| `motions/tag-dangle.ts` | `matchAnyPath` for `tag` and `tags` | Pendulum dangle `rotate: [0, -5, 4, -2, 0]` around the eyelet hole, looked up per-icon in `TAG_DANGLE_CENTERS` (`tag` → (7.5, 7.5), `tags` → (10.5, 6.5)) and applied as a per-variant `transformOrigin` (same per-iconName pivot pattern as `cog-gear`'s `COG_CENTERS`). The hole sits on the pivot so it stays put; `tags` sets a small `stagger` so the two tags jostle out of phase. ±5° keeps the lowest tip inside the viewBox |
| `motions/bookmark-stick.ts` | The bookmark body across the family (base shape + the 2 fragments `bookmark-off` splits around its slash) via `matchPathDOneOf` | "Stick-in-and-settle" — anchorless `y: [0, 1.4, -0.3, 0]` (`easeOut`) as the marker is pressed into the page and seats. Exports `BOOKMARK_STICK_KEYFRAMES` for the family modifier-reveal to inherit (bell-template host) |
| `motions/bookmark-modifier-reveal.ts` | `matchAnyPath` wildcard for every non-body bookmark-family path: `-check` tick, `-minus` / `-plus` strokes, `-x` strokes, `-off` slash | strokeDasharray + strokeDashoffset draw-in over the measured `ctx.pathLength`, completing at `t = 0.4` (the bookmark's deepest push), + inherited `BOOKMARK_STICK_KEYFRAMES.y` so the marker rides the bob. Translate carries no orientation, safe to inherit for every marker shape. Closed via `transitionEnd`. Place LAST in the compose list |
| `motions/ban-strike.ts` | `banRing` matches `ban`'s `<circle cx=12 cy=12 r=10>`; `banSlashStrike` matches the diagonal slash `M4.929 4.929 19.07 19.071` | The ring holds steady with a firm uniform attention pulse (`scale: [1, 0.96, 1]` + opacity, in place around its own centre — never translates, so it reads as staying put); the slash strikes through via strokeDashoffset draw-in completing at the ring's apex (`t = 0.4`) and inherits the ring's uniform scale (safe on the 45° diagonal — no flattening). Exports `BAN_RING_KEYFRAMES` |
| `motions/alert-sign.ts` | `alertSignPulse` matches the host `circle-alert` ring (`<circle cx=12 cy=12 r=10>`) + the `triangle-alert` body `<path>`; `alertExclamationFlash` matches the `!` stem + dot (the `<line>`s at x=12 in `circle-alert`, the `<path>`s `M12 9v4` / `M12 17h.01` in `triangle-alert`) | The sign does a subtle UNIFORM `scale: [1, 0.95, 1, 0.97, 1]` attention flinch (uniform so the circle stays a circle, not an oval) + opacity dip; the exclamation blinks sharply (`opacity: [1, 0.25, 1, 0.5, 1]`) and inherits the uniform scale (preserves the vertical stem — no distortion). A flash, not a draw-in — an alert `!` blinks, it doesn't stroke on. Exports `ALERT_SIGN_KEYFRAMES`. Shared by both alert icons |
| `motions/atom/spin.ts` | (factory only, no matches) | Pure rotation math; reused by `loader-spin` and other rotation signatures |

Update this table when you add a new motion module.

## 7. Family roadmap

> **Read first:** the authoritative priority order now lives in
> `.claude/skills/lucide-signature.md` Step 2 ("primitives-first"). It
> covers the host-primitive table (file envelope, calendar frame,
> badge shell, ...) that should be authored before composite families.
> The family list below is the **third pass** — rich-physics families
> that don't decompose into primitives.

Before picking a family to work on, run the coverage report:

```bash
pnpm --filter lucide-motion status        # human-readable
pnpm --filter lucide-motion status --all  # include every pending family
pnpm --filter lucide-motion status --json # for tooling
```

The report groups every Lucide icon by family (first hyphen segment) and
labels each family **done**, **partial**, or **pending**. It's sourced
directly from `src/modes/signatures/`, so it never goes stale.

The list below is a suggested **priority order** for tackling rich-
physics pending families after primitives are covered — picked for
impact and motion clarity, not exhaustive. Use the status command for
what's left; use this list for what to do next. Each family is
self-contained — finish one, get review, then start the next.

**Tier-2-rich families (highest impact):**

1. **`heart-*`** — heart, heart-crack, heart-handshake, heart-off,
   heart-pulse. Already have base `heartBeat`. Variants need: crack-
   line reveal (Tier 1), handshake clasp (Tier 2?), off-slash (Tier
   1), pulse-line (Tier 2 ECG-style sweep).

2. **`clock-*`** — clock, clock-{1..12}, alarm-clock, alarm-clock-*,
   timer, timer-*, watch, hourglass. Each clock variant needs hour-
   hand (slow tick) and minute-hand (faster tick) animated
   independently; face is static. Hourglass is its own thing (sand
   fall, Tier 2).

3. **`sun-*` / `moon-*`** — sun, sunrise, sunset, sun-medium, sun-
   snow, sun-dim, sun-moon, moon, moon-star. Sun + moon families
   done. Sun uses `sunRayPulse` (per-path scale-outward + opacity
   cascade) for every variant; composites layer element-specific
   motions (`moonGlow` for sun-moon's crescent, `snowflakeTwinkle`
   for sun-snow). Moon uses opacity-only `moonGlow` (reflected
   light, no radial scale); `moon-star` adds the four-pointed
   `moonStarTwinkle` pivoting at the star's own centre. The
   `sunrise` / `sunset` icons are still pending — they're in the
   `sunrise`/`sunset` first-hyphen families, not the `sun-*` group.

4. **`cloud-*` + `droplet*` + `umbrella`** — Whole group done:
   cloud (20/20), droplet (2/2), droplets (1/1), umbrella (2/2).
   `cloudBody` anchors every cloud variant; weather elements get
   bespoke physics — `cloudRainDrops`, `cloudSnowDots`,
   `cloudFogStreaks`, `cloudLightningBolt`. UI variants use
   `cloudModifierReveal`. Composites reuse `sunRayPulse` and
   `moonGlow`. The water-drop icons (`droplet`, `droplets`,
   `droplet-off`) use `dropletShimmer` (y-bob + surface-tension
   contraction) and inherit-coupled modifier reveals. Umbrellas
   sway via `umbrellaCanopy` (scale + rotate + opacity).

5. **`flame*` / `fire`** — flame (2/2) and fire (1/1) families
   done. The flame teardrop in `flame` + `flame-kindling` flickers
   via `flameFlicker` (contraction-only scaleY + rotation sway +
   opacity flicker, pivoted at the flame's base). The kindling
   sticks underneath glow via `flameKindlingEmbers` and inherit
   the flame's sway. `fire-extinguisher` (the only `fire-*` icon)
   isn't actual fire, so it gets a subtle device-armed pulse via
   `fireExtinguisherReady` rather than flame physics. `candle` is
   not currently in Lucide's set; if it ever lands, expect a
   flame-flicker on the tip + a steady-stem motion.

6. **`loader-*` / `refresh-*` / `rotate-*`** — loader (3/3) and
   refresh (4/4) done. Loader variants use continuous rotation
   (`loaderSpin` linear, `loaderCircleSweep` surge-and-settle,
   `loaderPinwheelBlade` gust-driven with per-blade reflectance).
   Refresh uses a mechanical wind-up: scale contracts to 0.85 to
   pull the corner tick marks (at radius √162 ≈ 12.73, outside
   the viewBox's inscribed circle) safely inside, performs one
   full 360° revolution in the named direction *while
   contracted*, then expands back to rest. Reads as the
   canonical refresh-button gesture without clipping the corner
   caps at intermediate angles. `rotate-*`, `repeat-*` are still
   pending; expect them to reuse the rotation atoms where the
   geometry allows.

7. **`wifi-*` / `signal-*` / `volume-*`** — wifi, wifi-{high,low,off,
   zero}, signal, signal-{high,low,medium,zero}, volume, volume-x,
   volume-1, volume-2. Tier 2 wave/bar radiation from center
   outward.

**Tier-1-dominant families (medium impact):**

8. **`battery-*`** — battery, battery-charging, battery-full, battery-
   low, battery-medium, battery-plus, battery-warning (7/7 done).
   Charge cells use a visible-at-rest voltage ripple rather than
   draw-on; charging bolt flashes as incoming current; plus/warning
   markers pulse/blink through the family modifier motion.

9. **`mail-*` / `send`** — mail, mail-open, mail-plus, mail-minus,
   mail-check, mail-x, mail-warning, mail-question-mark, mail-search
   (9/9 mail done), send, send-horizontal. Envelope flap is Tier 2;
   markers pulse/blink without draw-on; send is paper-plane flight.

10. **`mic-*` / `mic-off`** — microphone pulsing during active state,
    cross-out for off variant.

**Directional and UI families (lower impact, can be done fast in
batches):**

11. **`arrow-*` / `chevron-*` / `move-*`** — small directional
    nudge in the indicated direction. Could share a `directional-
    nudge` motion module.

12. **`play` / `pause` / `stop` / media controls** — subtle motion
    on activation (play has the famous "morph to pause" — out of
    scope, just animate stroke).

13. **`search`** — magnifying glass wobble or scan.

**Decorative / one-off (do as opportunistic):**

- `sparkle*` / `sparkles` — twinkle (reuse `starTwinkle`?)
- `zap` ✓ done (2/2) — translate descent from above viewBox + multi-flash flicker; cloud-lightning's bolt rewritten to the same physics
- `atom` — orbiting electrons
- `compass` — needle rotation
- `gauge` — needle sweep
- `wind` — drift lines
- `leaf` — fall + spin
- `waves` — oscillation

**Abstract archetypes (icons without a real-world referent):**

Every icon gets a signature — no skip list. Icons whose subject has no
real-world physical motion route through the abstract archetype
catalog. Mechanics are defined in the skill
(`.claude/skills/lucide-signature.md`, step 1 "Abstract archetype
catalog"); the family-to-archetype routing is below.

| Archetype | Families |
| --- | --- |
| **Typewriter stamp** | Typography: `a-arrow-*`, `a-large-small`, `ampersand`, `ampersands`, `asterisk`, `baseline`, `bold`, `case-*`, `heading`, `heading-1..6`, `italic`, `pilcrow`, `pilcrow-left`, `pilcrow-right`, `strikethrough`, `subscript`, `superscript`, `text-align-*`, `text-cursor`, `type` |
| **Vertex sequence pulse** | Geometric primitives: `astroid`, `circle`, `cone`, `cube`, `cylinder`, `diamond`, `dot`, `hexagon`, `line-squiggle`, `octagon`, `parallelogram`, `pentagon`, `shapes`, `slash`, `spline`, `square`, `triangle` |
| **Literal-depiction motion** | Brand marks doubling as an object: `apple` (fruit bob) |
| **Alignment action** | Layout/alignment: `align-*` (22), `columns-*`, `rows-*`, `grid-*`, `panel-*`, `dock`, `layout-*`, `sidebar`, `kanban`, `sheet`, `wall`, `split` |
| **Device interaction** | UI device depictions: `monitor`, `tv`, `smartphone`, `laptop`, `tablet`, `computer`, `keyboard`, `mouse`, `server`, `database`, `hard-drive*`, `app-window`, `app-window-mac` |
| **Window-lights + settle** | Buildings, furniture, static objects: `building*`, `house*`, `castle`, `church`, `factory`, `hospital`, `hotel`, `landmark`, `school`, `store`, `university`, `warehouse`, `lamp-*`, `armchair`, `bath`, `bed*`, `couch`, `sofa`, `refrigerator`, `fence`, `tent` |
| **Polished shine sweep** | Badges, awards, alerts, status markers: `badge-*`, `award`, `crown`, `gem`, `medal`, `ribbon`, `shield*`, `tag*`, `bookmark*`, `ban`, `circle-alert`, `triangle-alert`, `square-alert` |
| **Expression intensification** | Emoji faces: `smile`, `smile-plus`, `angry`, `laugh`, `frown`, `meh`, `annoyed` |

Each archetype is implemented as a single reusable motion factory
(`makeTypewriterStamp`, `makeVertexSequencePulse`, etc.) and unlocks
dozens of icons per archetype rather than per family. Build the
archetype motion once, route the icons through it as a batch.

## 8. Validation & review checklist

Before asking for review on a family:

- [ ] `pnpm --filter lucide-motion generate` runs without
      errors and reports the new icon count with signatures.
- [ ] `pnpm --filter lucide-motion status` shows the family
      transitioned from *partial* (or *pending*) to *done*. Every
      icon gets a signature — if a particular icon's referent has no
      real-world motion, route it through the matching abstract
      archetype (section 7). No skip list.
- [ ] `pnpm typecheck` from repo root — all three turbo tasks pass.
- [ ] `pnpm --filter lucide-motion test` — all resolver tests
      pass.
- [ ] No unexpected console warnings in dev. Any
      `[lucide-motion]` warnings indicate icons that still need
      a signature — they're authoring TODOs, not intentional skips.
- [ ] Visual: open `/playground`, toggle to `signature` mode, hover
      every icon in the family. Each should animate.
- [ ] Visual: each Tier 2 motion *reads as the real thing* (sound
      radiates, flames flicker, hearts beat). No "just scaling" or
      generic motion where physics is expected.
- [ ] Visual: each Tier 1 modifier is quiet enough not to compete
      with the host icon's primary motion.
- [ ] Visual: **every** non-shell path tracks the host through the
      animation — no marker, dot, slash, or internal element sits
      static while the host moves around it.
- [ ] Visual: at peak motion the stroke stays inside the 24×24
      viewBox at default `strokeWidth={2}` — no edge clipping. (Most
      scale motions should be contractions, not expansions.)
- [ ] Every per-value transition uses `inherit: true` so
      `duration` / `delay` / `repeat` propagate down from the parent.
- [ ] Variants reuse base motions; you didn't re-type physics.
- [ ] Each new motion file has a docstring explaining what it
      animates and which icons consume it.
- [ ] The catalog in section 6 of this doc is updated with new
      motions.

## 9. Known pitfalls

**`inherit: true` is required on per-value transitions.** When you
use motion's per-value `transition` to give different properties
different keyframe schedules (the host-coupling pattern — section 5),
each per-value object MUST set `inherit: true` or motion-dom replaces
the parent transition entirely, dropping `duration` / `delay` /
`repeat` and falling back to its 300 ms default. Symptom: a property
animates at the wrong speed or doesn't appear to do anything, and the
modifier ends up out of phase with the rest of the icon. Source:
`getValueTransition` in `motion-dom/animation/utils/get-value-transition.mjs`.

**Scale > 1 clips at the viewBox edges.** The default 24×24 viewBox
plus stroke-width 2 means content can extend from roughly (−1, −1)
to (25, 25) at scale 1, with no margin. Any scale > 1 pushes the
stroke past the SVG, which defaults to `overflow: hidden` — the
peaks of the motion get sliced off at runtime. Design scale rhythms
as contractions (`scale ≤ 1`); they're anatomically more accurate
for most icons (hearts squeeze, they don't balloon) and stay within
bounds at any stroke-width. If a motion genuinely needs to expand
beyond the icon's footprint, that's a signal to use a non-transform
animation (`pathLength`, `opacity`) instead.

**Path `d` strings vary across variants.** Lucide reshapes the base
shape to accommodate modifiers (`bell-plus` carves out the top-right
of the shell). Strict d-string equality means the base motion won't
match unless you extend its `matchPathDOneOf` list. Always check
whether existing motions match the new variant's paths first; extend
the list if they conceptually should but mechanically don't.

**Transform origin is per-signature, not per-path.** If your
signature uses `transformOrigin: "12px 4px"` (top mount) for the
primary motion, any *scale* on a modifier path will scale from that
point too — not from the modifier's own center. This is sometimes
useful thematically (the bell-ring sound waves scaling from the mount
*reads as* radiation). When it isn't, prefer non-transform animations
for the modifier (`pathLength`, `opacity`) so the wrong origin doesn't
fight you.

**Path order is positional and lucide-controlled.** If you author a
signature that branches on `ctx.index === 0`, a future Lucide update
that reorders paths in the icon would silently break the role
mapping. Always prefer matching by path data (`matchPathD`,
`matchPathDOneOf`), not by index.

**`matchAnyPath` is greedy.** It matches every path, including ones
you didn't intend. Always place `matchAnyPath` motions *last* in the
compose `motions` list, so more specific matches get tried first.

**Don't forget to regenerate.** The codegen reads
`src/modes/signatures/` at generate-time. Writing a new signature
without re-running `pnpm generate` means the icon's wrapper won't
import it. The `prebuild` and `predev` scripts handle this
automatically; you only need to run it manually after writing a
signature outside of those flows.

**The dev warning is your friend.** When something doesn't animate
correctly, check the dev console — browser-side for client renders,
terminal-side for the Next.js server during SSR. The engine warns
once per unmatched path with the iconName, index, and tag. That tells
you exactly which path needs a motion module.

---

## Companion references

- **Authoritative authoring guide**: `.claude/skills/lucide-signature.md` (read this first; this doc is a deeper reference for sections 2, 4, 5, 6, 7, 8).
- **Architecture overview**: this doc, sections 2 and 5.
- **Tier definitions and overlay-marker rules**: the skill is authoritative; this doc's section 3 is a summary.
- **Engine source**: the library workspace `src/engine.tsx`.
- **Compose source**: the library workspace `src/modes/compose.ts`.
- **Memory** (across Claude sessions): `feedback_signature_design.md` (tier rule and host-coupling history), `feedback_animation_temporal_review.md` (three-criteria check), `feedback_phase_review.md` (per-phase self-review).

This doc is point-in-time; the source of truth for any specific
behavior is the engine + compose code. If the doc and code disagree,
the code wins — and please update the doc.
