import { compose } from "../compose";
import { batteryCase } from "../motions/battery-case";

/**
 * Battery — the empty casing stays visible and sags in opacity like a
 * weak meter with no charge cells lit.
 */
export default compose({
  motions: [batteryCase],
  defaults: { duration: 1.1, easing: "easeOut", stagger: 0 },
});
