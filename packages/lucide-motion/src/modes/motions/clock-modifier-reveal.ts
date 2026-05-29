import { matchAnyPath, type Motion } from "../compose";
import { CLOCK_FACE_KEYFRAMES } from "./clock-face";

/**
 * Clock-family wildcard reveal — pathLength + opacity draw-in plus
 * the host `clockFace`'s scale pulse so modifier paths (the alert
 * indicator's line + dot, the arrow shaft + V, the check, the plus)
 * breathe with the face instead of floating statically over the
 * gently-pulsing clock body.
 *
 * Catches whatever's left after `clockFace` and `clockHands` match
 * — the composite variants' state markers. Place this last in the
 * compose `motions` list.
 *
 * Scale uses `inherit: true` so the host transition's
 * duration/delay/repeat propagate down; without that, motion-dom
 * replaces the parent transition entirely and the per-value block
 * falls back to its default 300 ms — completely out of sync with
 * the clock's face pulse.
 */
export const clockModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      scale: 1,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      scale: CLOCK_FACE_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.25, 0.65] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.25, 0.65] },
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: CLOCK_FACE_KEYFRAMES.times,
        },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
