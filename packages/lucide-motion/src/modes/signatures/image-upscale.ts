import { compose } from "../compose";
import { imageFrame } from "../motions/image-frame";
import { imageModifierReveal } from "../motions/image-modifier-reveal";

/**
 * `image-upscale` — 10×10 picture rect with corner arrows pointing
 * outward (the "make this bigger" gesture). Frame dips via
 * `imageFrame` (extended to match the smaller rect); corner arrows
 * draw in via `imageModifierReveal`. No sun / mountain in this
 * variant.
 */
export default compose({
  motions: [imageFrame, imageModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
});
