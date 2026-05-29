import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudSnowDots } from "../motions/cloud-snow-dots";

/**
 * Cloud-snow — six snowflakes fall via {@link cloudSnowDots} with
 * a slower descent than rain plus a small sideways flutter from
 * air currents. Per-path stagger spreads the flakes' phases so
 * the snow reads as drifting rather than synchronised.
 */
export default compose({
  motions: [cloudBody, cloudSnowDots],
  defaults: { duration: 1.8, easing: "easeInOut", stagger: 0.08 },
});
