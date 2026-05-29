import { cogGear } from "../motions/cog-gear";
import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * `file-cog` — file envelope + cog gear at (7, 18) rotating via
 * `cogGear` (added "file-cog": [7, 18] to COG_CENTERS + the 8
 * (7, 18) tooth d's to COG_TOOTH_DS + the hub circle).
 */
export default compose({
  motions: [cogGear, fileEnvelope, fileModifierReveal],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
});
