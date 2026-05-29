import { compose } from "../compose";
import { pilcrowArrow } from "../motions/pilcrow-arrow";
import { typewriterStamp } from "../motions/typewriter-stamp";

/**
 * `pilcrow-left` — pilcrow strokes stamp via `typewriterStamp`; the
 * leftward arrow glides LEFT via `pilcrowArrow` (placed FIRST so
 * the arrow paths are claimed).
 */
export default compose({
  motions: [pilcrowArrow, typewriterStamp],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
