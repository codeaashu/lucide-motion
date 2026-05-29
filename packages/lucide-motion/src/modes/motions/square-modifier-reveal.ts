import { matchAnyPath, type Motion } from "../compose";
import { SQUARE_SHELL_KEYFRAMES } from "./square-shell";

/**
 * Square-family wildcard reveal — every non-shell path reveals at
 * the shell's light-beat apex, then inherits BOTH the shell's scale
 * and opacity for the rest of the cycle so payloads pulse WITH the
 * square (principle 2 — cohesion).
 *
 * Catches state markers (check, x, plus, minus, asterisk, slash,
 * divide, equal, dot, percent, ...) AND symbol/content payloads
 * (pi, sigma, radical, function f, m, menu lines, kanban bars,
 * activity trace, terminal prompt, library spines, chart-gantt
 * bars, chevrons, arrows, etc.).
 *
 * Branches by element type:
 *
 * - `<path>` / `<line>` → `strokeDasharray` + `strokeDashoffset`
 *   draw-in over the measured `ctx.pathLength` (cleared on
 *   `transitionEnd`).
 * - `<circle>` / `<rect>` → `scale` from 0, pivoted at the
 *   element's own `fill-box` centre (so the reveal stamps in
 *   place, not from the icon centre — important for off-centre
 *   payloads like `square-dot`'s circle at (12, 12), or the
 *   `<rect>` payloads in `square-stop` and `square-square`).
 *
 * Reveal completes at `t = 0.4` (the shell's light-beat apex).
 * Opacity tracks `SQUARE_SHELL_KEYFRAMES.opacity` from 0 —
 * `[0, 0, 0.78, 1]` — so the payload emerges into the shell's
 * dim. Scale inherits the shell's contraction directly — uniform
 * in-plane scale is safe to direct-inherit per principle 2's
 * first branch (no orientation distortion).
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath`
 * is greedy and would otherwise claim the shell.
 */
export const squareModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const isShape = ctx.pathTag === "circle" || ctx.pathTag === "rect";
    if (isShape) {
      return {
        rest: {
          scale: 1,
          opacity: 1,
          transformBox: "fill-box",
          transformOrigin: "center",
        },
        active: {
          scale: [0, 0, 1],
          opacity: [0, 0, 0.78, 1],
          transformBox: "fill-box",
          transformOrigin: "center",
          transition: {
            duration: ctx.duration,
            delay: ctx.delay + ctx.index * ctx.stagger,
            repeat: ctx.repeat,
            scale: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.4] },
            opacity: {
              inherit: true,
              ease: "easeOut",
              times: [0, 0.2, 0.4, 1],
            },
          },
        },
      };
    }
    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        opacity: 1,
        scale: 1,
      },
      active: {
        strokeDasharray: ctx.pathLength,
        strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
        opacity: [0, 0, 0.78, 1],
        scale: SQUARE_SHELL_KEYFRAMES.scale,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          strokeDasharray: { duration: 0 },
          strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.4] },
          opacity: {
            inherit: true,
            ease: "easeOut",
            times: [0, 0.2, 0.4, 1],
          },
          scale: {
            inherit: true,
            ease: "easeInOut",
            times: SQUARE_SHELL_KEYFRAMES.times,
          },
        },
        transitionEnd: {
          strokeDasharray: 0,
          strokeDashoffset: 0,
        },
      },
    };
  },
};
