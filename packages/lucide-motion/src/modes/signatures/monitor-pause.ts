import { compose } from "../compose";
import { monitorChassis } from "../motions/monitor-chassis";
import { monitorModifierReveal } from "../motions/monitor-modifier-reveal";

/**
 * `monitor-pause` — the display wakes (`monitorChassis`) while the
 * marker / payload stamps onto the screen at the wake apex via
 * `monitorModifierReveal`, pulsing in step with the screen so it
 * stays anchored to the device throughout the flash.
 */
export default compose({
  motions: [monitorChassis, monitorModifierReveal],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 17px",
});
