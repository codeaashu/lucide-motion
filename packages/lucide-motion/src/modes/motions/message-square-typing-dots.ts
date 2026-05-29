import { matchPathDOneOf, type Motion } from "../compose";
import { MESSAGE_SQUARE_BODY_KEYFRAMES } from "./message-square-body";

/**
 * Typing-indicator dots for `message-square-more`. Lucide draws the
 * three dots as degenerate `h.01` paths at x = 8, 12, 16 (all at
 * y = 11). The iMessage typing-indicator gesture: each dot lifts in
 * sequence — left, middle, right — like a wave moving across the
 * row, then settles back. Reads as "someone is typing."
 *
 * Each dot does its own `y` bob (lifts ~1.2 units toward the bubble
 * roof, then drops back) at a different point in the cycle:
 *
 * - Dot 1 (x = 8) → lifts at `t ∈ [0.1, 0.2]`
 * - Dot 2 (x = 12) → lifts at `t ∈ [0.35, 0.45]`
 * - Dot 3 (x = 16) → lifts at `t ∈ [0.6, 0.7]`
 *
 * Each dot's keyframe array starts AND ends at `y = 0` so the cycle
 * is closed (principle 4). Translation is well within the viewBox —
 * y = 11 - 1.2 = 9.8 at peak lift, no clipping risk.
 *
 * Sub-icons in this family still need cohesion with the bubble's
 * nod (principle 2). The dots inherit BOTH `rotate` and `opacity`
 * from `MESSAGE_SQUARE_BODY_KEYFRAMES` so they swing and shimmer
 * with the bubble while doing their own bob — three layered
 * behaviours, all phase-locked through the shared `duration`.
 *
 * Place this BEFORE `messageSquareModifierReveal` in the
 * `message-square-more` compose list so the dots get this Tier 2
 * physics instead of the wildcard's draw-in.
 */
const DOT_PATHS = ["M8 11h.01", "M12 11h.01", "M16 11h.01"] as const;

const matchDots = matchPathDOneOf(...DOT_PATHS);

// Each dot's y-bob curve, indexed by dot order (left → right).
// Closed cycles — first AND last value are 0.
const DOT_Y_KEYFRAMES: { y: number[]; times: number[] }[] = [
  // Dot 1 (x=8) — lifts early in the cycle.
  { y: [0, -1.2, 0, 0], times: [0, 0.15, 0.3, 1] },
  // Dot 2 (x=12) — lifts in the middle.
  { y: [0, 0, -1.2, 0, 0], times: [0, 0.3, 0.4, 0.55, 1] },
  // Dot 3 (x=16) — lifts late in the cycle.
  { y: [0, 0, -1.2, 0], times: [0, 0.55, 0.65, 1] },
];

const indexFor = (d: string) =>
  d === "M8 11h.01" ? 0 : d === "M12 11h.01" ? 1 : 2;

export const messageSquareTypingDots: Motion = {
  matches: matchDots,
  factory: (ctx) => {
    const i = indexFor(String(ctx.pathAttrs.d));
    const { y, times } = DOT_Y_KEYFRAMES[i];
    return {
      rest: { y: 0, rotate: 0, opacity: 1 },
      active: {
        y,
        // Nod with the bubble.
        rotate: MESSAGE_SQUARE_BODY_KEYFRAMES.rotate,
        // Shimmer with the bubble.
        opacity: MESSAGE_SQUARE_BODY_KEYFRAMES.opacity,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          y: { inherit: true, ease: "easeInOut", times },
          rotate: {
            inherit: true,
            ease: "easeInOut",
            times: MESSAGE_SQUARE_BODY_KEYFRAMES.times,
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: MESSAGE_SQUARE_BODY_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
