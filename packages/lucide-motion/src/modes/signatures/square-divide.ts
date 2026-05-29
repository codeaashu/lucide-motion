import { compose } from "../compose";
import { squareModifierReveal } from "../motions/square-modifier-reveal";
import { squareShell } from "../motions/square-shell";

/**
 * `square-divide` — the square pulses (`squareShell`) while the marker
 * / payload reveals at the pulse apex via
 * `squareModifierReveal`, inheriting both the shell scale and
 * the opacity dim so the payload stays anchored to the square.
 */
export default compose({
  motions: [squareShell, squareModifierReveal],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
});
