import { compose } from "../compose";
import { rotateSquareSpin } from "../motions/rotate-square-spin";

/**
 * Rotate-cw-square — the rounded-square selection frame (split
 * into two open fragments to make room for the directional arrow
 * on top) and the arrow itself swing clockwise a quarter turn, hold
 * briefly at the apex, then ease back to rest. Frame corners sit
 * inside the inscribed circle so no contraction is needed.
 */
export default compose({
  motions: [rotateSquareSpin],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
