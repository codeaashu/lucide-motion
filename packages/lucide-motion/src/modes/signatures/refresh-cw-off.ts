import { compose } from "../compose";
import { refreshArcCycle } from "../motions/refresh-arc-cycle";
import { refreshModifierReveal } from "../motions/refresh-modifier-reveal";

/**
 * Refresh-cw-off — the clockwise refresh wheel (now split into four
 * arc fragments by the slash) still tries to wipe and redraw via
 * `refreshArcCycle`, while the diagonal slash strikes through at the
 * wipe trough via `refreshModifierReveal`. The "blocked" reading
 * comes from the slash being the only thing visible at the cycle's
 * narrative low point — when the arcs have vanished, the disabled-
 * state marker is what remains.
 */
export default compose({
  motions: [refreshArcCycle, refreshModifierReveal],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
