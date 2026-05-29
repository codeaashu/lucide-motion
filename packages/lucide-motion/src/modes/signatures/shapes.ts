import { compose } from "../compose";
import { vertexSequencePulse } from "../motions/vertex-sequence-pulse";

/**
 * `shapes` — multiple primitive shapes stacked. Each shape resonates
 * around its own bbox centre (per-element fill-box pivot), with
 * per-element stagger so they cascade one by one.
 */
export default compose({
  motions: [vertexSequencePulse],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0.08 },
});
