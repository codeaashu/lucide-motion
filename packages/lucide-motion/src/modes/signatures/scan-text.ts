import { compose } from "../compose";
import { scanCornersFrame } from "../motions/scan-corners-frame";
import { scanTextLines } from "../motions/scan-text-lines";

/**
 * `scan-text` — viewfinder brackets lock on while the three text
 * lines dim top-to-bottom in sequence (OCR read wave). Each line
 * fires at `ctx.index * 0.12` so the reading sweep stays visible
 * at the family's default duration.
 */
export default compose({
  motions: [scanCornersFrame, scanTextLines],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
