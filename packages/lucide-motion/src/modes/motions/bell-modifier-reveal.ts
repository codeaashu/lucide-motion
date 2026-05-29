import { matchAnyPath, type Motion } from "../compose";
import { BELL_SHELL_KEYFRAMES } from "./bell-shell";

/**
 * Bell-family wildcard reveal — a delayed stroke draw-in plus the host
 * `bellShell` rotation so every non-shell non-clapper path in a bell
 * variant rocks *with* the bell instead of floating statically over a
 * swinging icon.
 *
 * Catches whatever's left after `bellShell` and `bellClapper` match:
 * - bell-plus / bell-minus / bell-check marker strokes
 * - bell-off's diagonal slash
 *
 * The reveal animates `strokeDashoffset` against a measured
 * `ctx.pathLength` instead of Motion's `pathLength` shortcut (which
 * leaves `pathLength="1"` + `stroke-dasharray="1 1"` on the DOM at
 * rest, re-introducing the closed-path seam). `transitionEnd` resets
 * both dash attrs to 0 after the play so the resting stroke stays
 * solid and seam-free. See `src/modes/draw.ts` for the canonical pattern.
 *
 * Rotate uses `inherit: true` so the host transition's duration / delay
 * / repeat propagate down. Without that, motion-dom replaces the
 * parent transition entirely and the per-value block falls back to its
 * default 300 ms — completely out of phase with the bell's 1 s rock.
 *
 * Place this last in the compose `motions` list so the shell and
 * clapper get tried first; whatever's left is the modifier.
 */
export const bellModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      rotate: 0,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      rotate: BELL_SHELL_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // Snap the dash size so the draw-in is a clean offset sweep,
        // not a tweening dash pattern.
        strokeDasharray: { duration: 0 },
        // Reveal runs on its own delayed-draw schedule.
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        // Rotate piggybacks on the host bell shell's damped rock.
        rotate: {
          inherit: true,
          ease: BELL_SHELL_KEYFRAMES.ease,
          times: BELL_SHELL_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
