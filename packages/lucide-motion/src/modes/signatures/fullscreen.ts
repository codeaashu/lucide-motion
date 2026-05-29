import { compose } from "../compose";
import { fullscreenInnerRect } from "../motions/fullscreen-inner-rect";
import { scanCornersFrame } from "../motions/scan-corners-frame";

/**
 * `fullscreen` — viewfinder brackets pinch onto the inner content
 * rect. Both contract uniformly around (12, 12) in lockstep; the
 * rect inherits `SCAN_CORNERS_KEYFRAMES` directly so the frame-in-
 * frame reads as one cohesive "framing the content" gesture.
 */
export default compose({
  motions: [scanCornersFrame, fullscreenInnerRect],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
