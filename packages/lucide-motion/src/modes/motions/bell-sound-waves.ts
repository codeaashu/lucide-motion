import { matchPathDOneOf, type Motion } from "../compose";
import { BELL_SHELL_KEYFRAMES } from "./bell-shell";

/**
 * The two sound-wave arcs flanking a `bell-ring`. **Real-life motion**: a
 * bell ringing radiates sound outward from where it hangs. Modeled by
 * scaling each wave from 0 around the bell's mount pivot (the signature's
 * `transformOrigin`, `12px 4px`), so the waves appear to emerge from the
 * mount and propagate outward to their full extent — the same path real
 * sound waves take.
 *
 * Two pulses across the duration: a strong initial radiation, a brief
 * dim as the wave moves outward, then a second pulse — suggesting the
 * bell continuing to toll rather than a single one-shot ring.
 *
 * Both waves animate identically; Lucide's `bell-ring` is symmetric and
 * the waves should propagate together as one ring event.
 *
 * **Rocks with the host shell**: the waves also rotate using the
 * `bellShell` keyframes (via `inherit: true` per-value transitions) so
 * they stay anchored to the swinging mount instead of floating
 * statically while the bell underneath rocks.
 */
const WAVE_PATHS = [
  "M22 8c0-2.3-.8-4.3-2-6",
  "M4 2C2.8 3.7 2 5.7 2 8",
];

export const bellSoundWaves: Motion = {
  matches: matchPathDOneOf(...WAVE_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1, rotate: 0 },
    active: {
      scale: [0, 0, 1, 0.85, 1, 1],
      opacity: [0, 0, 1, 0.6, 1, 1],
      rotate: BELL_SHELL_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        // Scale + opacity keep their own paired easeOut timing —
        // the two-pulse radiation curve is part of the sound-wave
        // metaphor and shouldn't ride the bell's damped ease.
        scale: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.1, 0.4, 0.6, 0.8, 1.0],
        },
        opacity: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.1, 0.4, 0.6, 0.8, 1.0],
        },
        // Rotate piggybacks on the host bell shell's damped rock.
        rotate: {
          inherit: true,
          ease: BELL_SHELL_KEYFRAMES.ease,
          times: BELL_SHELL_KEYFRAMES.times,
        },
      },
    },
  }),
};
