import { compose } from "../compose";
import { searchLoupe } from "../motions/search-loupe";
import { searchModifierReveal } from "../motions/search-modifier-reveal";

/**
 * search-x — loupe + handle wobble via `searchLoupe`; the two crossed
 * × strokes are External State Markers that draw in onto the loupe
 * via `searchModifierReveal` and then ride the wobble through
 * inherited rotation.
 */
export default compose({
  motions: [searchLoupe, searchModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
  transformOrigin: "11px 11px",
});
