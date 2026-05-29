import { bookBody } from "../motions/book-body";
import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { compose } from "../compose";

/**
 * `book-up-2` — book with two up-arrows. bookBody matches the two
 * reshaped body fragments; the two up-arrows draw in via
 * `bookModifierReveal` with stagger.
 */
export default compose({
  motions: [bookBody, bookModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0.06 },
});
