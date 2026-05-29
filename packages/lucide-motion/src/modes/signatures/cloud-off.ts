import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudModifierReveal } from "../motions/cloud-modifier-reveal";

/**
 * Cloud-off — Lucide draws the cloud body as two fragments split by
 * the diagonal slash; `cloudBody` catches both fragments via the
 * arc-pattern match. The slash itself draws in via
 * {@link cloudModifierReveal}.
 */
export default compose({
  motions: [cloudBody, cloudModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.05 },
});
