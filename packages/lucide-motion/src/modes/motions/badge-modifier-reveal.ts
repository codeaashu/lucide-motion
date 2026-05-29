import { matchAnyPath, type Motion } from "../compose";
import { BADGE_SHELL_KEYFRAMES } from "./badge-shell";

/**
 * Badge-family wildcard reveal — a delayed stroke draw-in plus the
 * host shell's `scale` so every non-shell path in a badge-* variant
 * pulses *with* the medallion instead of floating statically over a
 * light-catching shell.
 *
 * Catches whatever's left after `badgeShell` claims the wavy outline:
 *
 * - State markers: `badge-check`'s tick, `badge-x`'s strokes,
 *   `badge-plus`'s and `badge-minus`'s lines, `badge-alert`'s
 *   exclamation, `badge-info`'s `i`, `badge-percent`'s diagonal +
 *   dots, `badge-question-mark`'s `?`.
 * - Currency payloads (typography stamped on the medallion):
 *   `badge-cent`, `badge-dollar-sign`, `badge-euro`,
 *   `badge-indian-rupee`, `badge-japanese-yen`,
 *   `badge-pound-sterling`, `badge-russian-ruble`,
 *   `badge-swiss-franc`, `badge-turkish-lira`. These are emblems
 *   stamped onto the badge — the same draw-in + inherited shell
 *   pulse reads as "currency mark stamped, badge catches light."
 *
 * The reveal animates `strokeDashoffset` against the measured
 * `ctx.pathLength` and clears the dash attrs on `transitionEnd` so the
 * resting stroke stays solid and seam-free, matching Lucide's static
 * SVG visually (see `src/modes/draw.ts` for the canonical pattern). Works for both
 * `<path>` and `<line>` because both expose `getTotalLength()`.
 *
 * Strike completes at `t = 0.4` — exactly when the shell reaches its
 * light-beat apex. The marker stamps the medallion AT the moment it
 * lights up, then holds drawn through the relaxation.
 *
 * Scale piggybacks on `BADGE_SHELL_KEYFRAMES.scale` (uniform,
 * in-plane — safe to inherit directly per principle 2's first branch;
 * no orientation distortion on diagonals or orthogonals).
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath` is
 * greedy and would otherwise claim the shell.
 */
export const badgeModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      scale: 1,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      // Scale piggybacks on the host shell's light beat.
      scale: BADGE_SHELL_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // Snap the dash size so the draw-in is a clean offset sweep.
        strokeDasharray: { duration: 0 },
        // Strike completes at t = 0.4 — the shell's apex.
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: BADGE_SHELL_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
