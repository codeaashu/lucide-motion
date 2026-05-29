import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudRainDrops } from "../motions/cloud-rain-drops";

/**
 * Cloud-drizzle — six short drop nubs (two rows of three) fall via
 * {@link cloudRainDrops}. The shorter `v1` strokes vs cloud-rain's
 * `v6` strokes are what gives drizzle its lighter visual character;
 * the same falling-translation motion captures both, and tighter
 * stagger across more drops makes the drizzle feel busier than the
 * three-drop rain.
 */
export default compose({
  motions: [cloudBody, cloudRainDrops],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.08 },
});
