import { matchAnyPath, type Motion } from "../compose";

/**
 * `gem` — a cut gemstone catching light. Lucide draws the gem as three
 * strokes: the outer faceted outline, the central facet-V lines, and
 * the horizontal girdle (table) line. A real gem doesn't move; its
 * character is the sharp specular flash as light strikes each facet in
 * turn.
 *
 * `gemFacetGlint` gives each stroke a quick double-flash (`opacity`
 * dipping sharply then recovering, twice) plus a barely-perceptible
 * `scale` contraction for sparkle. Staggered across the three paths via
 * `ctx.index` (the signature sets a non-zero `stagger`) so the glint
 * travels facet-to-facet rather than the whole gem pulsing at once.
 *
 * Distinct from `starTwinkle` — no rotation wobble, because a cut gem
 * sparkles by reflection without spinning. Contraction-only and
 * pivoted at each path's own bbox centre via `fill-box` (principle 3).
 */
export const gemFacetGlint: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      opacity: 1,
      scale: 1,
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
    },
    active: {
      opacity: [1, 0.45, 1, 0.8, 1],
      scale: [1, 0.96, 1, 0.99, 1],
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.2, 0.45, 0.7, 1],
      },
    },
  }),
};
