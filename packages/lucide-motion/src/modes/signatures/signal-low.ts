import { compose } from "../compose";
import { signalBar } from "../motions/signal-bar";
import { signalDot } from "../motions/signal-dot";

/**
 * Signal-low — dot + one bar. Same baseline-cascade gesture.
 */
export default compose({
  motions: [signalDot, signalBar],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0.08 },
  transformOrigin: "12px 20px",
});
