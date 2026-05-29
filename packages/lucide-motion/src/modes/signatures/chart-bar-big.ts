import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartRectBars } from "../motions/chart-rect-bars";

/**
 * `chart-bar-big` — two thick rounded horizontal bars (rects) +
 * L-axes. Rects do a uniform contraction + opacity dim, staggered
 * top-to-bottom; axes pulse underneath.
 */
export default compose({
  motions: [chartRectBars, chartAxes],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.1 },
  transformOrigin: "5px 12px",
});
