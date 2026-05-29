import { compose } from "../compose";
import { rotateArcCycle } from "../motions/rotate-arc-cycle";

/**
 * Rotate-cw — the arc-and-arrowhead pinches inward, swings a
 * clockwise quarter turn, holds briefly at the apex, then eases
 * back to rest. The canonical "rotate by 90°" gesture from image
 * editors and selection tools. See `rotateArcCycle` for the design
 * notes on the contraction trick that keeps the corner arrowhead
 * inside the viewBox at intermediate angles.
 */
export default compose({
  motions: [rotateArcCycle],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
