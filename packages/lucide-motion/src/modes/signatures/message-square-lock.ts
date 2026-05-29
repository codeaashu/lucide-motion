import { compose } from "../compose";
import { lockBody } from "../motions/lock-body";
import { lockShackle } from "../motions/lock-shackle";
import { messageSquareBody } from "../motions/message-square-body";
import { messageSquareModifierReveal } from "../motions/message-square-modifier-reveal";

/**
 * `message-square-lock` — bubble nods via `messageSquareBody`; the
 * lock badge in the corner runs its own "lock test" gesture via
 * `lockShackle` (anchorless `y` translate) + `lockBody` (opacity
 * dim). Lock motions are placed FIRST so they claim the shackle path
 * + body rect before `messageSquareModifierReveal`'s wildcard would
 * draw them on as state markers.
 */
export default compose({
  motions: [
    lockShackle,
    lockBody,
    messageSquareBody,
    messageSquareModifierReveal,
  ],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
