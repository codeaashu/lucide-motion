import { matchAnyPath, type Motion } from "../compose";
import { PEN_WRITE_KEYFRAMES } from "./pen-write";

/**
 * Family wildcard reveal for the pen / pencil family — catches the
 * off-slash (`m2 2 20 20`) in `pen-off` and `pencil-off`. Draws in
 * via dashoffset over `ctx.pathLength` and inherits the pen wobble's
 * `rotate` so the slash strikes through and tilts with the broken
 * fragments rather than floating statically over them.
 *
 * Place LAST in the compose list so penWrite and penEraserTip claim
 * the pen body + eraser tip first.
 *
 * Per the family-modifier-reveal pattern (see badge / heart / bell
 * precedents): cleared via `transitionEnd` so the resting DOM is
 * dash-free.
 */
export const penModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      rotate: 0,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      rotate: PEN_WRITE_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.2, 0.5],
        },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.5] },
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: PEN_WRITE_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
