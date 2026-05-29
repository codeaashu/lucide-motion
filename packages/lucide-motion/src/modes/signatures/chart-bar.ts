import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartBarsHorizontal } from "../motions/chart-bars-horizontal";

/**
 * `chart-bar` — three horizontal bars + L-axes. Bars contract toward
 * the y-axis baseline (x=5) in a top-to-bottom wave; axes pulse a
 * quieter breath underneath. Pivot at the y-axis so `scaleX` operates
 * uniformly from the shared baseline.
 */
export default compose({
  motions: [chartBarsHorizontal, chartAxes],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.09 },
  transformOrigin: "5px 12px",
});
