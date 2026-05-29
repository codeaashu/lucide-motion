import { codeSymbol } from "../motions/code-symbol";
import { compose } from "../compose";
import { messageSquareBody } from "../motions/message-square-body";
import { messageSquareModifierReveal } from "../motions/message-square-modifier-reveal";

/**
 * `message-square-code` — bubble nods via `messageSquareBody`; the
 * `</>` chevrons inside pinch via `codeSymbol`. Code motion placed
 * FIRST so the chevrons are claimed by the pinch before
 * `messageSquareModifierReveal`'s wildcard would draw them on as
 * state markers.
 */
export default compose({
  motions: [codeSymbol, messageSquareBody, messageSquareModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
