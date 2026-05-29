import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudModifierReveal } from "../motions/cloud-modifier-reveal";

/**
 * Cloud-upload — cloud body breathes while the up-arrow's shaft +
 * V chevron draw in via {@link cloudModifierReveal}. Mirrors the
 * cloud-download pattern with the arrow pointing up instead.
 */
export default compose({
  motions: [cloudBody, cloudModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.06 },
});
