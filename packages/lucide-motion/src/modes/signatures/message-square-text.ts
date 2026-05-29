import { compose } from "../compose";
import { messageSquareBody } from "../motions/message-square-body";
import { messageSquareModifierReveal } from "../motions/message-square-modifier-reveal";
import { messageSquareTextLines } from "../motions/message-square-text-lines";

/**
 * `message-square-text` — the bubble nods (`messageSquareBody`)
 * while the three text lines drop in one by one
 * (`messageSquareTextLines`): top → middle → bottom, like text
 * being written into the bubble.
 *
 * Duration bumped to 0.9 so the three drops read as a clear
 * cascade rather than blurring into one.
 */
export default compose({
  motions: [messageSquareBody, messageSquareTextLines, messageSquareModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
