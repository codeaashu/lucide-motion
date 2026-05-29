import { compose } from "../compose";
import { volumeSpeaker } from "../motions/volume-speaker";

/**
 * Volume — speaker housing alone, pulsing with the two-thump bassline
 * of a real cone driver pushing air toward the listener. Signature
 * pivots at the speaker mouth so the contraction reads as the
 * diaphragm pulling back before snapping forward.
 */
export default compose({
  motions: [volumeSpeaker],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
  transformOrigin: "11px 12px",
});
