import { compose } from "../compose";
import { sendPaperPlane } from "../motions/send-paper-plane";

/**
 * Send-horizontal — the rightward paper plane launches +X, fades
 * out as it recedes, then respawns at rest. Direction read from
 * `iconName` by `sendPaperPlane`.
 */
export default compose({
  motions: [sendPaperPlane],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0 },
});
