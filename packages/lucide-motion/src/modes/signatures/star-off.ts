import { compose } from "../compose";
import { starModifierReveal } from "../motions/star-modifier-reveal";
import { starTwinkle } from "../motions/star-twinkle";

/**
 * Star-off — Lucide draws the broken star as two outline fragments
 * (top-right and bottom-left) separated by the diagonal
 * `m2 2 20 20` slash. {@link starTwinkle} catches both fragments
 * via the family's `matchPathDOneOf` list so they twinkle as one
 * broken-but-still-luminous star. {@link starModifierReveal} draws
 * the slash in via `pathLength` + `opacity` while inheriting the
 * twinkle's rotate and scale so the slash wobbles and contracts
 * in step with the fragments rather than floating statically over
 * them.
 */
export default compose({
  motions: [starTwinkle, starModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.04 },
});
