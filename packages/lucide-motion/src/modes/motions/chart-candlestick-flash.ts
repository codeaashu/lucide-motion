import { matchPathDOneOf, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Candlestick chart's two candles in `chart-candlestick`. Each candle
 * is composed of two short vertical wicks (above + below) and one
 * rounded body rect. Lucide draws them in this order:
 *
 *   1. `M9 5v4`     — left candle, upper wick
 *   2. `<rect>`     — left candle, body (x=7, y=9, w=4, h=6)
 *   3. `M9 15v2`    — left candle, lower wick
 *   4. `M17 3v2`    — right candle, upper wick
 *   5. `<rect>`     — right candle, body (x=15, y=5, w=4, h=8)
 *   6. `M17 13v3`   — right candle, lower wick
 *   7. L-axes (handled by `chartAxes`)
 *
 * Tier 2 data motion — a candle's intrinsic motion is "the price
 * settles into its open/close range." Both candles together perform a
 * unified flash: the whole candlestick (wick + body + wick) does a
 * uniform contraction + opacity dim and recovers, with the left
 * candle leading the right by a small stagger so the eye reads the
 * pair as fresh ticks landing in sequence.
 *
 * Wicks and bodies are matched together (both by `matchPathDOneOf`
 * for the wick paths and `pathTag === "rect"` for the bodies) so they
 * pulse as one unit per candle. The signature's stagger drives the
 * pair sequencing.
 *
 * `chart-candlestick` must NOT compose `chartBarsVertical` (which
 * would otherwise grab the wick d's via its regex) or `chartRectBars`
 * (which would grab the body rects). Use this motion exclusively for
 * the data elements.
 *
 * Closed cycle per principle 4.
 */
const CANDLESTICK_WICK_PATHS = ["M9 5v4", "M9 15v2", "M17 3v2", "M17 13v3"];

export const chartCandlestickFlash: Motion = {
  matches: (ctx: ModeContext) => {
    if (ctx.pathTag === "rect") return true;
    if (ctx.pathTag !== "path") return false;
    return matchPathDOneOf(...CANDLESTICK_WICK_PATHS)(ctx);
  },
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.8, 1, 1],
      opacity: [1, 0.4, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.3, 0.65, 1],
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.3, 0.65, 1],
        },
      },
    },
  }),
};
