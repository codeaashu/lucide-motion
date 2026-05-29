import { compose } from "../compose";
import { imageFrame } from "../motions/image-frame";
import { imageModifierReveal } from "../motions/image-modifier-reveal";
import { imageSun } from "../motions/image-sun";

/**
 * `image-down` — picture frame + sun + corner down-arrow. Sun
 * flashes, frame dips, arrow draws in via `imageModifierReveal`.
 */
export default compose({
  motions: [imageSun, imageFrame, imageModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
});
