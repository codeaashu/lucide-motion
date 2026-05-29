import { compose } from "../compose";
import { clockFace } from "../motions/clock-face";
import { clockHands } from "../motions/clock-hands";
import { clockModifierReveal } from "../motions/clock-modifier-reveal";

/**
 * Clock-alert ticks with the alert indicator (a vertical bar + dot
 * to the right of the face) revealing in. The face here is a partial
 * radius-10 arc rather than a full circle — `clockFace` catches it
 * via the `[Aa]10 10 0` arc pattern. The alert paths fall through to
 * `clockModifierReveal`, which draws them in with `pathLength` +
 * `opacity` and scales them with the host face's gentle pulse.
 */
export default compose({
  motions: [clockFace, clockHands, clockModifierReveal],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.04 },
});
