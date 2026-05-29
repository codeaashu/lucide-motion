import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";
import { penWrite } from "../motions/pen-write";

/**
 * `file-pen` — file envelope + pen badge wobbling via `penWrite`
 * (pen body d already in PEN_BODY_DS).
 */
export default compose({
  motions: [penWrite, fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
