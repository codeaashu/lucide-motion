import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudRainDrops } from "../motions/cloud-rain-drops";
import { sunRayPulse } from "../motions/sun-ray-pulse";

/**
 * Cloud-sun-rain — the same composition as `cloud-sun` plus two
 * short rain drops below the smaller cloud. Specific motions are
 * tried before the wildcard `sunRayPulse`: `cloudBody` catches the
 * cloud, `cloudRainDrops` catches the drops (so `sunRayPulse`
 * doesn't claim them via `matchAnyPath`), and `sunRayPulse` then
 * catches the remaining sun rays + quarter-arc.
 */
export default compose({
  motions: [cloudBody, cloudRainDrops, sunRayPulse],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.08 },
});
