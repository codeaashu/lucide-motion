import { compose } from "../compose";
import { movePulse } from "../motions/move-pulse";

/**
 * `move-3d` — L-axes + 3D edge + arrows on the two axes. "Move in
 * 3D space" → uniform pulse via `movePulse`.
 */
export default compose({
  motions: [movePulse],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
