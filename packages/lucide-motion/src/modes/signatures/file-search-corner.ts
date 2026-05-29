import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";
import { searchLoupe } from "../motions/search-loupe";

/**
 * `file-search-corner` — file envelope + corner-badge loupe at
 * (16, 17) wobbling via `searchLoupe`.
 */
export default compose({
  motions: [searchLoupe, fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
