import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartCandlestickFlash } from "../motions/chart-candlestick-flash";

/**
 * `chart-candlestick` — two candles (each: upper wick + body rect +
 * lower wick) + L-axes. Both candles' wicks and bodies pulse together
 * via `chartCandlestickFlash`, left candle leading the right by the
 * stagger. Axes pulse the opacity breath underneath.
 *
 * Does NOT compose `chartBarsVertical` or `chartRectBars` — those
 * would otherwise claim the wick paths and body rects with the wrong
 * motion (per-bar pressure wave instead of per-candle flash).
 */
export default compose({
  motions: [chartCandlestickFlash, chartAxes],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0.05 },
});
