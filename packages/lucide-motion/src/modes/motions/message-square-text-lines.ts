import { matchPathDOneOf, type Motion } from "../compose";
import { MESSAGE_SQUARE_BODY_KEYFRAMES } from "./message-square-body";

/**
 * Text-line cascade for `message-square-text`. Lucide draws three
 * horizontal lines at y = 7, 11, 15 (`M7 7h8`, `M7 11h10`, `M7
 * 15h6`). The signature gesture is each line dropping in from above
 * its rest position, one after the other — top line first, middle
 * next, bottom last — like text being written into the bubble.
 *
 * Each line teleports up to `y = -3` (invisible via opacity = 0) at
 * the start, then drops back to its rest `y = 0` at its own
 * staggered time:
 *
 * - Line 1 (y = 7)  → drops in `t ∈ [0.05, 0.3]`
 * - Line 2 (y = 11) → drops in `t ∈ [0.3, 0.55]`
 * - Line 3 (y = 15) → drops in `t ∈ [0.55, 0.8]`
 *
 * Each line's first keyframe is `y = 0, opacity = 1` (rest) so the
 * cycle is closed; the second keyframe teleports to `y = -3,
 * opacity = 0` (invisible) within 1ms so the displacement isn't
 * visible. The bookend pattern matches `cloud-rain-drops.ts`'s
 * teleport convention from principle 4.
 *
 * Lines also inherit `rotate` from `MESSAGE_SQUARE_BODY_KEYFRAMES`
 * so they nod with the bubble. Opacity is owned by each line's
 * cascade timing — they emerge in sequence rather than dimming with
 * the bubble — but settle to 1 by `t = 0.8` so the rest of the
 * cycle they breathe with the bubble's opacity dim... actually each
 * line's opacity sequence ends at 1 and stays there, so the bubble's
 * opacity shimmer is the only continued opacity activity afterward.
 *
 * Place this BETWEEN `messageSquareBody` and
 * `messageSquareModifierReveal` in `message-square-text`'s compose
 * list.
 *
 * Closed cycle: y and opacity both start AND end at their rest
 * values.
 */
const LINE_PATHS = ["M7 7h8", "M7 11h10", "M7 15h6"] as const;

const matchLine = matchPathDOneOf(...LINE_PATHS);

type LineKeyframes = { y: number[]; opacity: number[]; times: number[] };

// Each line's cascade — first frame at rest (visible) so the cycle is
// closed; immediate teleport to y=-3 with opacity=0 (invisible); then
// drop in at the line's own staggered window.
const LINE_KEYFRAMES: Record<string, LineKeyframes> = {
  // Line 1 — drops in first.
  "M7 7h8": {
    y: [0, -3, 0, 0],
    opacity: [1, 0, 1, 1],
    times: [0, 0.001, 0.3, 1],
  },
  // Line 2 — drops in second.
  "M7 11h10": {
    y: [0, -3, -3, 0, 0],
    opacity: [1, 0, 0, 1, 1],
    times: [0, 0.001, 0.3, 0.55, 1],
  },
  // Line 3 — drops in third.
  "M7 15h6": {
    y: [0, -3, -3, 0, 0],
    opacity: [1, 0, 0, 1, 1],
    times: [0, 0.001, 0.55, 0.8, 1],
  },
};

export const messageSquareTextLines: Motion = {
  matches: matchLine,
  factory: (ctx) => {
    const d = String(ctx.pathAttrs.d);
    // Fallback for the rest-cycle test which calls with a synthetic d
    // outside our registry; ensures the factory still returns valid
    // variants (and the test asserts rest landing).
    const kf =
      LINE_KEYFRAMES[d] ?? {
        y: [0, 0],
        opacity: [1, 1],
        times: [0, 1],
      };
    return {
      rest: { y: 0, opacity: 1, rotate: 0 },
      active: {
        y: kf.y,
        opacity: kf.opacity,
        rotate: MESSAGE_SQUARE_BODY_KEYFRAMES.rotate,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          y: { inherit: true, ease: "easeOut", times: kf.times },
          opacity: { inherit: true, ease: "easeOut", times: kf.times },
          rotate: {
            inherit: true,
            ease: "easeInOut",
            times: MESSAGE_SQUARE_BODY_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
