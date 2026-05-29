import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * file-check — page bobs + corner flicks (`fileEnvelope`) while the
 * `✓` stroke draws on at the settle peak via `fileModifierReveal`.
 */
export default compose({
  motions: [fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
