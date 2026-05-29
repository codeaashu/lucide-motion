import { compose } from "../compose";
import { bookBody } from "../motions/book-body";

/**
 * `book` — the base closed-cover book icon, one anatomical role.
 * The bookBody motion handles the whole shape: a subtle scale
 * compression + y bob that reads as the book landing on a surface.
 *
 * The same bookBody motion is the host for every other
 * single-cover book-* composite. Their signatures compose
 * `bookBody` alongside their own badge-subject motions
 * (book-marked's bookmark ribbon, book-key's key, book-image's
 * image frame, etc.) and a future `bookModifierReveal` for the
 * state-marker variants (book-plus / -minus / -check / -x).
 */
export default compose({
  motions: [bookBody],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
