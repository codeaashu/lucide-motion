import { compose } from "../compose";
import { messageSquareBody } from "../motions/message-square-body";

/**
 * `message-square` — bare speech bubble. The messageSquareBody
 * motion nods the bubble ±3° around its tail tip (3, 22) with a
 * phase-locked opacity dim, reading as the bubble "speaking" with
 * the tail planted at the speaker's mouth.
 *
 * Every other message-square-* composite reuses messageSquareBody
 * as the host and layers `messageSquareModifierReveal` for the
 * marker / payload glyph, which inherits both the nod and the
 * opacity so payloads stay anchored to the bubble.
 */
export default compose({
  motions: [messageSquareBody],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
