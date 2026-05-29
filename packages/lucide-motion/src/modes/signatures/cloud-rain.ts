import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudRainDrops } from "../motions/cloud-rain-drops";

/**
 * Cloud-rain — cloud body breathes while three drops fall via
 * {@link cloudRainDrops}. Drops translate downward through a small
 * Y range and fade in at the cloud, out before the floor. Per-path
 * stagger cascades the drops so the shower reads as a brief gust
 * passing through. One characteristic cycle per hover.
 */
export default compose({
  motions: [cloudBody, cloudRainDrops],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.1 },
});
