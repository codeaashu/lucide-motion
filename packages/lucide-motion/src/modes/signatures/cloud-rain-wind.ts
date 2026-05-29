import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cloudRainDrops } from "../motions/cloud-rain-drops";

/**
 * Cloud-rain-wind — cloud body breathes while three diagonal rain
 * streaks fall via {@link cloudRainDrops}. The streaks' slant is
 * baked into the path geometry; falling translation moves each
 * streak along its visual axis, the eye reads vertical translation
 * + slanted shape as wind-blown rain.
 */
export default compose({
  motions: [cloudBody, cloudRainDrops],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.1 },
});
