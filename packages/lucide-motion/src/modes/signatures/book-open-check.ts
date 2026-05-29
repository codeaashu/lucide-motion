import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { bookOpenCover, bookOpenSpine } from "../motions/book-open-cover";
import { compose } from "../compose";

/**
 * `book-open-check` — open-book cover + spine + check tick. Cover +
 * spine via `bookOpenCover` / `bookOpenSpine`; check draws on via
 * the family wildcard (still uses BOOK_BODY_KEYFRAMES.y for kinetic
 * life — close enough to the open-cover beat).
 */
export default compose({
  motions: [bookOpenCover, bookOpenSpine, bookModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
