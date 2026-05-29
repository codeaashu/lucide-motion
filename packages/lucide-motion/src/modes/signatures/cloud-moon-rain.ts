import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudRainDrops } from "../motions/cloud-rain-drops";
import { moonGlow } from "../motions/moon-glow";

/**
 * Cloud-moon-rain — same composition as `cloud-moon` plus two
 * short rain drops below the smaller cloud. All three motions use
 * specific matchers (no `matchAnyPath`) so ordering is less
 * critical, but we keep `cloudBody` first by convention.
 */
export default compose({
  motions: [cloudBody, cloudRainDrops, moonGlow],
  defaults: { duration: 1.5, easing: "easeInOut", stagger: 0.08 },
});
