import { compose } from "../compose";
import { cogGear } from "../motions/cog-gear";
import { monitorChassis } from "../motions/monitor-chassis";
import { monitorModifierReveal } from "../motions/monitor-modifier-reveal";

/**
 * `monitor-cog` — the display wakes via `monitorChassis` while the
 * gear badge at the upper-right rotates one full revolution via
 * `cogGear` around (18, 6).
 *
 * `cogGear` is placed FIRST so the cog teeth + hub are claimed by
 * rotation before `monitorModifierReveal`'s wildcard would draw
 * the gear on as if it were a state marker. Per-variant
 * `transformOrigin: "18px 6px"` overrides the signature-level
 * `transformOrigin: "12px 17px"` (still used by the chassis motion)
 * cleanly via view-box `transformBox`.
 */
export default compose({
  motions: [cogGear, monitorChassis, monitorModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 17px",
});
