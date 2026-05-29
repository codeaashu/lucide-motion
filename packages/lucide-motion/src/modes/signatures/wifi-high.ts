import { compose } from "../compose";
import { wifiCircleReveal, wifiModifierReveal } from "../motions/wifi-modifier-reveal";
import { wifiSignalSource } from "../motions/wifi-signal-source";
import { wifiSignalWave } from "../motions/wifi-signal-wave";

/**
 * Wifi-high — the source dot emits, then the available middle and
 * inner signal arcs radiate from the bottom source point.
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
