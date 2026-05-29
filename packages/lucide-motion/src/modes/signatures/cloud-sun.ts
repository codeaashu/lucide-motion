import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { sunRayPulse } from "../motions/sun-ray-pulse";

/**
 * Cloud-sun — the smaller cloud sits in the lower-left while the
 * sun (four rays + an upper-right quarter-arc) peeks out from the
 * upper-right. The cloud body breathes via {@link cloudBody} while
 * the sun radiates via {@link sunRayPulse} — rays cascade outward
 * from the sun's centre (which here is exactly (12, 12), the icon
 * centre and the default transform origin).
 *
 * `sunRayPulse` is `matchAnyPath`, so any path not already caught
 * by `cloudBody` (the sun rays + the sun's quarter-arc) falls
 * through to it.
 */
export default compose({
  motions: [cloudBody, sunRayPulse],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.05 },
});
