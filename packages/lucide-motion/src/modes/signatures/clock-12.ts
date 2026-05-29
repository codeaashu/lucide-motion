import { compose } from "../compose";
import { clockFace } from "../motions/clock-face";
import { clockHands } from "../motions/clock-hands";

/**
 * Clock-12 ticks — face pulses, hand-pair ticks 6° clockwise. At 12
 * o'clock both hands overlap pointing straight up, so the hand path
 * is just `M12 6v6` (minute hand from 12 to centre with no hour-hand
 * continuation, since the hour hand sits exactly behind it).
 */
export default compose({
  motions: [clockFace, clockHands],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.04 },
});
