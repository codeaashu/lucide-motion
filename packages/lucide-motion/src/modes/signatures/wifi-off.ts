import { compose } from "../compose";
import { wifiCircleReveal, wifiModifierReveal } from "../motions/wifi-modifier-reveal";
import { wifiSignalSource } from "../motions/wifi-signal-source";
import { wifiSignalWave } from "../motions/wifi-signal-wave";

/**
 * Wifi-off — broken signal arcs still radiate from the source while
 * the diagonal slash reveals at the emission peak.
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
