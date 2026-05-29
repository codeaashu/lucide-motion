import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudLightningBolt } from "../motions/cloud-lightning-bolt";

/**
 * Cloud-lightning — cloud body breathes while the lightning bolt
 * descends from inside the cloud's underside and flashes via
 * {@link cloudLightningBolt}. The bolt translates from a hidden
 * position behind the cloud body down to its rest position with a
 * rapid opacity ramp, then runs the multi-flash flicker
 * (bright-dark-bright-dark-settle) of a real lightning strike.
 */
export default compose({
  motions: [cloudBody, cloudLightningBolt],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
});
