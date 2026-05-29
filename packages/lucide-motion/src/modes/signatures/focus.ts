import { compose } from "../compose";
import { focusReticle } from "../motions/focus-reticle";
import { scanCornersFrame } from "../motions/scan-corners-frame";

/**
 * `focus` — viewfinder brackets lock onto the centre reticle. The
 * brackets do their pinch-and-hold via `scanCornersFrame`; the
 * reticle does an autofocus convergence pulse via `focusReticle` —
 * pinching deeper and dimming harder while the lens "locks in,"
 * then releasing in lockstep with the brackets.
 */
export default compose({
  motions: [scanCornersFrame, focusReticle],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
