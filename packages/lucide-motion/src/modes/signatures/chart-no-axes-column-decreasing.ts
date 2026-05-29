import { compose } from "../compose";
import { chartBarsVertical } from "../motions/chart-bars-vertical";

/**
 * `chart-no-axes-column-decreasing` — three vertical columns
 * (decreasing height), no L-axes. Same wave as `chart-no-axes-column`.
 */
export default compose({
  motions: [chartBarsVertical],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.09 },
  transformOrigin: "12px 21px",
});
