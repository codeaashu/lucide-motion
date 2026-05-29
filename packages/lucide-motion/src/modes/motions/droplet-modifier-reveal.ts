import { matchAnyPath, type Motion } from "../compose";
import { DROPLET_KEYFRAMES } from "./droplet-shimmer";

/**
 * Droplet-family wildcard reveal — pathLength + opacity draw-in
 * plus the host `dropletShimmer`'s scale pulse so the diagonal
 * slash in `droplet-off` breathes in sync with the drop fragments
 * rather than floating statically over them.
 *
 * Catches whatever's left after `dropletShimmer` matches (i.e. the
 * slash path `m2 2 20 20`). Place this LAST in the compose
 * `motions` list.
 *
 * Scale uses `inherit: true` so the host transition's
 * duration/delay/repeat propagate down — without it, motion-dom
 * replaces the parent transition entirely.
 */
export const dropletModifierReveal: Motion = {
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
      scale: DROPLET_KEYFRAMES.scale,
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
          times: DROPLET_KEYFRAMES.times,
        },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
