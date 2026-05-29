import { matchAnyPath, type Motion } from "../compose";

/**
 * `ribbon` — a prize rosette: a looped ribbon knotted at the centre
 * with two tails hanging below in a V. Pinned through its centre, the
 * whole rosette sways gently on its pin and the hanging tails trail
 * the motion.
 *
 * Implemented as a whole-icon damped rotation `[0, -4, 3, -1.5, 0]`.
 * The signature pivots at `"12px 7px"` — the centre of the rosette
 * loop — so the loop barely moves (it sits on the pivot) while the
 * tails, far below at y≈14–21, swing the most. All five paths rotate
 * as one rigid object, so nothing disconnects.
 *
 * ViewBox-safe: the furthest point (a tail tip near (6, 21)) sits at
 * radius ≈15.7 from the (12, 7) pivot; a 4° rotation displaces it
 * ≈1.1 units, comfortably inside the 24×24 frame.
 *
 * `matchAnyPath` — the only motion in `ribbon`'s compose list.
 */
export const ribbonSway: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { rotate: 0 },
    active: {
      rotate: [0, -4, 3, -1.5, 0],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.25, 0.55, 0.8, 1],
      },
    },
  }),
};
