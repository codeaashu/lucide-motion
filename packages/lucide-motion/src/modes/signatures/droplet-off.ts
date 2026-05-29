import { compose } from "../compose";
import { dropletModifierReveal } from "../motions/droplet-modifier-reveal";
import { dropletShimmer } from "../motions/droplet-shimmer";

/**
 * Droplet-off — the drop split into two fragments by a diagonal
 * slash. `dropletShimmer` catches the two fragments via the
 * arc-pattern match; `dropletModifierReveal` draws the slash in via
 * `pathLength` + `opacity` while inheriting the drop's shimmer
 * scale so the slash breathes in sync with the fragments.
 */
export default compose({
  motions: [dropletShimmer, dropletModifierReveal],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.05 },
});
