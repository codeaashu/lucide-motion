import { compose } from "../compose";
import { bookmarkStick } from "../motions/bookmark-stick";

/**
 * `bookmark` — sticks into the page (a downward push) and settles. See
 * `bookmarkStick`.
 */
export default compose({
  motions: [bookmarkStick],
  defaults: { duration: 0.7, easing: "easeOut", stagger: 0 },
});
