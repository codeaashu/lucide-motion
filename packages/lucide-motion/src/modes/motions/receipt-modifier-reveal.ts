import { matchAnyPath, type Motion } from "../compose";
import { RECEIPT_BODY_KEYFRAMES } from "./receipt-body";

/**
 * Receipt-family wildcard reveal — every non-body path is a
 * currency symbol or text line printed on the receipt. Each draws
 * in at the body's retraction apex, then inherits BOTH the body's
 * `scaleY` and `opacity` so the printed content retracts and dims
 * WITH the paper (principle 2 — cohesion).
 *
 * `strokeDasharray` + `strokeDashoffset` against `ctx.pathLength`,
 * cleared on `transitionEnd`. Reveal completes at `t = 0.4`
 * (the body's retraction apex). Opacity tracks
 * `RECEIPT_BODY_KEYFRAMES.opacity` from 0 — `[0, 0, 0.78, 1]`.
 * `scaleY` inherits the body's contraction directly so payloads
 * compress and re-extend with the paper.
 *
 * Every receipt variant's non-body anatomy is a `<path>`, so no
 * shape branch is needed — there are no `<circle>` / `<rect>`
 * markers in the family.
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath`
 * is greedy.
 */
export const receiptModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      scaleY: 1,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 0.78, 1],
      scaleY: RECEIPT_BODY_KEYFRAMES.scaleY,
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
        scaleY: {
          inherit: true,
          ease: "easeInOut",
          times: RECEIPT_BODY_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
