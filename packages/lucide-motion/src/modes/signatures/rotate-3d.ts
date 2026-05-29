import { compose } from "../compose";
import { rotate3dOrbit } from "../motions/rotate-3d-orbit";

/**
 * Rotate-3d — a single eased clockwise revolution of the whole
 * icon. The two perpendicular orbital ellipses sweeping past each
 * other through the full cycle reads as a sphere spinning in 3D,
 * distinguishing this variant from the family's quarter-turn
 * gesture used by the 2D rotate icons.
 */
export default compose({
  motions: [rotate3dOrbit],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
});
