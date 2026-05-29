import { compose } from "../compose";
import { clockFace } from "../motions/clock-face";
import { clockHands } from "../motions/clock-hands";

/**
 * Clock — face pulses gently while the hand-pair ticks 6° clockwise
 * (one minute step), holds, and eases back to rest. The signature
 * pivots at the default (12, 12), which is the clock's centre.
 */
export default compose({
  motions: [clockFace, clockHands],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.04 },
});
