import { compose } from "../compose";
import { imageFrame } from "../motions/image-frame";
import { imageModifierReveal } from "../motions/image-modifier-reveal";
import { imageMountain } from "../motions/image-mountain";
import { imageSun } from "../motions/image-sun";

/**
 * `image-minus` — picture + corner `−` marker. Sun flashes, mountain
 * dims, frame dips, minus line draws in via `imageModifierReveal`.
 */
export default compose({
  motions: [imageSun, imageMountain, imageFrame, imageModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
});
