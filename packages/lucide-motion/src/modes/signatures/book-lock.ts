import { bookBody } from "../motions/book-body";
import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { compose } from "../compose";
import { lockBody } from "../motions/lock-body";
import { lockShackle } from "../motions/lock-shackle";

/**
 * `book-lock` — book settles via `bookBody` (extended matcher
 * includes the two reshaped body fragments); the lock badge runs
 * its Round-2 motions: shackle pulls up via `lockShackle`
 * (`M18 6V4a2 2 0 1 0-4 0v2` already in LOCK_SHACKLE_DS); body 8×5
 * rect dims via `lockBody` (already covered by the (w, h) tuple).
 */
export default compose({
  motions: [lockShackle, lockBody, bookBody, bookModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
