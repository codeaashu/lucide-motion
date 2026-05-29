import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The small four-pointed sparkle next to the crescent in `moon-star`.
 * Lucide draws it as two short crossing strokes — a horizontal at
 * (18,5)→(22,5) and a vertical at (20,3)→(20,7) — that together form
 * a "+" shape in the icon's upper-right.
 *
 * Tier 2 motion: a star twinkles by light intensity flicker — its
 * apparent brightness fluctuates as atmospheric turbulence bends the
 * light from a distant point source. Modeled here as two scale +
 * opacity contractions back toward the star's centre: the star
 * briefly "implodes" to a small, dim point and re-emerges twice
 * before settling at its rest size. Reads as twinkle while staying
 * entirely within the natural icon footprint — no scale ever exceeds
 * 1, so nothing can leak past the 24×24 viewBox even when the stroke
 * scales with the transform.
 *
 * **Pivot**: the `moon-star` signature sets its `transformOrigin` to
 * `"20px 5px"` — the star's geometric centre — so this scale animates
 * in place rather than translating the sparkle toward the icon centre.
 * The opacity-only `moonGlow` on the crescent is unaffected by that
 * off-centre origin, so both motions can coexist cleanly.
 *
 * Per principle 3: contraction-only (`scale ≤ 1`) is the correct
 * design for a path whose rest pose sits this close to the viewBox
 * edge. Scaling above 1 multiplies the stroke radius along with the
 * geometry, and the horizontal sparkle's right endpoint at (22, 5)
 * has no headroom for a thicker stroke. Contractions take the strokes
 * inward toward the origin, never outward.
 */
const STAR_PATHS = [
  "M18 5h4",
  "M20 3v4",
];

export const moonStarTwinkle: Motion = {
  matches: matchPathDOneOf(...STAR_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.4, 1, 0.6, 1],
      opacity: [1, 0.3, 1, 0.55, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: [0, 0.2, 0.5, 0.75, 1],
        repeat: ctx.repeat,
      },
    },
  }),
};
