import { codeSymbol } from "../motions/code-symbol";
import { codeXmlSlash } from "../motions/code-xml-slash";
import { compose } from "../compose";

/**
 * `code-xml` — `</>` chevron pair with a forward slash between them.
 * Chevrons pinch via `codeSymbol`; the slash dims in sync via
 * `codeXmlSlash`.
 */
export default compose({
  motions: [codeSymbol, codeXmlSlash],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
