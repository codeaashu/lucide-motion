import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartBarsVertical } from "../motions/chart-bars-vertical";

/**
 * `chart-column-increasing` — three vertical columns (increasing
 * height) + L-axes. Same data-refresh wave as `chart-column`.
 */
export default compose({
  motions: [chartBarsVertical, chartAxes],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.09 },
  transformOrigin: "12px 21px",
});
