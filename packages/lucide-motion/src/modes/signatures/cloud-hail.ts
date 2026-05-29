import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudRainDrops } from "../motions/cloud-rain-drops";
import { cloudSnowDots } from "../motions/cloud-snow-dots";

/**
 * Cloud-hail — three larger vertical hailstone chunks fall via
 * {@link cloudRainDrops}, while three smaller round hailstones
 * fall via {@link cloudSnowDots}. The two motion modules give
 * the big chunks straight-vertical drops and the smaller pieces
 * a slight sideways flutter, reading as mixed-size hail coming
 * down together.
 */
export default compose({
  motions: [cloudBody, cloudRainDrops, cloudSnowDots],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.08 },
});
