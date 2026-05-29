import { awardRibbonSway } from "../motions/award-ribbon-sway";
import { compose } from "../compose";
import { polishedShineSweep } from "../motions/polished-shine-sweep";

/**
 * `award` — medal circle pulses via `polishedShineSweep` (catching
 * light); ribbon flag sways side-to-side from its attachment point
 * under the medal via `awardRibbonSway`. Sway motion placed FIRST
 * so it claims the ribbon path before the shine sweep would.
 */
export default compose({
  motions: [awardRibbonSway, polishedShineSweep],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
});
