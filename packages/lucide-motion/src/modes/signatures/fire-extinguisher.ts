import { compose } from "../compose";
import { fireExtinguisherReady } from "../motions/fire-extinguisher-ready";

/**
 * Fire-extinguisher — a tool, not actual fire. Uses the shared
 * {@link fireExtinguisherReady} motion: a subtle two-pulse scale
 * contraction + opacity dim across the whole device. Reads as the
 * extinguisher "alive on standby" rather than flame physics — the
 * device itself doesn't burn, so it gets a steady-state ready
 * signal instead of the flame's flicker.
 */
export default compose({
  motions: [fireExtinguisherReady],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
});
