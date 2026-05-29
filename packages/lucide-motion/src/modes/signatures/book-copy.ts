import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { compose } from "../compose";

/**
 * `book-copy` — two overlapping books with no shared closed-book
 * body path. Everything draws in via the wildcard family reveal as
 * the icon "assembles."
 */
export default compose({
  motions: [bookModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0.06 },
});
