import { codeSymbol } from "../motions/code-symbol";
import { compose } from "../compose";
import { messageCircleBody } from "../motions/message-circle-body";
import { messageCircleModifierReveal } from "../motions/message-circle-modifier-reveal";

/**
 * `message-circle-code` — bubble nods via `messageCircleBody`; the
 * `</>` chevrons inside the bubble pinch via `codeSymbol`. Code
 * motion placed FIRST so the chevrons are claimed by the pinch
 * before `messageCircleModifierReveal`'s wildcard would draw them
 * on as state markers.
 */
export default compose({
  motions: [codeSymbol, messageCircleBody, messageCircleModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
