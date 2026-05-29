import { compose } from "../compose";
import { messageCircleBody } from "../motions/message-circle-body";
import { messageCircleModifierReveal } from "../motions/message-circle-modifier-reveal";
import { messageCircleTypingDots } from "../motions/message-circle-typing-dots";

/**
 * `message-circle-more` — the bubble nods (`messageCircleBody`)
 * while the three inner dots run an iMessage-style typing
 * indicator: each dot lifts in sequence left → middle → right
 * (`messageCircleTypingDots`), inheriting the bubble's rotate +
 * opacity so the row stays anchored to the bubble through the nod.
 *
 * Duration is longer than the family default (0.9 vs 0.65) so the
 * three lifts read as a clear wave rather than blurring into one.
 */
export default compose({
  motions: [messageCircleBody, messageCircleTypingDots, messageCircleModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
