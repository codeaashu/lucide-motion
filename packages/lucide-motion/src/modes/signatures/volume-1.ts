import { compose } from "../compose";
import { volumeSoundWaves } from "../motions/volume-sound-waves";
import { volumeSpeaker } from "../motions/volume-speaker";

/**
 * Volume-1 — low-volume speaker with a single inner wave. The arc
 * emerges from the speaker mouth on the first thump and then breathes
 * with the speaker's second thump for cohesion.
 */
export default compose({
  motions: [volumeSpeaker, volumeSoundWaves],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
  transformOrigin: "11px 12px",
});
