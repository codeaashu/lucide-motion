import { compose } from "../compose";
import { messageSquareBody } from "../motions/message-square-body";
import { messageSquareModifierReveal } from "../motions/message-square-modifier-reveal";
import { messageSquareTypingDots } from "../motions/message-square-typing-dots";

/**
 * `message-square-more` — the bubble nods (`messageSquareBody`)
 * while the three inner dots run an iMessage-style typing
 * indicator: each dot lifts in sequence left → middle → right
 * (`messageSquareTypingDots`), inheriting the bubble's rotate +
 * opacity so the row stays anchored to the bubble through the nod.
 *
 * `messageSquareTypingDots` is placed BEFORE the wildcard so it
 * claims the three dot paths with Tier 2 typing physics instead of
 * the wildcard's draw-in.
 *
 * Duration is longer than the family default (0.9 vs 0.65) so the
 * left → middle → right wave has time to read as three separate
 * lifts rather than blurring into one.
 */
export default compose({
  motions: [messageSquareBody, messageSquareTypingDots, messageSquareModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
