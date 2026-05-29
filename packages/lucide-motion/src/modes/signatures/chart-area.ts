import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartLineStroke } from "../motions/chart-line-stroke";

/**
 * `chart-area` — L-axes frame + closed area polygon. The polygon dims
 * + tiny scale dip to signal a data refresh; the axes pulse a quieter
 * opacity breath. Centre pivot keeps the area's contraction symmetric.
 */
export default compose({
  motions: [chartLineStroke, chartAxes],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
