import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { bookOpenCover, bookOpenSpine } from "../motions/book-open-cover";
import { compose } from "../compose";

/**
 * `book-open-text` — open-book with 4 text lines (2 per page). Cover
 * + spine via the open-book motions; text lines draw in via the
 * wildcard family reveal staggered.
 */
export default compose({
  motions: [bookOpenCover, bookOpenSpine, bookModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0.05 },
});
