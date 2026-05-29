import { compose } from "../compose";
import { penEraserTip } from "../motions/pen-eraser-tip";
import { penWrite } from "../motions/pen-write";

/**
 * `pencil` — pen body + the small ferrule stroke at the eraser end.
 * Body wobbles via `penWrite`; ferrule dims in sync via
 * `penEraserTip`.
 */
export default compose({
  motions: [penWrite, penEraserTip],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
