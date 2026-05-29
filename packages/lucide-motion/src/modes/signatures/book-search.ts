import { bookBody } from "../motions/book-body";
import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { compose } from "../compose";
import { searchLoupe } from "../motions/search-loupe";

/**
 * `book-search` — book settles via `bookBody` (extended matcher
 * includes the two reshaped body fragments); the loupe at (17, 18)
 * wobbles via `searchLoupe` (added "book-search": [17, 18] to
 * SEARCH_LOUPE_CENTERS + handle + circle).
 */
export default compose({
  motions: [searchLoupe, bookBody, bookModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
