import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";
import { searchLoupe } from "../motions/search-loupe";

/**
 * `file-search` — file envelope + loupe at (11.5, 14.5) wobbling via
 * `searchLoupe` (added "file-search": [11.5, 14.5] to
 * SEARCH_LOUPE_CENTERS + handle + circle).
 */
export default compose({
  motions: [searchLoupe, fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
