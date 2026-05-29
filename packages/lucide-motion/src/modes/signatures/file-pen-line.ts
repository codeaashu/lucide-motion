import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";
import { penWrite } from "../motions/pen-write";

/**
 * `file-pen-line` — file envelope + pen badge wobbling via
 * `penWrite`. The small underline `M8 18h1` falls through to
 * `fileModifierReveal`.
 */
export default compose({
  motions: [penWrite, fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
