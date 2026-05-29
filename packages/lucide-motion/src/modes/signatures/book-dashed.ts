import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { compose } from "../compose";

/**
 * `book-dashed` — 11 dashed-outline segments forming the book shape.
 * No solid book body path, so everything draws in via the wildcard
 * family reveal with stagger so the segments cascade into a book.
 */
export default compose({
  motions: [bookModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.04 },
});
