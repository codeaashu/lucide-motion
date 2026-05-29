import { matchAnyPath, type Motion } from "../compose";

/**
 * Generic "modifier reveals itself during the action" motion. Used by every
 * bell variant whose modifier is a path: `bell-plus`, `bell-minus`,
 * `bell-check`, `bell-off`, `bell-ring`. The modifier starts invisible and
 * draws itself in mid-way through the ring, so the bell appears to ring
 * *and then* the modifier registers (a "+ was added", "× cancelled it",
 * "✓ confirmed it"). At the end of the animation the modifier stays
 * visible, matching the icon's resting state.
 *
 * Uses `strokeDashoffset` + `opacity` so no transform origin is needed —
 * works cleanly under the bell's `12px 4px` mount pivot without scaling
 * from the wrong point. Animates against a measured `ctx.pathLength` and
 * clears the dash attrs via `transitionEnd` so the resting stroke is
 * solid and seam-free, matching Lucide's static SVG visually (see
 * `src/modes/draw.ts`).
 *
 * Wildcard match: place this last in the compose `motions` list so the
 * shell and clapper get matched first; whatever's left is the modifier.
 */
export const modifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        times: [0, 0.2, 0.55],
        ease: "easeOut",
        repeat: ctx.repeat,
        // Snap the dash size; the offset is what animates.
        strokeDasharray: { duration: 0 },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
