import { compose } from "../compose";
import { sendPaperPlane } from "../motions/send-paper-plane";

/**
 * Send — the diagonal paper plane launches up-right, fades out as
 * it recedes into the distance, then respawns at the rest
 * position. See `sendPaperPlane` for design notes.
 */
export default compose({
  motions: [sendPaperPlane],
  defaults: { duration: 1.2, easing: "easeOut", stagger: 0 },
});
