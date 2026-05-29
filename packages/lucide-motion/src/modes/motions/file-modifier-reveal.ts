import { matchAnyPath, type Motion } from "../compose";
import { FILE_ENVELOPE_KEYFRAMES } from "./file-envelope";

/**
 * File-family wildcard reveal — a delayed stroke draw-in plus the
 * host body's y bob so every non-body non-corner path in a file-*
 * variant bobs *with* the page instead of floating statically over a
 * settling document.
 *
 * Catches whatever's left after `fileEnvelope` claims the body and
 * folded corner:
 * - file-plus / file-minus / file-check / file-x marker strokes
 *   (and their `*-corner` siblings where the marker sits in the
 *   fold area)
 * - file-question-mark's `?` curve and dot
 * - file-exclamation-point's `!` stroke and dot
 *
 * The reveal animates `strokeDashoffset` against the measured
 * `ctx.pathLength` and clears the dash attrs on `transitionEnd` so
 * the resting stroke stays solid and seam-free, matching Lucide's
 * static SVG visually (see `src/modes/draw.ts` for the canonical pattern).
 *
 * The reveal completes AT the body's settle peak (t = 0.4, the moment
 * the page lands) — the marker stamps the page in step with the
 * landing, then holds while the body rebounds. `y` inherits the body
 * bob so the marker travels with the page as one rigid stamp.
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath` is
 * greedy and would otherwise claim the body and corner paths first.
 */
export const fileModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      y: 0,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      // Mirror the [0, 0, 1] reveal shape: hidden during the
      // anticipation beat, then draws on by the settle peak. With
      // strokeDashoffset, "hidden" is offset=length and "drawn" is
      // offset=0.
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      // Bob in lockstep with the body so the marker stays anchored
      // to the page through the settle.
      y: FILE_ENVELOPE_KEYFRAMES.bodyY,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // Snap the dash size so the draw-in is a clean offset sweep,
        // not a tweening dash pattern.
        strokeDasharray: { duration: 0 },
        // Strike completes at t = 0.4 — exactly when the body
        // reaches its settle peak. Marker stamps the page on
        // landing impact, then holds drawn through the rebound.
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        // Y piggybacks on the host body's bob.
        y: {
          inherit: true,
          ease: "easeInOut",
          times: FILE_ENVELOPE_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
