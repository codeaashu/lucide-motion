import { matchAnyPath, type Motion } from "../compose";
import { STAR_TWINKLE_KEYFRAMES } from "./star-twinkle";

/**
 * Star-family wildcard reveal — pathLength + opacity draw-in plus
 * the host `starTwinkle`'s rotate + scale so the diagonal slash in
 * `star-off` wobbles and contracts in step with the two broken
 * star fragments rather than floating statically over them.
 *
 * Catches whatever's left after `starTwinkle` matches (i.e. the
 * slash path `m2 2 20 20` in `star-off`). Place this LAST in the
 * compose `motions` list.
 *
 * Each per-value transition uses `inherit: true` so the host
 * transition's duration/delay/repeat propagate down — without it,
 * motion-dom replaces the parent transition entirely with its
 * default 300 ms, and the slash falls out of phase with the star
 * fragments.
 *
 * The slash's `opacity` runs its own reveal schedule (`[0, 0, 1]`
 * across `[0, 0.2, 0.6]`) rather than inheriting the host's dim-
 * recover curve — the path starts invisible and needs to fade in
 * before settling at its drawn state, whereas the host stars never
 * leave the visible range.
 */
export const starModifierReveal: Motion = {
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
      scale: STAR_TWINKLE_KEYFRAMES.scale,
      rotate: STAR_TWINKLE_KEYFRAMES.rotate,
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
          times: STAR_TWINKLE_KEYFRAMES.times,
        },
        rotate: {
          inherit: true,
          ease: ctx.easing,
          times: STAR_TWINKLE_KEYFRAMES.times,
        },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
