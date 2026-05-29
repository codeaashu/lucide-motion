import { compose } from "../compose";
import { batteryCase } from "../motions/battery-case";
import { batteryModifierReveal } from "../motions/battery-modifier-reveal";

/**
 * Battery-plus — the split casing ripples while the visible plus
 * marker performs a small press/rebound pulse.
 */
export default compose({
  motions: [batteryCase, batteryModifierReveal],
  defaults: { duration: 1.1, easing: "easeOut", stagger: 0 },
});
