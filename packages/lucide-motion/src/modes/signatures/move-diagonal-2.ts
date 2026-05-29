import { compose } from "../compose";
import { movePulse } from "../motions/move-pulse";

/**
 * `move-diagonal-2` — mirror of `move-diagonal` (opposite diagonal).
 * Same uniform pulse via `movePulse`.
 */
export default compose({
  motions: [movePulse],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
