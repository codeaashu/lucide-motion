import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudModifierReveal } from "../motions/cloud-modifier-reveal";

/**
 * Cloud-check — cloud body breathes while the checkmark draws in
 * via {@link cloudModifierReveal}.
 */
export default compose({
  motions: [cloudBody, cloudModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.05 },
});
