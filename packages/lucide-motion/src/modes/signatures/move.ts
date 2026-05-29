import { compose } from "../compose";
import { movePulse } from "../motions/move-pulse";

/**
 * `move` — 4-way move cross (arrows pointing N/S/E/W). Indeterminate
 * direction → uniform scale pulse + opacity dim reads as "movable in
 * any direction" without committing to one axis.
 */
export default compose({
  motions: [movePulse],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
