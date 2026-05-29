import { compose } from "../compose";
import { clockFace } from "../motions/clock-face";
import { clockHands } from "../motions/clock-hands";
import { clockModifierReveal } from "../motions/clock-modifier-reveal";

/**
 * Clock-arrow-down ticks with the down-arrow modifier (shaft + V)
 * revealing in. Face is a partial radius-10 arc that leaves room for
 * the arrow in the lower-right; `clockFace` catches it and the arrow
 * paths fall through to `clockModifierReveal` for a pathLength +
 * opacity draw-in coupled to the face's gentle scale.
 */
export default compose({
  motions: [clockFace, clockHands, clockModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.04 },
});
