import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartStackedBars } from "../motions/chart-stacked-bars";

/**
 * `chart-bar-stacked` — two stacked horizontal bars + L-axes. The
 * bars wave in one-by-one via `chartStackedBars`, which groups each
 * rect with its inner divider so they ride together. Pivot at the
 * bars' shared left edge (`"7px 12px"`).
 */
export default compose({
  motions: [chartStackedBars, chartAxes],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0.18 },
  transformOrigin: "7px 12px",
});
