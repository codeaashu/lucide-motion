import { compose } from "../compose";
import { arrowGlide } from "../motions/arrow-glide";
import { arrowSortContent } from "../motions/arrow-sort-content";
import { arrowSortLines } from "../motions/arrow-sort-lines";

/**
 * `arrow-up-narrow-wide` — the three divider lines on the right side cascade in
 * one by one in the arrow's direction (`arrowSortLines`), while
 * the arrow shaft + head on the left glides in the sort direction
 * (`arrowGlide`). `arrowSortLines` placed FIRST so it claims the
 * three lines with cascade physics before `arrowSortContent`'s
 * geometric predicate would treat them as static. Other right-side
 * content (none for narrow-wide variants — the three lines ARE the
 * content) would fall through to `arrowSortContent` if it existed.
 */
export default compose({
  motions: [arrowSortLines, arrowSortContent, arrowGlide],
  defaults: { duration: 0.75, easing: "easeOut", stagger: 0 },
});
