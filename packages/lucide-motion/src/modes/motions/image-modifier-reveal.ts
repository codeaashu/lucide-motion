import { matchAnyPath, type Motion } from "../compose";
import { IMAGE_SUN_KEYFRAMES } from "./image-sun";

/**
 * Image-family wildcard reveal — catches the modifier marker in
 * each image-* variant (arrow stem + head in image-down / image-up,
 * `+` lines in image-plus, `−` line in image-minus, off-slash + the
 * inner sun arc + broken-mountain fragments in image-off, play
 * triangle in image-play, corner arrows + connector in image-upscale).
 *
 * Dasharray draw-in over the measured `ctx.pathLength` + opacity
 * reveal, completing at the sun's flash apex (`t = 0.3` per
 * `IMAGE_SUN_KEYFRAMES.times`). Inherits a small uniform scale dip
 * synthesized over `IMAGE_SUN_KEYFRAMES.times` so the markers share
 * kinetic life with the shutter without distorting orientation.
 *
 * Cleared via `transitionEnd` so the resting DOM is dash-free.
 *
 * Place LAST in the compose list — `matchAnyPath` is greedy.
 */
export const imageModifierReveal: Motion = {
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
      // Synthesized uniform scale dip aligned with the sun flash.
      scale: [1, 0.92, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.15, 0.4],
        },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: IMAGE_SUN_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
