import { compose } from "../compose";
import { micBody } from "../motions/mic-body";

/**
 * Mic-vocal — handheld stage mic. Ball, handle, and cable share the
 * same "mic is hot" pulse as the base mic so the singer's mic reads
 * as live without inventing new physics.
 */
export default compose({
  motions: [micBody],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
