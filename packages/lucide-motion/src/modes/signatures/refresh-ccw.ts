import { compose } from "../compose";
import { refreshArcCycle } from "../motions/refresh-arc-cycle";

/**
 * Refresh-ccw — same wipe-redraw cycle as `refresh-cw`, but the path
 * data's stored direction is counter-clockwise, so pathLength's 0→1
 * phase visually rotates in the opposite direction. Direction is
 * encoded in the geometry; the motion module is shared.
 */
export default compose({
  motions: [refreshArcCycle],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
