import { compose } from "../compose";
import { bookmarkModifierReveal } from "../motions/bookmark-modifier-reveal";
import { bookmarkStick } from "../motions/bookmark-stick";

/**
 * `bookmark-plus` — body sticks in via `bookmarkStick`; the plus cross
 * strokes draw on via `bookmarkModifierReveal` (placed LAST) and ride
 * the bookmark's bob.
 */
export default compose({
  motions: [bookmarkStick, bookmarkModifierReveal],
  defaults: { duration: 0.7, easing: "easeOut", stagger: 0 },
});
