import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * `file-clock` — clock badge subject integration deferred (clockFace
 * / clockHands match only the standalone full-size clock geometry).
 */
export default compose({
  motions: [fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0.04 },
});
