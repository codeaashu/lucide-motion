import { compose } from "../compose";
import { chartBarsVertical } from "../motions/chart-bars-vertical";

/**
 * `chart-no-axes-column` — three vertical columns, no L-axes frame.
 * Same data-refresh wave as `chart-column` (left-to-right `scaleY`
 * contraction toward the y=21 baseline) without the axes companion.
 */
export default compose({
  motions: [chartBarsVertical],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.09 },
  transformOrigin: "12px 21px",
});
