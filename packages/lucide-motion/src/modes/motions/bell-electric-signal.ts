import { matchPathDOneOf, type Motion } from "../compose";
import { BELL_ELECTRIC_BODY_KEYFRAMES } from "./bell-electric-body";

/**
 * The two signal arcs flanking the `bell-electric` dome — the small
 * arc at radius 7 lower-right and the larger arc at radius 11
 * upper-right. **Real-life motion**: an electric bell driven by
 * oscillating current emits a continuous train of pulses, not a
 * single ring. Modeled by scaling each arc from 0 around the dome's
 * center (the signature's `transformOrigin`, `9px 9px`) so they
 * visually emerge from the bell and propagate outward — and rhythmed
 * as a quicker double-pulse than `bell-ring`'s acoustic-bell waves
 * to read as "electric activation" rather than "single toll".
 *
 * **Rocks with the host body**: the arcs also rotate using the
 * `bellElectricBody` keyframes (via `inherit: true` per-value
 * transitions) so they stay anchored to the buzzing bell instead of
 * floating statically while the dome underneath vibrates.
 */
const SIGNAL_PATHS = [
  "M18.518 17.347A7 7 0 0 1 14 19",
  "M18.8 4A11 11 0 0 1 20 9",
];

export const bellElectricSignal: Motion = {
  matches: matchPathDOneOf(...SIGNAL_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1, rotate: 0 },
    active: {
      scale: [0, 0, 1, 0.7, 1, 0.85, 1],
      opacity: [0, 0.2, 1, 0.5, 1, 0.7, 1],
      rotate: BELL_ELECTRIC_BODY_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        // Two crisp pulses — sharper attack than bell-ring's gentler
        // sound-wave rhythm to read as electric, not acoustic.
        scale: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.06, 0.3, 0.45, 0.65, 0.8, 1],
        },
        opacity: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.06, 0.3, 0.45, 0.65, 0.8, 1],
        },
        // Rotate piggybacks on the host bell-electric body's buzz.
        rotate: {
          inherit: true,
          ease: BELL_ELECTRIC_BODY_KEYFRAMES.ease,
          times: BELL_ELECTRIC_BODY_KEYFRAMES.times,
        },
      },
    },
  }),
};
