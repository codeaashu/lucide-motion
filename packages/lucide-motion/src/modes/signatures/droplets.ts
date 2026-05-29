import { compose } from "../compose";
import { dropletShimmer } from "../motions/droplet-shimmer";

/**
 * Droplets — a smaller drop on the left and a larger drop on the
 * right, both bobbing gently via {@link dropletShimmer}. Per-path
 * stagger gives the two drops a slight phase offset so they don't
 * shimmer in lockstep — reads as water drops responding to
 * independent ripples rather than a synchronised pulse.
 */
export default compose({
  motions: [dropletShimmer],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.15 },
});
