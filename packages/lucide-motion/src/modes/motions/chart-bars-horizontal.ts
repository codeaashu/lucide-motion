import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Horizontal bars across the chart family — paths whose `d` starts
 * with a moveTo followed immediately by a horizontal command (`h` or
 * `H`). Covers:
 *
 * - `chart-bar` / `chart-bar-decreasing` / `chart-bar-increasing`
 *   (three horizontal bars each, anchored at x=7 alongside the y-axis)
 * - `chart-gantt`'s three task bars (offset starts: `M10 6h8`,
 *   `M12 16h6`, `M8 11h7`)
 * - `chart-column-stacked`'s two horizontal stack-divider strokes
 *   (`M11 13H7`, `M19 9h-4`)
 * - `chart-no-axes-gantt`'s three task bars (`M6 5h12`, `M4 12h10`,
 *   `M12 19h8`)
 *
 * Tier 2 data motion — bars rest at full length; a wave travels through
 * them top-to-bottom, contracting each bar toward the y-axis baseline
 * (x=5) and dimming, then springing back. Sister to
 * `chartBarsVertical`; the chart "data refresh" character is the same,
 * the axis of contraction flips.
 *
 * Signature pivots at the y-axis baseline (`"5px 12px"` for chart-bar*
 * and chart-gantt; `"4px 12px"` for chart-no-axes-gantt whose leftmost
 * bar starts at x=4) so `scaleX` contracts each bar toward the
 * baseline. Stagger by `ctx.index` cascades top-to-bottom (Lucide
 * paints them sorted by y).
 *
 * Contraction-only per principle 3 — bars already reach x=19, leaving
 * only 5 units of viewBox margin; expansion would clip.
 */
export const CHART_BARS_HORIZONTAL_KEYFRAMES: {
  scaleX: number[];
  opacity: number[];
  times: number[];
} = {
  scaleX: [1, 0.55, 1, 1],
  opacity: [1, 0.4, 1, 1],
  times: [0, 0.28, 0.6, 1],
};

const HORIZONTAL_BAR_D_RE = /^M[\d.]+ [\d.]+[hH]/;

export const chartBarsHorizontal: Motion = {
  matches: (ctx: ModeContext) =>
    ctx.pathTag === "path" && HORIZONTAL_BAR_D_RE.test(String(ctx.pathAttrs.d)),
  factory: (ctx) => ({
    rest: { scaleX: 1, opacity: 1 },
    active: {
      scaleX: CHART_BARS_HORIZONTAL_KEYFRAMES.scaleX,
      opacity: CHART_BARS_HORIZONTAL_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scaleX: {
          inherit: true,
          ease: "easeInOut",
          times: CHART_BARS_HORIZONTAL_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: CHART_BARS_HORIZONTAL_KEYFRAMES.times,
        },
      },
    },
  }),
};
