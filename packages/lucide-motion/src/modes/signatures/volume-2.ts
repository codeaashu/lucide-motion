import { compose } from "../compose";
import { volumeSoundWaves } from "../motions/volume-sound-waves";
import { volumeSpeaker } from "../motions/volume-speaker";

/**
 * Volume-2 — full-volume speaker with inner + outer waves. The
 * wavefront cascades outward from the speaker mouth: inner reaches its
 * full radius on the first thump, outer follows on the second.
 */
export default compose({
  motions: [volumeSpeaker, volumeSoundWaves],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
  transformOrigin: "11px 12px",
});
