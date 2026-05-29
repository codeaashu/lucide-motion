import { bookOpenCover, bookOpenSpine } from "../motions/book-open-cover";
import { compose } from "../compose";

/**
 * `book-open` — two-page open book. Cover dips + dims via
 * `bookOpenCover`; spine line phase-locks opacity via
 * `bookOpenSpine`. Distinct anatomy from the closed-book family.
 */
export default compose({
  motions: [bookOpenCover, bookOpenSpine],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
