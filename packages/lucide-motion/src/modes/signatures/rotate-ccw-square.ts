import { compose } from "../compose";
import { rotateSquareSpin } from "../motions/rotate-square-spin";

/**
 * Rotate-ccw-square — counter-clockwise mirror of `rotate-cw-square`.
 * Direction is read from the `iconName` by `rotateSquareSpin` and
 * applied as -90.
 */
export default compose({
  motions: [rotateSquareSpin],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
