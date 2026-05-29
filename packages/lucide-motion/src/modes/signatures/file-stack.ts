import { compose } from "../compose";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * `file-stack` — three stacked file outlines. Doesn't use the
 * canonical fileEnvelope d, so everything draws on via the family
 * wildcard reveal.
 */
export default compose({
  motions: [fileModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0.06 },
});
