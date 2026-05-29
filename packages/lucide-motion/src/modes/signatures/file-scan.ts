import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * `file-scan` — file envelope + four scan-corner brackets. Scan
 * brackets draw on via `fileModifierReveal` (the dedicated
 * `scanCornersFrame` motion matches different corner-bracket d's
 * used in the standalone scan family, not these file-scan corners).
 */
export default compose({
  motions: [fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0.05 },
});
