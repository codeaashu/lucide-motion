import { compose } from "../compose";
import { batteryCase } from "../motions/battery-case";
import { batteryCellFill } from "../motions/battery-cell-fill";

/**
 * Battery-full — all three charge cells carry a left-to-right voltage
 * ripple while the casing stays visible.
 */
export default compose({
  motions: [batteryCellFill, batteryCase],
  defaults: { duration: 1.1, easing: "easeOut", stagger: 0 },
});
