import { compose } from "../compose";
import { wifiCircleReveal, wifiModifierReveal } from "../motions/wifi-modifier-reveal";
import { wifiSignalSource } from "../motions/wifi-signal-source";
import { wifiSignalWave } from "../motions/wifi-signal-wave";
import { wifiSyncArrows } from "../motions/wifi-sync-arrows";

/**
 * Wifi-sync — the remaining signal arcs radiate while the sync arrows
 * rotate as one refresh-ccw-style control loop around the badge center.
 */
export default compose({
  motions: [
    wifiSignalSource,
    wifiSignalWave,
    wifiSyncArrows,
    wifiCircleReveal,
    wifiModifierReveal,
  ],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0.055 },
  transformOrigin: "12px 20px",
});
