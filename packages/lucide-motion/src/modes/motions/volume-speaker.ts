import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Volume speaker — the speaker housing pulses with a two-thump bassline,
 * the way a real cone driver vibrates against its chassis to push air
 * outward. Both thumps are contractions (`scale ≤ 1`); rest is the
 * relaxed size and the diaphragm pulls back briefly before snapping
 * forward. The signature pivots at the speaker mouth (`11px 12px`) so
 * the contraction reads as the cone drawing back into its housing
 * before pushing air toward the listener.
 *
 * Lucide reshapes the speaker across `volume-off` — splits the chassis
 * around the diagonal slash and leaves a degraded vertex remnant. Both
 * fragments go through the same thump so the broken pieces stay
 * coupled rather than sitting static while the rest of the icon moves.
 *
 * Exports `VOLUME_SPEAKER_KEYFRAMES` so `volumeSoundWaves` and
 * `volumeModifierReveal` can inherit the same rhythm and stay locked to
 * the speaker.
 */
export const VOLUME_SPEAKER_KEYFRAMES = {
  scale: [1, 0.93, 1, 0.96, 1],
  times: [0, 0.18, 0.42, 0.66, 1],
};

const SPEAKER_PATHS = [
  // volume / volume-1 / volume-2 / volume-x base speaker
  "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
  // volume-off — speaker chassis split by the diagonal slash
  "m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11",
  // volume-off — top vertex remnant above the slash
  "M9.828 4.172A.686.686 0 0 1 11 4.657v.686",
];

export const volumeSpeaker: Motion = {
  matches: matchPathDOneOf(...SPEAKER_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1 },
    active: {
      scale: VOLUME_SPEAKER_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        repeat: ctx.repeat,
        times: VOLUME_SPEAKER_KEYFRAMES.times,
      },
    },
  }),
};
