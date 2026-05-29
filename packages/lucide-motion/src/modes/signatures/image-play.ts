import { compose } from "../compose";
import { imageFrame } from "../motions/image-frame";
import { imageModifierReveal } from "../motions/image-modifier-reveal";
import { imageSun } from "../motions/image-sun";

/**
 * `image-play` — picture + play triangle in the corner. Sun flashes,
 * frame dips, play triangle draws in via `imageModifierReveal`.
 */
export default compose({
  motions: [imageSun, imageFrame, imageModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
});
