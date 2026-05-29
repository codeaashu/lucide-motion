import { matchPathDOneOf, type Motion } from "../compose";
import { RECEIPT_BODY_KEYFRAMES } from "./receipt-body";

/**
 * Receipt-text line cascade for `receipt-text`. Lucide draws three
 * horizontal lines at y = 8, 12, 16 (`M14 8H8`, `M16 12H8`,
 * `M13 16H8`) — the printed line items. Same gesture as
 * `messageSquareTextLines`: each line drops in from above its rest
 * position, one after the other (top → middle → bottom), like
 * items being printed onto the receipt.
 *
 * - Line 1 (y = 8)  → drops in `t ∈ [0.001, 0.3]`
 * - Line 2 (y = 12) → drops in `t ∈ [0.3, 0.55]`
 * - Line 3 (y = 16) → drops in `t ∈ [0.55, 0.8]`
 *
 * Each line teleports up to `y = -3` (invisible via `opacity = 0`)
 * at the start, then drops back to its rest position at its own
 * staggered window. Bookend at rest pattern matches
 * `message-square-text-lines`.
 *
 * Lines also inherit `scaleY` from `RECEIPT_BODY_KEYFRAMES` so
 * they retract with the receipt's paper-feed gesture.
 *
 * Place this BETWEEN `receiptBody` and `receiptModifierReveal` in
 * `receipt-text`'s compose list so it claims the three line paths
 * with Tier 2 cascade physics instead of the wildcard's plain
 * draw-in.
 *
 * Closed cycle: y and opacity both start AND end at their rest
 * values.
 */
const LINE_PATHS = ["M14 8H8", "M16 12H8", "M13 16H8"] as const;

const matchLine = matchPathDOneOf(...LINE_PATHS);

type LineKeyframes = { y: number[]; opacity: number[]; times: number[] };

const LINE_KEYFRAMES: Record<string, LineKeyframes> = {
  // Line 1 (top, y=8) — drops in first
  "M14 8H8": {
    y: [0, -3, 0, 0],
    opacity: [1, 0, 1, 1],
    times: [0, 0.001, 0.3, 1],
  },
  // Line 2 (middle, y=12) — drops in second
  "M16 12H8": {
    y: [0, -3, -3, 0, 0],
    opacity: [1, 0, 0, 1, 1],
    times: [0, 0.001, 0.3, 0.55, 1],
  },
  // Line 3 (bottom, y=16) — drops in third
  "M13 16H8": {
    y: [0, -3, -3, 0, 0],
    opacity: [1, 0, 0, 1, 1],
    times: [0, 0.001, 0.55, 0.8, 1],
  },
};

export const receiptTextLines: Motion = {
  matches: matchLine,
  factory: (ctx) => {
    const d = String(ctx.pathAttrs.d);
    // Fallback for the rest-cycle test which calls with a synthetic d.
    const kf =
      LINE_KEYFRAMES[d] ?? {
        y: [0, 0],
        opacity: [1, 1],
        times: [0, 1],
      };
    return {
      rest: { y: 0, opacity: 1, scaleY: 1 },
      active: {
        y: kf.y,
        opacity: kf.opacity,
        scaleY: RECEIPT_BODY_KEYFRAMES.scaleY,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          y: { inherit: true, ease: "easeOut", times: kf.times },
          opacity: { inherit: true, ease: "easeOut", times: kf.times },
          scaleY: {
            inherit: true,
            ease: "easeInOut",
            times: RECEIPT_BODY_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
