import { compose } from "../compose";
import { pilcrowArrow } from "../motions/pilcrow-arrow";
import { typewriterStamp } from "../motions/typewriter-stamp";

/**
 * `pilcrow-right` — pilcrow strokes stamp via `typewriterStamp`;
 * the rightward arrow glides RIGHT via `pilcrowArrow`.
 */
export default compose({
  motions: [pilcrowArrow, typewriterStamp],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
