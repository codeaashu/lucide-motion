import { matchAnyPath, type Motion } from "../compose";
import { MIC_BODY_KEYFRAMES } from "./mic-body";

/**
 * Mic-family wildcard reveal — pathLength + opacity draw-in for
 * `mic-off`'s diagonal slash, plus inherited body scale so the slash
 * pulses in step with the silenced capsule rather than floating
 * statically over the rest of the icon.
 *
 * Strike completes at `t = 0.7` so the slash lands on the body's
 * second-pulse apex — the same "land on a host event" pattern the
 * eye-off slash uses against the blink apex.
 *
 * Place this last in the compose `motions` list so the body registry
 * matches first; only the slash falls through to this wildcard.
 */
export const micModifierReveal: Motion = {
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
      scale: MIC_BODY_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        // Reveal completes at the body's second-pulse apex.
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.25, 0.7] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.25, 0.7] },
        // Scale piggybacks on the host mic body's pulse.
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: MIC_BODY_KEYFRAMES.times,
        },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
