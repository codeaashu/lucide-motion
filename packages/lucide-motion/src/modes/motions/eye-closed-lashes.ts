import { matchPathDOneOf, type Motion } from "../compose";
import { EYE_CLOSED_LID_KEYFRAMES } from "./eye-closed-lid";

/**
 * The four eyelash strokes radiating outward from the closed lid in
 * Lucide's `eye-closed`:
 * - Outer-right lash: `m20 15-1.726-2.05`
 * - Outer-left lash:  `m4 15 1.726-2.05`
 * - Inner-right lash: `m15 18-.722-3.25`
 * - Inner-left lash:  `m9 18 .722-3.25`
 *
 * Tier 2 motion: real eyelashes are stiff hairs attached to the lid
 * margin — they don't translate or grow on their own, they shimmer
 * when the lid muscles flex underneath them. Modeled here as a brief
 * opacity dim — the lashes catch less light at the squeeze moment
 * (when the lid pulls tight and pushes the lash bases together,
 * shading their tips) and brighten as the lid relaxes.
 *
 * Inherits `EYE_CLOSED_LID_KEYFRAMES.scaleY` so the lashes scale
 * vertically with the lid's squeeze and stay anchored to the moving
 * eyelid rather than floating statically over it. Vertical-only
 * scaling matches the lid's pivot and avoids pulling the outer lash
 * tips at (4, 15) / (20, 15) outward across the viewBox.
 *
 * The per-value `inherit: true` is required — without it motion-dom
 * replaces the parent transition entirely and the lashes fall out
 * of phase with the lid.
 *
 * The signature's stagger cascades the flutter across the four
 * lashes so they shimmer in sequence rather than pulsing in unison.
 */
const EYE_CLOSED_LASH_PATHS = [
  "m15 18-.722-3.25",
  "m20 15-1.726-2.05",
  "m4 15 1.726-2.05",
  "m9 18 .722-3.25",
];

export const eyeClosedLashes: Motion = {
  matches: matchPathDOneOf(...EYE_CLOSED_LASH_PATHS),
  factory: (ctx) => ({
    rest: { opacity: 1, scaleY: 1 },
    active: {
      opacity: [1, 0.4, 1],
      scaleY: EYE_CLOSED_LID_KEYFRAMES.scaleY,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        opacity: {
          inherit: true,
          ease: ctx.easing,
          times: [0, 0.45, 1],
        },
        scaleY: {
          inherit: true,
          ease: ctx.easing,
          times: EYE_CLOSED_LID_KEYFRAMES.times,
        },
      },
    },
  }),
};
