import { compose } from "../compose";
import { batteryCase } from "../motions/battery-case";
import { batteryCellFill } from "../motions/battery-cell-fill";

/**
 * Battery-low — the casing sags while the single left cell carries a
 * weak voltage ripple from the bottom baseline.
 */
export default compose({
  motions: [batteryCellFill, batteryCase],
  defaults: { duration: 1.1, easing: "easeOut", stagger: 0 },
});
