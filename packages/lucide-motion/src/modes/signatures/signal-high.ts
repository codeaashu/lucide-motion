import { compose } from "../compose";
import { signalBar } from "../motions/signal-bar";
import { signalDot } from "../motions/signal-dot";

/**
 * Signal-high — dot + three bars (missing the tallest fourth bar
 * of the full `signal` icon). Same baseline-cascade gesture; the
 * three bars present grow left-to-right.
 */
export default compose({
  motions: [signalDot, signalBar],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0.08 },
  transformOrigin: "12px 20px",
});
