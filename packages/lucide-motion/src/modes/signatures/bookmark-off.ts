import { compose } from "../compose";
import { bookmarkModifierReveal } from "../motions/bookmark-modifier-reveal";
import { bookmarkStick } from "../motions/bookmark-stick";

/**
 * `bookmark-off` — the two body fragments stick in via `bookmarkStick`;
 * the diagonal slash draws on via `bookmarkModifierReveal` (placed
 * LAST) and rides the bookmark's bob.
 */
export default compose({
  motions: [bookmarkStick, bookmarkModifierReveal],
  defaults: { duration: 0.7, easing: "easeOut", stagger: 0 },
});
