import { bookBody } from "../motions/book-body";
import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { compose } from "../compose";

/**
 * `book-key` — book settles via `bookBody` (extended matcher
 * includes the two reshaped body fragments); the key shape (shaft +
 * tooth + ring circle) draws on via `bookModifierReveal`. A key
 * Round-2 subject isn't authored yet, so the whole key payload
 * reveals via the family wildcard for now.
 */
export default compose({
  motions: [bookBody, bookModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0.05 },
});
