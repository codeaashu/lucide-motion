import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";
import { imageMountain } from "../motions/image-mountain";
import { imageSun } from "../motions/image-sun";

/**
 * `file-image` — file envelope + picture badge. Sun at (10, 12)
 * flashes via `imageSun`; mountain dims via `imageMountain`. Both
 * Round-2 image subject motions placed FIRST.
 */
export default compose({
  motions: [imageSun, imageMountain, fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
