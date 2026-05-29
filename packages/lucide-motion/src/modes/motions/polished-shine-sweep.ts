import { matchAnyPath, type Motion } from "../compose";

/**
 * Polished-shine-sweep archetype — the canonical motion for awards,
 * badges, gems, medals, ribbons, alerts, tags, and bookmark-like
 * icons whose subject has no real-world characteristic motion but
 * is depicted as a polished surface that catches light.
 *
 * Implemented as a brief uniform contraction + opacity dim around
 * each path's own bbox centre — same mechanism as `badgeShell`
 * (the precedent for this archetype). Reads as the surface
 * catching light, the highlight passing, the surface relaxing.
 *
 * Per-element `transformOrigin: "50% 50%"` + `transformBox:
 * "fill-box"` so each shape pulses around its own centre, working
 * cleanly for compound icons (e.g. `tags` with two tag shapes,
 * `medal` with ribbon strands + medallion).
 *
 * Contraction-only per principle 3.
 *
 * Coverage: `award`, `crown`, `gem`, `medal`, `ribbon`, `tag`,
 * `tags`, `bookmark`, `bookmark-check`, `bookmark-minus`,
 * `bookmark-plus`, `bookmark-x`, `bookmark-off`, `ban`,
 * `circle-alert`, `triangle-alert`.
 */
export const POLISHED_SHINE_SWEEP_KEYFRAMES: {
  scale: number[];
  opacity: number[];
  times: number[];
} = {
  scale: [1, 0.94, 1],
  opacity: [1, 0.75, 1],
  times: [0, 0.4, 1],
};

export const polishedShineSweep: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      scale: 1,
      opacity: 1,
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
    },
    active: {
      scale: POLISHED_SHINE_SWEEP_KEYFRAMES.scale,
      opacity: POLISHED_SHINE_SWEEP_KEYFRAMES.opacity,
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: POLISHED_SHINE_SWEEP_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: POLISHED_SHINE_SWEEP_KEYFRAMES.times,
        },
      },
    },
  }),
};
