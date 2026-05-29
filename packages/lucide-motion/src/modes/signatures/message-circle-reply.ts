import { compose } from "../compose";
import { messageCircleBody } from "../motions/message-circle-body";
import { messageCircleModifierReveal } from "../motions/message-circle-modifier-reveal";
import { messageCircleReplyArrow } from "../motions/message-circle-reply-arrow";

/**
 * `message-circle-reply` — the bubble nods (`messageCircleBody`)
 * while the reply arrow nudges leftward and returns
 * (`messageCircleReplyArrow`), reading as the arrow "pointing back"
 * to its sender. The arrow stays visible at rest and inherits the
 * bubble's rotate + opacity for cohesion.
 */
export default compose({
  motions: [messageCircleBody, messageCircleReplyArrow, messageCircleModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
