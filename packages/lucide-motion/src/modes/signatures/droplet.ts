import { compose } from "../compose";
import { dropletShimmer } from "../motions/droplet-shimmer";

/**
 * Droplet — a single closed water-drop path that bobs gently
 * downward, contracts slightly (surface tension), and dims its
 * opacity (light refraction through the curved surface) via the
 * shared {@link dropletShimmer} motion. No modifiers, no slashes —
 * just the drop, breathing.
 */
export default compose({
  motions: [dropletShimmer],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
});
