import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartBarsHorizontal } from "../motions/chart-bars-horizontal";

/**
 * `chart-gantt` — three horizontal task bars (offset by start time) +
 * L-axes. Bars contract via `chartBarsHorizontal` toward the y-axis
 * in a top-to-bottom wave, reading as the schedule reflowing.
 */
export default compose({
  motions: [chartBarsHorizontal, chartAxes],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.09 },
  transformOrigin: "5px 12px",
});
