import { matchPathDOneOf, type Motion } from "../compose";
import { MESSAGE_CIRCLE_BODY_KEYFRAMES } from "./message-circle-body";

/**
 * Reply arrow for `message-circle-reply`. Lucide draws the arrow as
 * the back-pointing chevron `m10 15-3-3 3-3` plus the curving stem
 * `M7 12h8a2 2 0 0 1 2 2v1`. Same gesture as
 * `messageSquareReplyArrow`: the arrow nudges leftward and returns,
 * reading as the arrow "pointing back / replying."
 *
 * Stays visible the entire cycle (no draw-in) — the reply arrow is
 * the icon's defining payload, so it gets bespoke physics. Inherits
 * both `rotate` and `opacity` from `MESSAGE_CIRCLE_BODY_KEYFRAMES`.
 *
 * Place this BETWEEN `messageCircleBody` and
 * `messageCircleModifierReveal` in `message-circle-reply`'s compose
 * list so it claims the two arrow paths with Tier 2 physics instead
 * of the wildcard's draw-in.
 *
 * Closed cycle: x ends at 0.
 */
const REPLY_ARROW_PATHS = ["m10 15-3-3 3-3", "M7 12h8a2 2 0 0 1 2 2v1"];

export const messageCircleReplyArrow: Motion = {
  matches: matchPathDOneOf(...REPLY_ARROW_PATHS),
  factory: (ctx) => ({
    rest: { x: 0, rotate: 0, opacity: 1 },
    active: {
      x: [0, -1.5, -1.5, 0],
      rotate: MESSAGE_CIRCLE_BODY_KEYFRAMES.rotate,
      opacity: MESSAGE_CIRCLE_BODY_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        x: { inherit: true, ease: "easeInOut", times: [0, 0.25, 0.5, 1] },
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
  }),
};
