import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartScatterDot } from "../motions/chart-scatter-dot";

/**
 * `chart-scatter` — five filled data dots + L-axes. Each dot pulses
 * (scale + opacity) in sequence so the scatter reads as observations
 * landing one at a time. Axes breath underneath.
 */
export default compose({
  motions: [chartScatterDot, chartAxes],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0.08 },
});
