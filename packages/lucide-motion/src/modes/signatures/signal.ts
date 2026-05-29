import { compose } from "../compose";
import { signalBar } from "../motions/signal-bar";
import { signalDot } from "../motions/signal-dot";

/**
 * Signal (full strength) — the zero-indicator dot fades in first,
 * then the four bars cascade left-to-right, each growing from the
 * baseline (y=20) up to its full height. Pivots at "12px 20px" so
 * `scaleY` operates from the baseline uniformly across short and
 * tall bars.
 */
export default compose({
  motions: [signalDot, signalBar],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0.08 },
  transformOrigin: "12px 20px",
});
