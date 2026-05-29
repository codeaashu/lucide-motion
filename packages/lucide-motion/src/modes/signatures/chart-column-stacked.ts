import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import { chartStackedColumns } from "../motions/chart-stacked-columns";

/**
 * `chart-column-stacked` — two stacked columns + L-axes. The columns
 * wave in one-by-one via `chartStackedColumns`, which groups each
 * rect with its inner divider so they ride together. Pivot at the
 * columns' shared bottom edge (`"12px 17px"`).
 */
export default compose({
  motions: [chartStackedColumns, chartAxes],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0.18 },
  transformOrigin: "12px 17px",
});
