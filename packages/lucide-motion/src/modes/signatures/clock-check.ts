import { compose } from "../compose";
import { clockFace } from "../motions/clock-face";
import { clockHands } from "../motions/clock-hands";
import { clockModifierReveal } from "../motions/clock-modifier-reveal";

/**
 * Clock-check ticks with the check-mark modifier revealing in. Face
 * is a partial radius-10 arc that leaves room for the check in the
 * lower-right; check path falls through to `clockModifierReveal`
 * for a pathLength + opacity draw-in coupled to the face's gentle
 * scale.
 */
export default compose({
  motions: [clockFace, clockHands, clockModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.04 },
});
