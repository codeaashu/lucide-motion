import { compose } from "../compose";
import { batteryCase } from "../motions/battery-case";
import { batteryModifierReveal } from "../motions/battery-modifier-reveal";

/**
 * Battery-warning — the split casing sags while the visible warning
 * marker blinks like a low-voltage alert LED.
 */
export default compose({
  motions: [batteryCase, batteryModifierReveal],
  defaults: { duration: 1.1, easing: "easeOut", stagger: 0 },
});
