import { compose } from "../compose";
import { wifiCircleReveal, wifiModifierReveal } from "../motions/wifi-modifier-reveal";
import { wifiPenWrite } from "../motions/wifi-pen-write";
import { wifiSignalSource } from "../motions/wifi-signal-source";
import { wifiSignalWave } from "../motions/wifi-signal-wave";

/**
 * Wifi-pen — signal arcs radiate while the editing pen writes in on
 * its own diagonal axis.
 */
export default compose({
  motions: [
    wifiSignalSource,
    wifiSignalWave,
    wifiPenWrite,
    wifiCircleReveal,
    wifiModifierReveal,
  ],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0.055 },
  transformOrigin: "12px 20px",
});
