import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartLineStroke } from "../motions/chart-line-stroke";

/**
 * `chart-line` — L-axes + zig-zag data line. The line dims and
 * contracts slightly (`scale: [1, 0.94, 1]`) as the axes' opacity
 * breath dims in parallel — reads as the chart refreshing its plot.
 */
export default compose({
  motions: [chartLineStroke, chartAxes],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
