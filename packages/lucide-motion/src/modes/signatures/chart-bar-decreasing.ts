import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartBarsHorizontal } from "../motions/chart-bars-horizontal";

/**
 * `chart-bar-decreasing` — three horizontal bars (decreasing length)
 * + L-axes. Same data-refresh wave as `chart-bar`: bars contract
 * toward the y-axis baseline in a top-to-bottom cascade.
 */
export default compose({
  motions: [chartBarsHorizontal, chartAxes],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.09 },
  transformOrigin: "5px 12px",
});
