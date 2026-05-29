import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartBarsHorizontal } from "../motions/chart-bars-horizontal";

/**
 * `chart-bar-increasing` — three horizontal bars (increasing length)
 * + L-axes. Same data-refresh wave as `chart-bar`.
 */
export default compose({
  motions: [chartBarsHorizontal, chartAxes],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.09 },
  transformOrigin: "5px 12px",
});
