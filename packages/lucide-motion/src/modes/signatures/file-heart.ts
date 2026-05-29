import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * `file-heart` — heart subject integration deferred; the badge heart
 * draws on via `fileModifierReveal`.
 */
export default compose({
  motions: [fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
