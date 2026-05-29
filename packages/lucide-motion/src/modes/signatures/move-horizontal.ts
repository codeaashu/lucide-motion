import { compose } from "../compose";
import { movePulse } from "../motions/move-pulse";

/**
 * `move-horizontal` — left+right arrows on a horizontal axis.
 * Indeterminate direction → uniform pulse via `movePulse`.
 */
export default compose({
  motions: [movePulse],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
