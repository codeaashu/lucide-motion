import { compose } from "../compose";
import { imageFrame } from "../motions/image-frame";
import { imageMountain } from "../motions/image-mountain";
import { imageSun } from "../motions/image-sun";

/**
 * `image` — standalone picture: frame + sun + mountain. The sun
 * flashes via `imageSun` (scale + opacity pulse around its own
 * centre), the mountain dims in sync via `imageMountain`, the frame
 * does a subtle scale + opacity dip via `imageFrame`. Reads as a
 * camera shutter capture.
 *
 * Canonical Round-2 image-subject template. Composite badges
 * (file-image, book-image, folder-image, …) compose `imageSun`,
 * `imageMountain`, and `imageFrame` first (when their families are
 * signed), letting the embedded picture flash inside the host's own
 * motion.
 */
export default compose({
  motions: [imageSun, imageMountain, imageFrame],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
