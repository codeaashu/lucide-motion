import { compose } from "../compose";
import { movePulse } from "../motions/move-pulse";

/**
 * `move-diagonal` — two L-brackets at opposite corners + diagonal
 * connector. "Resize along this diagonal" → uniform pulse via
 * `movePulse`.
 */
export default compose({
  motions: [movePulse],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
