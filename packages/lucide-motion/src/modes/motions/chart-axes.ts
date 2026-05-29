import { matchPathD, type Motion } from "../compose";

/**
 * Chart axes primitive — the L-shaped axis frame
 * `M3 3v16a2 2 0 0 0 2 2h16` that appears byte-identical across 19 of
 * the 23 chart-* variants (`chart-area`, `chart-bar`, `chart-bar-*`,
 * `chart-column`, `chart-column-*`, `chart-candlestick`, `chart-gantt`,
 * `chart-line`, `chart-network`, `chart-pie` excluded (no axes),
 * `chart-scatter`, `chart-spline`).
 *
 * Tier 2 host frame. The axes are a steady reference grid — they do not
 * physically move in a real chart, but a chart that's "live" has a
 * subtle indicator pulse. The motion is a two-beat opacity breath that
 * matches the cadence of a chart updating its data: the axes momentarily
 * recede so the data plot reads as the foreground action, then return to
 * full strength.
 *
 * Pairs with the chart-data motions (`chartBarsVertical`,
 * `chartBarsHorizontal`, `chartRectBars`, `chartLineStroke`,
 * `chartScatterDot`, ...) which carry the bespoke "data refresh" pulse
 * staggered through the plot elements. Exports
 * `CHART_AXES_KEYFRAMES` so those motions can share the cadence.
 */
const CHART_AXES_D = "M3 3v16a2 2 0 0 0 2 2h16";

export const CHART_AXES_KEYFRAMES: {
  opacity: number[];
  times: number[];
} = {
  opacity: [1, 0.88, 1, 0.94, 1],
  times: [0, 0.2, 0.45, 0.7, 1],
};

export const chartAxes: Motion = {
  matches: matchPathD(CHART_AXES_D),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: CHART_AXES_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: CHART_AXES_KEYFRAMES.times,
      },
    },
  }),
};
