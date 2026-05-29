import { compose } from "../compose";
import { chartBarsHorizontal } from "../motions/chart-bars-horizontal";

/**
 * `chart-no-axes-gantt` — three horizontal task bars (offset by
 * start time), no L-axes. Same wave as `chart-gantt` but pivot at
 * x=4 since the leftmost bar starts there.
 */
export default compose({
  motions: [chartBarsHorizontal],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.09 },
  transformOrigin: "4px 12px",
});
