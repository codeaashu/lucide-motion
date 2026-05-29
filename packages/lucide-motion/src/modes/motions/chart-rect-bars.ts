import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Rect-based bars across the chart family — wherever Lucide draws a
 * bar as a `<rect>` with rounded corners (`rx=1`) instead of a single
 * stroke. Covers:
 *
 * - `chart-bar-big` and `chart-column-big` — two thick rounded bars
 * - `chart-bar-stacked` and `chart-column-stacked` — two rounded
 *   container rects (the inner divider strokes are handled by the
 *   `chartBars*` motions)
 *
 * Tier 2 data motion — same "data refresh pulse" identity as the path-
 * based bars, expressed as a uniform contraction so the rect's rounded
 * corners stay proportional. Per-rect stagger from `ctx.index`
 * cascades the wave through the stack.
 *
 * Uniform `scale` (not axis-locked `scaleX`/`scaleY`) because the rects
 * are wide and tall enough that an axis-locked contraction would
 * read as squashing rather than refreshing; uniform scale around the
 * signature's baseline pivot keeps the visual identity coherent with
 * the path bars.
 *
 * Closed cycle: scale and opacity start AND end at 1.
 *
 * Candlestick rects (`chart-candlestick`) are handled separately by
 * `chartCandlestickFlash`, which sequences the wicks and bodies
 * together.
 */
export const CHART_RECT_BARS_KEYFRAMES: {
  scale: number[];
  opacity: number[];
  times: number[];
} = {
  scale: [1, 0.85, 1, 1],
  opacity: [1, 0.5, 1, 1],
  times: [0, 0.28, 0.6, 1],
};

export const chartRectBars: Motion = {
  matches: (ctx: ModeContext) => ctx.pathTag === "rect",
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: CHART_RECT_BARS_KEYFRAMES.scale,
      opacity: CHART_RECT_BARS_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: CHART_RECT_BARS_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: CHART_RECT_BARS_KEYFRAMES.times,
        },
      },
    },
  }),
};
