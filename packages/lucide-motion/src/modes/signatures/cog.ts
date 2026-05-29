import { compose } from "../compose";
import { cogGear } from "../motions/cog-gear";

/**
 * `cog` — standalone settings gear. Twelve teeth + concentric inner
 * and outer circles, all rotating one full revolution around (12, 12)
 * via `cogGear`. The motion is the canonical "configure" gesture and
 * the template every composite cog (cloud-cog, wifi-cog, monitor-cog,
 * file-cog, ...) inherits from.
 */
export default compose({
  motions: [cogGear],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
});
