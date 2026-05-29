import { bookBody } from "../motions/book-body";
import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { compose } from "../compose";
import { imageMountain } from "../motions/image-mountain";
import { imageSun } from "../motions/image-sun";

/**
 * `book-image` — book settles via `bookBody`; the embedded picture
 * (sun at (10, 8), mountain peak) fires the Round-2 image subject
 * motions. Sun flashes via `imageSun` around its own (cx, cy);
 * mountain dims via `imageMountain`. Subject motions placed FIRST
 * so they claim the picture elements before `bookModifierReveal`
 * would draw them on as state markers.
 */
export default compose({
  motions: [imageSun, imageMountain, bookBody, bookModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
