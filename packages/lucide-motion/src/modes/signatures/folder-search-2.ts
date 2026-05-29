import { compose } from "../compose";
import { folderBody } from "../motions/folder-body";
import { folderModifierReveal } from "../motions/folder-modifier-reveal";
import { searchLoupe } from "../motions/search-loupe";

/**
 * `folder-search-2` — folder hinges via `folderBody`; the loupe
 * (overlaid front-and-centre on this variant, not corner-badge)
 * wobbles via `searchLoupe` around its centre (11.5, 12.5).
 */
export default compose({
  motions: [searchLoupe, folderBody, folderModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 20px",
});
