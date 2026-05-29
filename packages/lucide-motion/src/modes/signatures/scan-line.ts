import { compose } from "../compose";
import { scanCornersFrame } from "../motions/scan-corners-frame";
import { scanLineSweep } from "../motions/scan-line-sweep";

/**
 * `scan-line` — viewfinder brackets lock on while the horizontal
 * scan line bobs vertically across the frame (y up then down). The
 * canonical document-scanner gesture: a laser beam translates across
 * the subject to read it.
 */
export default compose({
  motions: [scanCornersFrame, scanLineSweep],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
