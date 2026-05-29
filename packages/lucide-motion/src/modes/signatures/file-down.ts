import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

export default compose({
  motions: [fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.6, easing: "easeInOut", stagger: 0.04 },
});
