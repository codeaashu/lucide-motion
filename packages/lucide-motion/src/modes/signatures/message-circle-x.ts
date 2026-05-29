import { compose } from "../compose";
import { messageCircleBody } from "../motions/message-circle-body";
import { messageCircleModifierReveal } from "../motions/message-circle-modifier-reveal";

/**
 * `message-circle-x` — the bubble nods (`messageCircleBody`) while the
 * marker / payload stamps onto the bubble at the first nod apex via
 * `messageCircleModifierReveal`, inheriting both the nod and the
 * opacity dip so payloads stay anchored to the bubble.
 */
export default compose({
  motions: [messageCircleBody, messageCircleModifierReveal],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
