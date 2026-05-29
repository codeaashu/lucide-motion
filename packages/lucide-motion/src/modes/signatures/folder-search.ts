import { compose } from "../compose";
import { folderBody } from "../motions/folder-body";
import { folderModifierReveal } from "../motions/folder-modifier-reveal";
import { searchLoupe } from "../motions/search-loupe";

/**
 * `folder-search` — folder hinges via `folderBody`; the loupe badge
 * at the lower-right wobbles via `searchLoupe` around its own centre
 * (17, 17). Search motion placed FIRST so the loupe circle + handle
 * are claimed by the wobble before `folderModifierReveal`'s wildcard
 * would draw them on as state markers.
 */
export default compose({
  motions: [searchLoupe, folderBody, folderModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 20px",
});
