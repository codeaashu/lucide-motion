import { compose } from "../compose";
import { rotateArcCycle } from "../motions/rotate-arc-cycle";
import { rotateKeyTurn } from "../motions/rotate-key-turn";

/**
 * Rotate-ccw-key — two simultaneous gestures sharing one apex:
 * the arc + arrowhead pinch and swing counter-clockwise around the
 * icon centre via `rotateArcCycle` (indicator-of-direction), and
 * the key (shaft + cross piece + keyhole circle) turns counter-
 * clockwise around its own keyhole pivot at (12, 15) via
 * `rotateKeyTurn` — reads as "turn the key in the lock to unlock"
 * with the arc showing which way.
 */
export default compose({
  motions: [rotateArcCycle, rotateKeyTurn],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
