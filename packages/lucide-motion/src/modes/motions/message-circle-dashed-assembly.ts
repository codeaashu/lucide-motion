import { matchPathDOneOf, type Motion } from "../compose";
import { MESSAGE_CIRCLE_BODY_KEYFRAMES } from "./message-circle-body";

/**
 * Dashed-outline draw-in for `message-circle-dashed`. Lucide draws
 * the round bubble as 8 short arc + tail segments around the
 * perimeter. Each segment draws itself in stroke-by-stroke, STRICTLY
 * one after another in a clockwise sweep starting from the tail, so
 * the dashed outline visibly assembles arc-by-arc around the
 * bubble. Same gesture as `messageSquareDashedAssembly`.
 *
 * Sweep order (clockwise from the tail tip):
 *
 *   0. tail piece (`m6.163 21.117...`)
 *   1. left side (`M2.182 13.9...`)
 *   2. top-left arc (`M3.721 6.391...`)
 *   3. top (`M10.1 2.182...`)
 *   4. top-right arc (`M17.609 3.72...`)
 *   5. right side (`M21.818 10.1...`)
 *   6. bottom-right arc (`M20.28 17.61...`)
 *   7. bottom (`M13.9 21.818...`)
 *
 * Each segment owns a non-overlapping `0.0875`-wide slice of the
 * cycle (8 × 0.0875 = 0.7). Segment `i` waits invisible until
 * `t = i * 0.0875`, then draws in over `[i * 0.0875, (i+1) * 0.0875]`,
 * then holds drawn. All eight finish by `t = 0.7`, leaving the last
 * 30% for the bubble to nod with the assembled outline.
 *
 * `strokeDasharray` + `strokeDashoffset` against `ctx.pathLength`,
 * cleared on `transitionEnd`. Stagger baked into per-value `times`
 * so the rotate inherit stays synchronised.
 *
 * Place this BEFORE `messageCircleBody` in
 * `message-circle-dashed`'s compose list so it claims the eight
 * dashed segments with the strict one-by-one draw-in instead of
 * the body's plain nod.
 */
const SWEEP_INDEX: Record<string, number> = {
  "m6.163 21.117-2.906.85a1 1 0 0 1-1.236-1.169l.965-2.98": 0, // tail
  "M2.182 13.9a10 10 0 0 1 0-3.8": 1, // left side
  "M3.721 6.391a10 10 0 0 1 2.7-2.69": 2, // top-left arc
  "M10.1 2.182a10 10 0 0 1 3.8 0": 3, // top
  "M17.609 3.72a10 10 0 0 1 2.69 2.7": 4, // top-right arc
  "M21.818 10.1a10 10 0 0 1 0 3.8": 5, // right side
  "M20.28 17.61a10 10 0 0 1-2.7 2.69": 6, // bottom-right arc
  "M13.9 21.818a10 10 0 0 1-3.8 0": 7, // bottom
};

const matchDashedSegment = matchPathDOneOf(
  ...(Object.keys(SWEEP_INDEX) as (keyof typeof SWEEP_INDEX)[])
);

export const messageCircleDashedAssembly: Motion = {
  matches: matchDashedSegment,
  factory: (ctx) => {
    const seq = SWEEP_INDEX[String(ctx.pathAttrs.d)] ?? 0;
    // 8 segments × 0.0875-wide slices = 0.7 of the cycle for the
    // sweep; the remaining 0.3 lets the bubble nod with the fully
    // assembled outline.
    const start = seq * 0.0875;
    const end = start + 0.0875;
    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        opacity: 1,
        rotate: 0,
      },
      active: {
        strokeDasharray: ctx.pathLength,
        strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0, 0],
        opacity: [0, 0, 1, 1],
        rotate: MESSAGE_CIRCLE_BODY_KEYFRAMES.rotate,
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
            times: MESSAGE_CIRCLE_BODY_KEYFRAMES.times,
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
