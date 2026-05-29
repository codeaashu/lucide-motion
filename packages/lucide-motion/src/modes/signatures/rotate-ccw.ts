import { compose } from "../compose";
import { rotateArcCycle } from "../motions/rotate-arc-cycle";

/**
 * Rotate-ccw — counter-clockwise quarter-turn-and-back. Same
 * mechanics as rotate-cw; direction is read from the `iconName` by
 * `rotateArcCycle` and applied as -90.
 */
export default compose({
  motions: [rotateArcCycle],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
