import { compose } from "../compose";
import { scanBarcodeBars } from "../motions/scan-barcode-bars";
import { scanCornersFrame } from "../motions/scan-corners-frame";

/**
 * `scan-barcode` — viewfinder brackets lock on while the three
 * barcode bars pulse left-to-right in a wave (each bar in turn
 * contracts vertically from its baseline and dims, then springs
 * back). Reads as a hand-scanner sweeping across the barcode.
 *
 * Pivots at `"12px 17px"` — the bars' shared baseline — so each
 * bar contracts toward its own bottom rather than the icon centre.
 * The brackets' uniform contraction still reads correctly because
 * each corner's distance from this pivot is similar.
 */
export default compose({
  motions: [scanCornersFrame, scanBarcodeBars],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 17px",
});
