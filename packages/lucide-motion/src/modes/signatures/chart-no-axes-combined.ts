import { compose } from "../compose";
import { chartBarsVertical } from "../motions/chart-bars-vertical";
import { chartLineStroke } from "../motions/chart-line-stroke";

/**
 * `chart-no-axes-combined` — five vertical bars rising to y=21 with
 * a scalloped top line tracing across them. Bars run the data-refresh
 * wave via `chartBarsVertical`; the top line dims with
 * `chartLineStroke`. Pivot at the bars' shared baseline so `scaleY`
 * operates correctly; the line's uniform `scale` reads as a quiet
 * dim from the same anchor.
 */
export default compose({
  motions: [chartLineStroke, chartBarsVertical],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.07 },
  transformOrigin: "12px 21px",
});
