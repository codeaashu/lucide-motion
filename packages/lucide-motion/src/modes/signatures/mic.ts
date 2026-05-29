import { compose } from "../compose";
import { micBody } from "../motions/mic-body";

/**
 * Mic — the whole body shares the "mic is hot" pulse (subtle two-beat
 * scale contraction) so the capsule, U-arc holder, and stem read as
 * actively listening together rather than the capsule flicking alone
 * over a static frame.
 */
export default compose({
  motions: [micBody],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
