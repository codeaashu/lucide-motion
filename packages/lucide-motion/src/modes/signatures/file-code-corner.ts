import { codeSymbol } from "../motions/code-symbol";
import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";

/**
 * `file-code-corner` — file envelope + `</>` corner-badge chevrons
 * pinching via `codeSymbol`.
 */
export default compose({
  motions: [codeSymbol, fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
