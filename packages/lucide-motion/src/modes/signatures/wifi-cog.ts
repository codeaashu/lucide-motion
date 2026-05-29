import { compose } from "../compose";
import { cogGear } from "../motions/cog-gear";
import { wifiModifierReveal } from "../motions/wifi-modifier-reveal";
import { wifiSignalSource } from "../motions/wifi-signal-source";
import { wifiSignalWave } from "../motions/wifi-signal-wave";

/**
 * `wifi-cog` — the signal arcs radiate from the lower source while
 * the gear badge at the upper-right rotates one full revolution via
 * `cogGear` around (18, 18).
 *
 * `cogGear` is placed FIRST so the cog teeth + hub are claimed by
 * rotation before `wifiModifierReveal`'s wildcard would draw the
 * gear on as if it were a state marker. Per-variant
 * `transformOrigin: "18px 18px"` on each cog element overrides the
 * signature-level `transformOrigin: "12px 20px"` (still used by the
 * wifi source motions) — engine uses `transformBox: "view-box"` so
 * both pivots resolve in user units cleanly.
 */
export default compose({
  motions: [
    cogGear,
    wifiSignalSource,
    wifiSignalWave,
    wifiModifierReveal,
  ],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0.055 },
  transformOrigin: "12px 20px",
});
