import { compose } from "../compose";
import { penEraserTip } from "../motions/pen-eraser-tip";
import { pencilRulerTool } from "../motions/pencil-ruler-tool";
import { penWrite } from "../motions/pen-write";

/**
 * `pencil-ruler` — drafting set: pencil wobbles via `penWrite`,
 * eraser ferrule dims via `penEraserTip`, ruler dims in sync via
 * `pencilRulerTool`. Reads as the designer reaching for the tools.
 */
export default compose({
  motions: [penWrite, penEraserTip, pencilRulerTool],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
