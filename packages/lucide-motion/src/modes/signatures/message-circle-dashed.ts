import { compose } from "../compose";
import { messageCircleBody } from "../motions/message-circle-body";
import { messageCircleDashedAssembly } from "../motions/message-circle-dashed-assembly";
import { messageCircleModifierReveal } from "../motions/message-circle-modifier-reveal";

/**
 * `message-circle-dashed` — the eight dashed segments draw in
 * strictly one after another in a clockwise sweep from the tail
 * (`messageCircleDashedAssembly`), then nod together as one dashed
 * bubble. The assembly motion claims the eight segments BEFORE
 * `messageCircleBody` so it gets the sweep physics instead of the
 * body's plain nod.
 *
 * Duration bumped to 0.9 so the sweep + nod reads clearly.
 */
export default compose({
  motions: [
    messageCircleDashedAssembly,
    messageCircleBody,
    messageCircleModifierReveal,
  ],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
  transformOrigin: "3px 22px",
});
