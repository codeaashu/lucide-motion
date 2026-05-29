import { compose } from "../compose";
import { imageFrame } from "../motions/image-frame";
import { imageModifierReveal } from "../motions/image-modifier-reveal";
import { imageMountain } from "../motions/image-mountain";
import { imageSun } from "../motions/image-sun";

/**
 * `image-plus` — picture + corner `+` marker. Sun flashes, mountain
 * dims, frame dips, plus draws in via `imageModifierReveal`.
 */
export default compose({
  motions: [imageSun, imageMountain, imageFrame, imageModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
});
