import { compose } from "../compose";
import { clockFace } from "../motions/clock-face";
import { clockHands } from "../motions/clock-hands";

/**
 * Clock-6 ticks — face pulses, hand-pair (set to 6 o'clock, where
 * the hands form a single colinear line from 12 to 6) ticks 6°
 * clockwise. Hand path is `M12 6v10` here rather than the more
 * common `M12 6v6…` continuation — both are caught by `clockHands`'s
 * `startsWith("M12 6v")` predicate.
 */
export default compose({
  motions: [clockFace, clockHands],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.04 },
});
