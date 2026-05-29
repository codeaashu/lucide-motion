import { bookBody } from "../motions/book-body";
import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { compose } from "../compose";

/**
 * `book-heart` — book settles via `bookBody`; the heart badge draws
 * on via `bookModifierReveal`. (The standalone heart subject
 * `heartBeat` matches only the full-size heart geometry; extending
 * to this badge-size heart is deferred.)
 */
export default compose({
  motions: [bookBody, bookModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
