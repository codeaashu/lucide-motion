import { compose } from "../compose";
import { signalDot } from "../motions/signal-dot";

/**
 * Signal-zero — only the zero-indicator dot. No bars to cascade,
 * just the dot's quiet opacity fade-in.
 */
export default compose({
  motions: [signalDot],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 20px",
});
