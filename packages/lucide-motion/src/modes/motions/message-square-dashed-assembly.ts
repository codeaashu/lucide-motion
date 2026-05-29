import { matchPathDOneOf, type Motion } from "../compose";
import { MESSAGE_SQUARE_BODY_KEYFRAMES } from "./message-square-body";

/**
 * Dashed-outline draw-in for `message-square-dashed`. Lucide draws
 * the bubble as ten short segments scattered around the perimeter;
 * each segment draws itself in stroke-by-stroke, STRICTLY one after
 * another in a clockwise sweep starting from the tail. Reads as
 * the dashed outline being traced around the bubble piece by piece.
 *
 * Sweep order (clockwise from the tail tip):
 *
 *   0. tail piece (`M2 16v5.286...`)
 *   1. left edge (`M2 12v-2`)
 *   2. top-left corner (`M4 3a2...`)
 *   3. top edge — left (`M8 3h2`)
 *   4. top edge — right (`M14 3h2`)
 *   5. top-right corner (`M22 6V5...`)
 *   6. right edge (`M22 10v2`)
 *   7. bottom-right corner (`M20 19a...`)
 *   8. bottom edge — right (`M16 19h-2`)
 *   9. bottom edge — left (`M8 19h2`)
 *
 * Each segment owns a non-overlapping `0.07`-wide slice of the
 * cycle. Segment `i` waits invisible until `t = i * 0.07`, then
 * draws in over `[i * 0.07, (i+1) * 0.07]`, then holds drawn. All
 * ten finish by `t = 0.7`, leaving the last 30% of the cycle for
 * the bubble to nod with the assembled outline.
 *
 * Each segment uses `strokeDasharray` + `strokeDashoffset` against
 * the measured `ctx.pathLength` (cleared on `transitionEnd` so the
 * resting stroke stays solid and seam-free), with opacity flipping from 0 to
 * 1 in sync with the stroke draw — same pattern as the family
 * wildcard, just with per-segment `times`.
 *
 * Stagger is baked into per-value `times` arrays so the rotate
 * inherit stays synchronised across all segments. The first time
 * value is clamped to `0` (not `start`) so the initial invisible
 * hold renders without producing a non-monotonic `times` array
 * when `start = 0` for the tail.
 *
 * Place this BEFORE `messageSquareBody` in
 * `message-square-dashed`'s compose list so it claims the ten
 * dashed segments with the strict one-by-one draw-in instead of
 * the body's plain nod.
 */
const SWEEP_INDEX: Record<string, number> = {
  "M2 16v5.286a.71.71 0 0 0 1.212.502l1.149-1.149": 0, // tail
  "M2 12v-2": 1, // left edge
  "M4 3a2 2 0 0 0-2 2v1": 2, // top-left corner
  "M8 3h2": 3, // top left
  "M14 3h2": 4, // top right
  "M22 6V5a2 2 0 0 0-2-2": 5, // top-right corner
  "M22 10v2": 6, // right edge
  "M20 19a2 2 0 0 0 2-2v-1": 7, // bottom-right corner
  "M16 19h-2": 8, // bottom right
  "M8 19h2": 9, // bottom left
};

const matchDashedSegment = matchPathDOneOf(
  ...(Object.keys(SWEEP_INDEX) as (keyof typeof SWEEP_INDEX)[])
);

export const messageSquareDashedAssembly: Motion = {
  matches: matchDashedSegment,
  factory: (ctx) => {
    // Clockwise sweep index (not ctx.index — Lucide's path order is
    // spatially scrambled). Fallback to 0 for the rest-cycle test
    // which calls with a synthetic d.
    const seq = SWEEP_INDEX[String(ctx.pathAttrs.d)] ?? 0;
    // 10 segments × 0.07-wide slices = 0.7 of the cycle for the
    // sweep; the remaining 0.3 lets the bubble nod with the fully
    // assembled outline. `start === 0` for the tail (seq 0) — its
    // draw kicks off immediately.
    const start = seq * 0.07;
    const end = start + 0.07;
    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        opacity: 1,
        rotate: 0,
      },
      active: {
        strokeDasharray: ctx.pathLength,
        // Three keyframes: invisible hold (length), wait, draw to 0
        // by `end`, hold drawn. Same shape as file-modifier-reveal,
        // just with per-segment `times`.
        strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0, 0],
        opacity: [0, 0, 1, 1],
        rotate: MESSAGE_SQUARE_BODY_KEYFRAMES.rotate,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          strokeDasharray: { duration: 0 },
          strokeDashoffset: {
            inherit: true,
            ease: "easeOut",
            times: [0, start, end, 1],
          },
          opacity: {
            inherit: true,
            ease: "easeOut",
            times: [0, start, end, 1],
          },
          rotate: {
            inherit: true,
            ease: "easeInOut",
            times: MESSAGE_SQUARE_BODY_KEYFRAMES.times,
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
