import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Vertical column bars across the chart family — paths whose `d` starts
 * with a moveTo followed immediately by a vertical command (`v` or
 * `V`). Covers:
 *
 * - `chart-column` / `chart-column-decreasing` / `chart-column-increasing`
 *   (three columns each, anchored at y=17 baseline above the axes line)
 * - `chart-no-axes-column` / `chart-no-axes-column-decreasing` /
 *   `chart-no-axes-column-increasing` (three columns anchored at y=21)
 * - `chart-no-axes-combined`'s five vertical bars rising to y=21
 * - `chart-bar-stacked`'s two short stack-divider strokes
 *   (`M11 13v4`, `M15 5v4`)
 *
 * Tier 2 data motion — bars rest at full height; a wave of "fresh data
 * arriving" travels through them left-to-right, contracting each bar
 * toward the chart baseline and dimming, then springing back to full
 * height. Modelled after `signalBar`'s pressure-wave pattern (per
 * principle 1, the canonical chart action is "the data plot pulses as
 * fresh values land," not generic scale).
 *
 * Signature pivots at the baseline appropriate for the variant
 * (`"12px 21px"` for chart-column*, `"12px 21px"` also for no-axes-*),
 * so `scaleY` contracts each column toward the common baseline
 * regardless of which x it sits at. Stagger by `ctx.index` so columns
 * cascade left-to-right in Lucide path order (Lucide writes them
 * sorted by ascending x in most variants — close enough to a real wave
 * read).
 *
 * Contraction-only per principle 3 — bars in the no-axes column
 * variants already reach y=3, so any expansion would clip the top
 * viewBox edge.
 */
export const CHART_BARS_VERTICAL_KEYFRAMES: {
  scaleY: number[];
  opacity: number[];
  times: number[];
} = {
  scaleY: [1, 0.55, 1, 1],
  opacity: [1, 0.4, 1, 1],
  times: [0, 0.28, 0.6, 1],
};

const VERTICAL_BAR_D_RE = /^M[\d.]+ [\d.]+[vV]/;

export const chartBarsVertical: Motion = {
  matches: (ctx: ModeContext) =>
    ctx.pathTag === "path" && VERTICAL_BAR_D_RE.test(String(ctx.pathAttrs.d)),
  factory: (ctx) => ({
    rest: { scaleY: 1, opacity: 1 },
    active: {
      scaleY: CHART_BARS_VERTICAL_KEYFRAMES.scaleY,
      opacity: CHART_BARS_VERTICAL_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scaleY: {
          inherit: true,
          ease: "easeInOut",
          times: CHART_BARS_VERTICAL_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: CHART_BARS_VERTICAL_KEYFRAMES.times,
        },
      },
    },
  }),
};
