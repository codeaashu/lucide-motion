import { compose } from "../compose";
import { penWrite } from "../motions/pen-write";

/**
 * `pen` — standalone single-stroke pen. The diamond body wobbles in
 * place via `penWrite`, reading as the pen making small writing
 * strokes mid-word. Canonical Round-2 pen template.
 */
export default compose({
  motions: [penWrite],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
