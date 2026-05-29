import { matchAnyPath, type Motion } from "../compose";
import { UMBRELLA_KEYFRAMES } from "./umbrella-canopy";

/**
 * Umbrella-family wildcard reveal — pathLength + opacity draw-in
 * plus the host `umbrellaCanopy`'s scale + rotate so the diagonal
 * slash in `umbrella-off` sways with the umbrella rather than
 * floating statically over a tilting canopy.
 *
 * Catches whatever's left after `umbrellaCanopy` matches (i.e. the
 * slash path `m2 2 20 20`). Place this LAST in the compose
 * `motions` list.
 *
 * Both scale and rotate use `inherit: true` so the host
 * transition's duration/delay/repeat propagate down without being
 * replaced by motion-dom's default 300 ms.
 */
export const umbrellaModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      scale: UMBRELLA_KEYFRAMES.scale,
      rotate: UMBRELLA_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.6] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.6] },
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: UMBRELLA_KEYFRAMES.times,
        },
        rotate: {
          inherit: true,
          ease: ctx.easing,
          times: UMBRELLA_KEYFRAMES.times,
        },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
