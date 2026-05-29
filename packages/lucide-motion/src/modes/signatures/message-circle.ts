import { compose } from "../compose";
import { messageCircleBody } from "../motions/message-circle-body";

/**
 * `message-circle` — bare round speech bubble. The messageCircleBody
 * motion nods the bubble ±3° around its tail tip (3, 22) with a
 * phase-locked opacity dim, reading as the bubble "speaking" with
 * the tail planted at the speaker's mouth.
 *
 * Every other message-circle-* composite reuses messageCircleBody
 * as the host and layers `messageCircleModifierReveal` for the
 * marker / payload glyph, which inherits both the nod and the
 * opacity so payloads stay anchored to the bubble.
 */
export default compose({
  motions: [messageCircleBody],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
