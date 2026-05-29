import { compose } from "../compose";
import { imageModifierReveal } from "../motions/image-modifier-reveal";

/**
 * `image-off` — broken picture: every element (frame fragments,
 * broken-mountain fragments, inner sun arc, off-slash) draws in via
 * `imageModifierReveal` as the icon "shatters into view." Distinct
 * from the other image variants which animate the still-intact
 * picture; here the whole anatomy is broken, so a single wildcard
 * reveal reads as the shutter failing to capture.
 */
export default compose({
  motions: [imageModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.04 },
});
