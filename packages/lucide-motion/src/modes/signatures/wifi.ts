import { compose } from "../compose";
import { wifiCircleReveal, wifiModifierReveal } from "../motions/wifi-modifier-reveal";
import { wifiSignalSource } from "../motions/wifi-signal-source";
import { wifiSignalWave } from "../motions/wifi-signal-wave";

/**
 * Wifi — source dot emits first, then the inner/middle/outer arcs
 * radiate outward from the bottom source point.
 */
export default compose({
  motions: [
    wifiSignalSource,
    wifiSignalWave,
    wifiCircleReveal,
    wifiModifierReveal,
  ],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0.055 },
  transformOrigin: "12px 20px",
});
