import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudModifierReveal } from "../motions/cloud-modifier-reveal";
import { cloudSyncArrows } from "../motions/cloud-sync-arrows";

/**
 * Cloud-sync — cloud body breathes while the four sync-arrow paths
 * rotate as one refresh-ccw-style wheel around the badge center
 * (12, 16). The wheel uses the same pinch-then-spin rhythm as
 * `wifi-sync` and the refresh family, so the four disjoint paths
 * read as one rigid mechanism instead of a draw-in cascade.
 */
export default compose({
  motions: [cloudBody, cloudSyncArrows, cloudModifierReveal],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.06 },
});
