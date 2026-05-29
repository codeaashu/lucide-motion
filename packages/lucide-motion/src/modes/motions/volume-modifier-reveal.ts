import { matchAnyPath, type Motion } from "../compose";
import { VOLUME_SPEAKER_KEYFRAMES } from "./volume-speaker";

/**
 * Volume-family wildcard reveal — pathLength + opacity draw-in for the
 * leftover paths in `volume-x` and `volume-off`, plus inherited
 * speaker scale so the markers thump in step with the cone rather than
 * floating statically over a pulsing speaker.
 *
 * Catches whatever's left after `volumeSpeaker` and `volumeSoundWaves`
 * match:
 * - volume-x's two crossed `<line>` strokes
 * - volume-off's diagonal slash (`m2 2 20 20`)
 * - volume-off's broken arc fragments (degraded waves treated as
 *   state markers in the muted icon)
 *
 * Strike completes at `t = 0.66` so the marker lands on the speaker's
 * second thump apex — the same "land on a host event" pattern the
 * eye-off slash uses against the blink apex.
 *
 * Place this last in the compose `motions` list so the speaker and
 * sound waves match first; the wildcard catches the rest.
 */
export const volumeModifierReveal: Motion = {
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
      scale: VOLUME_SPEAKER_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        // Reveal completes at the speaker's second thump apex.
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.25, 0.66] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.25, 0.66] },
        // Scale piggybacks on the speaker's two-thump bassline.
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: VOLUME_SPEAKER_KEYFRAMES.times,
        },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
