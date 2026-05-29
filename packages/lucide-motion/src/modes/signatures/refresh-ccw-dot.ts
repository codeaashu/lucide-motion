import { compose } from "../compose";
import { refreshArcCycle } from "../motions/refresh-arc-cycle";
import { refreshCenterDot } from "../motions/refresh-center-dot";

/**
 * Refresh-ccw-dot — the counter-clockwise refresh wheel plus a
 * pending-content indicator at the icon centre. The arcs wipe and
 * redraw; the dot contracts and dims at the wipe trough so it
 * shares a kinetic peak with the loop, then recovers as the icon
 * redraws around it. The dot is the persistent anchor that the
 * refresh action revolves around.
 */
export default compose({
  motions: [refreshArcCycle, refreshCenterDot],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
