import { compose } from "../compose";
import { shieldBody } from "../motions/shield-body";
import { shieldModifierReveal } from "../motions/shield-modifier-reveal";

/**
 * `shield-minus` — the crest deflects (`shieldBody`) while the marker /
 * payload stamps onto the shield at the deflect apex via
 * `shieldModifierReveal`, tilting and dimming in step with the
 * shield so it stays anchored to the crest through the rebound.
 */
export default compose({
  motions: [shieldBody, shieldModifierReveal],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 22px",
});
