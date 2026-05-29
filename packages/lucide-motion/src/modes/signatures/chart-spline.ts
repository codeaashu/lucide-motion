import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartLineStroke } from "../motions/chart-line-stroke";

/**
 * `chart-spline` — L-axes + smooth cubic curve. Same data-refresh
 * pulse as `chart-line`; the curve dims and contracts together with
 * the axes' breath.
 */
export default compose({
  motions: [chartLineStroke, chartAxes],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
