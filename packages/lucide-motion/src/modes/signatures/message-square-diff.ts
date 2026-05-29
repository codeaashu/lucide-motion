import { compose } from "../compose";
import { messageSquareBody } from "../motions/message-square-body";
import { messageSquareModifierReveal } from "../motions/message-square-modifier-reveal";

/**
 * `message-square-diff` — the bubble nods (`messageSquareBody`) while the
 * marker / payload stamps onto the bubble at the first nod apex via
 * `messageSquareModifierReveal`, inheriting both the nod and the
 * opacity dip so payloads stay anchored to the bubble.
 */
export default compose({
  motions: [messageSquareBody, messageSquareModifierReveal],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
