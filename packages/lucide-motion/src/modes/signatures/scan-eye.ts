import { compose } from "../compose";
import { scanCornersFrame } from "../motions/scan-corners-frame";
import { scanEyeBlink } from "../motions/scan-eye-blink";

/**
 * `scan-eye` — viewfinder brackets lock on while the eye blinks.
 * `scanEyeBlink` reuses the canonical `EYE_BLINK_KEYFRAMES.scaleY`
 * (`[1, 0.1, 1]`) on scan-eye's smaller geometry — pupil `r = 1`
 * and the eyelid arc — so the eye collapses to a sliver as the
 * scanner acquires, matching the eye family's blink rhythm.
 */
export default compose({
  motions: [scanCornersFrame, scanEyeBlink],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
