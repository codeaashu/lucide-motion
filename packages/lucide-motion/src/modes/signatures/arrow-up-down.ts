import { compose } from "../compose";
import { arrowOscillate } from "../motions/arrow-oscillate";

/**
 * `arrow-up-down` — bidirectional oscillation along the indicated axis
 * (`arrowOscillate`). Whole icon shifts one direction, returns
 * past centre, settles. Reads as "this represents bidirectional
 * movement."
 */
export default compose({
  motions: [arrowOscillate],
  defaults: { duration: 0.75, easing: "easeInOut", stagger: 0 },
});
