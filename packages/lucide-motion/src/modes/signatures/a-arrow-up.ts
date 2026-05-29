import { aArrow } from "../motions/a-arrow";
import { compose } from "../compose";
import { typewriterStamp } from "../motions/typewriter-stamp";

/**
 * `a-arrow-up` — letter A stamps via `typewriterStamp`; the up-arrow
 * glides UP via `aArrow` (placed FIRST so the arrow paths are
 * claimed by the glide).
 */
export default compose({
  motions: [aArrow, typewriterStamp],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
