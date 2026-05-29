import { aArrow } from "../motions/a-arrow";
import { compose } from "../compose";
import { typewriterStamp } from "../motions/typewriter-stamp";

/**
 * `a-arrow-down` — letter A stamps via `typewriterStamp`; the
 * down-arrow glides DOWN via `aArrow`.
 */
export default compose({
  motions: [aArrow, typewriterStamp],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
