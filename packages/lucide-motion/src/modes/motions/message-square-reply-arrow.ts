import { matchPathDOneOf, type Motion } from "../compose";
import { MESSAGE_SQUARE_BODY_KEYFRAMES } from "./message-square-body";

/**
 * Reply arrow for `message-square-reply`. Lucide draws the arrow as
 * the back-pointing chevron `m10 8-3 3 3 3` plus the curving stem
 * `M17 14v-1a2 2 0 0 0-2-2H7`. The arrow is visible at rest and the
 * signature gesture is a small leftward nudge: the arrow shifts
 * ~1.5 viewBox units to the left, then returns — reads as the
 * arrow "pointing back / replying."
 *
 * Stays visible the entire cycle (no draw-in) per the anti-pattern
 * "drawn-in as primary signature" — the reply arrow is the icon's
 * defining payload, so it gets bespoke physics.
 *
 * Inherits both `rotate` and `opacity` from
 * `MESSAGE_SQUARE_BODY_KEYFRAMES` so the arrow nods and shimmers
 * with the bubble through the cycle.
 *
 * Place this BETWEEN `messageSquareBody` and
 * `messageSquareModifierReveal` in `message-square-reply`'s compose
 * list so it claims the arrow paths with Tier 2 physics instead of
 * the wildcard's draw-in.
 *
 * Closed cycle: x ends at 0.
 */
const REPLY_ARROW_PATHS = ["m10 8-3 3 3 3", "M17 14v-1a2 2 0 0 0-2-2H7"];

export const messageSquareReplyArrow: Motion = {
  matches: matchPathDOneOf(...REPLY_ARROW_PATHS),
  factory: (ctx) => ({
    rest: { x: 0, rotate: 0, opacity: 1 },
    active: {
      x: [0, -1.5, -1.5, 0],
      rotate: MESSAGE_SQUARE_BODY_KEYFRAMES.rotate,
      opacity: MESSAGE_SQUARE_BODY_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        x: { inherit: true, ease: "easeInOut", times: [0, 0.25, 0.5, 1] },
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
  }),
};
