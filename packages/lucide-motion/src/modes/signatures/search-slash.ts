import { compose } from "../compose";
import { searchLoupe } from "../motions/search-loupe";
import { searchModifierReveal } from "../motions/search-modifier-reveal";

/**
 * search-slash — loupe + handle wobble via `searchLoupe`; the
 * diagonal slash is an External State Marker that draws in onto
 * the loupe via `searchModifierReveal` and then rides the wobble
 * through inherited rotation.
 */
export default compose({
  motions: [searchLoupe, searchModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
  transformOrigin: "11px 11px",
});
