import { compose } from "../compose";
import { vertexSequencePulse } from "../motions/vertex-sequence-pulse";

export default compose({
  motions: [vertexSequencePulse],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
