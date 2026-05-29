import { matchPathDOneOf, type Motion } from "../compose";
import { VOLUME_SPEAKER_KEYFRAMES } from "./volume-speaker";

/**
 * Volume sound waves — Tier 2 acoustic radiation from the speaker
 * mouth. Each arc starts contracted toward the mouth and grows back to
 * its full Lucide radius, so the cascade reads as the wavefront
 * propagating outward rather than a uniform pulse. Inner arc emerges
 * during the speaker's first thump (full at `t = 0.42`); outer arc
 * follows on the second thump (full at `t = 0.66`).
 *
 * Once a wave reaches full size it inherits the speaker's remaining
 * thump rhythm so the arcs breathe with the cone instead of going
 * static after their emergence. Scale, pathLength and opacity all
 * share `VOLUME_SPEAKER_KEYFRAMES.times` so the wave and the host
 * stay phase-locked through the whole cycle.
 *
 * The signature pivots at `11px 12px` (the speaker mouth) so the
 * starting contraction collapses each wave back to that point — sound
 * issuing from where the cone meets the air.
 */
const INNER_ARC = "M16 9a5 5 0 0 1 0 6";
const OUTER_ARC = "M19.364 18.364a9 9 0 0 0 0-12.728";

const WAVE_PATHS = [INNER_ARC, OUTER_ARC];

export const volumeSoundWaves: Motion = {
  matches: matchPathDOneOf(...WAVE_PATHS),
  factory: (ctx) => {
    const isInner = String(ctx.pathAttrs.d) === INNER_ARC;
    const L = ctx.pathLength;
    // Inner reaches full size at t=0.42 (after speaker's first thump);
    // outer holds back further then reaches full at t=0.66.
    const scale = isInner
      ? [0.5, 0.5, 1, 0.96, 1]
      : [0.35, 0.35, 0.55, 1, 1];
    // dashoffset = (1 - reveal_fraction) * length, so a reveal of
    // [0, 0, 1, 1, 1] is offset [L, L, 0, 0, 0]; a reveal of
    // [0, 0, 0.3, 1, 1] is offset [L, L, L*0.7, 0, 0].
    const strokeDashoffset = isInner
      ? [L, L, 0, 0, 0]
      : [L, L, L * 0.7, 0, 0];
    const opacity = isInner
      ? [0, 0, 1, 1, 1]
      : [0, 0, 0.4, 1, 1];

    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        scale: 1,
        opacity: 1,
      },
      active: {
        strokeDasharray: L,
        strokeDashoffset,
        scale,
        opacity,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          strokeDasharray: { duration: 0 },
          strokeDashoffset: {
            inherit: true,
            ease: "easeOut",
            times: VOLUME_SPEAKER_KEYFRAMES.times,
          },
          scale: {
            inherit: true,
            ease: "easeOut",
            times: VOLUME_SPEAKER_KEYFRAMES.times,
          },
          opacity: {
            inherit: true,
            ease: "easeOut",
            times: VOLUME_SPEAKER_KEYFRAMES.times,
          },
        },
        transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
      },
    };
  },
};
