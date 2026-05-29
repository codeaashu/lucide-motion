import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartRectBars } from "../motions/chart-rect-bars";

/**
 * `chart-column-big` — two thick rounded vertical bars (rects) +
 * L-axes. Rects contract uniformly toward the x-axis baseline.
 */
export default compose({
  motions: [chartRectBars, chartAxes],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.1 },
  transformOrigin: "12px 21px",
});
