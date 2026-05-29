import { compose } from "../compose";
import { messageSquareBody } from "../motions/message-square-body";
import { messageSquareDashedAssembly } from "../motions/message-square-dashed-assembly";
import { messageSquareModifierReveal } from "../motions/message-square-modifier-reveal";

/**
 * `message-square-dashed` — the ten dashed segments assemble inward
 * from their displaced starting positions to form the bubble
 * outline (`messageSquareDashedAssembly`), then nod together as one
 * dashed bubble. `messageSquareDashedAssembly` claims the ten
 * segments BEFORE `messageSquareBody` so it gets the assembly
 * physics instead of the body's plain nod.
 *
 * Duration bumped to 0.9 (from the family default 0.65) so the
 * assemble + settle reads clearly before the nod.
 */
export default compose({
  motions: [
    messageSquareDashedAssembly,
    messageSquareBody,
    messageSquareModifierReveal,
  ],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
