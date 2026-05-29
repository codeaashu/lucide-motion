import { compose } from "../compose";
import { arrowGlide } from "../motions/arrow-glide";
import { arrowSortChars } from "../motions/arrow-sort-chars";
import { arrowSortContent } from "../motions/arrow-sort-content";

/**
 * `arrow-up-1-0` — the two characters on the right cascade in one after
 * another in the arrow's direction (`arrowSortChars`), while the
 * arrow shaft + head on the left glides in the sort direction
 * (`arrowGlide`). `arrowSortChars` placed FIRST so it claims
 * the character elements before `arrowSortContent`'s geometric
 * predicate would treat them as static. `arrowSortContent`
 * remains as a fallback for any future character variants that
 * add static decorations.
 */
export default compose({
  motions: [arrowSortChars, arrowSortContent, arrowGlide],
  defaults: { duration: 0.75, easing: "easeOut", stagger: 0 },
});
