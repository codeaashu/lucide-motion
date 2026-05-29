import { matchPathD, type Motion } from "../compose";
import { SIGNAL_BAR_KEYFRAMES } from "./signal-bar";

/**
 * The degenerate dot at (2, 20) in every signal variant — the
 * zero-strength indicator that's always rendered, even in
 * `signal-zero`. Pulses opacity in step with the bar wave so the
 * dot is part of the cascade's leading edge rather than a static
 * marker beside a pulsing array.
 *
 * Plain opacity only — the dot sits on the signature's baseline
 * pivot (y=20) where `scaleY` would compress its round stroke
 * caps unnaturally. Inherits the bar wave's `times` and opacity
 * keyframes so the dot's dim/recover lands in step with the
 * bars'.
 */
export const signalDot: Motion = {
  matches: matchPathD("M2 20h.01"),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: SIGNAL_BAR_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: SIGNAL_BAR_KEYFRAMES.times,
      },
    },
  }),
};
