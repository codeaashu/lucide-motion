import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudModifierReveal } from "../motions/cloud-modifier-reveal";

/**
 * Cloud-alert — cloud body breathes while the alert mark (a short
 * vertical bar plus a dot beneath it) draws in via the wildcard
 * {@link cloudModifierReveal}. The reveal also inherits the cloud
 * body's gentle scale so the mark breathes in sync with the cloud
 * rather than floating statically.
 */
export default compose({
  motions: [cloudBody, cloudModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.05 },
});
