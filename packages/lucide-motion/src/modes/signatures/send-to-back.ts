import { compose } from "../compose";
import { sendToBackFront, sendToBackRest } from "../motions/send-to-back";

/**
 * Send-to-back — the front rect (top-left) translates diagonally
 * toward the back rect's position and dims, then returns. The
 * back rect and connector arrows do a quiet opacity sympathy dip
 * on the same rhythm so the icon reads as one cohesive "shift
 * to back" gesture.
 */
export default compose({
  motions: [sendToBackFront, sendToBackRest],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
});
