import { compose } from "../compose";
import { clockFace } from "../motions/clock-face";
import { clockHands } from "../motions/clock-hands";

/** Clock-1 ticks — face pulses, hand-pair (set to 1 o'clock) ticks 6° clockwise. */
export default compose({
  motions: [clockFace, clockHands],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.04 },
});
