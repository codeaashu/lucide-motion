import { compose } from "../compose";
import { mailEnvelope } from "../motions/mail-envelope";
import { mailFlap } from "../motions/mail-flap";

/**
 * Mail-open — same flap-raise gesture as `mail` applied to the
 * open-envelope geometry. The inner V (now at y=10 corners with a
 * deeper middle) rises toward the pivot at y=7, reading as the
 * already-opened envelope's contents peeking out a little further.
 */
export default compose({
  motions: [mailEnvelope, mailFlap],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 7px",
});
