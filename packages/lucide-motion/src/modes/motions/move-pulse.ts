import { matchAnyPath, type Motion } from "../compose";

/**
 * Indeterminate-direction move icons — `move` (4-way cross), `move-
 * horizontal`, `move-vertical`, `move-diagonal`, `move-diagonal-2`,
 * `move-3d`. These icons signal "this thing is movable" without
 * specifying a single direction, so a directional glide would
 * misrepresent them. Instead, a subtle uniform scale pulse + opacity
 * dim reads as "movement available" without committing to an axis.
 *
 * matchAnyPath inside each signature so every element (axis lines,
 * arrow heads, brackets) pulses together as one cohesive "ready to
 * move" gesture.
 */
export const movePulse: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.92, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        scale: { inherit: true, ease: "easeInOut", times: [0, 0.4, 1] },
        opacity: { inherit: true, ease: "easeInOut", times: [0, 0.4, 1] },
      },
    },
  }),
};
