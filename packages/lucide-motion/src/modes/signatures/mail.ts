import { compose } from "../compose";
import { mailEnvelope } from "../motions/mail-envelope";
import { mailFlap } from "../motions/mail-flap";

/**
 * Mail — the envelope's V-flap lifts briefly (scaleY contraction
 * around the flap-corner Y level y=7) then settles, with the body
 * opacity dipping gently in step. Reads as a peek-open gesture —
 * the iconic mail "you've got a message" cue.
 */
export default compose({
  motions: [mailEnvelope, mailFlap],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 7px",
});
