import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartBarsVertical } from "../motions/chart-bars-vertical";

/**
 * `chart-column` — three vertical column bars + L-axes. Columns
 * contract toward the x-axis baseline (y=21) in a left-to-right wave;
 * axes pulse a quieter breath underneath. Pivot at the baseline so
 * `scaleY` operates uniformly across columns of different heights.
 */
export default compose({
  motions: [chartBarsVertical, chartAxes],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.09 },
  transformOrigin: "12px 21px",
});
