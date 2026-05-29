import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudFogStreaks } from "../motions/cloud-fog-streaks";

/**
 * Cloud-fog — cloud body breathes while two horizontal fog streaks
 * drift laterally via {@link cloudFogStreaks}. Each streak sways
 * along its own X axis and its density dips/recovers mid-cycle,
 * reading as wisps catching the breeze rather than the icon
 * writing itself in. Stagger offsets the two banks so the upper
 * wisp drifts slightly ahead of the lower.
 */
export default compose({
  motions: [cloudBody, cloudFogStreaks],
  defaults: { duration: 2.0, easing: "easeInOut", stagger: 0.2 },
});
