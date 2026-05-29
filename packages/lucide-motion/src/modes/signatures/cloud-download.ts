import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudModifierReveal } from "../motions/cloud-modifier-reveal";

/**
 * Cloud-download — cloud body breathes while the down-arrow's
 * shaft + V chevron draw in via {@link cloudModifierReveal}.
 * Stagger between the two arrow paths gives the V a "snap-into-
 * place" feel after the shaft.
 */
export default compose({
  motions: [cloudBody, cloudModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.06 },
});
