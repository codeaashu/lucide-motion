import { compose } from "../compose";
import { scanCornersFrame } from "../motions/scan-corners-frame";
import {
  scanFaceCheekDots,
  scanFaceSmile,
} from "../motions/scan-face-features";

/**
 * `scan-face` — viewfinder brackets lock on while the face winks
 * acknowledgement. The two cheek dots dim sharply at the lock-on
 * midpoint (eyes briefly closing) and the smile holds calm. Reads
 * as "face detected, scan complete."
 */
export default compose({
  motions: [scanCornersFrame, scanFaceCheekDots, scanFaceSmile],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
