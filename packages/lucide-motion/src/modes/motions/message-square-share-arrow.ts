import { matchPathDOneOf, type Motion } from "../compose";
import { MESSAGE_SQUARE_BODY_KEYFRAMES } from "./message-square-body";

/**
 * Share arrow for `message-square-share`. Lucide draws the arrow as
 * two paths — the corner bracket `M16 3h6v6` and the diagonal stem
 * `m16 9 6-6`. The arrow is visible at rest (it's part of the icon's
 * identity) and the signature gesture is a small upward nudge: the
 * arrow lifts ~1.5 viewBox units toward the corner, then returns —
 * reads as "share / send outward."
 *
 * Stays visible the entire cycle (no draw-in) per the anti-pattern
 * "drawn-in as primary signature" — the share arrow is the icon's
 * defining payload, so it gets bespoke physics, not a reveal.
 *
 * Inherits both `rotate` and `opacity` from
 * `MESSAGE_SQUARE_BODY_KEYFRAMES` so the arrow nods and shimmers
 * with the bubble through the cycle.
 *
 * Place this BETWEEN `messageSquareBody` and
 * `messageSquareModifierReveal` in `message-square-share`'s compose
 * list so it claims the arrow paths with Tier 2 physics instead of
 * the wildcard's draw-in.
 *
 * Closed cycle: y ends at 0.
 */
const SHARE_ARROW_PATHS = ["M16 3h6v6", "m16 9 6-6"];

export const messageSquareShareArrow: Motion = {
  matches: matchPathDOneOf(...SHARE_ARROW_PATHS),
  factory: (ctx) => ({
    rest: { y: 0, rotate: 0, opacity: 1 },
    active: {
      // Nudge up and return. easeOut on the rise so it's snappy, then
      // hangs briefly at peak before drifting back to rest.
      y: [0, -1.5, -1.5, 0],
      rotate: MESSAGE_SQUARE_BODY_KEYFRAMES.rotate,
      opacity: MESSAGE_SQUARE_BODY_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        y: { inherit: true, ease: "easeInOut", times: [0, 0.25, 0.5, 1] },
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
