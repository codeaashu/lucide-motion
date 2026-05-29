import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The flame outline used by `flame` and `flame-kindling` — the
 * classic teardrop shape that draws a flame in profile.
 *
 * Tier 2 motion: real flames don't translate up and down — they
 * *flicker* irregularly in height as the air feeding the base
 * changes, *lean* side-to-side as drafts push the tongue, and
 * pulse in brightness as the hot core gets exposed and re-covered.
 * Modeled here as three layered keyframe arrays:
 *
 * - `scaleY`: contraction-only flicker (the flame briefly shrinks
 *   downward toward its base — per principle 3 and the moon-star
 *   stroke lesson, never exceeds rest). Six irregular dips read as
 *   asymmetric flicker rather than a steady pulse.
 * - `rotate`: ±2° sway around the flame's base (set per-signature
 *   as the `transformOrigin`). The tip wobbles side-to-side while
 *   the base stays anchored — the natural way a held flame leans
 *   when a draft hits it.
 * - `opacity`: irregular brightness flicker as the hot core gets
 *   alternately exposed and shrouded.
 *
 * **Pivot**: the signature sets `transformOrigin` to the flame's
 * base (≈ "12px 16px" for `flame`, "12px 15px" for `flame-kindling`
 * — slightly different because the kindling-variant's teardrop is
 * a touch smaller). With the pivot at the base, both `scaleY`
 * contractions and `rotate` sways work the way real flames do —
 * the base sits steady, the tip dances.
 *
 * Exports `FLAME_KEYFRAMES` so the kindling embers can inherit the
 * rotate sway and stay loosely tied to the flame's flicker.
 */
export const FLAME_KEYFRAMES = {
  scaleY: [1, 0.96, 1, 0.92, 0.97, 0.94, 1],
  rotate: [0, 2, -2, 1, -1, 0.5, 0],
  times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
};

const FLAME_PATHS = [
  // flame.tsx
  "M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",
  // flame-kindling.tsx
  "M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z",
];

export const flameFlicker: Motion = {
  matches: matchPathDOneOf(...FLAME_PATHS),
  factory: (ctx) => ({
    rest: { scaleY: 1, rotate: 0, opacity: 1 },
    active: {
      scaleY: FLAME_KEYFRAMES.scaleY,
      rotate: FLAME_KEYFRAMES.rotate,
      opacity: [1, 0.82, 1, 0.88, 1, 0.93, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: FLAME_KEYFRAMES.times,
        repeat: ctx.repeat,
      },
    },
  }),
};
