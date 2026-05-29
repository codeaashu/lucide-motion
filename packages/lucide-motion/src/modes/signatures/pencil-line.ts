import { compose } from "../compose";
import { penEraserTip } from "../motions/pen-eraser-tip";
import { penLineStroke } from "../motions/pen-line-stroke";
import { penWrite } from "../motions/pen-write";

/**
 * `pencil-line` — pencil body + eraser ferrule + the underline. All
 * three motions phase-lock to the pen wobble's `times`.
 */
export default compose({
  motions: [penWrite, penEraserTip, penLineStroke],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
