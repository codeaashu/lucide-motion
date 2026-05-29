import { codeSymbol } from "../motions/code-symbol";
import { compose } from "../compose";

/**
 * `code` — standalone `</>` chevron pair. Both chevrons pinch
 * inward toward each other via `codeSymbol`, then return.
 * Canonical Round-2 code template.
 */
export default compose({
  motions: [codeSymbol],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
