import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudModifierReveal } from "../motions/cloud-modifier-reveal";

/**
 * Cloud-backup — cloud body breathes while the backup-arc + arrow
 * paths (a small re-entry curve and arrow fragments) draw in via
 * {@link cloudModifierReveal}.
 */
export default compose({
  motions: [cloudBody, cloudModifierReveal],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.06 },
});
