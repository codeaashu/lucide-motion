import { compose } from "../compose";
import { chartPieSweep } from "../motions/chart-pie-sweep";

/**
 * `chart-pie` — upper-right wedge + remaining 3/4 arc. Both paths
 * contract uniformly toward the pie's centre and dim, wedge leading
 * arc by the stagger so the slice reads as the focused data segment
 * refreshing first.
 */
export default compose({
  motions: [chartPieSweep],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0.1 },
});
