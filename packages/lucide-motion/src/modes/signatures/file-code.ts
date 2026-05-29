import { codeSymbol } from "../motions/code-symbol";
import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * `file-code` — file envelope + `</>` chevrons pinching via
 * `codeSymbol` (Round-2 subject, placed FIRST).
 */
export default compose({
  motions: [codeSymbol, fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
