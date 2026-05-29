import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The umbrella's structural paths — handle (curving down-right at
 * the base), tip (short stub at the top), and canopy (the big arc
 * over the icon). Catches all three in `umbrella` and the same plus
 * the upper + lower canopy fragments in `umbrella-off`.
 *
 * Tier 2 motion: a held umbrella reacts to wind — the canopy
 * catches air and the whole assembly sways slightly. Modeled here
 * as a gentle rotation (the wind catch) layered with a small scale
 * contraction (the canopy "drawing in" against gusts) and an
 * opacity dim. Per-axis amplitudes are small so the canopy edges
 * stay safely inside the viewBox at the rotation peak.
 *
 * Pivot: the signature uses the default `transformOrigin` of
 * (12, 12) — roughly the centre of the umbrella's mass and a
 * reasonable approximation of where the held handle would resist
 * the wind.
 *
 * Exports `UMBRELLA_KEYFRAMES` for the family's modifier reveal to
 * inherit (so the off-slash breathes with the umbrella).
 */
export const UMBRELLA_KEYFRAMES = {
  scale: [1, 0.96, 0.98, 1],
  rotate: [0, -2.5, 1.5, 0],
  opacity: [1, 0.92, 0.97, 1],
  times: [0, 0.3, 0.65, 1],
};

const UMBRELLA_PATHS = [
  // Handle (umbrella + umbrella-off)
  "M12 13v7a2 2 0 0 0 4 0",
  // Tip (umbrella + umbrella-off)
  "M12 2v2",
  // Full canopy (umbrella)
  "M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z",
  // Upper canopy fragment (umbrella-off)
  "M18.656 13h2.336a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-12.07-7.51",
  // Lower canopy fragment (umbrella-off)
  "M5.961 5.957a10.28 10.28 0 0 0-3.922 5.769A1 1 0 0 0 3 13h10",
];

export const umbrellaCanopy: Motion = {
  matches: matchPathDOneOf(...UMBRELLA_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1, rotate: 0, opacity: 1 },
    active: {
      scale: UMBRELLA_KEYFRAMES.scale,
      rotate: UMBRELLA_KEYFRAMES.rotate,
      opacity: UMBRELLA_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: UMBRELLA_KEYFRAMES.times,
        repeat: ctx.repeat,
      },
    },
  }),
};
