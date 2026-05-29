import { compose } from "../compose";
import { arrowGlide } from "../motions/arrow-glide";
import { arrowStaticRef } from "../motions/arrow-static-ref";

/**
 * `arrow-down-to-dot` — the arrow nudges in the indicated direction
 * (`arrowGlide`) while the reference line / dot stays anchored
 * with a subtle opacity dip for cohesion (`arrowStaticRef`).
 * `arrowStaticRef` is placed FIRST so the line / dot is claimed
 * before `arrowGlide`'s matchAnyPath would translate it.
 */
export default compose({
  motions: [arrowStaticRef, arrowGlide],
  defaults: { duration: 0.6, easing: "easeOut", stagger: 0 },
});
