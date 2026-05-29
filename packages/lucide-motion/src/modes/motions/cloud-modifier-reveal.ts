import { matchAnyPath, type Motion } from "../compose";
import { CLOUD_BODY_KEYFRAMES } from "./cloud-body";

/**
 * Cloud-family wildcard reveal — pathLength + opacity draw-in plus
 * the host `cloudBody`'s scale pulse so non-cloud-non-weather paths
 * (the alert mark, check, off-slash, cog gear, download/upload
 * arrows, sync/backup loops) breathe with the cloud rather than
 * floating statically over a gently-pulsing body.
 *
 * Catches whatever's left after `cloudBody` and the element-
 * specific weather motions (`cloudRainDrops`, `cloudSnowDots`,
 * `cloudFogStreaks`, `cloudLightningBolt`, `sunRayPulse`,
 * `moonGlow`) match. Place this LAST in the compose `motions` list.
 *
 * Scale uses `inherit: true` so the host transition's
 * duration/delay/repeat propagate down; without that, motion-dom
 * replaces the parent transition entirely and the per-value block
 * falls back to its default 300 ms — out of sync with the cloud's
 * pulse.
 */
export const cloudModifierReveal: Motion = {
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
      scale: CLOUD_BODY_KEYFRAMES.scale,
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
          times: CLOUD_BODY_KEYFRAMES.times,
        },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
