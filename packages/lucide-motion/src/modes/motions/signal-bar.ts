import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Signal-strength bars in `signal`, `signal-high`, `signal-medium`,
 * `signal-low`. The bars rest at full height; a wave of pressure
 * travels through them left-to-right — each bar in turn briefly
 * contracts toward the baseline (y=20) and dims, then springs back
 * to its rest height and full brightness. Reads as a signal pulse
 * radiating across the indicator.
 *
 * The signature pivots at `"12px 20px"` so `scaleY` operates from
 * the common baseline — short bars and tall bars share the same
 * contraction gesture regardless of which x they sit at, and the
 * one Lucide bar stored top-to-bottom (`M22 4v16` in the full
 * `signal` icon) contracts from the same baseline as the rest.
 *
 * Contraction-only (`scaleY ≤ 1`) per principle 3 — the tallest
 * bar already reaches y=4, only ~3 units shy of the viewBox edge,
 * so any expansion would clip. The pulse reads as wave intensity
 * via opacity rather than scale; the scale contraction supplies
 * the "compression" half of the wave.
 *
 * Per-path stagger from `ctx.index` cascades the pulse across the
 * bars (Lucide orders them by ascending x). Exports
 * `SIGNAL_BAR_KEYFRAMES` for the family's dot motion to share the
 * pulse rhythm.
 */
export const SIGNAL_BAR_KEYFRAMES: {
  scaleY: number[];
  opacity: number[];
  times: number[];
} = {
  scaleY: [1, 0.6, 1, 1],
  opacity: [1, 0.3, 1, 1],
  times: [0, 0.25, 0.55, 1],
};

const BAR_PATHS = ["M7 20v-4", "M12 20v-8", "M17 20V8", "M22 4v16"];

export const signalBar: Motion = {
  matches: matchPathDOneOf(...BAR_PATHS),
  factory: (ctx) => ({
    rest: { scaleY: 1, opacity: 1 },
    active: {
      scaleY: SIGNAL_BAR_KEYFRAMES.scaleY,
      opacity: SIGNAL_BAR_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scaleY: {
          inherit: true,
          ease: "easeInOut",
          times: SIGNAL_BAR_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: SIGNAL_BAR_KEYFRAMES.times,
        },
      },
    },
  }),
};
