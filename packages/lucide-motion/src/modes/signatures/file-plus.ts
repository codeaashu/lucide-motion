import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * file-plus — the page bobs and the corner flicks (`fileEnvelope`),
 * while the `+` marker stamps on at the body's settle peak via
 * `fileModifierReveal`, bobbing with the page so it stays anchored.
 */
export default compose({
  motions: [fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
