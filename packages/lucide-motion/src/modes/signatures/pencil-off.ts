import { compose } from "../compose";
import { penEraserTip } from "../motions/pen-eraser-tip";
import { penModifierReveal } from "../motions/pen-modifier-reveal";
import { penWrite } from "../motions/pen-write";

/**
 * `pencil-off` — broken pencil fragments wobble via `penWrite`, the
 * eraser ferrule line dims via `penEraserTip`, the diagonal off-slash
 * strikes through via `penModifierReveal`.
 */
export default compose({
  motions: [penWrite, penEraserTip, penModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
