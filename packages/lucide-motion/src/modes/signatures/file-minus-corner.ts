import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * file-minus-corner — page bobs + corner flicks (`fileEnvelope`)
 * while the `−` stroke (drawn in the fold area) draws on at the
 * settle peak via `fileModifierReveal`.
 */
export default compose({
  motions: [fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
