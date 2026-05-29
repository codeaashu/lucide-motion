import { compose } from "../compose";
import { messageSquareBody } from "../motions/message-square-body";
import { messageSquareModifierReveal } from "../motions/message-square-modifier-reveal";
import { messageSquareShareArrow } from "../motions/message-square-share-arrow";

/**
 * `message-square-share` — the bubble nods (`messageSquareBody`)
 * while the share arrow nudges upward and returns
 * (`messageSquareShareArrow`), reading as content being sent
 * outward. The arrow stays visible at rest and inherits the
 * bubble's rotate + opacity for cohesion.
 *
 * `messageSquareShareArrow` is placed BETWEEN the body and the
 * wildcard so it claims the two arrow paths with Tier 2 physics
 * instead of the wildcard's draw-in.
 */
export default compose({
  motions: [messageSquareBody, messageSquareShareArrow, messageSquareModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
