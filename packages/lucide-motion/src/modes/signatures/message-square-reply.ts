import { compose } from "../compose";
import { messageSquareBody } from "../motions/message-square-body";
import { messageSquareModifierReveal } from "../motions/message-square-modifier-reveal";
import { messageSquareReplyArrow } from "../motions/message-square-reply-arrow";

/**
 * `message-square-reply` — the bubble nods (`messageSquareBody`)
 * while the reply arrow nudges leftward and returns
 * (`messageSquareReplyArrow`), reading as the arrow "pointing back"
 * to its sender. The arrow stays visible at rest and inherits the
 * bubble's rotate + opacity for cohesion.
 */
export default compose({
  motions: [messageSquareBody, messageSquareReplyArrow, messageSquareModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
