import { matchPathDOneOf, type Motion } from "../compose";
import { MESSAGE_CIRCLE_BODY_KEYFRAMES } from "./message-circle-body";

/**
 * Typing-indicator dots for `message-circle-more`. Lucide draws the
 * three dots as degenerate `h.01` paths at x = 8, 12, 16 (all at
 * y = 12). Same iMessage gesture as `messageSquareTypingDots`: each
 * dot lifts in sequence — left, middle, right — like a wave moving
 * across the row, then settles back. Reads as "someone is typing."
 *
 * Each dot does its own `y` bob at a different point in the cycle:
 *
 * - Dot 1 (x = 8)  → lifts at `t ∈ [0.15, 0.3]`
 * - Dot 2 (x = 12) → lifts at `t ∈ [0.3, 0.55]`
 * - Dot 3 (x = 16) → lifts at `t ∈ [0.55, 0.7]`
 *
 * Inherits both `rotate` and `opacity` from
 * `MESSAGE_CIRCLE_BODY_KEYFRAMES` so the row nods and shimmers with
 * the bubble while doing its own bob.
 *
 * Place this BEFORE `messageCircleModifierReveal` in
 * `message-circle-more`'s compose list so the dots get this Tier 2
 * physics instead of the wildcard's draw-in.
 *
 * Closed cycle: y starts AND ends at 0.
 */
const DOT_PATHS = ["M8 12h.01", "M12 12h.01", "M16 12h.01"] as const;

const matchDots = matchPathDOneOf(...DOT_PATHS);

const DOT_Y_KEYFRAMES: { y: number[]; times: number[] }[] = [
  { y: [0, -1.2, 0, 0], times: [0, 0.15, 0.3, 1] },
  { y: [0, 0, -1.2, 0, 0], times: [0, 0.3, 0.4, 0.55, 1] },
  { y: [0, 0, -1.2, 0], times: [0, 0.55, 0.65, 1] },
];

const indexFor = (d: string) =>
  d === "M8 12h.01" ? 0 : d === "M12 12h.01" ? 1 : 2;

export const messageCircleTypingDots: Motion = {
  matches: matchDots,
  factory: (ctx) => {
    const i = indexFor(String(ctx.pathAttrs.d));
    const { y, times } = DOT_Y_KEYFRAMES[i];
    return {
      rest: { y: 0, rotate: 0, opacity: 1 },
      active: {
        y,
        rotate: MESSAGE_CIRCLE_BODY_KEYFRAMES.rotate,
        opacity: MESSAGE_CIRCLE_BODY_KEYFRAMES.opacity,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          y: { inherit: true, ease: "easeInOut", times },
          rotate: {
            inherit: true,
            ease: "easeInOut",
            times: MESSAGE_CIRCLE_BODY_KEYFRAMES.times,
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: MESSAGE_CIRCLE_BODY_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
