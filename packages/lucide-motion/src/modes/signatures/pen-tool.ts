import { compose } from "../compose";
import { penToolDesign } from "../motions/pen-tool-design";

/**
 * `pen-tool` — bezier design pen with an anchor point selected. The
 * anchor circle pulses, the nib handle wobbles slightly, body +
 * tangent line dim for cohesion.
 */
export default compose({
  motions: [penToolDesign],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
