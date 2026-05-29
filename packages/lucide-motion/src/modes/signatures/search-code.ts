import { codeSymbol } from "../motions/code-symbol";
import { compose } from "../compose";
import { searchLoupe } from "../motions/search-loupe";
import { searchModifierReveal } from "../motions/search-modifier-reveal";

/**
 * `search-code` — loupe + handle wobble via `searchLoupe`; the `</>`
 * chevrons inside the loupe pinch via `codeSymbol` (Tier 2 subject,
 * placed FIRST). Anything else falls through to
 * `searchModifierReveal` for the External State Marker draw-in.
 */
export default compose({
  motions: [codeSymbol, searchLoupe, searchModifierReveal],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
  transformOrigin: "11px 11px",
});
