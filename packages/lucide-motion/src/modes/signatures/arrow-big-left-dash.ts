import { compose } from "../compose";
import { arrowGlide } from "../motions/arrow-glide";

/**
 * `arrow-big-left-dash` — directional nudge in the indicated direction via
 * `arrowGlide`. Magnitude ±1.5 (vs ±1 for the cardinal arrows) to
 * match the big arrow's visual weight.
 */
export default compose({
  motions: [arrowGlide],
  defaults: { duration: 0.55, easing: "easeOut", stagger: 0 },
});
