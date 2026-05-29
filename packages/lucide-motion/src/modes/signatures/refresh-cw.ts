import { compose } from "../compose";
import { refreshArcCycle } from "../motions/refresh-arc-cycle";

/**
 * Refresh-cw — the two clockwise arcs and their arrowhead tick marks
 * wipe to invisible and redraw along the path's stored direction,
 * reading as a clockwise refresh sweep without ever applying a
 * transform that would clip the corner ticks against the viewBox.
 * See `refreshArcCycle` for the design notes on why this avoids a
 * literal 360° rotation.
 */
export default compose({
  motions: [refreshArcCycle],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
