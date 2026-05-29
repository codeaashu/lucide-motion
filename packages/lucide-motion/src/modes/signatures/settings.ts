import { compose } from "../compose";
import { settingsGear } from "../motions/settings-gear";

/**
 * `settings` — the rounded gear icon (wavy outline + central socket).
 * One eased 0→360° revolution around the icon centre via
 * `settingsGear`. Distinct from `cog` (which uses discrete teeth + a
 * bespoke `cog-gear` motion with per-composite pivot lookup).
 */
export default compose({
  motions: [settingsGear],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
});
